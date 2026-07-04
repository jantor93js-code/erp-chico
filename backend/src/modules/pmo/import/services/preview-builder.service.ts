import { ContractValidationResult } from '../interfaces/contract-validation-result.interface';
import { ImportStatistics } from '../interfaces/import-statistics.interface';
import { ImportPreview } from '../interfaces/import-preview.interface';

export class PreviewBuilderService {
  build(contractValidation: ContractValidationResult, statistics: ImportStatistics): ImportPreview {
    const metadata = contractValidation.metadata ?? {};
    const warnings = contractValidation.warnings ?? [];
    const errors = contractValidation.errors ?? [];

    const summary = {
      totalDocumentos: statistics.totalDocumentos,
      totalAreas: statistics.totalAreas,
      totalProcesos: statistics.totalProcesos,
      totalEstados: statistics.totalEstados,
      totalResponsablesActualizacion: statistics.totalResponsablesActualizacion,
      totalResponsablesRevision: statistics.totalResponsablesRevision,
      totalTiposDocumentales: statistics.totalTiposDocumentales,
      totalCodigosArea: statistics.totalCodigosArea,
    };

    const resumenEjecutivo = `La importación contiene ${summary.totalDocumentos} documentos distribuidos en ${summary.totalAreas} áreas, ${summary.totalProcesos} procesos, ${summary.totalEstados} estados, ${summary.totalTiposDocumentales} tipos documentales, ${summary.totalResponsablesActualizacion} responsables de actualización, ${summary.totalResponsablesRevision} responsables de revisión y ${summary.totalCodigosArea} códigos de área. ${
      errors.length > 0
        ? 'El contrato presenta errores estructurales que deben corregirse antes de continuar.'
        : 'No se detectaron errores estructurales del contrato.'
    }`;

    return {
      metadata,
      summary,
      statistics,
      warnings,
      errors,
      resumenEjecutivo,
    };
  }
}
