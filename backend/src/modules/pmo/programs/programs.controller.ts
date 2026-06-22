import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';

@Controller('pmo/programs')
export class ProgramsController {

  constructor(
    private readonly service: ProgramsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProgramDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateProgramDto>,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}