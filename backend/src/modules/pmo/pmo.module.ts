import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TasksController, CommentsController],
  providers: [TasksService, CommentsService],
  exports: [TasksService, CommentsService],
})
export class PmoModule {}
