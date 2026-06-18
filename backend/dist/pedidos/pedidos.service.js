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
exports.PedidosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PedidosService = class PedidosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generarNumeroPedido() {
        const ultimo = await this.prisma.pedido.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!ultimo?.numeroPedido) {
            return 'PED-00001';
        }
        const numero = parseInt(ultimo.numeroPedido.replace('PED-', '')) + 1;
        return `PED-${numero
            .toString()
            .padStart(5, '0')}`;
    }
    async create(createPedidoDto) {
        const numeroPedido = await this.generarNumeroPedido();
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
            valorCalculado: pedido.detallesServicio.reduce((total, item) => total + item.valorTotal, 0),
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
    async asignarVehiculo(pedidoId, vehiculoId) {
        return this.prisma.pedido.update({
            where: {
                id: pedidoId,
            },
            data: {
                vehiculoId,
            },
        });
    }
    async asignarConductor(pedidoId, conductorId) {
        return this.prisma.pedido.update({
            where: {
                id: pedidoId,
            },
            data: {
                conductorId,
            },
        });
    }
    async programar(pedidoId, fechaProgramada) {
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
    async marcarEnRuta(id) {
        return this.prisma.pedido.update({
            where: {
                id,
            },
            data: {
                estado: 'EN_RUTA',
            },
        });
    }
    async marcarEnEjecucion(id) {
        return this.prisma.pedido.update({
            where: {
                id,
            },
            data: {
                estado: 'EN_EJECUCION',
            },
        });
    }
    async finalizar(id) {
        return this.prisma.pedido.update({
            where: {
                id,
            },
            data: {
                estado: 'FINALIZADO',
            },
        });
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PedidosService);
//# sourceMappingURL=pedidos.service.js.map