import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProcessesController],
  providers: [ProcessesService],
  exports: [ProcessesService],
})
export class ProcessesModule {}
