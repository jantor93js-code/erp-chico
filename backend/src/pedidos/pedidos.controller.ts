import {
Controller,
Post,
Get,
Body,
Patch,
Param,
} from '@nestjs/common';
import { AsignarVehiculoDto } from './dto/asignar-vehiculo.dto';
import { AsignarConductorDto } from './dto/asignar-conductor.dto';
import { ProgramarPedidoDto } from './dto/programar-servicios.dto';


import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidosController {
constructor(
private readonly pedidosService: PedidosService,
) {}

@Post()
create(@Body() dto: CreatePedidoDto) {
return this.pedidosService.create(dto);
}

@Get()
findAll() {
return this.pedidosService.findAll();
}

@Get('disponibles')
findDisponibles() {
return this.pedidosService.findDisponibles();
}

@Patch(':id/asignar-vehiculo')
asignarVehiculo(
@Param('id') id: string,
@Body() body: AsignarVehiculoDto,
) {
return this.pedidosService.asignarVehiculo(
id,
body.vehiculoId,
);
}

@Patch(':id/asignar-conductor')
asignarConductor(
@Param('id') id: string,
@Body() body: AsignarConductorDto,
) {
return this.pedidosService.asignarConductor(
id,
body.conductorId,
);
}


@Patch(':id/programar')
programar(
@Param('id') id: string,
@Body() body: ProgramarPedidoDto,
) {
return this.pedidosService.programar(
id,
new Date(body.fechaProgramada),
);
}
@Patch(':id/en-ruta')
marcarEnRuta(
@Param('id') id: string,
) {
return this.pedidosService.marcarEnRuta(id);
}

@Patch(':id/en-ejecucion')
marcarEnEjecucion(
@Param('id') id: string,
) {
return this.pedidosService.marcarEnEjecucion(id);
}

@Patch(':id/finalizar')
finalizar(
@Param('id') id: string,
) {
return this.pedidosService.finalizar(id);
}

}
