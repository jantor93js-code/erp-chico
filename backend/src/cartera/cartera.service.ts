import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarteraService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    const facturas =
      await this.prisma.factura.findMany({
        include: {
          pedido: {
            include: {
              cliente: true,
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
        facturaId: factura.id,

        numeroFactura:
          factura.numeroFactura,

        cliente:
          factura.pedido.cliente
            ?.razonSocial,

        valorFactura:
          factura.valor,

        totalPagado,

        saldoPendiente:
          factura.valor - totalPagado,

        estadoPago:
          factura.estadoPago,

        fechaVencimiento:
          factura.fechaVencimiento,
      };
    });
  }

  async findPendientes() {

  const facturas =
    await this.prisma.factura.findMany({
      where: {
        estadoPago: {
          not: 'PAGADA',
        },
      },

      include: {
        pedido: {
          include: {
            cliente: true,
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

    const saldoPendiente =
      factura.valor - totalPagado;

    const hoy = new Date();

    const diasVencidos =
      Math.floor(
        (
          hoy.getTime() -
          factura.fechaVencimiento.getTime()
        ) /
        (1000 * 60 * 60 * 24),
      );

    return {

      facturaId: factura.id,

      numeroFactura:
        factura.numeroFactura,

      cliente:
        factura.pedido.cliente
          ?.razonSocial,

      valorFactura:
        factura.valor,

      totalPagado,

      saldoPendiente,

      estadoPago:
        factura.estadoPago,

      fechaVencimiento:
        factura.fechaVencimiento,

      diasVencidos:
        diasVencidos > 0
          ? diasVencidos
          : 0,
    };
  });
}
}