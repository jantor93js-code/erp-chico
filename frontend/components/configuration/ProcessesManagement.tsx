'use client';

import { useState, useEffect, useCallback } from 'react';
import { processesService } from '@/services/processesService';
import { areasService } from '@/services/areasService';
import ProcessForm from './ProcessForm';
import ProcessesList from './ProcessesList';
import { toast } from 'sonner';

export default function ProcessesManagement() {
  const [processes, setProcesses] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProcess, setEditingProcess] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pagination, setPagination] = useState({ skip: 0, take: 10, total: 0 });

  useEffect(() => {
    areasService.getAll().then((result) => setAreas(result.data)).catch(() => toast.error('Error al cargar áreas'));
  }, []);

  const loadProcesses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await processesService.getAll(pagination.skip, pagination.take);
      setProcesses(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch (error) {
      toast.error('Error al cargar procesos');
    } finally {
      setLoading(false);
    }
  }, [pagination.skip, pagination.take]);

  useEffect(() => {
    loadProcesses();
  }, [loadProcesses]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadProcesses();
      return;
    }

    setLoading(true);
    try {
      const results = await processesService.search(query);
      setProcesses(results);
    } catch (error) {
      toast.error('Error al buscar procesos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProcess(null);
    setShowForm(true);
  };

  const handleEdit = (process: any) => {
    setEditingProcess(process);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este proceso?')) return;

    try {
      await processesService.delete(id);
      toast.success('Proceso eliminado correctamente');
      loadProcesses();
    } catch (error) {
      toast.error('Error al eliminar proceso');
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingProcess) {
        await processesService.update(editingProcess.id, data);
        toast.success('Proceso actualizado correctamente');
      } else {
        await processesService.create(data);
        toast.success('Proceso creado correctamente');
      }
      setShowForm(false);
      loadProcesses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar proceso');
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProcess(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar procesos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Proceso
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">
                {editingProcess ? 'Editar Proceso' : 'Nuevo Proceso'}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProcessForm
              initialData={editingProcess}
              areas={areas}
              onSave={handleSave}
              onCancel={handleClose}
            />
          </div>
        </div>
      )}

      <ProcessesList
        processes={processes}
        areas={areas}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {processes.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-600">
            Mostrando {processes.length} de {pagination.total} procesos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  skip: Math.max(0, prev.skip - prev.take),
                }))
              }
              disabled={pagination.skip === 0}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  skip: prev.skip + prev.take,
                }))
              }
              disabled={pagination.skip + pagination.take >= pagination.total}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
