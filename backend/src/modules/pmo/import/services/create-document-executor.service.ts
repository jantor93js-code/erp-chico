import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PersistencePlan } from '../interfaces/persistence-plan.interface';
import { ImportSession, ImportSessionError } from '../interfaces/import-session.interface';
import { CreateExecutionResult } from '../interfaces/create-execution-result.interface';

@Injectable()
export class CreateDocumentExecutorService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(plan: PersistencePlan, session: ImportSession): Promise<{ result: CreateExecutionResult; session: ImportSession }> {
    const createOperations = plan.operations.filter(op => op.type === 'CREATE_DOCUMENT');
    const startedAt = Date.now();
    let documentosCreados = 0;
    const errores: Array<string | ImportSessionError> = [];
    const warnings: Array<string | ImportSessionError> = [];

    for (const operation of createOperations) {
      try {
        const payload = operation.payload ?? {};
        await this.prisma.document.create({
          data: {
            codigo: operation.codigoDocumento,
            // TODO:
            // - estado
            // - tipoDocumental
            // - descripcion
            // - codigoArea
            // - fechas
            nombre: typeof payload['nombreDocumento'] === 'string' ? payload['nombreDocumento'] : '',
            version: typeof payload['version'] === 'string' ? payload['version'] : undefined,
            proceso: typeof payload['proceso'] === 'string' ? payload['proceso'] : undefined,
            area: typeof payload['area'] === 'string' ? payload['area'] : undefined,
            responsableActualizacion: typeof payload['responsableActualizacion'] === 'string' ? payload['responsableActualizacion'] : undefined,
            responsableRevision: typeof payload['responsableRevision'] === 'string' ? payload['responsableRevision'] : undefined,
            origenImportacion: true,
            activo: true,
          },
        });
        documentosCreados += 1;
        session.operacionesEjecutadas += 1;
      } catch (error) {
        const mensaje = `CREATE_DOCUMENT failed for ${operation.codigoDocumento}: ${error instanceof Error ? error.message : String(error)}`;
        errores.push({ codigoDocumento: operation.codigoDocumento, mensaje });
      }
    }

    if (createOperations.length > 0 && errores.length === 0) {
      session.estado = 'COMPLETED';
    }

    if (errores.length > 0) {
      session.estado = 'FAILED';
    }

    session.errores = [...session.errores, ...errores];
    session.warnings = [...session.warnings, ...warnings];

    return {
      result: {
        documentosIntentados: createOperations.length,
        documentosCreados,
        documentosFallidos: errores.length,
        tiempoEjecucionMs: Date.now() - startedAt,
        errores: errores.map(error => typeof error === 'string' ? error : `${error.codigoDocumento}: ${error.mensaje}`),
        warnings: warnings.map(warning => typeof warning === 'string' ? warning : `${warning.codigoDocumento}: ${warning.mensaje}`),
      },
      session,
    };
  }
}
