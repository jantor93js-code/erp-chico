/**
 * Componente KPI Dashboard para el Gantt
 */
'use client';

import React from 'react';
import { GanttKPI } from './types';

interface GanttKPICardsProps {
  kpi: GanttKPI;
}

export const GanttKPICards: React.FC<GanttKPICardsProps> = ({ kpi }) => {
  const kpiItems = [
    {
      label: 'Total Actividades',
      value: kpi.totalActividades,
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      icon: '📋',
    },
    {
      label: 'Completadas',
      value: kpi.actividadesCompletadas,
      bg: 'bg-green-50',
      text: 'text-green-900',
      icon: '✓',
    },
    {
      label: 'En Progreso',
      value: kpi.enProgreso,
      bg: 'bg-yellow-50',
      text: 'text-yellow-900',
      icon: '▶',
    },
    {
      label: 'Pendientes',
      value: kpi.pendientes,
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      icon: '○',
    },
    {
      label: 'Atrasadas',
      value: kpi.atrasadas,
      bg: 'bg-red-50',
      text: 'text-red-900',
      icon: '⚠',
    },
    {
      label: 'Hitos',
      value: kpi.hitos,
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      icon: '◆',
    },
    {
      label: 'Avance General',
      value: `${kpi.avanceGeneral}%`,
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      icon: '📊',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7 mb-6">
      {kpiItems.map((item, idx) => (
        <div key={idx} className={`${item.bg} rounded-lg p-4 border border-gray-200`}>
          <div className={`text-lg font-bold ${item.text}`}>{item.value}</div>
          <div className="text-xs text-gray-600 mt-1">{item.label}</div>
          <div className="text-xl mt-2">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default GanttKPICards;
