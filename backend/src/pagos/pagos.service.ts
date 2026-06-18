import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
constructor(private prisma: PrismaService) {}

async create(dto: CreatePagoDto) {
const pago = await this.prisma.pago.create({
data: dto,
});

const factura = await this.prisma.factura.findUnique({
  where: {
    id: dto.facturaId,
  },
});
if (!factura) {
  throw new Error('Factura no encontrada');
}
const totalPagado =
  await this.prisma.pago.aggregate({
    where: {
      facturaId: dto.facturaId,
    },
    _sum: {
      valor: true,
    },
  });

const valorPagado =
  totalPagado._sum.valor || 0;

let nuevoEstado = 'PENDIENTE';

if (valorPagado >= factura!.valor) {
  nuevoEstado = 'PAGADA';
} else if (valorPagado > 0) {
  nuevoEstado = 'PARCIAL';
}

await this.prisma.factura.update({
  where: {
    id: dto.facturaId,
  },
  data: {
    estadoPago: nuevoEstado,
  },
});

return pago;

}

async findAll() {
return this.prisma.pago.findMany({
include: {
  factura: {
    include: {
      pedido: {
        include: {
          cliente: true,
        },
      },
    },
  },
},
});
}
async findByFactura(
  facturaId: string,
) {
  return this.prisma.pago.findMany({
    where: {
      facturaId,
    },
    orderBy: {
      fechaPago: 'desc',
    },
  });
}
}
