/**
 * Página del módulo Cronograma (Gantt)
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import PmoShell from '@/src/components/layout/PmoShell';
import PageHeader from '@/src/components/pmo/PageHeader';
import {
  GanttActivity,
  GanttFilter,
  GanttKPI,
  TimeScale,
  ViewMode,
  GanttKPICards,
  GanttToolbar,
  GanttTable,
  GanttChart,
  GanttCalendarView,
  GanttKanbanView,
  ActivityModal,
} from '@/src/components/gantt';
import { getGanttActivities, calculateGanttKPIs, isActivityLate } from '@/src/services/pmo/gantt';
import { getClients } from '@/src/services/pmo/clients';
import { getInitiatives } from '@/src/services/pmo/initiatives';
import { getProjects } from '@/src/services/pmo/projects';
import { getPrograms } from '@/src/services/pmo/programs';
import { getUsers } from '@/src/services/pmo/users';
import { createTask, deleteTask, updateTask } from '@/src/services/pmo/tasks';

export default function CronogramaPage() {
  const [activities, setActivities] = useState<GanttActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [filters, setFilters] = useState<GanttFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<GanttActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<GanttActivity | undefined>();

  const [timeScale, setTimeScale] = useState<TimeScale>('MES');
  const [viewMode, setViewMode] = useState<ViewMode>('DIVIDIDO');
  const [groupBy, setGroupBy] = useState<'none' | 'cliente' | 'programa' | 'iniciativa' | 'proyecto' | 'responsable'>('none');
  const [sortBy, setSortBy] = useState<'inicio' | 'fin' | 'nombre' | 'progreso'>('inicio');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    wbs: true,
    actividad: true,
    proyecto: true,
    responsable: true,
    estado: true,
    prioridad: true,
    inicio: true,
    fin: true,
    dias: true,
    avance: true,
    acciones: true,
  });

  const [tableScrollTop, setTableScrollTop] = useState(0);

  // Cargar actividades y opciones de jerarquía
  useEffect(() => {
    void loadActivities();
    void loadOptions();
  }, []);

  const activitiesWithLate = useMemo(
    () =>
      activities.map((activity) => ({
        ...activity,
        estado: isActivityLate(activity) ? 'ATRASADO' : activity.estado,
      })),
    [activities],
  );

  const filteredActivities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const getGroupValue = (activity: GanttActivity) => {
      switch (groupBy) {
        case 'cliente':
          return activity.clienteNombre || '';
        case 'programa':
          return activity.programaNombre || '';
        case 'iniciativa':
          return activity.iniciativaNombre || '';
        case 'proyecto':
          return activity.proyectoNombre || '';
        case 'responsable':
          return activity.responsableNombre || '';
        default:
          return '';
      }
    };

    const baseSort = (a: GanttActivity, b: GanttActivity) => {
      switch (sortBy) {
        case 'fin':
          return a.fechaFin.getTime() - b.fechaFin.getTime();
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'progreso':
          return b.avancePorc - a.avancePorc;
        case 'inicio':
        default:
          return a.fechaInicio.getTime() - b.fechaInicio.getTime();
      }
    };

    return activitiesWithLate
      .filter((activity) => {
        if (filters.cliente && activity.clienteId !== filters.cliente) return false;
        if (filters.iniciativa && activity.iniciativaId !== filters.iniciativa) return false;
        if (filters.proyecto && activity.proyectoId !== filters.proyecto) return false;
        if (filters.responsable && activity.responsableId !== filters.responsable) return false;
        if (filters.estado && activity.estado !== filters.estado) return false;
        if (filters.prioridad && activity.prioridad !== filters.prioridad) return false;
        if (normalizedSearch.length > 0) {
          return `${activity.nombre} ${activity.proyectoNombre || ''} ${activity.responsableNombre || ''} ${activity.descripcion || ''}`
            .toLowerCase()
            .includes(normalizedSearch);
        }
        return true;
      })
      .slice()
      .sort((a, b) => {
        if (groupBy === 'none') return baseSort(a, b);

        const groupResult = getGroupValue(a).localeCompare(getGroupValue(b));
        return groupResult !== 0 ? groupResult : baseSort(a, b);
      });
  }, [activitiesWithLate, filters, searchTerm, groupBy, sortBy]);

  const kpi = useMemo(() => calculateGanttKPIs(filteredActivities), [filteredActivities]);

  function mapActivityToTaskPayload(activity: GanttActivity) {
    const fallbackProjectId = activity.proyectoId || projects.find((project) => !!project?.id)?.id;
    if (!fallbackProjectId) {
      throw new Error('No project selected for the activity');
    }

    const tipo = activity.tipo && ['HITO', 'MILESTONE'].includes(activity.tipo) ? 'ACTIVIDAD' : activity.tipo || 'ACTIVIDAD';

    return {
      codigo: activity.wbs,
      titulo: activity.nombre,
      descripcion: activity.descripcion || '',
      estado: activity.estado,
      prioridad: activity.prioridad,
      fechaInicio: activity.fechaInicio instanceof Date ? activity.fechaInicio.toISOString() : activity.fechaInicio,
      fechaFin: activity.fechaFin instanceof Date ? activity.fechaFin.toISOString() : activity.fechaFin,
      fechaLimite: activity.fechaLimite instanceof Date ? activity.fechaLimite.toISOString() : activity.fechaLimite,
      responsableId: activity.responsableId || undefined,
      tipo,
      projectId: fallbackProjectId,
      area: activity.programaNombre || activity.iniciativaNombre || activity.proyectoNombre || undefined,
      fuente: 'PLAN_DE_TRABAJO',
    };
  }

  async function loadActivities() {
    try {
      setLoading(true);
      const data = await getGanttActivities();
      setActivities(data);
      return data;
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    try {
      const [clientsData, initiativesData, projectsData, usersData, programsData] = await Promise.all([
        getClients(),
        getInitiatives(),
        getProjects(),
        getUsers(),
        getPrograms(),
      ]);

      setClients(clientsData || []);
      setInitiatives(initiativesData || []);
      setProjects(projectsData || []);
      setUsers(usersData || []);
      setPrograms(programsData || []);
    } catch (error) {
      console.error('Error loading PMO options:', error);
    }
  }

  function handleNewActivity() {
    setEditingActivity(undefined);
    setIsModalOpen(true);
  }

  function handleEditActivity(activity: GanttActivity) {
    setEditingActivity(activity);
    setIsModalOpen(true);
  }

  async function handleActivityChange(activity: GanttActivity) {
    try {
      if (!activity?.id) return;
      await updateTask(activity.id, mapActivityToTaskPayload(activity));
      await loadActivities();
      setSelectedActivity(activity);
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('No fue posible actualizar la actividad en el backend');
    }
  }

  async function handleDuplicateActivity(activity: GanttActivity) {
    const duplicatedActivity: GanttActivity = {
      ...activity,
      id: `${activity.id}-copy-${Date.now()}`,
      nombre: `${activity.nombre} (Copia)`,
      wbs: `${activity.wbs}.1`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await createTask(mapActivityToTaskPayload(duplicatedActivity));
      await loadActivities();
      setSelectedActivity({ ...duplicatedActivity, id: created?.id || duplicatedActivity.id });
    } catch (error) {
      console.error('Error duplicating activity:', error);
      alert('No fue posible duplicar la actividad en el backend');
    }
  }

  async function handleSaveActivity(activity: GanttActivity) {
    try {
      const payload = mapActivityToTaskPayload(activity);
      const existing = activities.find((a) => a.id === activity.id);

      if (existing) {
        await updateTask(activity.id, payload);
      } else {
        await createTask(payload);
      }

      await loadActivities();
      setSelectedActivity(activity);
      setIsModalOpen(false);
      setEditingActivity(undefined);
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('No fue posible guardar la actividad en el backend');
    }
  }

  async function handleUpdateActivityState(activity: GanttActivity, estado: GanttActivity['estado']) {
    try {
      const updated = { ...activity, estado, updatedAt: new Date() };
      await updateTask(activity.id, mapActivityToTaskPayload(updated));
      await loadActivities();
      setSelectedActivity(updated);
    } catch (error) {
      console.error('Error updating activity state:', error);
      alert('No fue posible actualizar el estado de la actividad');
    }
  }

  async function handleDeleteActivity(id: string) {
    try {
      await deleteTask(id);
      await loadActivities();
      setSelectedActivity(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('No fue posible eliminar la actividad en el backend');
    }
  }

  function handleExport() {
    // Preparar estructura para exportación (por ahora solo log)
    console.log('Exportar datos:', {
      activities: filteredActivities,
      kpi,
      timestamp: new Date().toISOString(),
    });
    alert('Funcionalidad de exportación en desarrollo');
  }

  function handlePrint() {
    window.print();
  }

  // Sincronizar scroll entre tabla y chart
  const handleScroll = (scrollTop: number) => setTableScrollTop(scrollTop);

  if (loading) {
    return (
      <PmoShell>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p className="text-gray-600">Cargando Plan de Trabajo...</p>
          </div>
        </div>
      </PmoShell>
    );
  }

  return (
    <PmoShell>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Encabezado */}
        <PageHeader section="PMO" title="Plan de Trabajo" description="Planificación y seguimiento unificado de actividades y proyectos" />

        {/* Contenido principal */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">
          {/* KPIs */}
          {kpi && <GanttKPICards kpi={kpi} />}

          {/* Toolbar */}
          <GanttToolbar
            filters={filters}
            onFiltersChange={setFilters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onNewActivity={handleNewActivity}
            onExport={handleExport}
            onPrint={handlePrint}
            timeScale={timeScale}
            onTimeScaleChange={setTimeScale}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
            options={{ clients, programs, initiatives, projects, users }}
          />

          {/* Vista Dividida o Individual */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'TABLA' && (
              <GanttTable
                activities={filteredActivities}
                selectedActivity={selectedActivity}
                onSelectActivity={setSelectedActivity}
                onEditActivity={handleEditActivity}
                onDuplicateActivity={handleDuplicateActivity}
                onDeleteActivity={handleDeleteActivity}
                visibleColumns={visibleColumns}
                scrollTop={tableScrollTop}
                onScroll={handleScroll}
              />
            )}

            {viewMode === 'GANTT' && (
              <GanttChart
                activities={filteredActivities}
                selectedActivity={selectedActivity}
                onSelectActivity={setSelectedActivity}
                onActivityChange={handleActivityChange}
                timeScale={timeScale}
                scrollTop={tableScrollTop}
                onScroll={handleScroll}
              />
            )}

            {viewMode === 'DIVIDIDO' && (
              <div className="flex gap-4 overflow-hidden h-full">
                {/* Panel izquierdo: Tabla */}
                <div className="flex-[0_0_400px] min-w-0 overflow-hidden">
                  <GanttTable
                    activities={filteredActivities}
                    selectedActivity={selectedActivity}
                    onSelectActivity={setSelectedActivity}
                    onEditActivity={handleEditActivity}
                    onDuplicateActivity={handleDuplicateActivity}
                    onDeleteActivity={handleDeleteActivity}
                    visibleColumns={visibleColumns}
                    scrollTop={tableScrollTop}
                    onScroll={handleScroll}
                  />
                </div>

                {/* Panel derecho: Gantt */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <GanttChart
                    activities={filteredActivities}
                    selectedActivity={selectedActivity}
                    onSelectActivity={setSelectedActivity}
                    onActivityChange={handleActivityChange}
                    timeScale={timeScale}
                    scrollTop={tableScrollTop}
                    onScroll={handleScroll}
                  />
                </div>
              </div>
            )}

            {viewMode === 'CALENDARIO' && (
              <GanttCalendarView
                activities={filteredActivities}
                view={timeScale === 'DIA' ? 'DIA' : timeScale === 'SEMANA' ? 'SEMANA' : 'MES'}
                onSelectActivity={setSelectedActivity}
                onEditActivity={handleEditActivity}
              />
            )}

            {viewMode === 'KANBAN' && (
              <GanttKanbanView
                activities={filteredActivities}
                onSelectActivity={setSelectedActivity}
                onUpdateActivityState={handleUpdateActivityState}
              />
            )}

            {viewMode === 'DIVIDIDO' && (
              <div className="space-y-4">
                {/* KPI cards for requested groups */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/** compute counts below */}
                  {(() => {
                    const normalize = (s?: string) => String(s || '').toLowerCase();
                    let sinIniciar = 0;
                    let estructuracion = 0;
                    let revision = 0;
                    filteredActivities.forEach((a) => {
                      const s = normalize(a.estado);
                      if (s.includes('sin iniciar') || s.includes('sin_iniciar') || s === 'sin iniciar' || s === 'sin_iniciar') {
                        sinIniciar += 1;
                        return;
                      }
                      if (s.includes('estructur')) {
                        estructuracion += 1;
                        return;
                      }
                      if (s.includes('revision') || s.includes('revisión') || s.includes('directiva') || s.includes('tecnica') || s.includes('técnica')) {
                        revision += 1;
                        return;
                      }
                    });

                    const max = Math.max(1, sinIniciar, estructuracion, revision);

                    const Card = ({ title, count, color }: { title: string; count: number; color: string }) => (
                      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">{title}</div>
                          <div className="text-2xl font-semibold mt-1">{count}</div>
                        </div>
                        <div className="w-24 h-12 flex items-end">
                          <div className="w-full h-2 rounded" style={{ background: '#F3F4F6' }}>
                            <div style={{ width: `${Math.round((count / max) * 100)}%`, height: '8px', background: color }} className="rounded" />
                          </div>
                        </div>
                      </div>
                    );

                    return (
                      <>
                        <Card title="Sin iniciar" count={sinIniciar} color="#F59E0B" />
                        <Card title="Estructuración" count={estructuracion} color="#3B82F6" />
                        <Card title="Revisión" count={revision} color="#10B981" />
                      </>
                    );
                  })()}
                </div>

                {/* Simple bar chart summarizing the three groups */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium mb-3">Resumen</h3>
                  {(() => {
                    const normalize = (s?: string) => String(s || '').toLowerCase();
                    let sinIniciar = 0;
                    let estructuracion = 0;
                    let revision = 0;
                    filteredActivities.forEach((a) => {
                      const s = normalize(a.estado);
                      if (s.includes('sin iniciar') || s.includes('sin_iniciar')) {
                        sinIniciar += 1;
                        return;
                      }
                      if (s.includes('estructur')) {
                        estructuracion += 1;
                        return;
                      }
                      if (s.includes('revision') || s.includes('revisión') || s.includes('directiva') || s.includes('tecnica') || s.includes('técnica')) {
                        revision += 1;
                        return;
                      }
                    });

                    const items = [
                      { key: 'Sin iniciar', value: sinIniciar, color: '#F59E0B' },
                      { key: 'Estructuración', value: estructuracion, color: '#3B82F6' },
                      { key: 'Revisión', value: revision, color: '#10B981' },
                    ];
                    const max = Math.max(1, ...items.map((i) => i.value));

                    return (
                      <div className="space-y-3">
                        {items.map((it) => (
                          <div key={it.key} className="flex items-center gap-4">
                            <div className="w-40 text-sm text-gray-600">{it.key}</div>
                            <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                              <div style={{ width: `${Math.round((it.value / max) * 100)}%`, background: it.color, height: '100%' }} />
                            </div>
                            <div className="w-16 text-right font-medium">{it.value}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de actividad */}
        <ActivityModal
          isOpen={isModalOpen}
          activity={editingActivity}
          options={{ clients, programs, initiatives, projects, users }}
          onClose={() => {
            setIsModalOpen(false);
            setEditingActivity(undefined);
          }}
          onSave={handleSaveActivity}
        />
      </div>
    </PmoShell>
  );
}
