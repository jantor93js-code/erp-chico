import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('pmo/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: any,
  ) {

  console.log(
    '######## CREATE TASK ########',
  );

  console.log(req.user);

  return this.tasksService.create(
    createTaskDto,
    req.user,
  );
}

  @Get()
  findAll(
    @Req() req: any,
    @Query() query: any,
  ) {
    console.log('ENTRO A TASKS CONTROLLER');

    return this.tasksService.findAll(
      req.user,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.tasksService.findOne(
      id,
      req.user,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
      req.user,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.tasksService.remove(
      id,
      req.user,
    );
  }
  
}