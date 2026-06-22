import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController, CommentsController],
  providers: [TasksService, CommentsService],
  exports: [TasksService, CommentsService],
})
export class PmoModule {}
