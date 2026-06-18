import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
} from '@nestjs/common';

import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';

@Controller('servicios')
export class ServiciosController {
  constructor(
    private readonly serviciosService: ServiciosService,
  ) {}

  @Post()
  create(@Body() dto: CreateServicioDto) {
    return this.serviciosService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviciosService.findAll();
  }
  @Get('rentabilidad')
reporteRentabilidad() {
  return this.serviciosService
    .reporteRentabilidad();
}
@Get(':id/rentabilidad')
rentabilidad(
  @Param('id') id: string,
) {
  return this.serviciosService.rentabilidad(
    id,
  );
}

  @Patch(':id/iniciar')
  iniciar(@Param('id') id: string) {
    return this.serviciosService.iniciar(id);
  }

  @Patch(':id/entregar')
  entregar(@Param('id') id: string) {
    return this.serviciosService.entregar(id);
  }



}