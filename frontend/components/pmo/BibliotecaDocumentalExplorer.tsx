'use client';

import { useMemo, useState, useEffect } from 'react';
import { createDocument, deleteDocument, updateDocument } from '@/src/services/pmo/documents';
import DocumentFormModal from '@/src/components/pmo/DocumentFormModal';
import ExecutiveMetrics from '@/components/pmo/dashboard/ExecutiveMetrics';
import ExecutiveAlerts from '@/components/pmo/dashboard/ExecutiveAlerts';
import ExpandToggle from '@/components/pmo/dashboard/ExpandToggle';
import { buildBibliotecaDocumentalDashboard, normalizeEstadoDocumental, normalizeVigencia } from '@/src/lib/bibliotecaDocumentalDashboard';
import { DOCUMENT_TYPE_CATALOG } from '@/src/lib/documentTypeCatalog';

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
  codigoDependencia?: string;
  estado?: string;
  estadoDocumental?: string;
  estadoDocumentalNombre?: string;
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
  // calculated fields from backend
  nextReview?: string | Date | null;
  daysRemaining?: number | null;
  estadoVigencia?: string | null;
};

type AreaItem = { id: string; nombre?: string; codigo?: string };
type ProcessItem = { id: string; nombre?: string; codigo?: string; areaId?: string };
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
  estadoDocumentalId: string;
  estado: string;
  vigencia: 'VIGENTE' | 'NO_VIGENTE';
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
  codigoDependencia: '',
  descripcion: '',
  tipoId: '',
  procesoId: '',
  areaId: '',
  version: '',
  responsableActualizacion: '',
  responsableRevision: '',
  estadoDocumentalId: '',
  estado: '',
  vigencia: 'NO_VIGENTE',
  fechaCreacion: '',
  fechaRevision: '',
  observaciones: '',
  enlace: '',
  fuente: 'MANUAL',
  activo: true,
};

type DashboardMetricsSummary = {
  byEstado?: Array<{ estado?: string; count: number }>;
  manuals?: number;
  policies?: number;
} | null;

type Props = {
  documents: DocumentItem[];
  areas: AreaItem[];
  processes: ProcessItem[];
  documentTypes: DocumentTypeItem[];
  documentStatuses: DocumentStatusItem[];
  onRefresh: () => Promise<void>;
  loading: boolean;
  showVisualAnalysis?: boolean;
  dashboardMetrics?: DashboardMetricsSummary;
};

function formatDate(date?: string) {
  if (!date) return '-';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('es-CO');
}

