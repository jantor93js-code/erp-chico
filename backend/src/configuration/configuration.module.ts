import { Module } from '@nestjs/common';
import { AreasModule } from './areas/areas.module';
import { ProcessesModule } from './processes/processes.module';
import { DocumentTypesModule } from './document-types/document-types.module';
import { DocumentStatusesModule } from './document-statuses/document-statuses.module';
import { TaskStatusesModule } from './task-statuses/task-statuses.module';

@Module({
  imports: [
    AreasModule,
    ProcessesModule,
    DocumentTypesModule,
    DocumentStatusesModule,
    TaskStatusesModule,
  ],
})
export class ConfigurationModule {}
