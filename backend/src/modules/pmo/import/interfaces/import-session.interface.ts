export type ImportSessionState = 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface ImportSessionError {
  codigoDocumento: string;
  mensaje: string;
}

export interface ImportSession {
  id: string;
  tenantId: string;
  usuario: string;
  fechaInicio: string;
  estado: ImportSessionState;
  archivoOrigen: string;
  totalOperaciones: number;
  operacionesEjecutadas: number;
  errores: Array<string | ImportSessionError>;
  warnings: Array<string | ImportSessionError>;
}
