import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDetalleServicioDto } from './dto/create-detalle-servicio.dto';

@Injectable()
export class DetalleServiciosService {
constructor(
private prisma: PrismaService,
) {}

async create(
dto: CreateDetalleServicioDto,
) {
return this.prisma.detalleServicio.create({
data: dto,
});
}

async findAll() {
return this.prisma.detalleServicio.findMany({
include: {
pedido: true,
},
});
}

async findByPedido(
pedidoId: string,
) {
return this.prisma.detalleServicio.findMany({
where: {
pedidoId,
},
});
}
}
