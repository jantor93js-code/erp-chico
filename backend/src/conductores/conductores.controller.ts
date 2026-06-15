import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { CreateConductorDto } from './dto/create-conductor.dto';

@Controller('conductores')
export class ConductoresController {
  constructor(
    private readonly conductoresService: ConductoresService,
  ) {}

  @Post()
  create(@Body() dto: CreateConductorDto) {
    return this.conductoresService.create(dto);
  }

  @Get()
  findAll() {
    return this.conductoresService.findAll();
  }
}