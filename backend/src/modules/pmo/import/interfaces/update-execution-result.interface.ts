export interface UpdateExecutionResult {
  documentosIntentados: number;
  documentosActualizados: number;
  documentosFallidos: number;
  tiempoEjecucionMs: number;
  errores: string[];
  warnings: string[];
}
