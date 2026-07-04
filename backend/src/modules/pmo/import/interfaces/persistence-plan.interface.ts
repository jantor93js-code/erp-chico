import { ContractDocument } from './pmo-import-contract.interface';

export type PersistenceOperationType = 'CREATE_DOCUMENT' | 'UPDATE_DOCUMENT' | 'SKIP_DOCUMENT';

export interface PersistenceOperation {
  type: PersistenceOperationType;
  codigoDocumento: string;
  payload?: ContractDocument | Record<string, unknown>;
}

export interface PersistencePlan {
  operations: PersistenceOperation[];
}
