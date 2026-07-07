import React from 'react';

export default function ImportSummaryCards({ summary }: { summary: { nuevos: number; actualizados: number; sinCambios: number; sinCodigo: number } }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-slate-500">Nuevos</div>
        <div className="text-2xl font-semibold">{summary.nuevos}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-slate-500">Actualizados</div>
        <div className="text-2xl font-semibold">{summary.actualizados}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-slate-500">Sin cambios</div>
        <div className="text-2xl font-semibold">{summary.sinCambios}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-slate-500">Sin código</div>
        <div className="text-2xl font-semibold">{summary.sinCodigo}</div>
      </div>
    </div>
  );
}
