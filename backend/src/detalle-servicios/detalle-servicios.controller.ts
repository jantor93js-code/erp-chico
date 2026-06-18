import {
Controller,
Post,
Get,
Body,
Param,
} from '@nestjs/common';

import { DetalleServiciosService } from './detalle-servicios.service';
import { CreateDetalleServicioDto } from './dto/create-detalle-servicio.dto';

@Controller('detalle-servicios')
export class DetalleServiciosController {
constructor(
private readonly detalleServiciosService: DetalleServiciosService,
) {}

@Post()
create(
@Body()
dto: CreateDetalleServicioDto,
) {
return this.detalleServiciosService.create(dto);
}

@Get()
findAll() {
return this.detalleServiciosService.findAll();
}

@Get('pedido/:pedidoId')
findByPedido(
@Param('pedidoId')
pedidoId: string,
) {
return this.detalleServiciosService.findByPedido(
pedidoId,
);
}
}
