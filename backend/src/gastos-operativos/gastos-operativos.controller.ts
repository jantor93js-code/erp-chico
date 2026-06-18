import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { GastosOperativosService } from './gastos-operativos.service';

import { CreateGastosOperativoDto } from './dto/create-gastos-operativo.dto';

@Controller('gastos-operativos')
export class GastosOperativosController {
  constructor(
    private readonly gastosOperativosService:
      GastosOperativosService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateGastosOperativoDto,
  ) {
    return this.gastosOperativosService.create(
      dto,
    );
  }

  @Get()
  findAll() {
    return this.gastosOperativosService.findAll();
  }

  @Get('servicio/:id')
  findByServicio(
    @Param('id')
    servicioId: string,
  ) {
    return this.gastosOperativosService.findByServicio(
      servicioId,
    );
  }
}