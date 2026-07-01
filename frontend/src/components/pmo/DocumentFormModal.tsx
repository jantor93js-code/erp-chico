'use client';

import { useState } from 'react';

type DocumentItem = {
  id: string;
  nombre: string;
  codigo?: string;
  codigoDependencia?: string;
  descripcion?: string;
  tipo?: string;
  tipoId?: string;
  tipoRef?: { id: string; codigo: string; nombre: string };
  proceso?: string;
  procesoId?: string;
  processRef?: { id: string; nombre: string };
  area?: string;
  areaId?: string;
  areaRef?: { id: string; nombre: string };
  estadoDocumental?: string;
  estadoDocumentalId?: string;
  estadoDocumentalRef?: { id: string; codigo: string; nombre: string };
  responsableId?: string;
  responsable?: string;
  responsableCargo?: string;
  responsableUsuario?: { id: string; nombre?: string; role?: { nombre?: string; slug?: string } };
  version?: string;
  enlace?: string;
  fechaCreacion?: string;
  fechaRevision?: string;
  observaciones?: string;
  fuente?: string;
  activo?: boolean;
};

type AreaItem = { id: string; nombre?: string; codigo?: string };
type ProcessItem = { id: string; nombre?: string; codigo?: string };
type DocumentTypeItem = { id: string; nombre?: string; codigo?: string };
type DocumentStatusItem = { id: string; nombre?: string; codigo?: string };
type UserItem = { id: string; nombre?: string; email?: string; role?: { nombre?: string; slug?: string } };

type FormState = {
  nombre: string;
  codigo: string;
  codigoDependencia: string;
  descripcion: string;
  tipoId: string;
  procesoId: string;
  areaId: string;
  version: string;
  responsableActualizacion: string;
  responsableRevision: string;
  estadoDocumentalState: string;
  estadoDocumental: 'VIGENTE' | 'NO_VIGENTE';
  fechaCreacion: string;
  fechaRevision: string;
  observaciones: string;
  enlace: string;
  fuente: string;
  activo: boolean;
};

type DocumentFormModalProps = {
  isOpen: boolean;
  selectedDocument: DocumentItem | null;
  formState: FormState;
  onFormChange: (key: keyof FormState, value: string | boolean) => void;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
  areas: AreaItem[];
  processes: ProcessItem[];
  documentTypes: DocumentTypeItem[];
  documentStatuses: DocumentStatusItem[];
  saving: boolean;
};

