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
exports.CotizacionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CotizacionesService = class CotizacionesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generarNumeroCotizacion() {
        const ultima = await this.prisma.cotizacion.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!ultima) {
            return 'COT-00001';
        }
        const numero = parseInt(ultima.numeroCotizacion.replace('COT-', '')) + 1;
        return `COT-${numero
            .toString()
            .padStart(5, '0')}`;
    }
    async create(dto) {
        const numeroCotizacion = await this.generarNumeroCotizacion();
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
    async findOne(id) {
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
    async update(id, dto) {
        return this.prisma.cotizacion.update({
            where: {
                id,
            },
            data: dto,
        });
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
    async aceptar(id) {
        const cotizacion = await this.prisma.cotizacion.update({
            where: {
                id,
            },
            data: {
                estado: 'ACEPTADA',
            },
        });
        const numeroPedido = await this.generarNumeroPedido();
        const pedido = await this.prisma.pedido.create({
            data: {
                numeroPedido,
                tenantId: cotizacion.tenantId,
                clienteId: cotizacion.clienteId,
                ejecutivoId: cotizacion.ejecutivoId,
                valorTotalPactado: cotizacion.valorCotizado,
                origen: cotizacion.origen,
                destino: cotizacion.destino,
                tipoServicio: cotizacion.tipoServicio,
                descripcion: cotizacion.descripcion,
                origenPedido: 'COTIZACION',
                cotizacionId: cotizacion.id,
                estado: 'SOLICITADO',
            },
        });
        return {
            cotizacion,
            pedido,
        };
    }
    async rechazar(id) {
        return this.prisma.cotizacion.update({
            where: {
                id,
            },
            data: {
                estado: 'RECHAZADA',
            },
        });
    }
    async remove(id) {
        return this.prisma.cotizacion.delete({
            where: {
                id,
            },
        });
    }
};
exports.CotizacionesService = CotizacionesService;
exports.CotizacionesService = CotizacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CotizacionesService);
//# sourceMappingURL=cotizaciones.service.js.map