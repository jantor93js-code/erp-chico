/**
 * Tabla de planificación para Gantt
 */
'use client';

import React, { useEffect, useRef } from 'react';
import { GanttActivity } from './types';

interface GanttTableProps {
  activities: GanttActivity[];
  selectedActivity: GanttActivity | null;
  onSelectActivity: (activity: GanttActivity) => void;
  onEditActivity: (activity: GanttActivity) => void;
  onDuplicateActivity: (activity: GanttActivity) => void;
  onDeleteActivity: (id: string) => void;
  visibleColumns?: Record<string, boolean>;
  scrollTop?: number;
  onScroll?: (scrollTop: number) => void;
}

const getStateColor = (estado: string): string => {
  switch (estado) {
    case 'COMPLETADO':
      return 'bg-green-100 text-green-800';
    case 'EN_CURSO':
      return 'bg-blue-100 text-blue-800';
    case 'PENDIENTE':
      return 'bg-gray-100 text-gray-800';
    case 'ATRASADO':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (prioridad: string): string => {
  switch (prioridad) {
    case 'CRITICA':
      return 'text-red-600 font-bold';
    case 'ALTA':
      return 'text-orange-600 font-semibold';
    case 'MEDIA':
      return 'text-yellow-600';
    case 'BAJA':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export const GanttTable: React.FC<GanttTableProps> = ({
  activities,
  selectedActivity,
  onSelectActivity,
  onEditActivity,
  onDuplicateActivity,
  onDeleteActivity,
  visibleColumns,
  scrollTop = 0,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && containerRef.current.scrollTop !== scrollTop) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200 flex flex-col h-full">
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        onScroll={(e) => onScroll?.((e.target as HTMLDivElement).scrollTop)}
      >
        <table className="w-full min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              {visibleColumns?.wbs !== false && <th className="sticky top-0 z-10 px-3 py-2 text-left font-semibold text-gray-900 min-w-[50px] bg-gray-50">WBS</th>}
              {visibleColumns?.actividad !== false && <th className="sticky top-0 z-10 px-3 py-2 text-left font-semibold text-gray-900 min-w-[180px] bg-gray-50">Actividad</th>}
              {visibleColumns?.proyecto !== false && <th className="sticky top-0 z-10 px-3 py-2 text-left font-semibold text-gray-900 min-w-[120px] bg-gray-50">Proyecto</th>}
              {visibleColumns?.responsable !== false && <th className="sticky top-0 z-10 px-3 py-2 text-left font-semibold text-gray-900 min-w-[120px] bg-gray-50">Responsable</th>}
              {visibleColumns?.estado !== false && <th className="sticky top-0 z-10 px-3 py-2 text-center font-semibold text-gray-900 min-w-[90px] bg-gray-50">Estado</th>}
              {visibleColumns?.prioridad !== false && <th className="sticky top-0 z-10 px-3 py-2 text-center font-semibold text-gray-900 min-w-[80px] bg-gray-50">Prioridad</th>}
              {visibleColumns?.inicio !== false && <th className="sticky top-0 z-10 px-3 py-2 text-center font-semibold text-gray-900 min-w-[80px] bg-gray-50">Inicio</th>}
              {visibleColumns?.fin !== false && <th className="sticky top-0 z-10 px-3 py-2 text-center font-semibold text-gray-900 min-w-[80px] bg-gray-50">Fin</th>}
              {visibleColumns?.dias !== false && <th className="sticky top-0 z-10 px-3 py-2 text-center font-semibold text-gray-900 min-w-[60px] bg-gray-50">Días</th>}
              {visibleColumns?.avance !== false && <th className="sticky top-0 z-10 px-3 py-2 text-center font-semibold text-gray-900 min-w-[90px] bg-gray-50">Avance</th>}
              {visibleColumns?.acciones !== false && <th className="sticky top-0 z-10 px-3 py-2 text-center font-semibold text-gray-900 min-w-[80px] bg-gray-50">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No hay actividades disponibles
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr
                  key={activity.id}
                  onClick={() => onSelectActivity(activity)}
                  className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition ${
                    selectedActivity?.id === activity.id ? 'bg-blue-100' : ''
                  }`}
                >
                  {visibleColumns?.wbs !== false && <td className="px-3 py-2 text-gray-900 font-semibold">{activity.wbs}</td>}
                  {visibleColumns?.actividad !== false && <td className="px-3 py-2 text-gray-900 font-medium">{activity.nombre}</td>}
                  {visibleColumns?.proyecto !== false && <td className="px-3 py-2 text-gray-700 text-xs">{activity.proyectoNombre || '—'}</td>}
                  {visibleColumns?.responsable !== false && <td className="px-3 py-2 text-gray-700 text-xs">{activity.responsableNombre || '—'}</td>}
                  {visibleColumns?.estado !== false && <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStateColor(activity.estado)}`}>
                      {activity.estado}
                    </span>
                  </td>}
                  {visibleColumns?.prioridad !== false && <td className={`px-3 py-2 text-center font-medium text-xs ${getPriorityColor(activity.prioridad)}`}>
                    {activity.prioridad}
                  </td>}
                  {visibleColumns?.inicio !== false && <td className="px-3 py-2 text-center text-gray-700 text-xs">
                    {activity.fechaInicio.toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit' })}
                  </td>}
                  {visibleColumns?.fin !== false && <td className="px-3 py-2 text-center text-gray-700 text-xs">
                    {activity.fechaFin.toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit' })}
                  </td>}
                  {visibleColumns?.dias !== false && <td className="px-3 py-2 text-center text-gray-900 font-semibold text-xs">
                    {activity.duracionDias}
                  </td>}
                  {visibleColumns?.avance !== false && <td className="px-3 py-2 text-center">
                    <div className="w-12 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${activity.avancePorc}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{activity.avancePorc}%</span>
                  </td>}
                  {visibleColumns?.acciones !== false && <td className="px-3 py-2 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditActivity(activity);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition text-sm"
                        title="Editar"
                      >
                        ✎
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateActivity(activity);
                        }}
                        className="text-purple-600 hover:text-purple-900 transition text-sm"
                        title="Duplicar"
                      >
                        ⧉
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('¿Eliminar actividad?')) {
                            onDeleteActivity(activity.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 transition text-sm"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GanttTable;
