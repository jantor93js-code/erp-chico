import React from 'react';

export default function ImportHeader() {
  return (
    <header className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Importación Inteligente — Biblioteca PMO</h1>
        <p className="text-sm text-slate-500 mt-1">Analiza contratos de importación y sincroniza documentos con la base de datos del PMO.</p>
      </div>
      <div className="text-slate-400">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="opacity-80">
          <path d="M12 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 10l-7 7-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </header>
  );
}
