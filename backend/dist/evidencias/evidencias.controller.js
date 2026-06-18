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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenciasController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const evidencias_service_1 = require("./evidencias.service");
const create_evidencia_dto_1 = require("./dto/create-evidencia.dto");
let EvidenciasController = class EvidenciasController {
    constructor(evidenciasService) {
        this.evidenciasService = evidenciasService;
    }
    create(dto) {
        return this.evidenciasService.create(dto);
    }
    findAll() {
        return this.evidenciasService.findAll();
    }
    findByPedido(pedidoId) {
        return this.evidenciasService.findByPedido(pedidoId);
    }
};
exports.EvidenciasController = EvidenciasController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_evidencia_dto_1.CreateEvidenciaDto]),
    __metadata("design:returntype", void 0)
], EvidenciasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvidenciasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pedido/:pedidoId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('pedidoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EvidenciasController.prototype, "findByPedido", null);
exports.EvidenciasController = EvidenciasController = __decorate([
    (0, common_1.Controller)('evidencias'),
    __metadata("design:paramtypes", [evidencias_service_1.EvidenciasService])
], EvidenciasController);
//# sourceMappingURL=evidencias.controller.js.map