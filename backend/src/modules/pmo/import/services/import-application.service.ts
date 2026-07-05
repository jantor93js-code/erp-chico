import { BadRequestException, Injectable } from '@nestjs/common';
import { ImportExecutionResult } from '../interfaces/import-execution-result.interface';
import { ImportPreviewResponse } from '../interfaces/import-preview-response.interface';
import { ChangeSetBuilderService } from './change-set-builder.service';
import { ContractReaderService } from './contract-reader.service';
import { ContractValidatorService } from './contract-validator.service';
import { CreateDocumentExecutorService } from './create-document-executor.service';
import { DatabaseSnapshotProviderService } from './database-snapshot-provider.service';
import { ImportSessionService } from './import-session.service';
import { PersistencePlannerService } from './persistence-planner.service';
import { UpdateDocumentExecutorService } from './update-document-executor.service';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ImportApplicationService {
  constructor(
    private readonly importSessionService: ImportSessionService,
    private readonly contractReader: ContractReaderService,
    private readonly contractValidator: ContractValidatorService,
    private readonly databaseSnapshotProvider: DatabaseSnapshotProviderService,
    private readonly changeSetBuilder: ChangeSetBuilderService,
    private readonly persistencePlanner: PersistencePlannerService,
    private readonly createDocumentExecutor: CreateDocumentExecutorService,
    private readonly updateDocumentExecutor: UpdateDocumentExecutorService,
    private readonly prisma: PrismaService,
  ) {}

  async preview(source: string | object, tenantId: string, usuario: string): Promise<ImportPreviewResponse> {
    const contract = await this.contractReader.read(source);
    const validationResult = this.contractValidator.validate(contract);
    const totalOperaciones = Array.isArray((contract as { documentos?: unknown[] }).documentos)
      ? (contract as { documentos: unknown[] }).documentos.length
      : 0;

    const session = this.importSessionService.create(tenantId, usuario, typeof source === 'string' ? source : 'inline-json', totalOperaciones);
    const runningSession = this.importSessionService.start(session);

    if (!validationResult.valid) {
      const failedSession = this.importSessionService.fail(runningSession, validationResult.errors, validationResult.warnings);
      throw new BadRequestException({
        message: 'Contrato inválido',
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        session: failedSession,
      });
    }

    const snapshot = await this.databaseSnapshotProvider.getSnapshot();

    const changeSet = this.changeSetBuilder.build(contract as Parameters<ChangeSetBuilderService['build']>[0], snapshot);

    const persistencePlan = this.persistencePlanner.plan(changeSet);

    // Persist session to DB for audit/history using same session id
    await (this.prisma as any).importSession.create({
      data: {
        id: runningSession.id,
        tenantId,
        usuario,
        archivoOrigen: typeof source === 'string' ? source : 'inline-json',
        estado: runningSession.estado as any,
        fechaInicio: new Date(runningSession.fechaInicio),
        totalOperaciones,
        operacionesEjecutadas: runningSession.operacionesEjecutadas,
        totalNuevos: changeSet.resumen.totalNuevos,
        totalActualizados: changeSet.resumen.totalActualizados,
        totalSinCambios: changeSet.resumen.totalSinCambios,
        totalErrores: validationResult.errors.length,
        totalWarnings: validationResult.warnings.length,
      },
    });

    return {
      session: runningSession,
      changeSet,
      persistencePlan,
    };
  }

  async execute(source: string | object, tenantId: string, usuario: string): Promise<ImportExecutionResult> {
    const previewResult = await this.preview(source, tenantId, usuario);
    const { changeSet, persistencePlan, session: runningSession } = previewResult;

    const startedAt = Date.now();
    const createExecution = await this.createDocumentExecutor.execute(persistencePlan, runningSession);

    const updateExecution = await this.updateDocumentExecutor.execute(persistencePlan, runningSession);

    const completedSession = updateExecution.session;
    if (createExecution.result.documentosFallidos > 0 || updateExecution.result.documentosFallidos > 0) {
      completedSession.estado = 'FAILED';
    } else {
      completedSession.estado = 'COMPLETED';
    }

    const combinedExecutionResult = {
      documentosIntentados: createExecution.result.documentosIntentados + updateExecution.result.documentosIntentados,
      documentosCreados: createExecution.result.documentosCreados,
      documentosActualizados: updateExecution.result.documentosActualizados,
      documentosFallidos: createExecution.result.documentosFallidos + updateExecution.result.documentosFallidos,
      tiempoEjecucionMs: Date.now() - startedAt,
      errores: [...createExecution.result.errores, ...updateExecution.result.errores],
      warnings: [...createExecution.result.warnings, ...updateExecution.result.warnings],
    };

    // Update persisted session with execution outcome
    await (this.prisma as any).importSession.update({
      where: { id: runningSession.id },
      data: {
        estado: completedSession.estado as any,
        fechaFin: new Date(),
        duracionMs: Date.now() - startedAt,
        operacionesEjecutadas: completedSession.operacionesEjecutadas,
        totalErrores: combinedExecutionResult.documentosFallidos,
        totalWarnings: (combinedExecutionResult.warnings ?? []).length,
      },
    });

    return {
      session: completedSession,
      preview: undefined,
      changeSet,
      persistencePlan,
      executionResult: combinedExecutionResult as any,
    };
  }
}
