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
    console.log('PLAN OPERATIONS LENGTH', plan.operations.length);
    const updateOperations = plan.operations.filter(op => op.type === 'UPDATE_DOCUMENT');
    console.log('UPDATE OPS', updateOperations.length);
    console.dir(updateOperations.slice(0, 5), { depth: null });
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

        console.log('====================================');
        console.log('EXECUTING UPDATE');
        console.log('====================================');
        console.log('codigoDocumento:', operation.codigoDocumento);
        console.log('differences completas:');
        console.dir(differences, { depth: null });

        const data: Record<string, unknown> = this.buildUpdateData(differences);
        const freeFormEstado = this.extractFreeFormEstado(differences);

        console.log('====================================');
        console.log('UPDATE DATA');
        console.log('====================================');
        console.dir(data, { depth: null });

        if (Object.keys(data).length === 0 && !freeFormEstado) {
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

        console.log('DIFFERENCES', differences);
        console.log('UPDATE DATA', data);
        console.log('====================================');
        console.log('BEFORE PRISMA UPDATE');
        console.log('====================================');
        console.log('where:', { codigo: operation.codigoDocumento });
        console.log('data:');
        console.dir(data, { depth: null });

        if (Object.keys(data).length > 0) {
          const updated = await (this.prisma as any).document.update({
            where: { codigo: operation.codigoDocumento },
            data,
          });
          console.log('UPDATED RETURN');
          console.log('====================================');
          console.dir(updated, { depth: null });
        }

        if (freeFormEstado) {
          const existing = await (this.prisma as any).document.findUnique({
            where: { codigo: operation.codigoDocumento },
          });
          if (existing?.id) {
            await (this.prisma as any).$executeRawUnsafe('UPDATE documents SET "estado" = $1 WHERE id = $2::uuid', freeFormEstado, existing.id);
          }
        }

        const verify = await (this.prisma as any).document.findUnique({
          where: { codigo: operation.codigoDocumento },
        });
        console.log('VERIFY DATABASE');
        console.dir(verify, { depth: null });

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

    console.log('UPDATE EJECUTADAS', documentosActualizados);
    console.log('UPDATE ERRORES', errores.length);

    if (updateOperations.length > 0 && errores.length === 0) {
      session.estado = 'COMPLETED';
    }

    if (errores.length > 0) {
      session.estado = 'FAILED';
    }

    session.errores = [...session.errores, ...errores];
    session.warnings = [...session.warnings, ...warnings];

    const result = {
      documentosIntentados: updateOperations.length,
      documentosActualizados,
      documentosFallidos: errores.length,
      tiempoEjecucionMs: Date.now() - startedAt,
      errores: errores.map(error => typeof error === 'string' ? error : `${error.codigoDocumento}: ${error.mensaje}`),
      warnings: warnings.map(warning => typeof warning === 'string' ? warning : `${warning.codigoDocumento}: ${warning.mensaje}`),
    };

    console.log('UPDATE RESULT');
    console.dir(result, { depth: null });

    return {
      result,
      session,
    };
  }

  private buildUpdateData(differences: DifferenceDetail[]): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    const parseDate = (v: unknown): Date | undefined => {
      if (v instanceof Date) return v;
      if (typeof v === 'string' && v.trim() !== '') {
        const d = new Date(v);
        if (!Number.isNaN(d.getTime())) return d;
      }
      return undefined;
    };

    const mapDocumentType = (value: string | null | undefined): string | undefined => {
      if (!value) return undefined;
      const v = value.toString();
      if (v === 'MANUAL' || v === 'PROCEDIMIENTO' || v === 'FORMATO' || v === 'POLITICA' || v === 'CONTRATO' || v === 'MATRIZ' || v === 'ACTIVIDAD' || v === 'OTRO') {
        return v;
      }
      return 'OTRO';
    };

    const mapEstadoDocumental = (value: string | null | undefined): string | undefined => {
      if (!value) return undefined;
      const normalized = value.toString().trim().toUpperCase();
      if (normalized === 'VIGENTE' || normalized === 'EN_REVISION' || normalized === 'PENDIENTE_APROBACION' || normalized === 'OBSOLETO' || normalized === 'ARCHIVADO') {
        return normalized;
      }
      return undefined;
    };

    const resolveEstadoValue = (value: string | null | undefined): { key: string; value?: unknown } | undefined => {
      if (typeof value !== 'string' && value !== null && value !== undefined) {
        return undefined;
      }
      const trimmed = value?.toString().trim();
      if (!trimmed) {
        return undefined;
      }
      const mappedEstadoDocumental = mapEstadoDocumental(trimmed);
      if (mappedEstadoDocumental) {
        return { key: 'estadoDocumental', value: mappedEstadoDocumental };
      }
      return undefined;
    };

    const handlers: Record<string, (val: string | null) => { key: string; value?: unknown } | undefined> = {
      nombreDocumento: (v) => ({ key: 'nombre', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      descripcion: (v) => ({ key: 'descripcion', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      tipo: (v) => ({ key: 'tipo', value: mapDocumentType(v) }),
      estado: (v) => resolveEstadoValue(v),
      estadoDocumental: (v) => resolveEstadoValue(v),
      area: (v) => ({ key: 'area', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      proceso: (v) => ({ key: 'proceso', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      version: (v) => ({ key: 'version', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      responsableActualizacion: (v) => ({ key: 'responsableActualizacion', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      responsableRevision: (v) => ({ key: 'responsableRevision', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      observaciones: (v) => ({ key: 'observaciones', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      enlace: (v) => ({ key: 'enlace', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
      fechaCreacion: (v) => ({ key: 'fechaCreacion', value: parseDate(v) }),
      fechaRevision: (v) => ({ key: 'fechaRevision', value: parseDate(v) }),
      codigoDependencia: (v) => ({ key: 'codigoDependencia', value: typeof v === 'string' && v.trim() !== '' ? v : undefined }),
    };

    for (const diff of differences) {
      const handler = handlers[diff.field];
      if (!handler) continue;
      const result = handler(diff.contractValue as string | null);
      if (!result) continue;
      const { key, value } = result;
      if (value === undefined) continue;
      data[key] = value;
    }

    return data;
  }

  private extractFreeFormEstado(differences: DifferenceDetail[]): string | undefined {
    for (const diff of differences) {
      if (diff.field !== 'estado' && diff.field !== 'estadoDocumental') {
        continue;
      }

      const value = typeof diff.contractValue === 'string' ? diff.contractValue : undefined;
      if (!value || value.trim() === '') {
        continue;
      }

      const mappedEstadoDocumental = this.mapEstadoDocumental(value);
      if (mappedEstadoDocumental) {
        continue;
      }

      return value.trim();
    }

    return undefined;
  }

  private mapEstadoDocumental(value: string | null | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    const normalized = value.toString().trim().toUpperCase();
    if (normalized === 'VIGENTE' || normalized === 'EN_REVISION' || normalized === 'PENDIENTE_APROBACION' || normalized === 'OBSOLETO' || normalized === 'ARCHIVADO') {
      return normalized;
    }

    return undefined;
  }
}
