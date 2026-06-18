import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportesService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async financiero() {

    const ingresos =
      await this.prisma.factura.aggregate({
        _sum: {
          valor: true,
        },
      });

    const gastos =
      await this.prisma.gastoOperativo.aggregate({
        _sum: {
          valor: true,
        },
      });

    const totalIngresos =
      ingresos._sum.valor || 0;

    const totalGastos =
      gastos._sum.valor || 0;

    const utilidad =
      totalIngresos - totalGastos;

    return {
      ingresos: totalIngresos,
      gastos: totalGastos,
      utilidad,

      rentabilidad:
        totalIngresos > 0
          ? Number(
              (
                (utilidad /
                  totalIngresos) *
                100
              ).toFixed(2),
            )
          : 0,
    };
  }
  async conductoresTop() {

  const conductores =
    await this.prisma.conductor.findMany({
      include: {
        servicios: true,
      },
    });

  return conductores
    .map((conductor) => ({
      conductorId: conductor.id,

      nombre:
        conductor.nombre,

      servicios:
        conductor.servicios.length,
    }))
    .sort(
      (a, b) =>
        b.servicios - a.servicios,
    );
}
async clientesTop() {

  const facturas =
    await this.prisma.factura.findMany({
      include: {
        pedido: {
          include: {
            cliente: true,
          },
        },
      },
    });

  const acumulado = {};

  facturas.forEach((factura) => {

    const nombre =
      factura.pedido.cliente
        ?.razonSocial ||
      'Sin cliente';

    if (!acumulado[nombre]) {
      acumulado[nombre] = 0;
    }

    acumulado[nombre] +=
      factura.valor;
  });

  return Object.entries(acumulado)
    .map(
      ([cliente, facturacion]) => ({
        cliente,
        facturacion,
      }),
    )
    .sort(
      (a, b) =>
        Number(b.facturacion) -
        Number(a.facturacion),
    );
}

}