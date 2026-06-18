import {
  Controller,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';

import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';

@Controller('evidencias')
export class EvidenciasController {
  constructor(
    private readonly evidenciasService: EvidenciasService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateEvidenciaDto,
  ) {
    return this.evidenciasService.create(dto);
  }

  @Get()
  findAll() {
    return this.evidenciasService.findAll();
  }

  @Get('pedido/:pedidoId')
  findByPedido(
    @Param('pedidoId')
    pedidoId: string,
  ) {
    return this.evidenciasService.findByPedido(
      pedidoId,
    );
  }
}