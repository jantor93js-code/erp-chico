import { Controller, Get, Post, Body } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Controller('facturas')
export class FacturasController {
  constructor(
    private readonly facturasService: FacturasService,
  ) {}

  @Post()
  create(@Body() dto: CreateFacturaDto) {
    return this.facturasService.create(dto);
  }

  @Get()
  findAll() {
    return this.facturasService.findAll();
  }
}