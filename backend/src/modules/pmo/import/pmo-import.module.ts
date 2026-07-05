import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PmoImportController } from './pmo-import.controller';
import { PmoImportService } from './pmo-import.service';
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
import { UpdateDocumentExecutorService } from './services/update-document-executor.service';

@Module({
  imports: [PrismaModule],
  controllers: [PmoImportController],
  providers: [
    PmoImportService,
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
    UpdateDocumentExecutorService,
    ImportApplicationService,
  ],
  exports: [PmoImportService, SynchronizationEngineService, ImportApplicationService],
})
export class PmoImportModule {}
