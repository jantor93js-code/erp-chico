import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getResumen() {
    const clientes = await this.prisma.cliente.count();

    const pedidos = await this.prisma.pedido.count();

    const servicios = await this.prisma.servicio.count();

    const conductores = await this.prisma.conductor.count();

    const facturas = await this.prisma.factura.count();

    const pagos = await this.prisma.pago.aggregate({
      _sum: {
        valor: true,
      },
    });

    return {
      clientes,
      pedidos,
      servicios,
      conductores,
      facturas,
      totalPagado: pagos._sum.valor || 0,
    };
  }
}