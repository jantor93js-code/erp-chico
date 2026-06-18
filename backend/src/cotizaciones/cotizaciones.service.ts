import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CotizacionesService {
  constructor(private prisma: PrismaService) {}
  private async generarNumeroCotizacion() {
  const ultima =
    await this.prisma.cotizacion.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

  if (!ultima) {
    return 'COT-00001';
  }

  const numero =
    parseInt(
      ultima.numeroCotizacion.replace(
        'COT-',
        '',
      ),
    ) + 1;

  return `COT-${numero
    .toString()
    .padStart(5, '0')}`;
}

 async create(dto: any) {
  const numeroCotizacion =
    await this.generarNumeroCotizacion();

  return this.prisma.cotizacion.create({
    data: {
      ...dto,
      numeroCotizacion,
    },
    include: {
     cliente: true,
     ejecutivo: true,
},
  });
}

  async findAll() {
    return this.prisma.cotizacion.findMany({
      include: {
        cliente: true,
        ejecutivo: true,
      },
      orderBy: {
        fechaCreacion: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.cotizacion.findUnique({
      where: {
        id,
      },
      include: {
        cliente: true,
        ejecutivo: true,
      },
    });
  }

  async update(id: string, dto: any) {
    return this.prisma.cotizacion.update({
      where: {
        id,
      },
      data: dto,
    });
  }
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
async aceptar(id: string) {

  const cotizacion =
    await this.prisma.cotizacion.update({
      where: {
        id,
      },
      data: {
        estado: 'ACEPTADA',
      },
    });

  const numeroPedido =
    await this.generarNumeroPedido();

  const pedido =
    await this.prisma.pedido.create({
      data: {

        numeroPedido,

        tenantId:
          cotizacion.tenantId,

        clienteId:
          cotizacion.clienteId,

        ejecutivoId:
          cotizacion.ejecutivoId,

        valorTotalPactado:
          cotizacion.valorCotizado,

        origen:
          cotizacion.origen,

        destino:
          cotizacion.destino,

        tipoServicio:
  cotizacion.tipoServicio,

  descripcion:
  cotizacion.descripcion,

        origenPedido:
          'COTIZACION',

        cotizacionId:
          cotizacion.id,

        estado:
          'SOLICITADO',
      },
    });

  return {
    cotizacion,
    pedido,
  };
}
 

async rechazar(id: string) {
  return this.prisma.cotizacion.update({
    where: {
      id,
    },
    data: {
      estado: 'RECHAZADA',
    },
  });
}
  async remove(id: string) {
    return this.prisma.cotizacion.delete({
      where: {
        id,
      },
    });
  }
}