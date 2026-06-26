import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TaskStatusesService } from './task-statuses.service';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('configuration/task-statuses')
@UseGuards(JwtAuthGuard)
export class TaskStatusesController {
  constructor(private readonly taskStatusesService: TaskStatusesService) {}

  @Post()
  create(@Body() createTaskStatusDto: CreateTaskStatusDto) {
    return this.taskStatusesService.create(createTaskStatusDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.taskStatusesService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
    );
  }

  @Get('all/active')
  findAllActive() {
    return this.taskStatusesService.findAllActive();
  }

  @Get('search')
  search(@Query('q') query: string) {
    if (!query) {
      return { data: [] };
    }
    return this.taskStatusesService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskStatusesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.taskStatusesService.update(id, updateTaskStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskStatusesService.remove(id);
  }
}
