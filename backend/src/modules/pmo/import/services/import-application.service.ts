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
    console.log('========== IMPORT APPLICATION ==========');
    console.log('Documentos:', (contract as any)?.documentos?.length ?? 0);

    const docs = (contract as any)?.documentos ?? [];
    const pro = docs.filter((d: any) => d?.codigoDocumento === 'PRO-PROY-01');

    console.log('PRO-PROY-01:', pro.length);
    console.log(JSON.stringify(pro, null, 2));

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

    console.log('ANTES DEL PLANNER');
    const persistencePlan = this.persistencePlanner.plan(changeSet);
    console.log('DESPUES DEL PLANNER');

    return {
      session: runningSession,
      changeSet,
      persistencePlan,
    };
  }

  async execute(source: string | object, tenantId: string, usuario: string): Promise<ImportExecutionResult> {
    console.log('================================');
    console.log('IMPORT EXECUTE');
    console.log(new Date().toISOString());
    console.log('================================');

    const previewResult = await this.preview(source, tenantId, usuario);
    const { changeSet, persistencePlan, session: runningSession } = previewResult;

    console.log('CHANGESET');
    console.dir(changeSet, { depth: null });

    console.log('RESUMEN');
    console.dir(changeSet.resumen, { depth: null });

    console.log('ANTES DEL PLANNER');

    console.log('DESPUES DEL PLANNER');
    console.log('OPERACIONES DEL PLAN');
    console.dir(persistencePlan.operations, { depth: null });
    console.log('PLAN OPERATIONS', persistencePlan.operations.length);
    console.log('PLAN OPERATIONS TYPES', persistencePlan.operations.reduce((acc, op) => {
      acc[op.type] = (acc[op.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));
    console.log('FIRST 10 UPDATE_OPERATIONS', persistencePlan.operations.filter(op => op.type === 'UPDATE_DOCUMENT').slice(0, 10).map(op => ({ type: op.type, codigoDocumento: op.codigoDocumento, differences: (op.payload as any)?.differences })));

    console.log('====================================');
    console.log('IMPORT -> UPDATE EXECUTOR');
    console.log('====================================');
    console.log('updateDocumentExecutor.execute count:', persistencePlan.operations.length);
    console.log('first 5 operations:');
    console.dir(persistencePlan.operations.slice(0, 5), { depth: null });
    console.log('first 5 operation types and codigoDocumento:');
    console.dir(persistencePlan.operations.slice(0, 5).map(op => ({ type: op.type, codigoDocumento: op.codigoDocumento, differences: (op.payload as any)?.differences })), { depth: null });

    const startedAt = Date.now();
    const createExecution = await this.createDocumentExecutor.execute(persistencePlan, runningSession);
    console.log(createExecution.result);

    const updateExecution = await this.updateDocumentExecutor.execute(persistencePlan, runningSession);
    console.log(updateExecution.result);

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

    return {
      session: completedSession,
      preview: undefined,
      changeSet,
      persistencePlan,
      executionResult: combinedExecutionResult as any,
    };
  }
}