function truncateText(text?: string, maxLength: number = 50): string {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function highlightText(text?: string, q?: string): any {
  if (!text) return '-';
  if (!q) return text;
  try {
    const escaped = q.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'ig'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  } catch (e) {
    return text;
  }
}

function getCodeDisplayValue(value?: string | null): string {
  if (value === null || value === undefined) return 'por asignar';
  const normalized = String(value).trim();
  if (!normalized || normalized.toLowerCase() === 'null' || normalized.toLowerCase() === 'undefined') return 'por asignar';
  return normalized;
}

function getDisplayEstadoDocumental(doc: DocumentItem): string {
  const raw = (doc.estadoDocumentalNombre || '').trim();
  if (!raw) return 'Sin documentar';

  const normalized = raw.toLowerCase();
  if (normalized === 'sin estado' || normalized === 'sin iniciar' || normalized === 'vigente' || normalized === 'no_vigente') {
    return 'Sin documentar';
  }

  return raw;
}

function getVigencyText(vigencia?: string): string {
  if (vigencia === 'VIGENTE') return 'Vigente';
  if (vigencia === 'NO_VIGENTE') return 'No vigente';
  return 'No vigente';
}

const RESPONSABLES = [
  'Maria Natalia Villanueva',
  'Jorge Mercado',
  'Oscar Alexander López',
  'Katherine Forero Basa',
  'Ivone Londoño',
];

function getAssignedResponsable(doc: DocumentItem): string {
  const key = doc.id || doc.nombre || '';
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return RESPONSABLES[hash % RESPONSABLES.length];
}

function getVigencyBadgeColor(vigencia?: string): string {
  if (vigencia === 'VENCIDO') return 'badge badge--red';
  if (vigencia === 'PROXIMO_VENCER') return 'badge badge--yellow';
  if (vigencia === 'VIGENTE') return 'badge badge--green';
  return 'badge badge--gray';
}

// Shade a hex color by percent (-100..100). Negative = darker, Positive = lighter.
function shadeColor(hex: string, percent: number): string {
  try {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const num = parseInt(c, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    const factor = (100 + percent) / 100;
    r = Math.min(255, Math.max(0, Math.round(r * factor)));
    g = Math.min(255, Math.max(0, Math.round(g * factor)));
    b = Math.min(255, Math.max(0, Math.round(b * factor)));
    const newHex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return `#${newHex}`;
  } catch (e) {
    return hex;
  }
}

export default function BibliotecaDocumentalExplorer({
  documents,
  areas,
  processes,
  documentTypes,
  documentStatuses,
  onRefresh,
  loading,
  showVisualAnalysis,
  dashboardMetrics,
}: Props) {
  const [showProcessBreakdown, setShowProcessBreakdown] = useState(false);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [rowsPerPage, setRowsPerPage] = useState(25);
  type SortKey = 'codigo' | 'codigoDependencia' | 'nombre' | 'tipo' | 'area' | 'proceso' | 'version' | 'descripcion' | 'enlace' | 'estadoDocumental' | 'responsable' | 'fechaCreacion' | 'fechaRevision' | 'vigencia' | 'activo';
  const [sortBy, setSortBy] = useState<SortKey>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const selectedAreaName = filterAreaId
    ? areas.find((a) => a.id === filterAreaId)?.nombre || 'Área seleccionada'
    : 'Todas las áreas';

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSearchQuery('');
    setFilterTipoId('');
    setFilterEstadoId('');
    setFilterAreaId('');
    setFilterActive('ALL');
    setPage(1);
  };

  const normalizedDocuments = useMemo(() => {
    return documents.map((doc) => {
      // support different field names from imports
      const rawNombre = (doc.nombre || (doc as any).nombre_documento || (doc as any).nombreDocumento || '').toString().trim();
      const rawArea = (doc.area || doc.areaRef?.nombre || (doc as any).area_dependencia || (doc as any).areaDependencia || '').toString().trim();
      const rawProceso = (doc.proceso || doc.processRef?.nombre || (doc as any).proceso_asociado || '').toString().trim();
      const rawTipo = (doc.tipoRef?.nombre || doc.tipo || (doc as any).tipo_documento || (doc as any).tipoDocumento || '').toString().trim();

      // If the name equals area/proceso/tipo (likely mis-mapped), treat as missing
      let finalNombre: string | undefined = rawNombre || undefined;
      if (finalNombre) {
        const n = finalNombre.toLowerCase();
        if ((rawArea && n === rawArea.toLowerCase()) || (rawProceso && n === rawProceso.toLowerCase()) || (rawTipo && n === rawTipo.toLowerCase())) {
          finalNombre = undefined;
        }
      }

      // Preserve manual code separately from dependency code for table columns.
      const rawCodigo = (doc.codigo || (doc as any).codigo_manual || (doc as any).codigoManual || '').toString().trim();
      const rawCodigoDependencia = (doc.codigoDependencia || (doc as any).codigo_dependencia || '').toString().trim();
      const finalCodigo = rawCodigo && rawCodigo !== rawCodigoDependencia ? rawCodigo : '';

      const rawEstado = (doc.estado || (doc as any).estado_documento || (doc as any).estadoDocumental || '').toString().trim();
      const fechaRevisionValue = (doc.fechaRevision || (doc as any).fecha_revision || (doc as any).ultimaRevision || '').toString().trim();
      const rawVigencia = (doc.vigencia || (doc as any).vigencia || (doc as any).estadoVigencia || '').toString().trim();
      const computedVigencia = normalizeVigencia(rawVigencia);

      return ({
        ...doc,
        nombre: finalNombre || 'por asignar',
        codigo: finalCodigo,
        codigoDependencia: rawCodigoDependencia || '',
        tipo: doc.tipoRef?.codigo || doc.tipoRef?.nombre || doc.tipo || (doc as any).tipo_documento || (doc as any).tipoDocumento || 'Sin tipo',
        tipoId: doc.tipoId || doc.tipoRef?.id || (doc as any).tipo_id || '',
        estado: rawEstado || 'Sin estado',
        estadoDocumental: normalizeEstadoDocumental(rawEstado || (doc as any).estado_documento || doc.estadoDocumental || 'Sin estado'),
        estadoDocumentalNombre: doc.estadoDocumentalRef?.nombre || '',
        estadoDocumentalId: doc.estadoDocumentalId || doc.estadoDocumentalRef?.id || '',
        vigencia: computedVigencia,
        area: rawArea || 'Sin área',
        areaId: doc.areaId || doc.areaRef?.id || '',
        proceso: rawProceso || 'Sin proceso',
        procesoId: doc.procesoId || doc.processRef?.id || '',
        responsableActualizacion: doc.responsableActualizacion || (doc as any).responsable || '',
        responsableRevision: doc.responsableRevision || '',
        responsable: doc.responsable || (doc as any).responsable || [doc.responsableActualizacion, doc.responsableRevision].filter(Boolean).join(' / ') || 'Sin asignar',
        activo: doc.activo ?? true,
        fuente: doc.fuente || 'MANUAL',
      } as DocumentItem);
    });
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return normalizedDocuments
      .filter((doc) => {
        const query = `${doc.codigo || ''} ${doc.codigoDependencia || ''} ${doc.nombre} ${doc.area || ''} ${doc.proceso || ''} ${doc.tipo || ''} ${doc.estado || ''} ${doc.estadoDocumental || ''} ${doc.responsable || ''}`.toLowerCase();
        const matchesSearch = !search || query.includes(search.toLowerCase());
        const selectedTipoName = documentTypes.find((t) => t.id === filterTipoId)?.nombre;
        const matchesTipo =
          !filterTipoId ||
          doc.tipoId === filterTipoId ||
          (selectedTipoName && String(doc.tipo).toLowerCase() === String(selectedTipoName).toLowerCase());
        const matchesEstado = !filterEstadoId || doc.estadoDocumentalId === filterEstadoId;
        const matchesArea = !filterAreaId || doc.areaId === filterAreaId;
        const matchesActive =
          filterActive === 'ALL' ||
          (filterActive === 'ACTIVO' && doc.activo) ||
          (filterActive === 'INACTIVO' && !doc.activo);

        return matchesSearch && matchesTipo && matchesEstado && matchesArea && matchesActive;
      })
      .sort((a, b) => {
        const aValue = String((a as Record<string, unknown>)[sortBy] ?? '');
        const bValue = String((b as Record<string, unknown>)[sortBy] ?? '');
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
  }, [normalizedDocuments, search, filterTipoId, filterEstadoId, filterAreaId, filterActive, sortBy, sortDirection]);

  const dashboardDocuments = filteredDocuments;

  const dashboardSummary = useMemo(() => {
    const summary = buildBibliotecaDocumentalDashboard(dashboardDocuments);

    const alerts = {
      vencidos: summary.vencidos,
      proximos: summary.proximos,
      sinResponsable: 0,
      sinCodigo: 0,
      sinEnlace: 0,
    };

    dashboardDocuments.forEach((d) => {
      if (!d.responsableActualizacion && !d.responsableRevision) alerts.sinResponsable += 1;
      if (!d.codigo) alerts.sinCodigo += 1;
      if (!d.enlace) alerts.sinEnlace += 1;
    });

    return {
      ...summary,
      alerts,
    };
  }, [dashboardDocuments]);

  const { alerts, orderedEstadoData } = dashboardSummary;

  const pageCount = Math.max(1, Math.ceil(filteredDocuments.length / rowsPerPage));
  const visibleDocuments = filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Debounce the visible search input to avoid excessive filtering on rapid typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchQuery.trim()), 280);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const executiveHeaderSubtitle = `Filtrados: ${filteredDocuments.length} · Área: ${selectedAreaName} · Vigentes: ${dashboardSummary.vigentes}`;

  // Recommendations removed per UX request (UI-only change)

  const reviewCounts = useMemo(() => {
    let notStarted = 0;
    let structuring = 0;
    let revision = 0;
    dashboardDocuments.forEach((d) => {
      const s = (d.estado || d.estadoDocumental || '').toLowerCase();
      if (s.includes('sin iniciar') || (s.includes('sin') && s.includes('iniciar')) || s.includes('no iniciado') || s.includes('sin documentar')) notStarted += 1;
      else if (s.includes('estructur') || s.includes('estructura')) structuring += 1;
      else if (s.includes('revisión') || s.includes('revision') || s.includes('técnica') || s.includes('tecnica') || s.includes('directiva')) revision += 1;
      else {
        if (s.includes('revis')) revision += 1;
      }
    });
    return { notStarted, structuring, revision };
  }, [dashboardDocuments]);

  const processCounts = useMemo(() => {
    const map = new Map<string, number>();
    dashboardDocuments.forEach((d) => {
      const key = d.proceso || 'Sin proceso';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  }, [dashboardDocuments]);

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
      estadoDocumentalId: doc.estadoDocumentalId || '',
      estado: doc.estado || '',
      vigencia: normalizeVigencia(doc.vigencia),
      fechaCreacion: doc.fechaCreacion ? doc.fechaCreacion.split('T')[0] : '',
      fechaRevision: doc.fechaRevision ? doc.fechaRevision.split('T')[0] : '',
      codigoDependencia: doc.codigoDependencia || '',
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
    setFormState((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
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
    const selectedStatusId = formState.estadoDocumentalId;
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
    const vigencia = formState.vigencia;
    const payload = {
      nombre: formState.nombre,
      codigo: formState.codigo,
      codigoDependencia: formState.codigoDependencia || undefined,
      descripcion: formState.descripcion || undefined,
      tipoId: formState.tipoId,
      procesoId: formState.procesoId,
      areaId: formState.areaId,
      version: formState.version || undefined,
      responsableActualizacion: formState.responsableActualizacion,
      responsableRevision: formState.responsableRevision,
      estado: formState.estado || undefined,
      estadoDocumentalId: selectedStatusId,
      vigencia,
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

  const handleRiskFilter = (filterKey: 'sinResponsable' | 'sinCodigo' | 'sinEnlace' | 'proximos' | 'vencidos') => {
    const terms: Record<string, string> = {
      sinResponsable: 'Sin asignar',
      sinCodigo: 'Sin código',
      sinEnlace: 'Sin enlace',
      proximos: 'Próximo',
      vencidos: 'Vencido',
    };
    setSearchQuery(terms[filterKey]);
    setPage(1);
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
    (selectedDocumentId === doc.id
      ? 'border border-[#C89B2A] bg-[#FEF3C7]'
      : 'border-b border-slate-200 hover:bg-slate-50') +
    (typeof doc.daysRemaining === 'number' && doc.daysRemaining < 0
      ? ' bg-rose-50'
      : typeof doc.daysRemaining === 'number' && doc.daysRemaining <= 30
      ? ' bg-amber-50'
      : (!doc.responsableActualizacion && !doc.responsableRevision)
      ? ' bg-slate-100'
      : '');

  const toggleVisualAnalysis = () => {
    try {
      // Parent page listens for this event to toggle the top 3 charts
      window.dispatchEvent(new CustomEvent('toggleVisualAnalysis'));
    } catch (e) {
      // noop
    }
  };

  return (
    <div className="space-y-6">

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <ExecutiveMetrics
          metrics={[
            { label: 'Documentos', value: dashboardSummary.total, badgeLabel: 'Total', badgeClassName: 'badge badge--gray' },
            { label: 'Vigentes', value: dashboardSummary.vigentes, badgeLabel: 'Vigente', badgeClassName: 'badge badge--green' },
            { label: 'Documentos finalizados', value: dashboardSummary.documentosFinalizados, badgeLabel: 'Finalizados', badgeClassName: 'badge badge--green' },
            { label: 'En estructuración', value: dashboardSummary.enEstructuracion, badgeLabel: 'Estructurando', badgeClassName: 'badge badge--yellow' },
          ]}
        />
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">Documentos</p>
            <p className="text-sm text-slate-500">{filteredDocuments.length} resultados</p>
            {selectedDocument && (
              <p className="text-sm text-slate-600">
                Documento seleccionado: <span className="font-semibold text-slate-900">{selectedDocument.nombre}</span>
              </p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1.5fr_1fr] sm:items-center sm:justify-between w-full">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 relative min-w-[260px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <input aria-label="Buscar documentos" placeholder="Buscar documentos" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="bg-transparent outline-none flex-1" />
              {searchQuery && (
                <button aria-label="Limpiar búsqueda" onClick={() => { setSearchQuery(''); setSearch(''); }} className="ml-2 text-slate-400 hover:text-slate-600">✕</button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <button
                type="button"
                onClick={toggleVisualAnalysis}
                className={`rounded-2xl border px-3 py-2 text-sm transition-colors ${showVisualAnalysis ? 'border-slate-300 bg-slate-100 text-slate-900' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                aria-label="Alternar análisis visual"
              >
                {showVisualAnalysis ? 'Ocultar análisis' : 'Mostrar análisis (3)'}
              </button>
              {selectedDocument && (
                <button onClick={handleOpenEdit} className="btn btn--secondary">
                  ✏️ Editar documento
                </button>
              )}
              <button onClick={handleNewDocument} className="btn btn--primary">+ Nuevo documento</button>
              <select value={filterTipoId} onChange={(e)=>setFilterTipoId(e.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 bg-white">
                <option value="">Tipo</option>
                {documentTypes.map(t=> <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <select value={filterEstadoId} onChange={(e)=>setFilterEstadoId(e.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 bg-white">
                <option value="">Estado</option>
                {documentStatuses.map(s=> <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
              <select value={filterAreaId} onChange={(e)=>setFilterAreaId(e.target.value)} className="rounded-2xl border border-slate-200 px-3 py-2 bg-white">
                <option value="">Área</option>
                {areas.map(a=> <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
              <button className="btn btn--secondary" onClick={clearFilters}>Limpiar</button>
            </div>
          </div>
        </div>

        {(search || filterTipoId || filterEstadoId || filterAreaId) && (
          <div className="flex flex-wrap items-center gap-2 px-6 py-3 text-sm text-slate-600">
            <span className="font-semibold">Filtros activos:</span>
            {search && <span className="badge badge--gray">Buscar: {search}</span>}
            {filterTipoId && <span className="badge badge--blue">Tipo: {documentTypes.find((t) => t.id === filterTipoId)?.nombre || filterTipoId}</span>}
            {filterEstadoId && <span className="badge badge--blue">Estado: {documentStatuses.find((s) => s.id === filterEstadoId)?.nombre || filterEstadoId}</span>}
            {filterAreaId && <span className="badge badge--blue">Área: {areas.find((a) => a.id === filterAreaId)?.nombre || filterAreaId}</span>}
          </div>
        )}

        <div className="min-w-full overflow-x-auto px-6 pb-6">
          <table className="pmo-table min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {[
                  { label: 'Código de Área', key: 'codigo' },
                  { label: 'Código de Doc.', key: 'codigoDependencia' },
                  { label: 'Nombre', key: 'nombre' },
                  { label: 'Tipo', key: 'tipo' },
                  { label: 'Proceso', key: 'proceso' },
                  { label: 'Área', key: 'area' },
                  { label: 'Estado documental', key: 'estadoDocumental' },
                  { label: 'Responsable', key: 'responsable' },
                  { label: 'Creación', key: 'fechaCreacion' },
                  { label: 'Última revisión', key: 'fechaRevision' },
                  { label: 'Vigencia', key: 'vigencia' },
                  { label: 'Drive', key: 'enlace' },
                ].map((column) => (
                  <th key={column.key} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-medium text-slate-700">
                    <button type="button" onClick={() => handleSort(column.key as SortKey)} className="inline-flex items-center gap-2 hover:text-slate-900">
                      {column.label}
                      {sortBy === column.key && <span className="text-xs text-slate-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-slate-600">Cargando documentos...</td>
                </tr>
              ) : visibleDocuments.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-slate-600">No se encontraron documentos.</td>
                </tr>
              ) : (
                visibleDocuments.map((doc) => (
                  <tr key={doc.id} className={rowClass(doc)} onClick={() => handleSelectDocument(doc)}>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs font-mono">{highlightText(getCodeDisplayValue(doc.codigoDependencia), search)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs font-mono">{highlightText(getCodeDisplayValue(doc.codigo), search)}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900 max-w-xs truncate">
                      {doc.nombre === 'por asignar' ? (
                        <div className="flex items-center gap-2">
                          <em className="text-slate-500 italic">por asignar</em>
                          {doc.codigoDependencia && (
                            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 rounded">{doc.codigoDependencia}</span>
                          )}
                        </div>
                      ) : (
                        highlightText(doc.nombre, search)
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                        {highlightText(doc.tipo, search)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{highlightText(doc.proceso, search)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{highlightText(doc.area, search)}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium badge badge--blue">
                        {highlightText(getDisplayEstadoDocumental(doc), search)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{highlightText(getAssignedResponsable(doc), search)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{formatDate(doc.fechaCreacion)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{formatDate(doc.fechaRevision)}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getVigencyBadgeColor(doc.vigencia)}`}>
                        {getVigencyText(doc.vigencia)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">
                      {doc.enlace ? (
                        <a href={doc.enlace} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                          Abrir
                        </a>
                      ) : (
                        <span className="text-slate-500">Sin enlace</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span>Mostrando</span>
            <span className="font-semibold">{visibleDocuments.length}</span>
            <span>de</span>
            <span className="font-semibold">{filteredDocuments.length}</span>
            <span>documentos</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-slate-600">Filas:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {[12, 20, 30, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <button className="btn btn--secondary" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              Anterior
            </button>
            <span className="font-semibold">
              {page} / {pageCount}
            </span>
            <button className="btn btn--secondary" onClick={() => handlePageChange(page + 1)} disabled={page >= pageCount}>
              Siguiente
            </button>
          </div>
        </div>
      </section>

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
