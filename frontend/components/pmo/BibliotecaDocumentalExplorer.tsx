'use client';

import { useMemo, useState, useEffect } from 'react';
import { createDocument, deleteDocument, updateDocument } from '@/src/services/pmo/documents';
import DocumentFormModal from '@/src/components/pmo/DocumentFormModal';
import ExecutiveMetrics from '@/components/pmo/dashboard/ExecutiveMetrics';
import ExecutiveAlerts from '@/components/pmo/dashboard/ExecutiveAlerts';
import ExpandToggle from '@/components/pmo/dashboard/ExpandToggle';

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
  codigoDependencia: '',
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
  showVisualAnalysis?: boolean;
};

function formatDate(date?: string) {
  if (!date) return '-';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('es-CO');
}

function getStatusBadgeColor(estadoNombre?: string): string {
  if (!estadoNombre) return 'badge badge--gray';

  const normalized = estadoNombre.toLowerCase();
  if (normalized.includes('publicado') || normalized.includes('aprobado') || normalized.includes('vigente')) return 'badge badge--green';
  if (normalized.includes('vencido') || normalized.includes('obsoleto') || normalized.includes('rechazado')) return 'badge badge--red';
  if (normalized.includes('revisión técnica') || normalized.includes('revision tecnica') || normalized.includes('técnica') || normalized.includes('tecnica')) return 'badge badge--yellow';
  if (normalized.includes('revisión directiva') || normalized.includes('revision directiva') || normalized.includes('directiva')) return 'badge badge--orange';
  if (normalized.includes('estructur') || normalized.includes('estructura')) return 'badge badge--orange';
  if (normalized.includes('borrador')) return 'badge badge--gray';
  if (normalized.includes('sin iniciar') || normalized.includes('sin') && normalized.includes('iniciar')) return 'badge badge--gray';

  return 'badge badge--gray';
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

function getVigencyText(vigencia?: string): string {
  if (vigencia === 'VENCIDO') return 'Vencido';
  if (vigencia === 'PROXIMO_VENCER') return 'Próximo a vencer';
  if (vigencia === 'VIGENTE') return 'Vigente';
  return vigencia || 'Sin vigencia';
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

      return ({
        ...doc,
        nombre: finalNombre || 'por asignar',
        codigo: finalCodigo,
        codigoDependencia: rawCodigoDependencia || '',
        tipo: doc.tipoRef?.codigo || doc.tipoRef?.nombre || doc.tipo || (doc as any).tipo_documento || (doc as any).tipoDocumento || 'Sin tipo',
        tipoId: doc.tipoId || doc.tipoRef?.id || (doc as any).tipo_id || '',
        estadoDocumental:
          doc.estadoDocumentalRef?.nombre || doc.estadoDocumentalRef?.codigo || doc.estadoDocumental || (doc as any).estado_documento || 'Sin estado',
        estadoDocumentalId: doc.estadoDocumentalId || doc.estadoDocumentalRef?.id || '',
        vigencia: doc.estadoVigencia || doc.vigencia || undefined,
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
        const query = `${doc.codigo || ''} ${doc.codigoDependencia || ''} ${doc.nombre} ${doc.area || ''} ${doc.proceso || ''} ${doc.tipo || ''} ${doc.estadoDocumental || ''} ${doc.responsable || ''}`.toLowerCase();
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

  const alerts = useMemo(() => {
    let vencidos = 0;
    let proximos = 0;
    let sinResponsable = 0;
    let sinCodigo = 0;
    let sinEnlace = 0;

    dashboardDocuments.forEach((d) => {
      const days = typeof d.daysRemaining === 'number' ? d.daysRemaining : undefined;
      if (days !== undefined) {
        if (days < 0) vencidos += 1;
        else if (days <= 30) proximos += 1;
      }
      if (!d.responsableActualizacion && !d.responsableRevision) sinResponsable += 1;
      if (!d.codigo) sinCodigo += 1;
      if (!d.enlace) sinEnlace += 1;
    });

    return { vencidos, proximos, sinResponsable, sinCodigo, sinEnlace };
  }, [dashboardDocuments]);

  const pageCount = Math.max(1, Math.ceil(filteredDocuments.length / rowsPerPage));
  const visibleDocuments = filteredDocuments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Debounce the visible search input to avoid excessive filtering on rapid typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchQuery.trim()), 280);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const vigencyCounts = useMemo(() => {
    let vigente = 0;
    let proximo = 0;
    let vencido = 0;
    dashboardDocuments.forEach((d) => {
      if (d.vigencia === 'VENCIDO') vencido += 1;
      else if (d.vigencia === 'PROXIMO_VENCER') proximo += 1;
      else vigente += 1;
    });
    return { vigente, proximo, vencido };
  }, [dashboardDocuments]);

  const executiveHeaderSubtitle = `Filtrados: ${filteredDocuments.length} · Área: ${selectedAreaName} · Vigentes: ${vigencyCounts.vigente}`;

  // Recommendations removed per UX request (UI-only change)

  const reviewCounts = useMemo(() => {
    let notStarted = 0;
    let structuring = 0;
    let revision = 0;
    dashboardDocuments.forEach((d) => {
      const s = (d.estadoDocumental || '').toLowerCase();
      if (s.includes('sin iniciar') || s.includes('sin') && s.includes('iniciar') || s.includes('no iniciado')) notStarted += 1;
      else if (s.includes('estructur') || s.includes('estructura')) structuring += 1;
      else if (s.includes('revisión') || s.includes('revision') || s.includes('técnica') || s.includes('tecnica') || s.includes('directiva')) revision += 1;
      else {
        // fallback: if estado mentions 'revis' treat as revision
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
      estadoDocumentalState: statusCode || doc.estadoDocumental || '',
      estadoDocumentalId: doc.estadoDocumentalId || '',
      estadoDocumental: ['VIGENTE', 'NO_VIGENTE'].includes(doc.estadoDocumental || '')
        ? (doc.estadoDocumental as 'VIGENTE' | 'NO_VIGENTE')
        : 'VIGENTE',
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
      codigoDependencia: formState.codigoDependencia || undefined,
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
            { label: 'Documentos', value: filteredDocuments.length, badgeLabel: 'Total', badgeClassName: 'badge badge--gray' },
            { label: 'Vigentes', value: vigencyCounts.vigente, badgeLabel: 'Vigente', badgeClassName: 'badge badge--green' },
            { label: 'Próximo a vencer', value: vigencyCounts.proximo, badgeLabel: 'Próximo', badgeClassName: 'badge badge--yellow', reduced: vigencyCounts.proximo === 0 },
            { label: 'Vencidos', value: alerts.vencidos, badgeLabel: 'Vencidos', badgeClassName: 'badge badge--red' },
          ]}
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[1fr]">
        <ExecutiveAlerts alerts={alerts} onFilter={handleRiskFilter} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Estado de revisión</p>
            <p className="text-sm text-slate-500">Resumen por fase y proceso.</p>
          </div>
          <ExpandToggle
            expanded={showProcessBreakdown}
            onClick={() => setShowProcessBreakdown((v) => !v)}
            label={showProcessBreakdown ? 'Ver menos desglose' : 'Ver desglose completo'}
            ariaLabel="Alternar vista de desglose"
          />
        </div>

        {!showProcessBreakdown ? (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {`${reviewCounts.notStarted} sin documentar · ${reviewCounts.revision} en revisión · ${reviewCounts.structuring} en estructuración`}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#6B7280' }} /> Sin documentar</div>
              <div className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#15803D' }} /> Revisión</div>
              <div className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#FB923C' }} /> Estructuración</div>
            </div>

            <div className="flex items-end gap-4 h-28 mt-1 justify-between px-2">
              {(() => {
                const max = Math.max(reviewCounts.notStarted, reviewCounts.structuring, reviewCounts.revision, 1);
                const items = [
                  { label: 'Sin documentar', value: reviewCounts.notStarted, color: '#6B7280' },
                  { label: 'Revisión', value: reviewCounts.revision, color: '#15803D' },
                  { label: 'Estructuración', value: reviewCounts.structuring, color: '#FB923C' },
                ];
                return items.map((it) => {
                  const pct = it.value > 0 ? (it.value / max) * 100 : 6;
                  const height = `${Math.max(pct, 8)}%`;
                  const opacity = it.value > 0 ? 1 : 0.35;
                  return (
                    <div key={it.label} className="flex-1 flex flex-col items-center px-2">
                      <div className="text-sm font-semibold mb-1 text-slate-800">{it.value}</div>
                      <div className="w-full h-20 flex items-end justify-center">
                        <div
                          role="img"
                          aria-label={`${it.label}: ${it.value}`}
                          style={{ height, background: `linear-gradient(180deg, ${it.color}, ${shadeColor(it.color, -12)})`, opacity }}
                          className="w-12 rounded-lg border border-slate-200 shadow-sm transform transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-slate-600 text-center">{it.label}</div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="mt-5 space-y-3">
              {(() => {
                const top = processCounts.slice(0, 6);
                const max = top.length ? Math.max(...top.map((t) => t.count)) : 1;
                return top.map((p) => (
                  <div key={p.label} className="flex items-center gap-3">
                    <div className="text-sm text-slate-700 w-40 truncate">{p.label}</div>
                    <div className="flex-1 bg-slate-100 h-3 rounded overflow-hidden">
                      <div style={{ width: `${(p.count / max) * 100}%`, background: '#C89B2A' }} className="h-3 rounded" />
                    </div>
                    <div className="text-sm w-10 text-right font-semibold">{p.count}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </section>

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
                className={`rounded-2xl border px-3 py-2 text-sm ${showVisualAnalysis ? 'border-black bg-black text-white' : 'border-black bg-white hover:bg-slate-50 text-slate-900'}`}
                aria-label="Alternar análisis visual"
              >
                {showVisualAnalysis ? 'Ocultar análisis' : 'Mostrar análisis (3)'}
              </button>
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
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(doc.estadoDocumental)}`}>
                        {doc.estadoDocumental}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 text-xs">{highlightText(doc.responsable, search)}</td>
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
