export interface CreateExecutionResult {
  documentosIntentados: number;
  documentosCreados: number;
  documentosFallidos: number;
  tiempoEjecucionMs: number;
  errores: string[];
  warnings: string[];
}
