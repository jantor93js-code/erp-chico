/**
 * Barra de herramientas premium con filtros, agrupación, orden y vistas
 */
'use client';

import React from 'react';
import { GanttFilter, TimeScale, ViewMode } from './types';

interface GanttToolbarProps {
  filters: GanttFilter;
  onFiltersChange: (filters: GanttFilter) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewActivity: () => void;
  onExport: () => void;
  onPrint: () => void;
  timeScale: TimeScale;
  onTimeScaleChange: (scale: TimeScale) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  groupBy?: 'none' | 'cliente' | 'programa' | 'iniciativa' | 'proyecto' | 'responsable';
  onGroupByChange?: (value: 'none' | 'cliente' | 'programa' | 'iniciativa' | 'proyecto' | 'responsable') => void;
  sortBy?: 'inicio' | 'fin' | 'nombre' | 'progreso';
  onSortByChange?: (value: 'inicio' | 'fin' | 'nombre' | 'progreso') => void;
  visibleColumns?: Record<string, boolean>;
  onVisibleColumnsChange?: (value: Record<string, boolean>) => void;
  options?: {
    clients?: Array<{ id: string; nombre: string }>;
    programs?: Array<{ id: string; nombre: string; clientId?: string; cliente?: { id?: string } }>;
    initiatives?: Array<{ id: string; nombre: string; programId?: string; programa?: { id?: string; cliente?: { id?: string } } }>;
    projects?: Array<{ id: string; nombre: string; initiativeId?: string; iniciativa?: { id?: string } }>;
    users?: Array<{ id: string; nombre?: string; email?: string }>;
  };
}

const columnOptions = [
  { key: 'wbs', label: 'WBS' },
  { key: 'actividad', label: 'Actividad' },
  { key: 'proyecto', label: 'Proyecto' },
  { key: 'responsable', label: 'Responsable' },
  { key: 'estado', label: 'Estado' },
  { key: 'prioridad', label: 'Prioridad' },
  { key: 'inicio', label: 'Inicio' },
  { key: 'fin', label: 'Fin' },
  { key: 'dias', label: 'Días' },
  { key: 'avance', label: 'Avance' },
  { key: 'acciones', label: 'Acciones' },
];

export const GanttToolbar: React.FC<GanttToolbarProps> = ({
  filters,
  onFiltersChange,
  searchTerm,
  onSearchChange,
  onNewActivity,
  onExport,
  onPrint,
  timeScale,
  onTimeScaleChange,
  viewMode,
  onViewModeChange,
  groupBy = 'none',
  onGroupByChange,
  sortBy = 'inicio',
  onSortByChange,
  visibleColumns,
  onVisibleColumnsChange,
  options,
}) => {
  const scales: TimeScale[] = ['DIA', 'SEMANA', 'MES', 'TRIMESTRE', 'AÑO'];
  const views: ViewMode[] = ['TABLA', 'GANTT', 'CALENDARIO', 'KANBAN', 'DIVIDIDO'];
  const visibleInitiatives = (options?.initiatives || []).filter((item) => {
    // Prefer primitive programId; fall back to nested relation when API includes it
    const programId = item.programId || item.programa?.id;
    const program = (options?.programs || []).find((p) => p.id === programId);
    const clientId = program?.clientId || program?.cliente?.id;
    return !filters.cliente || clientId === filters.cliente;
  });

  const visibleProjects = (options?.projects || []).filter((item) => {
    const initiativeId = item.initiativeId || item.iniciativa?.id;
    return !filters.iniciativa || initiativeId === filters.iniciativa;
  });

  const toggleColumn = (key: string) => {
    if (!visibleColumns || !onVisibleColumnsChange) return;
    onVisibleColumnsChange({ ...visibleColumns, [key]: !visibleColumns[key] });
  };

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="min-w-[240px] flex-1">
            <input
              type="text"
              placeholder="Buscar actividad, cliente o proyecto..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#C89B2A] focus:bg-white"
            />
          </div>
          <button
            onClick={onNewActivity}
            className="rounded-xl bg-[#0F4C81] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3d65]"
          >
            + Nueva actividad
          </button>
          <button
            onClick={onExport}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Exportar
          </button>
          <button
            onClick={onPrint}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Imprimir
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>Zoom</span>
            <select
              value={timeScale}
              onChange={(e) => onTimeScaleChange(e.target.value as TimeScale)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#C89B2A] focus:outline-none"
            >
              {scales.map((scale) => (
                <option key={scale} value={scale}>{scale}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span>Vista</span>
            <select
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#C89B2A] focus:outline-none"
            >
              {views.map((view) => (
                <option key={view} value={view}>{view}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>Agrupar</span>
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange?.(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#C89B2A] focus:outline-none"
          >
            <option value="none">Sin agrupar</option>
            <option value="cliente">Por cliente</option>
            <option value="programa">Por programa</option>
            <option value="iniciativa">Por iniciativa</option>
            <option value="proyecto">Por proyecto</option>
            <option value="responsable">Por responsable</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>Ordenar</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange?.(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#C89B2A] focus:outline-none"
          >
            <option value="inicio">Fecha de inicio</option>
            <option value="fin">Fecha de fin</option>
            <option value="nombre">Nombre</option>
            <option value="progreso">Avance</option>
          </select>
        </label>
      </div>

      <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-slate-700">Filtros avanzados y columnas</summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <select
            value={filters.cliente || ''}
            onChange={(e) => onFiltersChange({ ...filters, cliente: e.target.value || undefined, iniciativa: undefined, proyecto: undefined })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los clientes</option>
            {(options?.clients || []).map((client) => (
              <option key={client.id} value={client.id}>{client.nombre}</option>
            ))}
          </select>
          <select
            value={filters.iniciativa || ''}
            onChange={(e) => onFiltersChange({ ...filters, iniciativa: e.target.value || undefined, proyecto: undefined })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todas las iniciativas</option>
            {visibleInitiatives.map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>
          <select
            value={filters.proyecto || ''}
            onChange={(e) => onFiltersChange({ ...filters, proyecto: e.target.value || undefined })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los proyectos</option>
            {visibleProjects.map((item) => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>
          <select
            value={filters.responsable || ''}
            onChange={(e) => onFiltersChange({ ...filters, responsable: e.target.value || undefined })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los responsables</option>
            {(options?.users || []).map((user) => (
              <option key={user.id} value={user.id}>{user.nombre || user.email || user.id}</option>
            ))}
          </select>
          <select
            value={filters.estado || ''}
            onChange={(e) => onFiltersChange({ ...filters, estado: (e.target.value as any) || undefined })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_CURSO">En progreso</option>
            <option value="COMPLETADO">Completada</option>
            <option value="ATRASADO">Atrasada</option>
          </select>
          <select
            value={filters.prioridad || ''}
            onChange={(e) => onFiltersChange({ ...filters, prioridad: (e.target.value as any) || undefined })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todas las prioridades</option>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {columnOptions.map((column) => (
            <label key={column.key} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={visibleColumns?.[column.key] !== false}
                onChange={() => toggleColumn(column.key)}
              />
              {column.label}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
};

export default GanttToolbar;
