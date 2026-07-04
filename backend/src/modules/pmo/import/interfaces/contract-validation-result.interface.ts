export interface ContractValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    fechaGeneracion?: string;
    versionNormalizador?: string;
    versionTransformador?: string;
  };
  statistics: {
    totalDocumentos: number;
    totalCatalogos: number;
  };
}
