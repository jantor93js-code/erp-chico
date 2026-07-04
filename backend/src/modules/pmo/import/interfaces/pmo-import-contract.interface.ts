export interface PmoImportMetadata {
  fechaGeneracion: string;
  versionNormalizador: string;
  versionTransformador: string;
  fechaTransformacion?: string;
  archivoOrigen?: string;
  totalDocumentos?: number;
}

export interface PmoImportCatalogItem {
  valorOriginal: string;
  clave: string;
  conteo?: number;
  [key: string]: unknown;
}

export interface PmoImportCatalogs {
  tiposDocumentales: PmoImportCatalogItem[];
  areas: PmoImportCatalogItem[];
  procesos: PmoImportCatalogItem[];
  estados: PmoImportCatalogItem[];
  responsablesActualizacion: PmoImportCatalogItem[];
  responsablesRevision: PmoImportCatalogItem[];
  codigosArea: PmoImportCatalogItem[];
}

export interface ContractDocument {
  codigoDocumento?: string;
  nombreDocumento?: string;
  version?: string;
  proceso?: string;
  area?: string;
  estado?: string;
  responsableActualizacion?: string;
  responsableRevision?: string;
}

export interface PmoImportContract {
  metadata: PmoImportMetadata;
  catalogos: PmoImportCatalogs;
  documentos: ContractDocument[];
}
