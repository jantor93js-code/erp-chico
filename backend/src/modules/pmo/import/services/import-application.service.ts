import { BadRequestException, Injectable } from '@nestjs/common';
import { ImportExecutionResult } from '../interfaces/import-execution-result.interface';
import { ImportSession } from '../interfaces/import-session.interface';
import { ChangeSetBuilderService } from './change-set-builder.service';
import { ContractReaderService } from './contract-reader.service';
import { ContractValidatorService } from './contract-validator.service';
import { CreateDocumentExecutorService } from './create-document-executor.service';
import { DatabaseSnapshotProviderService } from './database-snapshot-provider.service';
import { ImportSessionService } from './import-session.service';
import { PersistencePlannerService } from './persistence-planner.service';

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
  ) {}

  async execute(source: string | object, tenantId: string, usuario: string): Promise<ImportExecutionResult> {
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
      return {
        session: failedSession,
        changeSet: {
          nuevos: [],
          sinCambios: [],
          actualizados: [],
          sinCodigo: [],
          resumen: {
            totalContrato: 0,
            totalBD: 0,
            totalNuevos: 0,
            totalSinCambios: 0,
            totalActualizados: 0,
            totalSinCodigo: 0,
          },
        },
        persistencePlan: { operations: [] },
        executionResult: {
          documentosIntentados: 0,
          documentosCreados: 0,
          documentosFallidos: 0,
          tiempoEjecucionMs: 0,
          errores: validationResult.errors,
          warnings: validationResult.warnings,
        },
      };
    }

    const snapshot = await this.databaseSnapshotProvider.getSnapshot();
    const changeSet = this.changeSetBuilder.build(contract as Parameters<ChangeSetBuilderService['build']>[0], snapshot);
    const persistencePlan = this.persistencePlanner.plan(changeSet);
    const executionResult = await this.createDocumentExecutor.execute(persistencePlan, runningSession);

    const completedSession = executionResult.session;

    return {
      session: completedSession,
      preview: undefined,
      changeSet,
      persistencePlan,
      executionResult: executionResult.result,
    };
  }
}
