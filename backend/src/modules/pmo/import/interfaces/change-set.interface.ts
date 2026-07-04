import { ContractDocument } from './pmo-import-contract.interface';
import { Document } from '@prisma/client';

export interface NewDocumentChange {
  codigoDocumento: string;
  contratoDocumento: ContractDocument;
}

export interface ExistingDocumentChange {
  codigoDocumento: string;
  contratoDocumento: ContractDocument;
  documentoBD: Document;
}

export interface NoCodeDocumentChange {
  contratoDocumento: ContractDocument;
}

export interface UnchangedDocumentChange {
  codigoDocumento: string;
  contratoDocumento: ContractDocument;
  documentoBD: Document;
}

export interface DifferenceDetail {
  field: string;
  databaseValue: string | null;
  contractValue: string | null;
}

export interface UpdatedDocumentChange {
  codigoDocumento: string;
  contratoDocumento: ContractDocument;
  documentoBD: Document;
  differences: DifferenceDetail[];
}

export interface ImportChangeSetSummary {
  totalContrato: number;
  totalBD: number;
  totalNuevos: number;
  totalSinCambios: number;
  totalActualizados: number;
  totalSinCodigo: number;
}

export interface ImportChangeSet {
  nuevos: NewDocumentChange[];
  sinCambios: UnchangedDocumentChange[];
  actualizados: UpdatedDocumentChange[];
  sinCodigo: NoCodeDocumentChange[];
  resumen: ImportChangeSetSummary;
}
