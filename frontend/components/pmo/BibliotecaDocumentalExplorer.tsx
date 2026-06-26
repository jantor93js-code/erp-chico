'use client';

import { useMemo, useState } from 'react';
import { createDocument, deleteDocument, updateDocument } from '@/src/services/pmo/documents';
import DocumentFormModal from '@/src/components/pmo/DocumentFormModal';

type DocumentItem = {
  id: string;
  nombre: string;
  codigo?: string;
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
  vigencia?: string;
  responsableActualizacion?: string;
  responsableRevision?: string;
  responsable?: string;
  version?: string;
  enlace?: string;
  fechaCreacion?: string;
  fechaRevision?: string;
  observaciones?: string;
  fuente?: string;
  activo?: boolean;
};

type AreaItem = { id: string; nombre?: string; codigo?: string };
type ProcessItem = { id: string; nombre?: string; codigo?: string; areaId?: string };
type DocumentTypeItem = { id: string; nombre?: string; codigo?: string };
type DocumentStatusItem = { id: string; nombre?: string; codigo?: string };
type UserItem = { id: string; nombre?: string; email?: string; role?: { nombre?: string; slug?: string } };

type FormState = {
  nombre: string;
  codigo: string;
  descripcion: string;
  tipoId: string;
  procesoId: string;
  areaId: string;
  version: string;
  responsableActualizacion: string;
  responsableRevision: string;
  estadoDocumentalState: string;
  estadoDocumentalId: string;
  estadoDocumental: 'VIGENTE' | 'NO_VIGENTE';
  fechaCreacion: string;
  fechaRevision: string;
  observaciones: string;
  enlace: string;
  fuente: string;
  activo: boolean;
};

const initialFormState: FormState = {
  nombre: '',
  codigo: '',
  descripcion: '',
  tipoId: '',
  procesoId: '',
  areaId: '',
  version: '',
  responsableActualizacion: '',
  responsableRevision: '',
  estadoDocumentalState: 'APROBADO',
  estadoDocumentalId: '',
  estadoDocumental: 'VIGENTE',
  fechaCreacion: '',
  fechaRevision: '',
  observaciones: '',
  enlace: '',
  fuente: 'MANUAL',
  activo: true,
};

type Props = {
  documents: DocumentItem[];
  areas: AreaItem[];
  processes: ProcessItem[];
  documentTypes: DocumentTypeItem[];
  documentStatuses: DocumentStatusItem[];
  onRefresh: () => Promise<void>;
  loading: boolean;
};

function formatDate(date?: string) {
  if (!date) return '-';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('es-CO');
}

function getStatusBadgeColor(estadoNombre?: string): string {
  if (!estadoNombre) return 'bg-slate-100 text-slate-700';
  
  const normalized = estadoNombre.toLowerCase();
  if (normalized.includes('aprobado')) return 'bg-green-100 text-green-700';
  if (normalized.includes('rechazado')) return 'bg-red-100 text-red-700';
  if (normalized.includes('en revisión') || normalized.includes('en_revision') || normalized.includes('en revision')) return 'bg-slate-100 text-slate-700';
  if (normalized.includes('vigente')) return 'bg-green-100 text-green-700';
  if (normalized.includes('obsoleto')) return 'bg-red-100 text-red-700';
  if (normalized.includes('archivado')) return 'bg-gray-100 text-gray-700';
  
  return 'bg-slate-100 text-slate-700';
}

