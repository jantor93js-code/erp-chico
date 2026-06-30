'use client';

import React from 'react';
import { GanttActivity } from './types';

interface GanttKanbanViewProps {
  activities: GanttActivity[];
  onSelectActivity: (activity: GanttActivity) => void;
  onUpdateActivityState: (activity: GanttActivity, estado: GanttActivity['estado']) => void;
}

const columns: Array<{ key: GanttActivity['estado']; title: string; accent: string }> = [
  { key: 'PENDIENTE', title: 'Pendiente', accent: 'bg-slate-100 text-slate-700' },
  { key: 'EN_CURSO', title: 'En progreso', accent: 'bg-amber-100 text-amber-700' },
  { key: 'ATRASADO', title: 'Atrasada', accent: 'bg-rose-100 text-rose-700' },
  { key: 'COMPLETADO', title: 'Completada', accent: 'bg-emerald-100 text-emerald-700' },
];

export const GanttKanbanView: React.FC<GanttKanbanViewProps> = ({
  activities,
  onSelectActivity,
  onUpdateActivityState,
}) => {
  return (
    <div className="h-full overflow-auto rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-900">Vista Kanban</p>
        <p className="text-xs text-slate-500">Mueve tarjetas entre columnas y el estado se actualiza en la misma fuente de datos.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const items = activities.filter((activity) => activity.estado === column.key);
          return (
            <div key={column.key} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className={`mb-3 flex items-center justify-between rounded-full px-3 py-2 text-xs font-semibold ${column.accent}`}>
                <span>{column.title}</span>
                <span>{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((activity) => (
                  <div key={activity.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                    <button type="button" className="w-full text-left" onClick={() => onSelectActivity(activity)}>
                      <p className="text-sm font-semibold text-slate-900">{activity.nombre}</p>
                      <p className="mt-1 text-xs text-slate-500">{activity.proyectoNombre || 'Sin proyecto'}</p>
                    </button>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="rounded-full bg-white px-2.5 py-1">Resp. {activity.responsableNombre || '—'}</span>
                      <span className="rounded-full bg-white px-2.5 py-1">{activity.prioridad}</span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2">
                        <span>Avance</span>
                        <span className="font-semibold text-slate-900">{activity.avancePorc}%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2">
                        <span>Fechas</span>
                        <span>{activity.fechaInicio.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} → {activity.fechaFin.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#F5F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#8A6A1A]">Docs {activity.documentos ?? 0}</span>
                        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#4338CA]">Comentarios {activity.comentarios ?? 0}</span>
                        <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-semibold text-[#047857]">Checklist {activity.checklist ?? 0}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {columns.filter((c) => c.key !== column.key).map((target) => (
                        <button
                          key={target.key}
                          type="button"
                          onClick={() => onUpdateActivityState(activity, target.key)}
                          className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-[#C89B2A] hover:text-[#8A6A1A]"
                        >
                          {target.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-500">Sin actividades</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttKanbanView;
