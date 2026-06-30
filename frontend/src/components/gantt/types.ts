/**
 * Tipos para el módulo Cronograma (Gantt)
 */

export type GanttActivityType = 'ACTIVIDAD' | 'SUBACTIVIDAD' | 'ENTREGABLE' | 'HITO' | 'MILESTONE';

export type GanttActivityState = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'ATRASADO';

export type GanttPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF'; // Finish-Start, Start-Start, Finish-Finish, Start-Finish

export type TimeScale = 'DIA' | 'SEMANA' | 'MES' | 'TRIMESTRE' | 'AÑO';

export type ViewMode = 'TABLA' | 'GANTT' | 'CALENDARIO' | 'KANBAN' | 'DIVIDIDO' | 'TIMELINE';

export interface GanttDependency {
  id: string;
  predecesora: string;
  sucesora: string;
  tipo: DependencyType;
}

export interface GanttActivity {
  id: string;
  wbs: string; // Work Breakdown Structure (e.g., "1.1.2")
  nombre: string;
  descripcion?: string;
  tipo: GanttActivityType;
  estado: GanttActivityState;
  prioridad: GanttPriority;

  // Relaciones
  proyectoId?: string;
  proyectoNombre?: string;
  programaId?: string;
  programaNombre?: string;
  iniciativaId?: string;
  iniciativaNombre?: string;
  clienteId?: string;
  clienteNombre?: string;
  responsableId?: string;
  responsableNombre?: string;

  // Fechas
  fechaInicio: Date;
  fechaFin: Date;
  duracionDias: number;
  fechaLimite?: Date;

  // Seguimiento
  avancePorc: number; // 0-100
  horasEstimadas?: number;
  horasReales?: number;
  costoEstimado?: number;
  costoReal?: number;

  // Dependencias
  predecesoras?: GanttDependency[];
  sucesoras?: GanttDependency[];

  // Indicadores
  esCritica?: boolean;
  holgura?: number; // En días
  esMilestone?: boolean;

  // Auditoria
  createdAt: Date;
  updatedAt: Date;

  // Notas
  observaciones?: string;
  riesgos?: string;

  // Executive surface metadata
  documentos?: number;
  comentarios?: number;
  checklist?: number;
  etiquetas?: string[];
}

export interface GanttFilter {
  cliente?: string;
  iniciativa?: string;
  proyecto?: string;
  responsable?: string;
  estado?: GanttActivityState;
  prioridad?: GanttPriority;
}

export interface GanttKPI {
  totalActividades: number;
  actividadesCompletadas: number;
  enProgreso: number;
  pendientes: number;
  atrasadas: number;
  hitos: number;
  avanceGeneral: number;
  fechaFinalEstimada?: Date;
  rutaCritica?: string[];
}
