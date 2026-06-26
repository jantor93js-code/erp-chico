import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { DocumentStatusesService } from './document-statuses.service';
import { DocumentStatusesController } from './document-statuses.controller';

@Module({
  imports: [AuthModule],
  controllers: [DocumentStatusesController],
  providers: [DocumentStatusesService],
  exports: [DocumentStatusesService],
})
export class DocumentStatusesModule {}
