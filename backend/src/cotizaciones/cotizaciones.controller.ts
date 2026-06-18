import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';

@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post()
  create(@Body() createCotizacioneDto: CreateCotizacioneDto) {
    return this.cotizacionesService.create(createCotizacioneDto);
  }

  @Get()
  findAll() {
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotizacionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCotizacioneDto: UpdateCotizacioneDto,
  ) {
    return this.cotizacionesService.update(
      id,
      updateCotizacioneDto,
    );
  }
@Patch(':id/aceptar')
aceptar(@Param('id') id: string) {
  return this.cotizacionesService.aceptar(id);
}

@Patch(':id/rechazar')
rechazar(@Param('id') id: string) {
  return this.cotizacionesService.rechazar(id);
}
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotizacionesService.remove(id);
  }
}