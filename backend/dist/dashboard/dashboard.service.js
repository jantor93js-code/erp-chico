"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGraficas() {
        const facturas = await this.prisma.factura.findMany();
        const pagos = await this.prisma.pago.findMany();
        const gastos = await this.prisma.gastoOperativo.findMany();
        const facturadoMes = facturas.reduce((total, item) => total + item.valor, 0);
        const pagosMes = pagos.reduce((total, item) => total + item.valor, 0);
        const gastosMes = gastos.reduce((total, item) => total + item.valor, 0);
        return {
            facturacionMensual: [
                {
                    mes: 'Junio',
                    valor: facturadoMes,
                },
            ],
            pagosMensuales: [
                {
                    mes: 'Junio',
                    valor: pagosMes,
                },
            ],
            gastosMensuales: [
                {
                    mes: 'Junio',
                    valor: gastosMes,
                },
            ],
            utilidadMensual: [
                {
                    mes: 'Junio',
                    valor: facturadoMes -
                        gastosMes,
                },
            ],
        };
    }
    async getResumen() {
        const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const finMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);
        const facturadoMes = await this.prisma.factura.aggregate({
            where: {
                fechaEmision: {
                    gte: inicioMes,
                    lte: finMes,
                },
            },
            _sum: {
                valor: true,
            },
        });
        const pagosMes = await this.prisma.pago.aggregate({
            where: {
                fechaPago: {
                    gte: inicioMes,
                    lte: finMes,
                },
            },
            _sum: {
                valor: true,
            },
        });
        const gastosMes = await this.prisma.gastoOperativo.aggregate({
            where: {
                fecha: {
                    gte: inicioMes,
                    lte: finMes,
                },
            },
            _sum: {
                valor: true,
            },
        });
        const pedidosMes = await this.prisma.pedido.count({
            where: {
                createdAt: {
                    gte: inicioMes,
                    lte: finMes,
                },
            },
        });
        const serviciosMes = await this.prisma.servicio.count({
            where: {
                createdAt: {
                    gte: inicioMes,
                    lte: finMes,
                },
            },
        });
        const utilidadMes = (facturadoMes._sum.valor || 0) -
            (gastosMes._sum.valor || 0);
        const clientes = await this.prisma.cliente.count();
        const pedidos = await this.prisma.pedido.count();
        const servicios = await this.prisma.servicio.count();
        const serviciosProgramados = await this.prisma.servicio.count({
            where: {
                estado: 'PROGRAMADO',
            },
        });
        const serviciosEnRuta = await this.prisma.servicio.count({
            where: {
                estado: 'EN_RUTA',
            },
        });
        const serviciosEntregados = await this.prisma.servicio.count({
            where: {
                estado: 'ENTREGADO',
            },
        });
        const conductores = await this.prisma.conductor.count();
        const facturas = await this.prisma.factura.count();
        const pagos = await this.prisma.pago.aggregate({
            _sum: {
                valor: true,
            },
        });
        const facturasPendientes = await this.prisma.factura.count({
            where: {
                estadoPago: 'PENDIENTE',
            },
        });
        const facturasPagadas = await this.prisma.factura.count({
            where: {
                estadoPago: 'PAGADA',
            },
        });
        const pagosRegistrados = await this.prisma.pago.count();
        const saldoPorCobrar = await this.prisma.factura.aggregate({
            where: {
                estadoPago: {
                    not: 'PAGADA',
                },
            },
            _sum: {
                valor: true,
            },
        });
        const gastosOperativos = await this.prisma.gastoOperativo.aggregate({
            _sum: {
                valor: true,
            },
        });
        const totalFacturado = await this.prisma.factura.aggregate({
            _sum: {
                valor: true,
            },
        });
        const utilidadOperativa = (totalFacturado._sum.valor || 0) -
            (gastosOperativos._sum.valor || 0);
        const serviciosRentables = await this.prisma.servicio.findMany({
            include: {
                pedido: true,
                gastosOperativos: true,
            },
        });
        let rentabilidadPromedio = 0;
        if (serviciosRentables.length > 0) {
            const suma = serviciosRentables.reduce((total, servicio) => {
                const gastos = servicio.gastosOperativos.reduce((s, gasto) => s + gasto.valor, 0);
                const ingresos = servicio.pedido.valorTotalPactado || 0;
                if (ingresos === 0)
                    return total;
                const porcentaje = ((ingresos - gastos) / ingresos) * 100;
                return total + porcentaje;
            }, 0);
            rentabilidadPromedio =
                Math.round(suma / serviciosRentables.length);
        }
        return {
            clientes,
            pedidos,
            servicios,
            serviciosProgramados,
            serviciosEnRuta,
            serviciosEntregados,
            conductores,
            facturas,
            facturasPendientes,
            facturasPagadas,
            pagosRegistrados,
            totalPagado: pagos._sum.valor || 0,
            saldoPorCobrar: saldoPorCobrar._sum.valor || 0,
            totalFacturado: totalFacturado._sum.valor || 0,
            totalGastosOperativos: gastosOperativos._sum.valor || 0,
            utilidadOperativa,
            rentabilidadPromedio,
            facturadoMes: facturadoMes._sum.valor || 0,
            pagosMes: pagosMes._sum.valor || 0,
            gastosMes: gastosMes._sum.valor || 0,
            utilidadMes,
            pedidosMes,
            serviciosMes,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map