/**
 * Barra de herramientas con filtros para Gantt
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
}

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
}) => {
  const scales: TimeScale[] = ['DIA', 'SEMANA', 'MES', 'TRIMESTRE', 'AÑO'];
  const views: ViewMode[] = ['TABLA', 'GANTT', 'DIVIDIDO', 'TIMELINE'];

  return (
    <div className="bg-white border-b border-gray-200 p-4 rounded-lg mb-4 shadow-sm">
      {/* Primera fila: Búsqueda y acciones */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar actividad..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones de acción */}
          <button
            onClick={onNewActivity}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Nueva Actividad
          </button>

          <button
            onClick={onExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            📥 Exportar
          </button>

          <button
            onClick={onPrint}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            🖨 Imprimir
          </button>
        </div>

        {/* Selectores de escala y vista */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Selector de escala */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Escala:</label>
            <select
              value={timeScale}
              onChange={(e) => onTimeScaleChange(e.target.value as TimeScale)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {scales.map((scale) => (
                <option key={scale} value={scale}>
                  {scale}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de vista */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Vista:</label>
            <select
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {views.map((view) => (
                <option key={view} value={view}>
                  {view}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Segunda fila: Filtros */}
      <details className="border-t border-gray-200 pt-3">
        <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
          ▶ Filtros avanzados
        </summary>
        <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-3 lg:grid-cols-6">
          <input
            type="text"
            placeholder="Cliente..."
            value={filters.cliente || ''}
            onChange={(e) => onFiltersChange({ ...filters, cliente: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Programa..."
            value={filters.programa || ''}
            onChange={(e) => onFiltersChange({ ...filters, programa: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Iniciativa..."
            value={filters.iniciativa || ''}
            onChange={(e) => onFiltersChange({ ...filters, iniciativa: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Proyecto..."
            value={filters.proyecto || ''}
            onChange={(e) => onFiltersChange({ ...filters, proyecto: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Responsable..."
            value={filters.responsable || ''}
            onChange={(e) => onFiltersChange({ ...filters, responsable: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <select
            value={filters.estado || ''}
            onChange={(e) => onFiltersChange({ ...filters, estado: (e.target.value as any) || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_CURSO">En Curso</option>
            <option value="COMPLETADO">Completado</option>
            <option value="ATRASADO">Atrasado</option>
          </select>
          <select
            value={filters.prioridad || ''}
            onChange={(e) => onFiltersChange({ ...filters, prioridad: (e.target.value as any) || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Todas las prioridades</option>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </div>
      </details>
    </div>
  );
};

export default GanttToolbar;