function truncateText(text?: string, maxLength: number = 50): string {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getVigencyText(vigencia?: string): string {
  if (vigencia === 'NO_VIGENTE') return 'No vigente';
  if (vigencia === 'VIGENTE') return 'Vigente';
  return vigencia || 'Sin vigencia';
}

function getVigencyBadgeColor(vigencia?: string): string {
  if (vigencia === 'VIGENTE') return 'bg-green-100 text-green-700';
  if (vigencia === 'NO_VIGENTE') return 'bg-slate-100 text-slate-700';
  return 'bg-slate-100 text-slate-700';
}

export default function BibliotecaDocumentalExplorer({
  documents,
  areas,
  processes,
  documentTypes,
  documentStatuses,
  onRefresh,
  loading,
}: Props) {
  const [search, setSearch] = useState('');
  const [filterTipoId, setFilterTipoId] = useState('');
  const [filterEstadoId, setFilterEstadoId] = useState('');
  const [filterAreaId, setFilterAreaId] = useState('');
  const [filterActive, setFilterActive] = useState<'ALL' | 'ACTIVO' | 'INACTIVO'>('ALL');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formState, setFormState] = useState<FormState>({ ...initialFormState });
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<'codigo' | 'nombre' | 'tipo' | 'area' | 'proceso' | 'version' | 'descripcion' | 'enlace' | 'estadoDocumental' | 'responsable' | 'fechaCreacion' | 'fechaRevision' | 'activo'>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const normalizedDocuments = useMemo(() => {
    return documents.map((doc) => ({
      ...doc,
      tipo: doc.tipoRef?.codigo || doc.tipoRef?.nombre || doc.tipo || 'Sin tipo',
      tipoId: doc.tipoId || doc.tipoRef?.id || '',
          estadoDocumental:
        doc.estadoDocumentalRef?.codigo || doc.estadoDocumentalRef?.nombre || doc.estadoDocumental || 'Sin estado',
      estadoDocumentalId: doc.estadoDocumentalId || doc.estadoDocumentalRef?.id || '',
      vigencia: doc.vigencia || doc.estadoDocumental || 'VIGENTE',
      area: doc.area || doc.areaRef?.nombre || 'Sin área',
      areaId: doc.areaId || doc.areaRef?.id || '',
      proceso: doc.proceso || doc.processRef?.nombre || 'Sin proceso',
      procesoId: doc.procesoId || doc.processRef?.id || '',
      responsableActualizacion: doc.responsableActualizacion || '',
      responsableRevision: doc.responsableRevision || '',
      responsable: [doc.responsableActualizacion, doc.responsableRevision].filter(Boolean).join(' / '),
      activo: doc.activo ?? true,
      fuente: doc.fuente || 'MANUAL',
    } as DocumentItem));
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return normalizedDocuments
      .filter((doc) => {
        const query = `${doc.codigo || ''} ${doc.nombre} ${doc.area || ''} ${doc.proceso || ''} ${doc.tipo || ''} ${doc.estadoDocumental || ''} ${doc.responsableActualizacion || ''} ${doc.responsableRevision || ''}`.toLowerCase();
        const matchesSearch = !search || query.includes(search.toLowerCase());
        const matchesTipo = !filterTipoId || doc.tipoId === filterTipoId;
        const matchesEstado = !filterEstadoId || doc.estadoDocumentalId === filterEstadoId;
        const matchesArea = !filterAreaId || doc.areaId === filterAreaId;
        const matchesActive =
          filterActive === 'ALL' ||
          (filterActive === 'ACTIVO' && doc.activo) ||
          (filterActive === 'INACTIVO' && !doc.activo);

        return matchesSearch && matchesTipo && matchesEstado && matchesArea && matchesActive;
      })
      .sort((a, b) => {
        const aValue = ((a as any)[sortBy] ?? '').toString();
        const bValue = ((b as any)[sortBy] ?? '').toString();
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
  }, [normalizedDocuments, search, filterTipoId, filterEstadoId, filterAreaId, filterActive, sortBy, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filteredDocuments.length / rowsPerPage));
  const visibleDocuments = filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const selectedDocument = selectedDocumentId
    ? normalizedDocuments.find((doc) => doc.id === selectedDocumentId) || null
    : null;

  const handleSelectDocument = (doc: DocumentItem) => {
    const statusCode = documentStatuses.find((status) => status.id === doc.estadoDocumentalId)?.codigo;
    setSelectedDocumentId(doc.id);
    setEditingDocument(doc);
    setFormState({
      nombre: doc.nombre || '',
      codigo: doc.codigo || '',
      descripcion: doc.descripcion || '',
      tipoId: doc.tipoId || '',
      procesoId: doc.procesoId || '',
      areaId: doc.areaId || '',
      version: doc.version || '',
      responsableActualizacion: doc.responsableActualizacion || '',
      responsableRevision: doc.responsableRevision || '',
      estadoDocumentalState: statusCode || doc.estadoDocumental || '',
      estadoDocumentalId: doc.estadoDocumentalId || '',
      estadoDocumental: ['VIGENTE', 'NO_VIGENTE'].includes(doc.estadoDocumental || '')
        ? (doc.estadoDocumental as 'VIGENTE' | 'NO_VIGENTE')
        : 'VIGENTE',
      fechaCreacion: doc.fechaCreacion ? doc.fechaCreacion.split('T')[0] : '',
      fechaRevision: doc.fechaRevision ? doc.fechaRevision.split('T')[0] : '',
      observaciones: doc.observaciones || '',
      enlace: doc.enlace || '',
      fuente: doc.fuente || 'MANUAL',
      activo: doc.activo ?? true,
    });
  };

  const handleOpenEdit = () => {
    if (!selectedDocument) return;
    setFormVisible(true);
  };

  const handleNewDocument = () => {
    setSelectedDocumentId(null);
    setEditingDocument(null);
    setFormState({ ...initialFormState });
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setSelectedDocumentId(null);
    setEditingDocument(null);
    setFormState({ ...initialFormState });
  };

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formState.nombre.trim()) {
      alert('Nombre es obligatorio');
      return;
    }
    if (!formState.tipoId) {
      alert('Tipo documental es obligatorio');
      return;
    }
    if (!formState.areaId) {
      alert('Área es obligatoria');
      return;
    }
    if (!formState.procesoId) {
      alert('Proceso es obligatorio');
      return;
    }
    if (!formState.codigo.trim()) {
      alert('Código de documento es obligatorio');
      return;
    }
    const selectedStatusId =
      documentStatuses.find((status) => status.codigo === formState.estadoDocumentalState)?.id || formState.estadoDocumentalId;
    if (!selectedStatusId) {
      alert('Estado documental es obligatorio');
      return;
    }
    if (!formState.responsableActualizacion.trim()) {
      alert('Responsable de actualización es obligatorio');
      return;
    }
    if (!formState.responsableRevision.trim()) {
      alert('Responsable de revisión/aprobación es obligatorio');
      return;
    }
    const payload = {
      nombre: formState.nombre,
      codigo: formState.codigo,
      descripcion: formState.descripcion || undefined,
      tipoId: formState.tipoId,
      procesoId: formState.procesoId,
      areaId: formState.areaId,
      version: formState.version || undefined,
      responsableActualizacion: formState.responsableActualizacion,
      responsableRevision: formState.responsableRevision,
      estadoDocumentalId: selectedStatusId,
      estadoDocumental: formState.estadoDocumental,
      fechaCreacion: formState.fechaCreacion || undefined,
      fechaRevision: formState.fechaRevision || undefined,
      observaciones: formState.observaciones || undefined,
      enlace: formState.enlace || undefined,
      fuente: formState.fuente || 'MANUAL',
      activo: formState.activo,
    };

    setSaving(true);
    try {
      if (editingDocument?.id) {
        await updateDocument(editingDocument.id, payload);
      } else {
        await createDocument(payload);
      }
      handleCloseForm();
      // Refresh in background without waiting
      onRefresh().catch((error) => console.error('Error refreshing documents:', error));
    } catch (error) {
      console.error(error);
      alert('No fue posible guardar el documento.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    if (!confirm(`¿Eliminar documento "${selectedDocument.nombre}"?`)) return;
    try {
      await deleteDocument(selectedDocument.id);
      handleCloseForm();
      // Refresh in background without waiting
      onRefresh().catch((error) => console.error('Error refreshing documents:', error));
    } catch (error) {
      console.error(error);
      alert('No fue posible eliminar el documento.');
    }
  };

  const handleDeleteDocument = async (doc: DocumentItem) => {
    if (!confirm(`¿Eliminar documento "${doc.nombre}"?`)) return;
    try {
      await deleteDocument(doc.id);
      if (selectedDocumentId === doc.id) {
        handleCloseForm();
      }
      // Refresh in background without waiting
      onRefresh().catch((error) => console.error('Error refreshing documents:', error));
    } catch (error) {
      console.error(error);
      alert('No fue posible eliminar el documento.');
    }
  };

  const handleStatusChange = async (doc: DocumentItem, estadoDocumentalId: string) => {
    if (!estadoDocumentalId) {
      alert('Seleccione un estado válido');
      return;
    }
    try {
      await updateDocument(doc.id, { estadoDocumentalId });
      // Refresh in background without waiting
      onRefresh().catch((error) => console.error('Error refreshing documents:', error));
    } catch (error) {
      console.error(error);
      alert('No fue posible actualizar el estado.');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pageCount) return;
    setPage(newPage);
  };

  const rowClass = (doc: DocumentItem) =>
    selectedDocumentId === doc.id
      ? 'border border-[#C89B2A] bg-[#FEF3C7]'
      : 'border-b border-slate-200 hover:bg-slate-50';

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Filtros principales</p>
            <p className="mt-1 text-sm text-slate-500">Busca por documento, tipo, estado, área o responsable.</p>
          </div>
          <button onClick={handleNewDocument} className="rounded-2xl bg-[#C89B2A] px-4 py-2 text-sm font-semibold text-white shadow-sm">
            + Nuevo documento
          </button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-5">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Buscar</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Código, nombre, línea de negocio..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Tipo documental</span>
            <select
              value={filterTipoId}
              onChange={(e) => setFilterTipoId(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Todos</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.codigo || type.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Estado documental</span>
            <select
              value={filterEstadoId}
              onChange={(e) => setFilterEstadoId(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Todos</option>
              {documentStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.codigo || status.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            <span>Área</span>
            <select
              value={filterAreaId}
              onChange={(e) => setFilterAreaId(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <option value="">Todas</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre || area.codigo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {['ALL', 'ACTIVO', 'INACTIVO'].map((value) => (
            <button
              key={value}
              onClick={() => setFilterActive(value as 'ALL' | 'ACTIVO' | 'INACTIVO')}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filterActive === value
                  ? 'border-[#C89B2A] bg-[#FEF3C7] text-[#92400E]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {value === 'ALL' ? 'Todos' : value === 'ACTIVO' ? 'Activos' : 'Inactivos'}
            </button>
          ))}
          <button
            onClick={() => {
              setSearch('');
              setFilterTipoId('');
              setFilterEstadoId('');
              setFilterAreaId('');
              setFilterActive('ALL');
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">Tabla de documentos</p>
              <p className="mt-1 text-sm text-slate-500">{filteredDocuments.length} resultados</p>
              {selectedDocument && (
                <p className="text-sm text-slate-600">
                  Documento seleccionado: <span className="font-semibold text-slate-900">{selectedDocument.nombre}</span>
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedDocument && (
                <>
                  <button
                    onClick={handleOpenEdit}
                    className="rounded-2xl bg-[#C89B2A] px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    Editar documento
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Eliminar documento
                  </button>
                </>
              )}
              <span className="text-sm text-slate-600">Página {page} de {pageCount}</span>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >Anterior</button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pageCount}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >Siguiente</button>
            </div>
          </div>
          <div className="min-w-full overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {[
                    { label: 'Código', key: 'codigo' },
                    { label: 'Nombre', key: 'nombre' },
                    { label: 'Tipo', key: 'tipo' },
                    { label: 'Proceso', key: 'proceso' },
                    { label: 'Área', key: 'area' },
                    { label: 'Versión', key: 'version' },
                    { label: 'Descripción', key: 'descripcion' },
                    { label: 'Link', key: 'enlace' },
                    { label: 'Estado', key: 'estadoDocumental' },
                    { label: 'Responsables', key: 'responsable' },
                    { label: 'Última actualización', key: 'fechaCreacion' },
                    { label: 'Próxima revisión', key: 'fechaRevision' },
                    { label: 'Vigencia', key: 'activo' },
                  ].map((column) => (
                    <th key={column.key} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-medium text-slate-700">
                      {column.key === 'acciones' ? (
                        column.label
                      ) : (
                        <button type="button" onClick={() => setSortBy(column.key as any)} className="inline-flex items-center gap-2 hover:text-slate-900">
                          {column.label}
                          {sortBy === column.key && <span className="text-xs text-slate-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-12 text-center text-slate-600">Cargando documentos...</td>
                  </tr>
                ) : visibleDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-12 text-center text-slate-600">No se encontraron documentos.</td>
                  </tr>
                ) : (
                  visibleDocuments.map((doc) => (
                    <tr key={doc.id} className={rowClass(doc)} onClick={() => handleSelectDocument(doc)}>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs font-mono">{doc.codigo || '-'}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900 max-w-xs truncate">{doc.nombre}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                          {doc.tipo}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{doc.proceso}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{doc.area}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{doc.version || '-'}</td>
                      <td className="px-4 py-4 text-slate-700 text-xs max-w-[220px]">
                        {truncateText(doc.descripcion, 80)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs max-w-[220px]">
                        {doc.enlace ? (
                          <a href={doc.enlace} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            Ver enlace
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(doc.estadoDocumental)}`}>
                          {doc.estadoDocumental}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">
                        <div className="space-y-1">
                          <div>{doc.responsableActualizacion || '-'}</div>
                          <div className="text-[11px] text-slate-500">Actualización</div>
                          <div>{doc.responsableRevision || '-'}</div>
                          <div className="text-[11px] text-slate-500">Revisión / Aprobación</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{formatDate(doc.fechaCreacion)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{formatDate(doc.fechaRevision)}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getVigencyBadgeColor(doc.vigencia)}`}>
                          {getVigencyText(doc.vigencia)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <DocumentFormModal
        isOpen={formVisible}
        selectedDocument={selectedDocument}
        formState={formState}
        onFormChange={handleChange}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={handleCloseForm}
        areas={areas}
        processes={processes}
        documentTypes={documentTypes}
        documentStatuses={documentStatuses}
        saving={saving}
      />
    </div>
  );
}
