import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';

@Module({
  imports: [AuthModule],
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
  exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
