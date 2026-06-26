/**
 * Modal para crear/editar actividades del Gantt
 */
'use client';

import React, { useEffect, useState } from 'react';
import { GanttActivity, GanttActivityType, GanttActivityState, GanttPriority } from './types';

interface ActivityModalProps {
  isOpen: boolean;
  activity?: GanttActivity;
  onClose: () => void;
  onSave: (activity: GanttActivity) => void;
}

const defaultActivity: Partial<GanttActivity> = {
  tipo: 'ACTIVIDAD',
  estado: 'PENDIENTE',
  prioridad: 'MEDIA',
  avancePorc: 0,
  esMilestone: false,
};

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  activity,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<GanttActivity>>(activity || defaultActivity);

  useEffect(() => {
    if (activity) {
      setFormData(activity);
    } else {
      setFormData(defaultActivity);
    }
  }, [activity, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
  };

  const handleSave = () => {
    // Validación mínima
    if (!formData.nombre) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.fechaInicio || !formData.fechaFin) {
      alert('Las fechas son obligatorias');
      return;
    }

    const duracionDias = Math.ceil(
      (formData.fechaFin.getTime() - formData.fechaInicio.getTime()) / (1000 * 60 * 60 * 24),
    );

    const dataToSave: GanttActivity = {
      id: formData.id || `activity-${Date.now()}`,
      wbs: formData.wbs || '1.0',
      nombre: formData.nombre || '',
      descripcion: formData.descripcion,
      tipo: (formData.tipo || 'ACTIVIDAD') as GanttActivityType,
      estado: (formData.estado || 'PENDIENTE') as GanttActivityState,
      prioridad: (formData.prioridad || 'MEDIA') as GanttPriority,
      proyectoId: formData.proyectoId,
      proyectoNombre: formData.proyectoNombre,
      programaId: formData.programaId,
      programaNombre: formData.programaNombre,
      iniciativaId: formData.iniciativaId,
      iniciativaNombre: formData.iniciativaNombre,
      clienteId: formData.clienteId,
      clienteNombre: formData.clienteNombre,
      responsableId: formData.responsableId,
      responsableNombre: formData.responsableNombre,
      fechaInicio: formData.fechaInicio || new Date(),
      fechaFin: formData.fechaFin || new Date(),
      duracionDias,
      fechaLimite: formData.fechaLimite,
      avancePorc: formData.avancePorc || 0,
      horasEstimadas: formData.horasEstimadas,
      horasReales: formData.horasReales,
      costoEstimado: formData.costoEstimado,
      costoReal: formData.costoReal,
      predecesoras: formData.predecesoras,
      sucesoras: formData.sucesoras,
      esCritica: formData.esCritica,
      holgura: formData.holgura,
      esMilestone: formData.esMilestone,
      createdAt: formData.createdAt || new Date(),
      updatedAt: new Date(),
      observaciones: formData.observaciones,
      riesgos: formData.riesgos,
    };

    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {activity ? 'Editar Actividad' : 'Nueva Actividad'}
          </h2>

          <div className="space-y-6">
            {/* Sección General */}
            <fieldset className="space-y-4 border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-gray-900 px-2 bg-white">General</legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la actividad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    name="tipo"
                    value={formData.tipo || 'ACTIVIDAD'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVIDAD">Actividad</option>
                    <option value="SUBACTIVIDAD">Subactividad</option>
                    <option value="ENTREGABLE">Entregable</option>
                    <option value="HITO">Hito</option>
                    <option value="MILESTONE">Milestone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción detallada"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                  <input
                    type="text"
                    name="proyectoNombre"
                    value={formData.proyectoNombre || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Seleccionar proyecto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <input
                    type="text"
                    name="responsableNombre"
                    value={formData.responsableNombre || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Responsable"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                  <input
                    type="text"
                    name="programaNombre"
                    value={formData.programaNombre || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Programa asociado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    name="clienteNombre"
                    value={formData.clienteNombre || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cliente asociado"
                  />
                </div>
              </div>
            </fieldset>

            {/* Sección Fechas */}
            <fieldset className="space-y-4 border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-gray-900 px-2 bg-white">Fechas</legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inicio *</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio ? formData.fechaInicio.toISOString().split('T')[0] : ''}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin ? formData.fechaFin.toISOString().split('T')[0] : ''}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (días)</label>
                  <input
                    type="number"
                    name="duracionDias"
                    value={formData.duracionDias || 0}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                <input
                  type="date"
                  name="fechaLimite"
                  value={formData.fechaLimite ? formData.fechaLimite.toISOString().split('T')[0] : ''}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </fieldset>

            {/* Sección Estado y Prioridad */}
            <fieldset className="space-y-4 border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-gray-900 px-2 bg-white">Estado y Prioridad</legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado || 'PENDIENTE'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_CURSO">En Curso</option>
                    <option value="COMPLETADO">Completado</option>
                    <option value="ATRASADO">Atrasado</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                  <select
                    name="prioridad"
                    value={formData.prioridad || 'MEDIA'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avance (%)</label>
                  <input
                    type="number"
                    name="avancePorc"
                    min="0"
                    max="100"
                    value={formData.avancePorc || 0}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="esMilestone"
                    checked={formData.esMilestone || false}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Es un Milestone
                </label>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="esCritica"
                    checked={formData.esCritica || false}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  Ruta crítica
                </label>
              </div>
            </fieldset>

            {/* Sección Seguimiento */}
            <fieldset className="space-y-4 border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-gray-900 px-2 bg-white">Seguimiento</legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horas Estimadas</label>
                  <input
                    type="number"
                    name="horasEstimadas"
                    value={formData.horasEstimadas || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horas Reales</label>
                  <input
                    type="number"
                    name="horasReales"
                    value={formData.horasReales || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo Estimado</label>
                  <input
                    type="number"
                    name="costoEstimado"
                    value={formData.costoEstimado || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo Real</label>
                  <input
                    type="number"
                    name="costoReal"
                    value={formData.costoReal || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </fieldset>

            {/* Sección Observaciones */}
            <fieldset className="space-y-4 border border-gray-200 rounded-lg p-4">
              <legend className="text-sm font-semibold text-gray-900 px-2 bg-white">Notas</legend>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Riesgos</label>
                <textarea
                  name="riesgos"
                  value={formData.riesgos || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </fieldset>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
