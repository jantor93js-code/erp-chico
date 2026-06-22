import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

import { TasksService } from './tasks/tasks.service';
import { TasksController } from './tasks/tasks.controller';

import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';

import { InitiativesService } from './initiatives/initiatives.service';
import { InitiativesController } from './initiatives/initiatives.controller';

import { ProjectsService } from './projects/projects.service';
import { ProjectsController } from './projects/projects.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    TasksController,
    CommentsController,
    InitiativesController,
    ProjectsController,
  ],
  providers: [
    TasksService,
    CommentsService,
    InitiativesService,
    ProjectsService,
  ],
  exports: [
    TasksService,
    CommentsService,
    InitiativesService,
    ProjectsService,
  ],
})
export class PmoModule {}