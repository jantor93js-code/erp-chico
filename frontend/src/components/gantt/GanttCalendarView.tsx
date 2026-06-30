'use client';

import React, { useMemo } from 'react';
import { GanttActivity } from './types';

interface GanttCalendarViewProps {
  activities: GanttActivity[];
  view: 'MES' | 'SEMANA' | 'DIA';
  onSelectActivity: (activity: GanttActivity) => void;
  onEditActivity: (activity: GanttActivity) => void;
}

const statusClasses: Record<string, string> = {
  PENDIENTE: 'bg-slate-100 text-slate-700 border-slate-200',
  EN_CURSO: 'bg-amber-100 text-amber-700 border-amber-200',
  ATRASADO: 'bg-rose-100 text-rose-700 border-rose-200',
  COMPLETADO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

function formatDate(date: Date) {
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

export const GanttCalendarView: React.FC<GanttCalendarViewProps> = ({
  activities,
  view,
  onSelectActivity,
  onEditActivity,
}) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days: Date[] = [];
    const startOffset = (firstDay.getDay() + 6) % 7;

    for (let index = 0; index < startOffset; index += 1) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() - (startOffset - index));
      days.push(date);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      days.push(next);
    }

    return days;
  }, [currentMonth, currentYear]);

  const dayActivities = useMemo(() => {
    const map = new Map<string, GanttActivity[]>();
    for (const activity of activities) {
      const start = new Date(activity.fechaInicio);
      const end = new Date(activity.fechaFin);
      const cursor = new Date(start);
      while (cursor <= end) {
        const key = cursor.toISOString().slice(0, 10);
        const list = map.get(key) ?? [];
        list.push(activity);
        map.set(key, list);
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return map;
  }, [activities]);

  if (view === 'DIA') {
    return (
      <div className="h-full overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Vista diaria</p>
            <p className="text-xs text-slate-500">Resumen del día para priorizar decisiones</p>
          </div>
          <span className="rounded-full bg-[#F5F3EF] px-3 py-1 text-xs font-semibold text-[#8A6A1A]">
            {today.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'short' })}
          </span>
        </div>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No hay actividades para este día.
            </div>
          ) : (
            activities.map((activity) => (
              <button
                key={activity.id}
                type="button"
                onClick={() => onEditActivity(activity)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-[#C89B2A] hover:shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{activity.nombre}</p>
                  <p className="mt-1 text-xs text-slate-500">{activity.proyectoNombre || 'Sin proyecto'} • {activity.responsableNombre || 'Sin responsable'}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[activity.estado] || 'bg-slate-100 text-slate-700'}`}>
                  {activity.estado}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'SEMANA') {
    return (
      <div className="h-full overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Vista semanal</p>
            <p className="text-xs text-slate-500">Prioriza el trabajo de la semana con el mismo contexto que en Gantt</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-7">
          {Array.from({ length: 7 }, (_, idx) => {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + idx + 1);
            const key = date.toISOString().slice(0, 10);
            const items = dayActivities.get(key) ?? [];
            return (
              <div key={key} className="min-h-[180px] rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{date.getDate()}</p>
                <div className="mt-3 space-y-2">
                  {items.map((activity) => (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => onEditActivity(activity)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-left text-xs shadow-sm hover:border-[#C89B2A]"
                    >
                      <p className="truncate font-semibold text-slate-800">{activity.nombre}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{activity.responsableNombre || 'Sin responsable'}</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Vista mensual</p>
          <p className="text-xs text-slate-500">Calendario visual para revisar la carga del mes</p>
        </div>
        <span className="rounded-full bg-[#F5F3EF] px-3 py-1 text-xs font-semibold text-[#8A6A1A]">
          {today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {day}
          </div>
        ))}
        {monthDays.map((date) => {
          const key = date.toISOString().slice(0, 10);
          const items = dayActivities.get(key) ?? [];
          const isCurrentMonth = date.getMonth() === currentMonth;
          return (
            <div key={key} className={`min-h-[108px] rounded-2xl border p-2 ${isCurrentMonth ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-xs font-semibold ${isCurrentMonth ? 'text-slate-700' : 'text-slate-400'}`}>{date.getDate()}</span>
                {items.length > 0 && <span className="rounded-full bg-[#C89B2A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#8A6A1A]">{items.length}</span>}
              </div>
              <div className="space-y-1">
                {items.slice(0, 2).map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => onEditActivity(activity)}
                    className="w-full rounded-lg border border-slate-200 bg-[#FFFDF7] px-2 py-1 text-left text-[11px] shadow-sm hover:border-[#C89B2A]"
                  >
                    <p className="truncate font-semibold text-slate-800">{activity.nombre}</p>
                  </button>
                ))}
                {items.length > 2 && <p className="text-[10px] text-slate-500">+{items.length - 2} más</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttCalendarView;
