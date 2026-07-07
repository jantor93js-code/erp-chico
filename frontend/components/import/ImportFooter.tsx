import React from 'react';

export default function ImportFooter({ onCancel, onExecute }: { onCancel: () => void; onExecute: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 mt-6">
      <button onClick={onCancel} className="px-4 py-2 rounded border border-slate-200 text-sm">Cancelar</button>
      <button onClick={onExecute} className="px-4 py-2 rounded bg-emerald-600 text-white text-sm">Ejecutar Importación</button>
    </div>
  );
}
