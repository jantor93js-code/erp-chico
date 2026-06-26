/**
 * Página del módulo Cronograma (Gantt)
 */
'use client';

import { useEffect, useState, useRef } from 'react';
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
  ActivityModal,
} from '@/src/components/gantt';
import { getGanttActivities, calculateGanttKPIs, isActivityLate } from '@/src/services/pmo/gantt';

export default function CronogramaPage() {
  const [activities, setActivities] = useState<GanttActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<GanttActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<GanttKPI | null>(null);

  const [filters, setFilters] = useState<GanttFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<GanttActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<GanttActivity | undefined>();

  const [timeScale, setTimeScale] = useState<TimeScale>('MES');
  const [viewMode, setViewMode] = useState<ViewMode>('DIVIDIDO');

  const [tableScrollTop, setTableScrollTop] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  // Cargar actividades
  useEffect(() => {
    loadActivities();
  }, []);

  // Calcular KPI cuando cambian las actividades
  useEffect(() => {
    const kpiData = calculateGanttKPIs(filteredActivities);
    setKpi(kpiData);
  }, [filteredActivities]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = activities;

    if (filters.cliente) {
      filtered = filtered.filter((a) => a.clienteId?.includes(filters.cliente || ''));
    }
    if (filters.programa) {
      filtered = filtered.filter((a) => a.programaId?.includes(filters.programa || ''));
    }
    if (filters.iniciativa) {
      filtered = filtered.filter((a) => a.iniciativaId?.includes(filters.iniciativa || ''));
    }
    if (filters.proyecto) {
      filtered = filtered.filter((a) => a.proyectoId?.includes(filters.proyecto || ''));
    }
    if (filters.responsable) {
      filtered = filtered.filter((a) => a.responsableId?.includes(filters.responsable || ''));
    }
    if (filters.estado) {
      filtered = filtered.filter((a) => a.estado === filters.estado);
    }
    if (filters.prioridad) {
      filtered = filtered.filter((a) => a.prioridad === filters.prioridad);
    }
    if (searchTerm.trim()) {
      const normalized = searchTerm.toLowerCase();
      filtered = filtered.filter((a) =>
        `${a.nombre} ${a.proyectoNombre || ''} ${a.responsableNombre || ''} ${a.descripcion || ''}`
          .toLowerCase()
          .includes(normalized),
      );
    }

    setFilteredActivities(filtered);
  }, [activities, filters, searchTerm]);

  // Detectar actividades atrasadas
  useEffect(() => {
    const updated = activities.map((a) => ({
      ...a,
      estado: isActivityLate(a) ? 'ATRASADO' : a.estado,
    }));
    setActivities(updated);
  }, []);

  async function loadActivities() {
    try {
      setLoading(true);
      const data = await getGanttActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
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

  function handleActivityChange(activity: GanttActivity) {
    setActivities((prev) => prev.map((item) => (item.id === activity.id ? activity : item)));
    setSelectedActivity(activity);
  }

  function handleDuplicateActivity(activity: GanttActivity) {
    const duplicatedActivity: GanttActivity = {
      ...activity,
      id: `${activity.id}-copy-${Date.now()}`,
      nombre: `${activity.nombre} (Copia)`,
      wbs: `${activity.wbs}.1`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setActivities((prev) => [...prev, duplicatedActivity]);
    setSelectedActivity(duplicatedActivity);
  }

  function handleSaveActivity(activity: GanttActivity) {
    const existing = activities.find((a) => a.id === activity.id);
    if (existing) {
      setActivities((prev) => prev.map((a) => (a.id === activity.id ? activity : a)));
    } else {
      setActivities((prev) => [...prev, activity]);
    }
    setSelectedActivity(activity);
    setIsModalOpen(false);
    setEditingActivity(undefined);
  }

  function handleDeleteActivity(id: string) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setSelectedActivity(null);
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
  const handleTableScroll = (scrollTop: number) => {
    setTableScrollTop(scrollTop);
    if (chartRef.current) {
      const scrollable = chartRef.current.querySelector('.flex-1');
      if (scrollable) {
        (scrollable as HTMLElement).scrollTop = scrollTop;
      }
    }
  };

  if (loading) {
    return (
      <PmoShell>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p className="text-gray-600">Cargando cronograma...</p>
          </div>
        </div>
      </PmoShell>
    );
  }

  return (
    <PmoShell>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Encabezado */}
        <PageHeader section="PMO" title="Cronograma (Gantt)" description="Planificación y seguimiento interactivo de proyectos" />

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
                scrollTop={tableScrollTop}
                onScroll={handleTableScroll}
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
                onScroll={handleTableScroll}
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
                    scrollTop={tableScrollTop}
                    onScroll={handleTableScroll}
                  />
                </div>

                {/* Panel derecho: Gantt */}
                <div className="flex-1 min-w-0 overflow-hidden" ref={chartRef}>
                  <GanttChart
                    activities={filteredActivities}
                    selectedActivity={selectedActivity}
                    onSelectActivity={setSelectedActivity}
                    onActivityChange={handleActivityChange}
                    timeScale={timeScale}
                    scrollTop={tableScrollTop}
                    onScroll={handleTableScroll}
                  />
                </div>
              </div>
            )}

            {viewMode === 'TIMELINE' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">Vista Timeline</p>
                  <p className="text-sm mt-2">Esta vista está en desarrollo</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de actividad */}
        <ActivityModal
          isOpen={isModalOpen}
          activity={editingActivity}
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
