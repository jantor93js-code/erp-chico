"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { useEffect, useState, type ChangeEvent } from "react";
import PmoShell from "@/src/components/layout/PmoShell";
import PageHeader from "@/src/components/pmo/PageHeader";
import BibliotecaDocumentalExplorer from "@/components/pmo/BibliotecaDocumentalExplorer";
import { getDocuments, getDocumentsDashboard, importDocuments } from "@/src/services/pmo/documents";
import { areasService } from "@/services/areasService";
import { processesService } from "@/services/processesService";
import { documentTypesService } from "@/services/documentTypesService";
import { documentStatusesService } from "@/services/documentStatusesService";

type DocumentItem = {
  id: string;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  tipo?: string;
  tipoId?: string;
  proceso?: string;
  procesoId?: string;
  area?: string;
  areaId?: string;
  codigoDependencia?: string;
  estadoDocumental?: string;
  estadoDocumentalId?: string;
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

type CatalogItem = {
  id: string;
  nombre?: string;
  codigo?: string;
};

type DashboardMetrics = {
  byEstado?: Array<{ estado?: string; count: number }>;
  manuals?: number;
  policies?: number;
} | null;

export default function BibliotecaDocumentalPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [areas, setAreas] = useState<CatalogItem[]>([]);
  const [processes, setProcesses] = useState<CatalogItem[]>([]);
  const [documentTypes, setDocumentTypes] = useState<CatalogItem[]>([]);
  const [documentStatuses, setDocumentStatuses] = useState<CatalogItem[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>(null);
  const [loading, setLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Fetch documents first (critical). Fetch catalogs in parallel but tolerate failures
      const documentsData = await getDocuments({ activo: 'all' });
      setDocuments(documentsData || []);

      const results = await Promise.allSettled([
        areasService.getAll(),
        processesService.getAll(),
        documentTypesService.getAllActive(),
        documentStatusesService.getAllActive(),
        getDocumentsDashboard(),
      ]);

      const [areasResult, processesResult, typesResult, statusesResult, dashboardResult] = results;

      if (areasResult.status === 'fulfilled') {
        const areasData = areasResult.value;
        setAreas('data' in areasData ? (areasData.data as CatalogItem[]) : (areasData as CatalogItem[]));
      } else {
        console.warn('Failed to load areas:', areasResult.reason);
        setAreas([]);
      }

      if (processesResult.status === 'fulfilled') {
        const processesData = processesResult.value;
        setProcesses('data' in processesData ? (processesData.data as CatalogItem[]) : (processesData as CatalogItem[]));
      } else {
        console.warn('Failed to load processes:', processesResult.reason);
        setProcesses([]);
      }

      if (typesResult.status === 'fulfilled') {
        setDocumentTypes(typesResult.value);
      } else {
        console.warn('Failed to load document types:', typesResult.reason);
        setDocumentTypes([]);
      }

      if (statusesResult.status === 'fulfilled') {
        setDocumentStatuses(statusesResult.value);
      } else {
        console.warn('Failed to load document statuses:', statusesResult.reason);
        setDocumentStatuses([]);
      }

      if (dashboardResult.status === 'fulfilled') {
        setDashboardMetrics(dashboardResult.value);
      } else {
        console.warn('Failed to load dashboard metrics:', dashboardResult.reason);
        setDashboardMetrics(null);
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const resetImportState = () => {
    setImportError(null);
    setImportResult(false);
  };

  const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImportFile(file);
    resetImportState();
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportError('Selecciona un archivo JSON o Excel para importar');
      return;
    }

    const lowerName = importFile.name.toLowerCase();
    if (!lowerName.endsWith('.json') && !lowerName.endsWith('.xlsx') && !lowerName.endsWith('.xls')) {
      setImportError('Solo se permite importar archivos JSON o Excel (.xls/.xlsx)');
      return;
    }

    setImportLoading(true);
    setImportError(null);
    setImportResult(false);

    try {
      await importDocuments(importFile);
      setImportResult(true);
      setImportDialogOpen(false);
      setImportFile(null);
      await loadData();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Error al importar el archivo';
      setImportError(message);
    } finally {
      setImportLoading(false);
    }
  };

  const closeImportDialog = () => {
    setImportDialogOpen(false);
    setImportFile(null);
    resetImportState();
  };

  return (
    <PmoShell>
      <PageHeader
        section="PMO · Biblioteca Documental"
        title="Biblioteca Documental"
        description="Explora documentos PMO con una navegación jerárquica y filtros inteligentes."
        actions={
          <button
            type="button"
            onClick={() => {
              resetImportState();
              setImportDialogOpen(true);
            }}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Importar JSON / Excel
          </button>
        }
      />

      {dashboardMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 px-8 pt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold mb-2">Documentos por estado</h4>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dashboardMetrics.byEstado || []}>
                  <XAxis dataKey="estado" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#C89B2A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold mb-2">Manual vs Política</h4>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Manuales', value: dashboardMetrics.manuals || 0 },
                      { name: 'Políticas', value: dashboardMetrics.policies || 0 },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    fill="#8884d8"
                  >
                    <Cell fill="#C89B2A" />
                    <Cell fill="#15803D" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold mb-2">Documentos por proceso</h4>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={documents.reduce((acc: Array<{ proceso: string; count: number }>, d) => {
                    const key = d.proceso || 'Sin proceso';
                    const existing = acc.find((x) => x.proceso === key);
                    if (existing) existing.count += 1;
                    else acc.push({ proceso: key, count: 1 });
                    return acc;
                  }, [])}
                >
                  <XAxis dataKey="proceso" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6B7280" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="px-8">
        <BibliotecaDocumentalExplorer
          documents={documents}
          areas={areas}
          processes={processes}
          documentTypes={documentTypes}
          documentStatuses={documentStatuses}
          onRefresh={loadData}
          loading={loading}
        />
      </div>

      {importDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Importar Biblioteca Documental</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Selecciona un archivo JSON con el arreglo de documentos para cargar en PMO.
                </p>
              </div>
              <button
                type="button"
                onClick={closeImportDialog}
                className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Archivo JSON / Excel
                <input
                  type="file"
                  accept=".json,.xlsx,.xls"
                  onChange={handleImportFileChange}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                />
              </label>

              {importFile && (
                <p className="text-sm text-slate-600">
                  Archivo seleccionado: <span className="font-medium text-slate-900">{importFile.name}</span>
                </p>
              )}

              {importError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {importError}
                </div>
              )}

              {importResult && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Importación completada correctamente.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeImportDialog}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={importLoading}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {importLoading ? 'Importando...' : 'Importar documento(s)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PmoShell>
  );
}
