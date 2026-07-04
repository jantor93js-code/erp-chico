import { ImportStatistics } from '../interfaces/import-statistics.interface';
import { PmoImportContract } from '../interfaces/pmo-import-contract.interface';

export class StatisticsBuilderService {
  build(contract: PmoImportContract): ImportStatistics {
    return {
      totalDocumentos: contract.documentos.length,
      totalAreas: contract.catalogos.areas.length,
      totalProcesos: contract.catalogos.procesos.length,
      totalEstados: contract.catalogos.estados.length,
      totalResponsablesActualizacion: contract.catalogos.responsablesActualizacion.length,
      totalResponsablesRevision: contract.catalogos.responsablesRevision.length,
      totalTiposDocumentales: contract.catalogos.tiposDocumentales.length,
      totalCodigosArea: contract.catalogos.codigosArea.length,
    };
  }
}
