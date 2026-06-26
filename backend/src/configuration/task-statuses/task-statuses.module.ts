import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { TaskStatusesService } from './task-statuses.service';
import { TaskStatusesController } from './task-statuses.controller';

@Module({
  imports: [AuthModule],
  controllers: [TaskStatusesController],
  providers: [TaskStatusesService],
  exports: [TaskStatusesService],
})
export class TaskStatusesModule {}
