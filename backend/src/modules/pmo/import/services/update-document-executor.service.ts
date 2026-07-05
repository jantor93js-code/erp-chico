import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DifferenceDetail } from '../interfaces/change-set.interface';
import { ImportSession, ImportSessionError } from '../interfaces/import-session.interface';
import { PersistencePlan } from '../interfaces/persistence-plan.interface';
import { UpdateExecutionResult } from '../interfaces/update-execution-result.interface';

@Injectable()
export class UpdateDocumentExecutorService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(plan: PersistencePlan, session: ImportSession): Promise<{ result: UpdateExecutionResult; session: ImportSession }> {
    const updateOperations = plan.operations.filter(op => op.type === 'UPDATE_DOCUMENT');
    const startedAt = Date.now();
    let documentosActualizados = 0;
    const errores: Array<string | ImportSessionError> = [];
    const warnings: Array<string | ImportSessionError> = [];

    for (const operation of updateOperations) {
      const opStart = Date.now();
      try {
        const payload = (operation.payload ?? {}) as Record<string, unknown>;
        const contract = payload.contract as Record<string, unknown> | undefined;
        const differences = (payload.differences ?? []) as DifferenceDetail[];

        if (!contract || !Array.isArray(differences)) {
          throw new Error('Invalid update operation payload');
        }

        const data: Record<string, unknown> = {};

        for (const difference of differences) {
          if (difference.field === 'nombreDocumento') {
            data.nombre = typeof difference.contractValue === 'string' ? difference.contractValue : undefined;
          }

          if (difference.field === 'version') {
            data.version = typeof difference.contractValue === 'string' ? difference.contractValue : undefined;
          }
        }

        if (Object.keys(data).length === 0) {
          warnings.push({ codigoDocumento: operation.codigoDocumento, mensaje: 'No hay campos modificados para actualizar' });
          // record skip as WARNING
          try {
            await (this.prisma as any).importOperation.create({
              data: {
                sessionId: session.id,
                codigoDocumento: operation.codigoDocumento,
                accion: 'UPDATE',
                resultado: 'WARNING',
                warning: 'No hay campos modificados para actualizar',
                duracionMs: Date.now() - opStart,
              },
            });
          } catch {
            // ignore
          }
          continue;
        }

        await this.prisma.document.update({
          where: { codigo: operation.codigoDocumento },
          data,
        });

        documentosActualizados += 1;
        session.operacionesEjecutadas += 1;

        try {
          await (this.prisma as any).importOperation.create({
            data: {
              sessionId: session.id,
              codigoDocumento: operation.codigoDocumento,
              accion: 'UPDATE',
              resultado: 'SUCCESS',
              duracionMs: Date.now() - opStart,
            },
          });
        } catch {
          // ignore
        }
      } catch (error) {
        const mensaje = `UPDATE_DOCUMENT failed for ${operation.codigoDocumento}: ${error instanceof Error ? error.message : String(error)}`;
        errores.push({ codigoDocumento: operation.codigoDocumento, mensaje });

        try {
          await (this.prisma as any).importOperation.create({
            data: {
              sessionId: session.id,
              codigoDocumento: operation.codigoDocumento,
              accion: 'UPDATE',
              resultado: 'FAILED',
              error: mensaje,
              duracionMs: Date.now() - opStart,
            },
          });
        } catch {
          // ignore
        }
      }
    }

    if (updateOperations.length > 0 && errores.length === 0) {
      session.estado = 'COMPLETED';
    }

    if (errores.length > 0) {
      session.estado = 'FAILED';
    }

    session.errores = [...session.errores, ...errores];
    session.warnings = [...session.warnings, ...warnings];

    return {
      result: {
        documentosIntentados: updateOperations.length,
        documentosActualizados,
        documentosFallidos: errores.length,
        tiempoEjecucionMs: Date.now() - startedAt,
        errores: errores.map(error => typeof error === 'string' ? error : `${error.codigoDocumento}: ${error.mensaje}`),
        warnings: warnings.map(warning => typeof warning === 'string' ? warning : `${warning.codigoDocumento}: ${warning.mensaje}`),
      },
      session,
    };
  }
}
