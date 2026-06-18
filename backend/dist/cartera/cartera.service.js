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
exports.CarteraService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CarteraService = class CarteraService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const facturas = await this.prisma.factura.findMany({
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
            const totalPagado = factura.pagos.reduce((total, pago) => total + pago.valor, 0);
            return {
                facturaId: factura.id,
                numeroFactura: factura.numeroFactura,
                cliente: factura.pedido.cliente
                    ?.razonSocial,
                valorFactura: factura.valor,
                totalPagado,
                saldoPendiente: factura.valor - totalPagado,
                estadoPago: factura.estadoPago,
                fechaVencimiento: factura.fechaVencimiento,
            };
        });
    }
    async findPendientes() {
        const facturas = await this.prisma.factura.findMany({
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
            const totalPagado = factura.pagos.reduce((total, pago) => total + pago.valor, 0);
            const saldoPendiente = factura.valor - totalPagado;
            const hoy = new Date();
            const diasVencidos = Math.floor((hoy.getTime() -
                factura.fechaVencimiento.getTime()) /
                (1000 * 60 * 60 * 24));
            return {
                facturaId: factura.id,
                numeroFactura: factura.numeroFactura,
                cliente: factura.pedido.cliente
                    ?.razonSocial,
                valorFactura: factura.valor,
                totalPagado,
                saldoPendiente,
                estadoPago: factura.estadoPago,
                fechaVencimiento: factura.fechaVencimiento,
                diasVencidos: diasVencidos > 0
                    ? diasVencidos
                    : 0,
            };
        });
    }
};
exports.CarteraService = CarteraService;
exports.CarteraService = CarteraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CarteraService);
//# sourceMappingURL=cartera.service.js.map