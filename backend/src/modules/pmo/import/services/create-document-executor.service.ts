import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PersistencePlan } from '../interfaces/persistence-plan.interface';
import { ImportSession, ImportSessionError } from '../interfaces/import-session.interface';
import { CreateExecutionResult } from '../interfaces/create-execution-result.interface';

type DocumentPayload = Record<string, unknown>;

@Injectable()
export class CreateDocumentExecutorService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(plan: PersistencePlan, session: ImportSession): Promise<{ result: CreateExecutionResult; session: ImportSession }> {
    const createOperations = plan.operations.filter(op => op.type === 'CREATE_DOCUMENT');
    console.log('CREATE OPS', createOperations.length);
    const startedAt = Date.now();
    let documentosCreados = 0;
    const errores: Array<string | ImportSessionError> = [];
    const warnings: Array<string | ImportSessionError> = [];

    for (const operation of createOperations) {
      const payload = (operation.payload ?? {}) as DocumentPayload;
      const opStart = Date.now();
      try {
        const data = this.buildDocumentCreateData(operation.codigoDocumento, payload);
        const rawEstado = this.asString(payload.estadoDocumental) ?? this.asString(payload.estado);
        const estadoDocumental = this.mapEstadoDocumental(rawEstado);
        const estado = !estadoDocumental && rawEstado ? rawEstado : undefined;

        console.log('DOCUMENT CREATE', data);

        const created = await (this.prisma as any).document.create({
          data,
        });

        if (estado && created?.id) {
          await (this.prisma as any).$executeRawUnsafe('UPDATE documents SET "estado" = $1 WHERE id = $2::uuid', estado, created.id);
        }

        documentosCreados += 1;
        session.operacionesEjecutadas += 1;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    console.log('CREATE EJECUTADAS', documentosCreados);
    console.log('CREATE ERRORES', errores.length);

    if (createOperations.length > 0 && errores.length === 0) {
      session.estado = 'COMPLETED';
    }

    if (errores.length > 0) {
      session.estado = 'FAILED';
    }

    session.errores = [...session.errores, ...errores];
    session.warnings = [...session.warnings, ...warnings];

    const result = {
      documentosIntentados: createOperations.length,
      documentosCreados,
      documentosFallidos: errores.length,
      tiempoEjecucionMs: Date.now() - startedAt,
      errores: errores.map(error => typeof error === 'string' ? error : `${error.codigoDocumento}: ${error.mensaje}`),
      warnings: warnings.map(warning => typeof warning === 'string' ? warning : `${warning.codigoDocumento}: ${warning.mensaje}`),
    };

    console.log('CREATE RESULT');
    console.dir(result, { depth: null });

    return {
      result,
      session,
    };
  }

  private buildDocumentCreateData(codigoDocumento: string, payload: DocumentPayload): Record<string, unknown> {
    const nombre = this.asString(payload.nombreDocumento) ?? this.asString(payload.nombre) ?? '';
    const descripcion = this.asString(payload.descripcion);
    const tipoDocumento = this.asString(payload.tipoDocumento) ?? this.asString(payload.tipo);
    const rawEstado = this.asString(payload.estadoDocumental) ?? this.asString(payload.estado);
    const estadoDocumental = this.mapEstadoDocumental(rawEstado);
    const fechaCreacion = this.parseDate(payload.fechaCreacion);
    const fechaRevision = this.parseDate(payload.fechaRevision);
    const enlace = this.asString(payload.enlace);
    const observaciones = this.asString(payload.observaciones);

    const data: Record<string, unknown> = {
      codigo: codigoDocumento,
      nombre,
      ...(descripcion && { descripcion }),
      tipo: this.mapDocumentType(tipoDocumento),
      ...(this.asString(payload.proceso) && { proceso: this.asString(payload.proceso) }),
      ...(this.asString(payload.area) && { area: this.asString(payload.area) }),
      ...(this.asString(payload.version) && { version: this.asString(payload.version) }),
      ...(this.asString(payload.responsableActualizacion) && { responsableActualizacion: this.asString(payload.responsableActualizacion) }),
      ...(this.asString(payload.responsableRevision) && { responsableRevision: this.asString(payload.responsableRevision) }),
      ...(estadoDocumental && { estadoDocumental }),
      ...(fechaCreacion && { fechaCreacion }),
      ...(fechaRevision && { fechaRevision }),
      ...(observaciones && { observaciones }),
      ...(enlace && { enlace }),
      fuente: 'IMPORTACION_EXCEL',
      origenImportacion: true,
      activo: true,
      ...(this.hasValue(payload.areaId) && { areaId: payload.areaId }),
      ...(this.hasValue(payload.processId) && { processId: payload.processId }),
      ...(this.hasValue(payload.tipoId) && { tipoId: payload.tipoId }),
      ...(this.hasValue(payload.estadoDocumentalId) && { estadoDocumentalId: payload.estadoDocumentalId }),
      ...(this.hasValue(payload.clienteId) && { clienteId: payload.clienteId }),
      ...(this.hasValue(payload.programId) && { programId: payload.programId }),
      ...(this.hasValue(payload.initiativeId) && { initiativeId: payload.initiativeId }),
      ...(this.hasValue(payload.projectId) && { projectId: payload.projectId }),
    };

    return data;
  }

  private inferVigencia(providedVigencia: string | undefined, rawEstado: string | undefined): string | undefined {
    const vigencia = this.mapVigencia(providedVigencia);
    if (vigencia) {
      return vigencia;
    }

    if (!rawEstado) {
      return undefined;
    }

    const normalizedEstado = rawEstado.trim().toUpperCase();
    if (normalizedEstado === 'NO_VIGENTE' || normalizedEstado === 'ARCHIVADO' || normalizedEstado === 'OBSOLETO' || normalizedEstado === 'VENCIDO') {
      return 'NO_VIGENTE';
    }
    if (normalizedEstado === 'VIGENTE' || normalizedEstado === 'PUBLICADO' || normalizedEstado === 'APROBADO') {
      return 'VIGENTE';
    }
    return undefined;
  }

  private mapEstadoDocumental(value: string | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    const normalized = value.trim().toUpperCase();
    if (normalized === 'VIGENTE') {
      return 'VIGENTE';
    }
    if (normalized === 'EN_REVISION') {
      return 'EN_REVISION';
    }
    if (normalized === 'PENDIENTE_APROBACION') {
      return 'PENDIENTE_APROBACION';
    }
    if (normalized === 'OBSOLETO') {
      return 'OBSOLETO';
    }
    if (normalized === 'ARCHIVADO') {
      return 'ARCHIVADO';
    }

    return undefined;
  }

  private asString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
  }

  private hasValue(value: unknown): value is string {
    return typeof value === 'string' && value.trim() !== '';
  }

  private parseDate(value: unknown): Date | undefined {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return undefined;
  }

  private mapDocumentType(value: string | undefined) {
    if (value === 'MANUAL' || value === 'PROCEDIMIENTO' || value === 'FORMATO' || value === 'POLITICA' || value === 'CONTRATO' || value === 'MATRIZ' || value === 'ACTIVIDAD' || value === 'OTRO') {
      return value;
    }

    return 'OTRO';
  }

  private mapVigencia(value: string | undefined): string | undefined {
    const normalized = value?.toString().trim().toUpperCase();
    if (normalized === 'VIGENTE') {
      return 'VIGENTE';
    }
    if (normalized === 'NO_VIGENTE') {
      return 'NO_VIGENTE';
    }
    return undefined;
  }
}
