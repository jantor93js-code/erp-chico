import React from 'react';

export default function ImportDetailsDrawer({ open, onClose, differences, codigo }: { open: boolean; onClose: () => void; differences?: any[]; codigo?: string }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-96 bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detalle: {codigo}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">Cerrar</button>
        </div>
        <div className="space-y-3">
          {(!differences || differences.length === 0) && <div className="text-sm text-slate-500">No hay diferencias.</div>}
          {differences?.map((d) => (
            <div key={d.field} className="border rounded p-3">
              <div className="text-xs text-slate-400">Campo</div>
              <div className="font-medium">{d.field}</div>
              <div className="mt-2 text-xs text-slate-400">Base de datos</div>
              <div className="text-sm">{d.databaseValue}</div>
              <div className="mt-2 text-xs text-slate-400">Contrato</div>
              <div className="text-sm">{d.contractValue}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
