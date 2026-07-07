import React from 'react';

export default function ImportDocumentsTable({ documents, onSelect }: { documents: any[]; onSelect: (codigo: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full table-auto">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm text-slate-500">Código</th>
            <th className="px-4 py-3 text-left text-sm text-slate-500">Nombre</th>
            <th className="px-4 py-3 text-left text-sm text-slate-500">Versión</th>
            <th className="px-4 py-3 text-left text-sm text-slate-500">Estado</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.codigoDocumento} className="hover:bg-slate-50 cursor-pointer" onClick={() => onSelect(doc.codigoDocumento)}>
              <td className="px-4 py-3 text-sm">{doc.codigoDocumento}</td>
              <td className="px-4 py-3 text-sm">{doc.nombreDocumento}</td>
              <td className="px-4 py-3 text-sm">{doc.version}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{doc.status}</td>
              <td className="px-4 py-3 text-right text-sm text-sky-600">Ver</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
