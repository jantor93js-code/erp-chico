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
exports.ServiciosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServiciosService = class ServiciosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async rentabilidad(id) {
        const servicio = await this.prisma.servicio.findUnique({
            where: { id },
            include: {
                pedido: true,
                gastosOperativos: true,
            },
        });
        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }
        const ingresos = servicio.pedido.valorTotalPactado || 0;
        const gastos = servicio.gastosOperativos.reduce((total, gasto) => total + gasto.valor, 0);
        const utilidad = ingresos - gastos;
        return {
            servicioId: servicio.id,
            ingresos,
            gastos,
            utilidad,
            porcentajeRentabilidad: ingresos > 0
                ? Number(((utilidad / ingresos) *
                    100).toFixed(2))
                : 0,
        };
    }
    async reporteRentabilidad() {
        const servicios = await this.prisma.servicio.findMany({
            include: {
                pedido: {
                    include: {
                        cliente: true,
                    },
                },
                gastosOperativos: true,
            },
        });
        return servicios.map((servicio) => {
            const ingresos = servicio.pedido.valorTotalPactado || 0;
            const gastos = servicio.gastosOperativos.reduce((total, gasto) => total + gasto.valor, 0);
            const utilidad = ingresos - gastos;
            const rentabilidad = ingresos > 0
                ? Number(((utilidad / ingresos) *
                    100).toFixed(2))
                : 0;
            return {
                servicioId: servicio.id,
                cliente: servicio.pedido.cliente
                    ?.razonSocial,
                ingresos,
                gastos,
                utilidad,
                rentabilidad,
                estado: servicio.estado,
                origen: servicio.origen,
                destino: servicio.destino,
            };
        });
    }
    async create(dto) {
        const servicio = await this.prisma.servicio.create({
            data: {
                ...dto,
                estado: 'PROGRAMADO',
            },
        });
        await this.prisma.pedido.update({
            where: {
                id: dto.pedidoId,
            },
            data: {
                estado: 'PROGRAMADO',
            },
        });
        return servicio;
    }
    async findAll() {
        return this.prisma.servicio.findMany({
            include: {
                pedido: true,
                vehiculo: true,
                conductor: true,
            },
        });
    }
    async iniciar(id) {
        return this.prisma.servicio.update({
            where: { id },
            data: {
                estado: 'EN_RUTA',
                fechaInicio: new Date(),
            },
        });
    }
    async entregar(id) {
        const servicio = await this.prisma.servicio.update({
            where: { id },
            data: {
                estado: 'ENTREGADO',
                fechaFin: new Date(),
            },
            include: {
                pedido: true,
            },
        });
        await this.prisma.pedido.update({
            where: {
                id: servicio.pedidoId,
            },
            data: {
                estado: 'FINALIZADO',
            },
        });
        console.log('Pedido actualizado:', servicio.pedidoId);
        const cantidadFacturas = await this.prisma.factura.count();
        const facturaExistente = await this.prisma.factura.findFirst({
            where: {
                pedidoId: servicio.pedido.id,
            },
        });
        if (facturaExistente) {
            return servicio;
        }
        await this.prisma.factura.create({
            data: {
                tenantId: servicio.pedido.tenantId,
                pedidoId: servicio.pedido.id,
                numeroFactura: `FAC-${String(cantidadFacturas + 1).padStart(5, '0')}`,
                valor: servicio.pedido.valorTotalPactado || 0,
                fechaVencimiento: new Date(Date.now() +
                    30 * 24 * 60 * 60 * 1000),
            },
        });
        return servicio;
    }
};
exports.ServiciosService = ServiciosService;
exports.ServiciosService = ServiciosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiciosService);
//# sourceMappingURL=servicios.service.js.map