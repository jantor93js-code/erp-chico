import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturasService {
constructor(private prisma: PrismaService) {}

async create(dto: CreateFacturaDto) {
return this.prisma.factura.create({
data: dto,
});
}
async findAll() {
  const facturas =
    await this.prisma.factura.findMany({
      include: {
        pedido: {
          include: {
            cliente: true,
            cotizacion: true,
          },
        },
        pagos: true,
      },
    });

  return facturas.map((factura) => {

    const totalPagado =
      factura.pagos.reduce(
        (total, pago) =>
          total + pago.valor,
        0,
      );

    return {
      ...factura,

      totalPagado,

      saldoPendiente:
        factura.valor - totalPagado,
    };
  });
}

}
