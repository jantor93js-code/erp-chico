import { ContractValidationResult } from '../interfaces/contract-validation-result.interface';
import { PmoImportContract } from '../interfaces/pmo-import-contract.interface';

export class ContractValidatorService {
  validate(contract: unknown): ContractValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const isObject = contract && typeof contract === 'object';
    const hasMetadata = isObject && 'metadata' in (contract as Record<string, unknown>);
    const hasCatalogos = isObject && 'catalogos' in (contract as Record<string, unknown>);
    const hasDocumentos = isObject && 'documentos' in (contract as Record<string, unknown>);

    if (!hasMetadata) {
      errors.push('metadata missing');
    }

    if (!hasCatalogos) {
      errors.push('catalogos missing');
    }

    if (!hasDocumentos) {
      errors.push('documentos missing');
    }

    const metadata = hasMetadata ? (contract as PmoImportContract).metadata : undefined;
    const catalogos = hasCatalogos ? (contract as PmoImportContract).catalogos : undefined;
    const documentos = hasDocumentos ? (contract as PmoImportContract).documentos : undefined;

    if (hasMetadata) {
      if (!metadata || !('fechaGeneracion' in metadata)) {
        errors.push('metadata missing fechaGeneracion');
      }
      if (!metadata || !('versionNormalizador' in metadata)) {
        errors.push('metadata missing versionNormalizador');
      }
      if (!metadata || !('versionTransformador' in metadata)) {
        errors.push('metadata missing versionTransformador');
      }
    }

    if (hasCatalogos) {
      if (!catalogos || !('areas' in catalogos)) {
        errors.push('catalogos missing areas');
      }
      if (!catalogos || !('procesos' in catalogos)) {
        errors.push('catalogos missing procesos');
      }
      if (!catalogos || !('tiposDocumentales' in catalogos)) {
        errors.push('catalogos missing tiposDocumentales');
      }
      if (!catalogos || !('estados' in catalogos)) {
        errors.push('catalogos missing estados');
      }
      if (!catalogos || !('responsablesActualizacion' in catalogos)) {
        errors.push('catalogos missing responsablesActualizacion');
      }
      if (!catalogos || !('responsablesRevision' in catalogos)) {
        errors.push('catalogos missing responsablesRevision');
      }
      if (!catalogos || !('codigosArea' in catalogos)) {
        errors.push('catalogos missing codigosArea');
      }
    }

    if (hasDocumentos && !Array.isArray(documentos)) {
      errors.push('documentos must be an array');
    }

    const totalDocumentos = Array.isArray(documentos) ? documentos.length : 0;
    const totalCatalogos = catalogos ? Object.keys(catalogos).length : 0;

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        fechaGeneracion: metadata?.fechaGeneracion,
        versionNormalizador: metadata?.versionNormalizador,
        versionTransformador: metadata?.versionTransformador,
      },
      statistics: {
        totalDocumentos,
        totalCatalogos,
      },
    };
  }
}
