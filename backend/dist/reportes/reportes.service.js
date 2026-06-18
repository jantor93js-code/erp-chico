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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportesService = class ReportesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async financiero() {
        const ingresos = await this.prisma.factura.aggregate({
            _sum: {
                valor: true,
            },
        });
        const gastos = await this.prisma.gastoOperativo.aggregate({
            _sum: {
                valor: true,
            },
        });
        const totalIngresos = ingresos._sum.valor || 0;
        const totalGastos = gastos._sum.valor || 0;
        const utilidad = totalIngresos - totalGastos;
        return {
            ingresos: totalIngresos,
            gastos: totalGastos,
            utilidad,
            rentabilidad: totalIngresos > 0
                ? Number(((utilidad /
                    totalIngresos) *
                    100).toFixed(2))
                : 0,
        };
    }
    async conductoresTop() {
        const conductores = await this.prisma.conductor.findMany({
            include: {
                servicios: true,
            },
        });
        return conductores
            .map((conductor) => ({
            conductorId: conductor.id,
            nombre: conductor.nombre,
            servicios: conductor.servicios.length,
        }))
            .sort((a, b) => b.servicios - a.servicios);
    }
    async clientesTop() {
        const facturas = await this.prisma.factura.findMany({
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
            const nombre = factura.pedido.cliente
                ?.razonSocial ||
                'Sin cliente';
            if (!acumulado[nombre]) {
                acumulado[nombre] = 0;
            }
            acumulado[nombre] +=
                factura.valor;
        });
        return Object.entries(acumulado)
            .map(([cliente, facturacion]) => ({
            cliente,
            facturacion,
        }))
            .sort((a, b) => Number(b.facturacion) -
            Number(a.facturacion));
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportesService);
//# sourceMappingURL=reportes.service.js.map