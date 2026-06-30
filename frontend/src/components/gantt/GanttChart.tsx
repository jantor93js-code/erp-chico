/**
 * Componente Gantt Chart - renderiza el diagrama visual
 */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GanttActivity, TimeScale } from './types';

interface GanttChartProps {
  activities: GanttActivity[];
  selectedActivity: GanttActivity | null;
  onSelectActivity: (activity: GanttActivity) => void;
  onActivityChange?: (activity: GanttActivity) => void;
  timeScale: TimeScale;
  scrollTop?: number;
  onScroll?: (scrollTop: number) => void;
}

const ROW_HEIGHT = 48;
const MIN_BAR_WIDTH = 24;

const getScaleConfig = (
  scale: TimeScale,
): {
  pixelsPerDay: number;
  headerHeight: number;
  headerStepDays: number;
  label: (date: Date) => string;
} => {
  switch (scale) {
    case 'DIA':
      return {
        pixelsPerDay: 40,
        headerHeight: 60,
        headerStepDays: 1,
        label: (d) => d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      };
    case 'SEMANA':
      return {
        pixelsPerDay: 10,
        headerHeight: 60,
        headerStepDays: 7,
        label: (d) => `S${Math.ceil((d.getDate() + 1) / 7)} ${d.getFullYear()}`,
      };
    case 'MES':
      return {
        pixelsPerDay: 3,
        headerHeight: 60,
        headerStepDays: 30,
        label: (d) => d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
      };
    case 'TRIMESTRE':
      return {
        pixelsPerDay: 1.5,
        headerHeight: 60,
        headerStepDays: 90,
        label: (d) => `T${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`,
      };
    case 'AÑO':
      return {
        pixelsPerDay: 0.5,
        headerHeight: 60,
        headerStepDays: 365,
        label: (d) => d.getFullYear().toString(),
      };
  }
};

const getActivityColor = (activity: GanttActivity): string => {
  if (activity.esCritica) return '#EA6B66'; // Rojo para ruta crítica
  switch (activity.estado) {
    case 'COMPLETADO':
      return '#10B981'; // Verde
    case 'EN_CURSO':
      return '#3B82F6'; // Azul
    case 'ATRASADO':
      return '#EF4444'; // Rojo
    case 'PENDIENTE':
    default:
      return '#9CA3AF'; // Gris
  }
};

const normalizeStartOfScale = (date: Date, scale: TimeScale): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);

  switch (scale) {
    case 'DIA':
      return normalized;
    case 'SEMANA': {
      const mondayOffset = (normalized.getDay() + 6) % 7;
      normalized.setDate(normalized.getDate() - mondayOffset);
      return normalized;
    }
    case 'MES':
      normalized.setDate(1);
      return normalized;
    case 'TRIMESTRE': {
      const quarterStartMonth = Math.floor(normalized.getMonth() / 3) * 3;
      normalized.setMonth(quarterStartMonth, 1);
      return normalized;
    }
    case 'AÑO':
      normalized.setMonth(0, 1);
      return normalized;
  }
};

const normalizeEndOfScale = (date: Date, scale: TimeScale): Date => {
  const normalized = new Date(date);
  normalized.setHours(23, 59, 59, 999);

  switch (scale) {
    case 'DIA':
      return normalized;
    case 'SEMANA': {
      const mondayOffset = (normalized.getDay() + 6) % 7;
      normalized.setDate(normalized.getDate() + (6 - mondayOffset));
      return normalized;
    }
    case 'MES':
      normalized.setMonth(normalized.getMonth() + 1, 0);
      return normalized;
    case 'TRIMESTRE': {
      const quarterStartMonth = Math.floor(normalized.getMonth() / 3) * 3;
      normalized.setMonth(quarterStartMonth + 3, 0);
      return normalized;
    }
    case 'AÑO':
      normalized.setMonth(11, 31);
      return normalized;
  }
};

