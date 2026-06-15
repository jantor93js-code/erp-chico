import { Controller, Get, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';

@Controller('pagos')
export class PagosController {
  constructor(
    private readonly pagosService: PagosService,
  ) {}

  @Post()
  create(@Body() dto: CreatePagoDto) {
    return this.pagosService.create(dto);
  }

  @Get()
  findAll() {
    return this.pagosService.findAll();
  }
}