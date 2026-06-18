import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
constructor(private prisma: PrismaService) {}
private async generarNumeroPedido() {
  const ultimo =
    await this.prisma.pedido.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

  if (!ultimo?.numeroPedido) {
    return 'PED-00001';
  }

  const numero =
    parseInt(
      ultimo.numeroPedido.replace(
        'PED-',
        '',
      ),
    ) + 1;

  return `PED-${numero
    .toString()
    .padStart(5, '0')}`;
}
async create(createPedidoDto: CreatePedidoDto) {

  const numeroPedido =
    await this.generarNumeroPedido();

  return this.prisma.pedido.create({
    data: {
      ...createPedidoDto,

      numeroPedido,

      estado: 'SOLICITADO',
    },
  });
}

async findAll() {
  const pedidos = await this.prisma.pedido.findMany({
    include: {
      cliente: true,
      ejecutivo: true,
      vehiculo: true,
      conductor: true,
      cotizacion: true,
      detallesServicio: true,
    },
  });

  return pedidos.map((pedido) => ({
    ...pedido,
    valorCalculado: pedido.detallesServicio.reduce(
      (total, item) => total + item.valorTotal,
      0,
    ),
  }));
}

async findDisponibles() {
return this.prisma.pedido.findMany({
where: {
estado: 'SOLICITADO',
},
include: {
cliente: true,
ejecutivo: true,
},
});
}

async asignarVehiculo(
pedidoId: string,
vehiculoId: string,
) {
return this.prisma.pedido.update({
where: {
id: pedidoId,
},
data: {
vehiculoId,
},
});
}

async asignarConductor(
pedidoId: string,
conductorId: string,
) {
return this.prisma.pedido.update({
where: {
id: pedidoId,
},
data: {
conductorId,
},
});
}

async programar(
pedidoId: string,
fechaProgramada: Date,
) {
return this.prisma.pedido.update({
where: {
id: pedidoId,
},
data: {
fechaProgramada,
estado: 'PROGRAMADO',
},
});
}

async marcarEnRuta(id: string) {
return this.prisma.pedido.update({
where: {
id,
},
data: {
estado: 'EN_RUTA',
},
});
}

async marcarEnEjecucion(id: string) {
return this.prisma.pedido.update({
where: {
id,
},
data: {
estado: 'EN_EJECUCION',
},
});
}

async finalizar(id: string) {
return this.prisma.pedido.update({
where: {
id,
},
data: {
estado: 'FINALIZADO',
},
});
}

}

