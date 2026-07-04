import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PmoImportController } from './pmo-import.controller';
import { PmoImportService } from './pmo-import.service';
import { ImportPreviewService } from './import-preview.service';
import { ImportRunService } from './import-run.service';
import { ImportAuditService } from './import-audit.service';
import { ImportJobRepository } from './repositories/import-job.repository';
import { ContractReaderService } from './services/contract-reader.service';
import { ContractValidatorService } from './services/contract-validator.service';
import { StatisticsBuilderService } from './services/statistics-builder.service';
import { PreviewBuilderService } from './services/preview-builder.service';
import { SynchronizationEngineService } from './services/synchronization-engine.service';
import { DatabaseSnapshotProviderService } from './services/database-snapshot-provider.service';
import { DocumentComparerService } from './services/document-comparer.service';
import { ChangeSetBuilderService } from './services/change-set-builder.service';
import { PersistencePlannerService } from './services/persistence-planner.service';
import { ImportSessionService } from './services/import-session.service';
import { CreateDocumentExecutorService } from './services/create-document-executor.service';
import { ImportApplicationService } from './services/import-application.service';

@Module({
  imports: [PrismaModule],
  controllers: [PmoImportController],
  providers: [
    PmoImportService,
    ImportPreviewService,
    ImportRunService,
    ImportAuditService,
    ImportJobRepository,
    ContractReaderService,
    ContractValidatorService,
    StatisticsBuilderService,
    PreviewBuilderService,
    SynchronizationEngineService,
    DatabaseSnapshotProviderService,
    DocumentComparerService,
    ChangeSetBuilderService,
    PersistencePlannerService,
    ImportSessionService,
    CreateDocumentExecutorService,
    ImportApplicationService,
  ],
  exports: [PmoImportService, SynchronizationEngineService, ImportApplicationService],
})
export class PmoImportModule {}