export default function DocumentFormModal({
  isOpen,
  selectedDocument,
  formState,
  onFormChange,
  onSave,
  onDelete,
  onClose,
  areas,
  processes,
  documentTypes,
  documentStatuses,
  saving,
}: DocumentFormModalProps) {
  const [mouseDownStartedOnWrapper, setMouseDownStartedOnWrapper] = useState(false);

  const handleBackdropMouseDown = () => {
    setMouseDownStartedOnWrapper(true);
  };

  const handleContentMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setMouseDownStartedOnWrapper(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && mouseDownStartedOnWrapper) {
      onClose();
    }
  };

  const estadoDocumentalOptions = documentStatuses.map((s) => ({ value: s.codigo || s.nombre, label: s.nombre || s.codigo }));

  const initialResponsable = formState.responsableActualizacion || formState.responsableRevision || '';

  const handleResponsableChange = (value: string) => {
    // Keep backward compatibility: set both fields to the same responsable
    onFormChange('responsableActualizacion', value);
    onFormChange('responsableRevision', value);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleBackdropClick}
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-lg" onMouseDown={handleContentMouseDown}>
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {selectedDocument ? 'Editar documento' : 'Nuevo documento'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Completa el formulario para {selectedDocument ? 'actualizar' : 'crear'} un documento.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Información General */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Información General</h3>
            
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Nombre documento *</span>
              <input
                value={formState.nombre}
                onChange={(e) => onFormChange('nombre', e.target.value)}
                placeholder="Ej: Manual de Procedimientos"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Código documento</span>
              <input
                value={formState.codigo}
                onChange={(e) => onFormChange('codigo', e.target.value)}
                placeholder="Ej: DOC-2026-001"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Código dependencia</span>
              <input
                value={(formState as any).codigoDependencia || ''}
                onChange={(e) => onFormChange('codigoDependencia' as any, e.target.value)}
                placeholder="Ej: 1.5"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Descripción</span>
              <textarea
                value={formState.descripcion}
                onChange={(e) => onFormChange('descripcion', e.target.value)}
                placeholder="Descripción breve del documento"
                className="w-full min-h-[80px] rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">Tipo documental *</span>
                  <button
                    type="button"
                    onClick={() => window.open('/erp/configuration', '_blank')}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    + Nuevo tipo
                  </button>
                </div>
                <select
                  value={formState.tipoId}
                  onChange={(e) => onFormChange('tipoId', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
                >
                  <option value="">Seleccione tipo</option>
                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.nombre || type.codigo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Versión</span>
                <input
                  value={formState.version}
                  onChange={(e) => onFormChange('version', e.target.value)}
                  placeholder="Ej: 1.0"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Clasificación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Clasificación</h3>
            
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Área / Dependencia *</span>
              <select
                value={formState.areaId}
                onChange={(e) => onFormChange('areaId', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              >
                <option value="">Seleccione área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre || area.codigo}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Proceso asociado *</span>
              <select
                value={formState.procesoId}
                onChange={(e) => onFormChange('procesoId', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              >
                <option value="">Seleccione proceso</option>
                {processes.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.nombre || process.codigo}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Estado *</span>
              <select
                value={formState.estadoDocumentalState}
                onChange={(e) => onFormChange('estadoDocumentalState', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              >
                <option value="">Seleccione estado</option>
                {estadoDocumentalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Responsables */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Responsables</h3>
            
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Responsable *</span>
              <input
                value={initialResponsable}
                onChange={(e) => handleResponsableChange(e.target.value)}
                placeholder="Ej: Jorge Mendoza"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              />
              <p className="text-xs text-slate-500">Se asignará como responsable de actualización y revisión.</p>
            </label>
          </div>

          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Fechas</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Fecha creación</span>
                <input
                  type="date"
                  value={formState.fechaCreacion}
                  onChange={(e) => onFormChange('fechaCreacion', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Próxima revisión</span>
                <input
                  type="date"
                  value={formState.fechaRevision}
                  onChange={(e) => onFormChange('fechaRevision', e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Archivos y enlaces */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Archivos y Enlaces</h3>
            
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Enlace Drive / Almacenamiento</span>
              <input
                value={formState.enlace}
                onChange={(e) => onFormChange('enlace', e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              />
            </label>
          </div>

          {/* Observaciones */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Observaciones y Estado</h3>
            
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Observaciones</span>
              <textarea
                value={formState.observaciones}
                onChange={(e) => onFormChange('observaciones', e.target.value)}
                placeholder="Notas adicionales sobre el documento"
                className="w-full min-h-[100px] rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Vigencia *</span>
              <select
                value={formState.estadoDocumental}
                onChange={(e) => onFormChange('estadoDocumental', e.target.value as 'VIGENTE' | 'NO_VIGENTE')}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-[#C89B2A] focus:outline-none"
              >
                <option value="VIGENTE">Vigente</option>
                <option value="NO_VIGENTE">No vigente</option>
              </select>
            </label>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              Fuente: {formState.fuente}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4 flex flex-wrap gap-3 justify-between items-center">
          {selectedDocument && (
            <div className="text-sm text-slate-600">
              Documento seleccionado: <span className="font-semibold text-slate-900">{selectedDocument.nombre}</span>
            </div>
          )}
          <button type="button" onClick={onClose} className="btn btn--secondary">Cancelar</button>
          {selectedDocument && (
            <button type="button" onClick={onDelete} className="btn btn--secondary" style={{borderColor:'rgba(239,68,68,0.08)', color:'#991b1b'}}>Eliminar</button>
          )}
          <button type="button" onClick={onSave} disabled={saving} className="btn btn--primary">
            {saving ? 'Guardando...' : selectedDocument ? 'Actualizar documento' : 'Crear documento'}
          </button>
        </div>
      </div>
    </div>
  );
}
