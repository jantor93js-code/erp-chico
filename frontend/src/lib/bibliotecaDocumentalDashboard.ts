export type BibliotecaDocumentalDashboardItem = {
  estado?: string;
  estadoDocumental?: string;
  estadoDocumentalNombre?: string;
  estadoDocumentalRef?: { nombre?: string | null };
  tipo?: string;
  vigencia?: string;
  fechaRevision?: string | null;
  responsableActualizacion?: string;
  responsableRevision?: string;
  codigo?: string;
  enlace?: string;
  area?: string;
};

export type BibliotecaDocumentalDashboardSummary = {
  total: number;
  vigentes: number;
  noVigentes: number;
  vencidos: number;
  proximos: number;
  orderedEstadoData: Array<{ estado: string; count: number }>;
  tipoDistribution: Array<{ tipo: string; count: number }>;
  areaDistribution: Array<{ area: string; count: number }>;
  documentosFinalizados: number;
  enEstructuracion: number;
};

export function normalizeEstadoDocumental(value?: string | null): string {
  const normalized = (value || '').toString().trim();
  if (!normalized) return 'Sin documentar';

  const normalizedLower = normalized.toLowerCase();
  if (normalizedLower === 'sin estado' || normalizedLower === 'sin iniciar' || normalizedLower === 'vigente' || normalizedLower === 'no_vigente') {
    return 'Sin documentar';
  }

  return normalized;
}

export function normalizeVigencia(value?: string | null): 'VIGENTE' | 'NO_VIGENTE' {
  const normalized = (value || '').toString().trim().toUpperCase();
  return normalized === 'VIGENTE' ? 'VIGENTE' : 'NO_VIGENTE';
}

export function getDaysRemainingFromRevision(fechaRevision?: string | null): number | null {
  if (!fechaRevision) return null;
  const parsed = new Date(fechaRevision);
  if (Number.isNaN(parsed.getTime())) return null;
  const now = new Date();
  return Math.ceil((parsed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function buildBibliotecaDocumentalDashboard(documents: BibliotecaDocumentalDashboardItem[]): BibliotecaDocumentalDashboardSummary {
  const statusCounts = new Map<string, number>();
  const typoCounts = new Map<string, number>();
  const areaCounts = new Map<string, number>();

  let vigentes = 0;
  let noVigentes = 0;
  let vencidos = 0;
  let proximos = 0;
  let documentosFinalizados = 0;
  let enEstructuracion = 0;

  documents.forEach((document) => {
    const normalizedVigencia = normalizeVigencia(document.vigencia);
    const days = getDaysRemainingFromRevision(document.fechaRevision);

    if (normalizedVigencia === 'VIGENTE') vigentes += 1;
    if (normalizedVigencia === 'NO_VIGENTE') noVigentes += 1;

    if (normalizedVigencia === 'NO_VIGENTE' || (days !== null && days < 0)) {
      vencidos += 1;
    } else if (normalizedVigencia === 'VIGENTE' && days !== null && days <= 30) {
      proximos += 1;
    }

    const estadoLabel = normalizeEstadoDocumental(
      document.estadoDocumentalNombre ||
      document.estadoDocumentalRef?.nombre ||
      document.estadoDocumental ||
      (document as any).estado_documento ||
      document.estado ||
      'Sin estado'
    );
    statusCounts.set(estadoLabel, (statusCounts.get(estadoLabel) || 0) + 1);

    // Count by revision state for finalized and structuring
    const estadoNormalized = estadoLabel.toLowerCase();
    if (estadoNormalized === 'revisión técnica' || estadoNormalized === 'revisión directiva') {
      documentosFinalizados += 1;
    } else if (estadoNormalized === 'estructuración') {
      enEstructuracion += 1;
    }

    // Count document types
    const tipoLabel = document.tipo || 'Otros';
    typoCounts.set(tipoLabel, (typoCounts.get(tipoLabel) || 0) + 1);

    // Count by area
    const areaLabel = document.area || 'Sin área';
    areaCounts.set(areaLabel, (areaCounts.get(areaLabel) || 0) + 1);
  });

  const orderedEstadoData = Array.from(statusCounts.entries())
    .map(([estado, count]) => ({ estado, count }))
    .sort((a, b) => {
      const order = ['Sin documentar', 'Estructuración', 'Revisión técnica', 'Revisión directiva', 'Aprobado', 'Demorado'];
      const aIndex = order.indexOf(a.estado);
      const bIndex = order.indexOf(b.estado);
      if (aIndex === -1 && bIndex === -1) return a.estado.localeCompare(b.estado);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

  const tipoDistribution = Array.from(typoCounts.entries())
    .map(([tipo, count]) => ({ tipo, count }))
    .sort((a, b) => b.count - a.count);

  const areaDistribution = Array.from(areaCounts.entries())
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: documents.length,
    vigentes,
    noVigentes,
    vencidos,
    proximos,
    orderedEstadoData,
    tipoDistribution,
    areaDistribution,
    documentosFinalizados,
    enEstructuracion,
  };
}
