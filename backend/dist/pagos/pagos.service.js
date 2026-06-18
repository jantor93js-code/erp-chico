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
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PagosService = class PagosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
        const totalPagado = await this.prisma.pago.aggregate({
            where: {
                facturaId: dto.facturaId,
            },
            _sum: {
                valor: true,
            },
        });
        const valorPagado = totalPagado._sum.valor || 0;
        let nuevoEstado = 'PENDIENTE';
        if (valorPagado >= factura.valor) {
            nuevoEstado = 'PAGADA';
        }
        else if (valorPagado > 0) {
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
    async findByFactura(facturaId) {
        return this.prisma.pago.findMany({
            where: {
                facturaId,
            },
            orderBy: {
                fechaPago: 'desc',
            },
        });
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagosService);
//# sourceMappingURL=pagos.service.js.map