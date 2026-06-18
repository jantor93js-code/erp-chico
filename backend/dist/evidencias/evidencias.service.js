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
exports.EvidenciasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvidenciasService = class EvidenciasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        return this.prisma.evidenciaServicio.create({
            data: dto,
        });
    }
    async findAll() {
        return this.prisma.evidenciaServicio.findMany({
            include: {
                servicio: {
                    include: {
                        pedido: {
                            include: {
                                cliente: true,
                                cotizacion: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findByPedido(pedidoId) {
        return this.prisma.evidenciaServicio.findMany({
            where: {
                pedidoId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.EvidenciasService = EvidenciasService;
exports.EvidenciasService = EvidenciasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvidenciasService);
//# sourceMappingURL=evidencias.service.js.map