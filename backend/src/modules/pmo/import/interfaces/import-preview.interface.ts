import { ImportStatistics } from './import-statistics.interface';

export interface ImportPreview {
  metadata?: {
    fechaGeneracion?: string;
    versionNormalizador?: string;
    versionTransformador?: string;
  };
  summary: {
    totalDocumentos: number;
    totalAreas: number;
    totalProcesos: number;
    totalEstados: number;
    totalResponsablesActualizacion: number;
    totalResponsablesRevision: number;
    totalTiposDocumentales: number;
    totalCodigosArea: number;
  };
  statistics: ImportStatistics;
  warnings: string[];
  errors: string[];
  resumenEjecutivo: string;
}