export const GanttChart: React.FC<GanttChartProps> = ({
  activities,
  selectedActivity,
  onSelectActivity,
  onActivityChange,
  timeScale,
  scrollTop = 0,
  onScroll,
}) => {
  const config = getScaleConfig(timeScale);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const isSyncingScroll = useRef(false);
  const [dragState, setDragState] = useState<{
    activityId: string;
    startX: number;
    startDate: Date;
    endDate: Date;
  } | null>(null);

  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (activities.length === 0) {
      const today = new Date();
      const minDate = normalizeStartOfScale(today, timeScale);
      const maxDate = normalizeEndOfScale(new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000), timeScale);
      const totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return { minDate, maxDate, totalDays };
    }

    const allDates = activities.flatMap((a) => [a.fechaInicio, a.fechaFin]);
    const minDate = normalizeStartOfScale(new Date(Math.min(...allDates.map((d) => d.getTime()))), timeScale);
    const maxDate = normalizeEndOfScale(new Date(Math.max(...allDates.map((d) => d.getTime()))), timeScale);
    const totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    return { minDate, maxDate, totalDays };
  }, [activities, timeScale]);

  const totalWidth = Math.max(900, Math.ceil(totalDays * config.pixelsPerDay) + 160);

  useEffect(() => {
    if (!dragState || !svgRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = event.clientX - rect.left;
      const deltaDays = Math.round((currentX - dragState.startX) / config.pixelsPerDay);
      const activity = activities.find((item) => item.id === dragState.activityId);
      if (!activity) return;

      const durationDays = Math.max(1, Math.round((dragState.endDate.getTime() - dragState.startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const newStart = new Date(dragState.startDate);
      newStart.setDate(newStart.getDate() + deltaDays);
      const newEnd = new Date(newStart.getTime() + durationDays * 24 * 60 * 60 * 1000);

      onActivityChange?.({
        ...activity,
        fechaInicio: newStart,
        fechaFin: newEnd,
        duracionDias: durationDays,
      });
    };

    const handleMouseUp = () => setDragState(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, activities, config, onActivityChange]);

  useEffect(() => {
    if (!bodyRef.current) return;
    if (bodyRef.current.scrollTop !== scrollTop) {
      bodyRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  // Generar encabezados de fecha
  const dateHeaders = useMemo(() => {
    const headers = [];
    const current = new Date(minDate);

    while (current <= maxDate) {
      headers.push({
        date: new Date(current),
        label: config.label(new Date(current)),
      });

      current.setDate(current.getDate() + config.headerStepDays);
    }

    return headers;
  }, [minDate, maxDate, config]);

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 flex flex-col h-full shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Vista Gantt ejecutiva</p>
            <p className="text-xs text-slate-500">Ruta crítica, progreso, hitos y línea de hoy en una sola vista.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">✓ Progreso</span>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">◆ Hitos</span>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">● Hoy</span>
          </div>
        </div>
      </div>

      {/* Encabezado de fechas fijo */}
      <div ref={headerRef} className="sticky top-0 z-10 bg-white/95 border-b border-slate-200 overflow-x-auto" onScroll={(e) => {
        if (isSyncingScroll.current) return;
        if (!bodyRef.current) return;
        isSyncingScroll.current = true;
        bodyRef.current.scrollLeft = (e.target as HTMLDivElement).scrollLeft;
        isSyncingScroll.current = false;
      }}>
        <div style={{ width: totalWidth }}>
          <div className="flex border-b border-slate-200">
            {dateHeaders.map((header, idx) => (
              <div
                key={idx}
                className="px-2 py-2 text-center text-xs font-semibold text-slate-700 border-r border-slate-200 flex-shrink-0"
                style={{ width: Math.max(config.headerStepDays * config.pixelsPerDay, 80) }}
              >
                {header.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de barras */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-auto"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          onScroll?.(target.scrollTop);
          if (isSyncingScroll.current) return;
          if (!headerRef.current) return;
          isSyncingScroll.current = true;
          headerRef.current.scrollLeft = target.scrollLeft;
          isSyncingScroll.current = false;
        }}
      >
        <svg ref={svgRef} width={totalWidth} height={Math.max(activities.length * ROW_HEIGHT + 140, 300)} className="bg-white">
          {/* Líneas verticales de grid */}
          {dateHeaders.map((_, idx) => (
            <line
              key={`grid-${idx}`}
              x1={idx * config.headerStepDays * config.pixelsPerDay}
              y1="0"
              x2={idx * config.headerStepDays * config.pixelsPerDay}
              y2={activities.length * ROW_HEIGHT + 100}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Hoy - línea roja */}
          {(() => {
            const today = new Date();
            const daysFromStart = Math.round((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
            const x = daysFromStart * config.pixelsPerDay;
            if (x >= 0 && x <= totalWidth) {
              return <line x1={x} y1="0" x2={x} y2={activities.length * ROW_HEIGHT + 100} stroke="#DC2626" strokeWidth="2" strokeDasharray="4" />;
            }
            return null;
          })()}

          {/* Barras de actividades */}
          {activities.map((activity, idx) => {
            const startDays = Math.round((activity.fechaInicio.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
            const durationDays = Math.max(
              1,
              Math.ceil((activity.fechaFin.getTime() - activity.fechaInicio.getTime()) / (1000 * 60 * 60 * 24)),
            );

            const x = Math.round(startDays * config.pixelsPerDay);
            const width = Math.max(Math.round(durationDays * config.pixelsPerDay), MIN_BAR_WIDTH);
            const y = idx * ROW_HEIGHT + 12;
            const barColor = getActivityColor(activity);
            const isSelected = selectedActivity?.id === activity.id;

            return (
              <g
                key={activity.id}
                onClick={() => onSelectActivity(activity)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setDragState({
                    activityId: activity.id,
                    startX: event.clientX - rect.left,
                    startDate: new Date(activity.fechaInicio),
                    endDate: new Date(activity.fechaFin),
                  });
                  onSelectActivity(activity);
                }}
                style={{ cursor: 'move' }}
              >
                {/* Fondo de selección */}
                {isSelected && (
                  <rect
                    x="0"
                    y={y - 5}
                    width={totalWidth}
                    height="40"
                    fill="#DBEAFE"
                    opacity="0.5"
                  />
                )}

                {/* Barra principal */}
                <rect
                  x={x}
                  y={y}
                  width={Math.max(width, 20)}
                  height="30"
                  fill={barColor}
                  opacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? '#0F4C81' : '#ffffff'}
                  strokeWidth={isSelected ? '2' : '1'}
                  rx="6"
                  className="hover:opacity-100 transition-opacity"
                />

                {/* Indicador de progreso */}
                {activity.avancePorc > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={Math.max((width * activity.avancePorc) / 100, 3)}
                    height="30"
                    fill={isSelected ? '#0F4C81' : '#ffffff'}
                    opacity="0.28"
                    rx="6"
                  />
                )}

                {/* Hito (rombo) */}
                {activity.esMilestone && (
                  <polygon
                    points={`${x + width / 2},${y - 8} ${x + width / 2 + 8},${y + 15} ${x + width / 2},${y + 38} ${x + width / 2 - 8},${y + 15}`}
                    fill="#9333EA"
                    opacity="0.9"
                  />
                )}

                {/* Etiqueta de actividad */}
                <text
                  x={x + 8}
                  y={y + 16}
                  fontSize="11"
                  fontWeight="600"
                  fill={width > 120 ? '#ffffff' : '#0f172a'}
                >
                  {activity.nombre}
                </text>
                <text
                  x={x + 8}
                  y={y + 30}
                  fontSize="10"
                  fill={width > 120 ? '#f8fafc' : '#64748b'}
                >
                  {activity.responsableNombre || 'Sin responsable'} • {activity.duracionDias}d
                </text>

                {/* Dependencias (línea de conexión) */}
                {activity.sucesoras &&
                  activity.sucesoras.map((dep) => {
                    const succActivity = activities.find((a) => a.id === dep.sucesora);
                    if (!succActivity) return null;

                    const endX = x + width;
                    const endY = y + 15;

                    const succStartDays = Math.round((succActivity.fechaInicio.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                    const succX = succStartDays * config.pixelsPerDay;
                    const succY = activities.indexOf(succActivity) * ROW_HEIGHT + 30;

                    return (
                      <line
                        key={dep.id}
                        x1={endX}
                        y1={endY}
                        x2={succX}
                        y2={succY}
                        stroke="#6366F1"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                        opacity="0.6"
                      />
                    );
                  })}
              </g>
            );
          })}

          {/* Marcador de flecha para dependencias */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#6366F1" />
            </marker>
          </defs>
        </svg>

        {/* Mensaje de vacío */}
        {activities.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No hay actividades para mostrar
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttChart;
