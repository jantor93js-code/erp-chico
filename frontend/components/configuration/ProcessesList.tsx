'use client';

interface ProcessesListProps {
  processes: any[];
  areas: any[];
  loading: boolean;
  onEdit: (process: any) => void;
  onDelete: (id: string) => void;
}

export default function ProcessesList({ processes, areas, loading, onEdit, onDelete }: ProcessesListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    );
  }

  if (processes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-600">No hay procesos registrados</p>
      </div>
    );
  }

  const getAreaName = (areaId: string) => areas.find((a) => a.id === areaId)?.nombre || 'N/A';

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Área</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descripción</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {processes.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{process.nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{process.codigo}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{getAreaName(process.areaId)}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{process.descripcion || '-'}</td>
              <td className="px-6 py-4 text-sm text-right">
                <button
                  onClick={() => onEdit(process)}
                  className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => onDelete(process.id)}
                  className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
