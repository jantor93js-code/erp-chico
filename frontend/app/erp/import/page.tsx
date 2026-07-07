"use client";

import React, { useState } from 'react';
import ImportHeader from '../../../components/import/ImportHeader';
import ImportDropzone from '../../../components/import/ImportDropzone';
import ImportPipeline from '../../../components/import/ImportPipeline';
import ImportSummaryCards from '../../../components/import/ImportSummaryCards';
import ImportDocumentsTable from '../../../components/import/ImportDocumentsTable';
import ImportDetailsDrawer from '../../../components/import/ImportDetailsDrawer';
import ImportFooter from '../../../components/import/ImportFooter';
import { PMOImportApi } from '../../../lib/api/pmo-import';

const pipelineSteps = [
  'Lectura',
  'Validación',
  'Snapshot',
  'Comparación',
  'Planificación',
  'Persistencia',
];

export default function ImportLibraryPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [summary, setSummary] = useState({ nuevos: 0, actualizados: 0, sinCambios: 0, sinCodigo: 0 });
  const [documents, setDocuments] = useState<any[]>([]);
  const [differences, setDifferences] = useState<Record<string, any[]>>({});
  const [previewResponse, setPreviewResponse] = useState<any>(null);
  const [runResponse, setRunResponse] = useState<any>(null);
  const [lastPayload, setLastPayload] = useState<{ source: unknown; tenantId: string; usuario: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [runningImport, setRunningImport] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCodigo, setSelectedCodigo] = useState<string | undefined>(undefined);

  async function onAnalyze(contract?: unknown) {
    const payload = { source: contract ?? {}, tenantId: 'tenant-001', usuario: 'admin' };
    setLastPayload(payload);
    setStatusMessage('Analizando contrato...');
    setPreviewResponse(null);
    setRunResponse(null);
    setSummary({ nuevos: 0, actualizados: 0, sinCambios: 0, sinCodigo: 0 });
    setDocuments([]);
    setDifferences({});
    setSelectedCodigo(undefined);
    setDrawerOpen(false);
    setActiveStep(0);
    setAnalyzing(true);

    try {
      const result = await PMOImportApi.analyzeImport(payload);
      setPreviewResponse(result);
      const resumen = (result.changeSet?.resumen ?? {}) as {
        totalNuevos?: number;
        totalActualizados?: number;
        totalSinCambios?: number;
        totalSinCodigo?: number;
      };
      setSummary({
        nuevos: resumen.totalNuevos ?? 0,
        actualizados: resumen.totalActualizados ?? 0,
        sinCambios: resumen.totalSinCambios ?? 0,
        sinCodigo: resumen.totalSinCodigo ?? 0,
      });

      const documentList: any[] = [];
      if (Array.isArray(result.changeSet?.nuevos)) {
        result.changeSet.nuevos.forEach((doc: any) => {
          documentList.push({ codigoDocumento: doc.codigoDocumento, nombreDocumento: doc.contratoDocumento?.nombreDocumento ?? '', version: doc.contratoDocumento?.version ?? '', status: 'Nuevo' });
        });
      }
      if (Array.isArray(result.changeSet?.actualizados)) {
        result.changeSet.actualizados.forEach((doc: any) => {
          documentList.push({ codigoDocumento: doc.codigoDocumento, nombreDocumento: doc.contratoDocumento?.nombreDocumento ?? '', version: doc.contratoDocumento?.version ?? '', status: 'Actualizado' });
        });
      }
      if (Array.isArray(result.changeSet?.sinCambios)) {
        result.changeSet.sinCambios.forEach((doc: any) => {
          documentList.push({ codigoDocumento: doc.codigoDocumento, nombreDocumento: doc.contratoDocumento?.nombreDocumento ?? '', version: doc.contratoDocumento?.version ?? '', status: 'Sin cambios' });
        });
      }
      if (Array.isArray(result.changeSet?.sinCodigo)) {
        result.changeSet.sinCodigo.forEach((doc: any) => {
          documentList.push({ codigoDocumento: '', nombreDocumento: doc.contratoDocumento?.nombreDocumento ?? '', version: doc.contratoDocumento?.version ?? '', status: 'Sin código' });
        });
      }

      setDocuments(documentList);
      const differencesMap = Array.isArray(result.changeSet?.actualizados)
        ? result.changeSet.actualizados.reduce((acc: Record<string, any[]>, doc: any) => {
            acc[doc.codigoDocumento] = doc.differences ?? [];
            return acc;
          }, {})
        : {};
      setDifferences(differencesMap);
      setStatusMessage('Importación completada');
      setActiveStep(pipelineSteps.length - 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      // eslint-disable-next-line no-console
      console.error('analyzeImport failed', message);
      setSummary({ nuevos: 0, actualizados: 0, sinCambios: 0, sinCodigo: 0 });
      setDocuments([]);
      setDifferences({});
      setStatusMessage(message.includes('400') ? 'No fue posible completar la importación: contrato inválido' : 'No fue posible completar la importación');
    } finally {
      setAnalyzing(false);
    }
  }

  async function onExecute() {
    if (!lastPayload) {
      setStatusMessage('No hay análisis previo para ejecutar.');
      return;
    }

    setStatusMessage('Ejecutando importación...');
    setRunningImport(true);

    try {
      const result = await PMOImportApi.executeImport(lastPayload);
      setRunResponse(result);
      setStatusMessage('Importación completada');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      // eslint-disable-next-line no-console
      console.error('executeImport failed', message);
      setStatusMessage(message.includes('400') ? 'No fue posible completar la importación: contrato inválido' : 'No fue posible completar la importación');
    } finally {
      setRunningImport(false);
    }
  }

  function onSelectDocument(codigo: string) {
    setSelectedCodigo(codigo);
    setDrawerOpen(true);
  }

  function onCloseDrawer() {
    setDrawerOpen(false);
    setSelectedCodigo(undefined);
  }

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <ImportHeader />

        <ImportDropzone onAnalyze={onAnalyze} />

        <div className="mb-4 text-sm text-slate-500">{statusMessage}</div>

        <ImportPipeline steps={pipelineSteps} activeIndex={activeStep} />

        <ImportSummaryCards summary={summary} />

        <ImportDocumentsTable documents={documents} onSelect={onSelectDocument} />

        <ImportFooter onCancel={() => {}} onExecute={onExecute} />

        <ImportDetailsDrawer open={drawerOpen} onClose={onCloseDrawer} differences={selectedCodigo ? differences[selectedCodigo] : undefined} codigo={selectedCodigo} />
      </div>
    </main>
  );
}
