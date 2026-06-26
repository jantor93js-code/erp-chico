/**
 * Servicio para el módulo Cronograma (Gantt)
 * Integra datos de Projects, Tasks, Clients, Programs, Initiatives
 */

import { GanttActivity, GanttKPI, GanttFilter } from '@/src/components/gantt/types';
import { getProjects } from '@/src/services/pmo/projects';
import { getTasks } from '@/src/services/pmo/tasks';
import { getClients } from '@/src/services/pmo/clients';
import { getPrograms } from '@/src/services/pmo/programs';
import { getInitiatives } from '@/src/services/pmo/initiatives';
import { getUsers } from '@/src/services/pmo/users';

const API = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene todas las actividades del Gantt desde las fuentes disponibles
 */
export async function getGanttActivities(filters?: GanttFilter): Promise<GanttActivity[]> {
  try {
    const [projects, tasks, clients, programs, initiatives, users] = await Promise.all([
      getProjects(),
      getTasks(),
      getClients(),
      getPrograms(),
      getInitiatives(),
      getUsers(),
    ]);

    const activities: GanttActivity[] = [];

    // Convertir Projects a GanttActivities
    projects.forEach((project: any, index: number) => {
      const startDate = project.fechaInicio ? new Date(project.fechaInicio) : new Date();
      const endDate = project.fechaFin ? new Date(project.fechaFin) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      const activity: GanttActivity = {
        id: project.id,
        wbs: `1.${index + 1}`,
        nombre: project.nombre,
        descripcion: project.descripcion,
        tipo: 'ACTIVIDAD',
        estado: (project.estado || 'PENDIENTE') as any,
        prioridad: (project.prioridad || 'MEDIA') as any,

        proyectoId: project.id,
        proyectoNombre: project.nombre,
        programaId: project.programId,
        iniciativaId: project.iniciativaId,
        clienteId: project.clienteId,
        responsableId: project.responsableId,

        fechaInicio: startDate,
        fechaFin: endDate,
        duracionDias: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
        avancePorc: calculateProgress(project),
        esMilestone: false,

        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      };

      if (shouldIncludeActivity(activity, filters)) {
        activities.push(activity);
      }
    });

    // Convertir Tasks a GanttActivities (solo las que no pertenezcan a un proyecto ya procesado)
    tasks.forEach((task: any, index: number) => {
      if (task.projectId) return; // Skip, ya está en Projects

      const startDate = task.fechaCreacion ? new Date(task.fechaCreacion) : new Date();
      const endDate = task.fechaLimite ? new Date(task.fechaLimite) : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      const activity: GanttActivity = {
        id: task.id,
        wbs: `2.${index + 1}`,
        nombre: task.titulo,
        descripcion: task.descripcion,
        tipo: task.tipo || 'ACTIVIDAD',
        estado: task.estado || 'PENDIENTE',
        prioridad: task.prioridad || 'MEDIA',

        proyectoId: task.projectId,
        responsableId: task.responsableId,

        fechaInicio: startDate,
        fechaFin: endDate,
        duracionDias: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
        avancePorc: task.estado === 'FINALIZADO' ? 100 : task.estado === 'EN_CURSO' ? 50 : 0,
        esMilestone: task.tipo === 'MILESTONE' || task.tipo === 'HITO',

        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      };

      // Enriquecer con info de usuario responsable
      if (task.responsableId && users.length > 0) {
        const responsable = users.find((u: any) => u.id === task.responsableId);
        if (responsable) activity.responsableNombre = responsable.nombre || responsable.email;
      }

      if (shouldIncludeActivity(activity, filters)) {
        activities.push(activity);
      }
    });

    return activities.sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime());
  } catch (error) {
    console.error('Error fetching Gantt activities:', error);
    return [];
  }
}

/**
 * Calcula KPIs del Gantt
 */
export function calculateGanttKPIs(activities: GanttActivity[]): GanttKPI {
  const totalActividades = activities.length;
  const actividadesCompletadas = activities.filter((a) => a.estado === 'COMPLETADO').length;
  const enProgreso = activities.filter((a) => a.estado === 'EN_CURSO').length;
  const pendientes = activities.filter((a) => a.estado === 'PENDIENTE').length;
  const atrasadas = activities.filter((a) => a.estado === 'ATRASADO').length;
  const hitos = activities.filter((a) => a.esMilestone).length;

  const avanceGeneral = totalActividades > 0 ? Math.round((activities.reduce((sum, a) => sum + a.avancePorc, 0) / totalActividades) * 100) / 100 : 0;

  const fechaFinalEstimada = activities.length > 0 ? new Date(Math.max(...activities.map((a) => a.fechaFin.getTime()))) : undefined;

  // Identificar ruta crítica (simplificado: actividades sin holgura o críticas)
  const rutaCritica = activities.filter((a) => a.esCritica).map((a) => a.id);

  return {
    totalActividades,
    actividadesCompletadas,
    enProgreso,
    pendientes,
    atrasadas,
    hitos,
    avanceGeneral,
    fechaFinalEstimada,
    rutaCritica,
  };
}

/**
 * Filtra actividades según criterios
 */
function shouldIncludeActivity(activity: GanttActivity, filters?: GanttFilter): boolean {
  if (!filters) return true;

  if (filters.cliente && activity.clienteId !== filters.cliente) return false;
  if (filters.programa && activity.programaId !== filters.programa) return false;
  if (filters.iniciativa && activity.iniciativaId !== filters.iniciativa) return false;
  if (filters.proyecto && activity.proyectoId !== filters.proyecto) return false;
  if (filters.responsable && activity.responsableId !== filters.responsable) return false;
  if (filters.estado && activity.estado !== filters.estado) return false;
  if (filters.prioridad && activity.prioridad !== filters.prioridad) return false;

  return true;
}

/**
 * Calcula el porcentaje de avance de una actividad
 */
function calculateProgress(item: any): number {
  if (item.avance !== undefined) return item.avance;
  if (item.estado === 'COMPLETADO') return 100;
  if (item.estado === 'EN_CURSO') return 50;
  return 0;
}

/**
 * Detecta si una actividad está atrasada
 */
export function isActivityLate(activity: GanttActivity): boolean {
  if (activity.estado === 'COMPLETADO') return false;
  const hoy = new Date();
  return activity.fechaFin < hoy;
}

/**
 * Calcula la holgura de una actividad (simplificado)
 */
export function calculateSlack(activity: GanttActivity): number {
  const hoy = new Date();
  const diasRestantes = Math.ceil((activity.fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diasRestantes);
}
