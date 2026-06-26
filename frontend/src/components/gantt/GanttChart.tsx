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

const getScaleConfig = (
  scale: TimeScale,
): {
  daysPerPixel: number;
  headerHeight: number;
  cellWidth: number;
  label: (date: Date) => string;
} => {
  switch (scale) {
    case 'DIA':
      return { daysPerPixel: 1 / 40, headerHeight: 60, cellWidth: 40, label: (d) => d.toLocaleDateString('es-ES', { day: '2-digit' }) };
    case 'SEMANA':
      return { daysPerPixel: 7 / 50, headerHeight: 60, cellWidth: 50, label: (d) => `S${Math.ceil(d.getDate() / 7)}` };
    case 'MES':
      return { daysPerPixel: 30 / 60, headerHeight: 60, cellWidth: 60, label: (d) => d.toLocaleDateString('es-ES', { month: '2-digit', year: '2-digit' }) };
    case 'TRIMESTRE':
      return { daysPerPixel: 90 / 70, headerHeight: 60, cellWidth: 70, label: (d) => `Q${Math.ceil((d.getMonth() + 1) / 3)}` };
    case 'AÑO':
      return { daysPerPixel: 365 / 80, headerHeight: 60, cellWidth: 80, label: (d) => d.getFullYear().toString() };
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
  const [dragState, setDragState] = useState<{
    activityId: string;
    startX: number;
    startDate: Date;
    endDate: Date;
  } | null>(null);

  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (activities.length === 0) {
      const today = new Date();
      return { minDate: today, maxDate: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000), totalDays: 365 };
    }

    const dates = activities.flatMap((a) => [a.fechaInicio, a.fechaFin]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Redondear a inicio de período según escala
    minDate.setDate(minDate.getDate() - minDate.getDate() % 7);

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return { minDate, maxDate, totalDays };
  }, [activities, timeScale]);

  const totalWidth = Math.max(800, totalDays / config.daysPerPixel + 100);

  useEffect(() => {
    if (!dragState || !svgRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = event.clientX - rect.left;
      const deltaDays = Math.round((currentX - dragState.startX) / (config.cellWidth * config.daysPerPixel));
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

  // Generar encabezados de fecha
  const dateHeaders = useMemo(() => {
    const headers = [];
    const current = new Date(minDate);

    while (current <= maxDate) {
      headers.push({
        date: new Date(current),
        label: config.label(new Date(current)),
      });

      if (timeScale === 'DIA') current.setDate(current.getDate() + 1);
      else if (timeScale === 'SEMANA') current.setDate(current.getDate() + 7);
      else if (timeScale === 'MES') current.setMonth(current.getMonth() + 1);
      else if (timeScale === 'TRIMESTRE') current.setMonth(current.getMonth() + 3);
      else if (timeScale === 'AÑO') current.setFullYear(current.getFullYear() + 1);
    }

    return headers;
  }, [minDate, maxDate, timeScale, config]);

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200 flex flex-col h-full">
      {/* Encabezado de fechas fijo */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        <div style={{ width: totalWidth }}>
          <div className="flex border-b border-gray-300">
            {dateHeaders.map((header, idx) => (
              <div
                key={idx}
                className="px-2 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-300 flex-shrink-0"
                style={{ width: config.cellWidth }}
              >
                {header.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de barras */}
      <div
        className="flex-1 overflow-auto"
        onScroll={(e) => onScroll?.((e.target as HTMLDivElement).scrollTop)}
      >
        <svg ref={svgRef} style={{ width: totalWidth, minHeight: '100%' }} className="bg-white">
          {/* Líneas verticales de grid */}
          {dateHeaders.map((_, idx) => (
            <line
              key={`grid-${idx}`}
              x1={idx * config.cellWidth}
              y1="0"
              x2={idx * config.cellWidth}
              y2={activities.length * 50 + 100}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Hoy - línea roja */}
          {(() => {
            const today = new Date();
            const daysFromStart = (today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
            const x = (daysFromStart / config.daysPerPixel) * config.cellWidth;
            if (x > 0 && x < totalWidth) {
              return <line x1={x} y1="0" x2={x} y2={activities.length * 50 + 100} stroke="#DC2626" strokeWidth="2" strokeDasharray="4" />;
            }
          })()}

          {/* Barras de actividades */}
          {activities.map((activity, idx) => {
            const startDays = (activity.fechaInicio.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
            const durationDays = (activity.fechaFin.getTime() - activity.fechaInicio.getTime()) / (1000 * 60 * 60 * 24);

            const x = (startDays / config.daysPerPixel) * config.cellWidth;
            const width = (durationDays / config.daysPerPixel) * config.cellWidth;
            const y = idx * 50 + 10;
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
                  opacity={isSelected ? 1 : 0.8}
                  stroke={isSelected ? '#1E40AF' : 'none'}
                  strokeWidth={isSelected ? '2' : '0'}
                  rx="4"
                  className="hover:opacity-100 transition-opacity"
                />

                {/* Indicador de progreso */}
                {activity.avancePorc > 0 && (
                  <rect
                    x={x}
                    y={y}
                    width={Math.max((width * activity.avancePorc) / 100, 3)}
                    height="30"
                    fill={barColor}
                    opacity="0.4"
                    rx="4"
                  />
                )}

                {/* Hito (rombo) */}
                {activity.esMilestone && (
                  <polygon
                    points={`${x + width / 2},${y - 8} ${x + width / 2 + 8},${y + 15} ${x + width / 2},${y + 38} ${x + width / 2 - 8},${y + 15}`}
                    fill="#9333EA"
                    opacity="0.7"
                  />
                )}

                {/* Dependencias (línea de conexión) */}
                {activity.sucesoras &&
                  activity.sucesoras.map((dep) => {
                    const succActivity = activities.find((a) => a.id === dep.sucesora);
                    if (!succActivity) return null;

                    const endX = x + width;
                    const endY = y + 15;

                    const succStartDays = (succActivity.fechaInicio.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
                    const succX = (succStartDays / config.daysPerPixel) * config.cellWidth;
                    const succY = activities.indexOf(succActivity) * 50 + 25;

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
