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
exports.PedidosController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const asignar_vehiculo_dto_1 = require("./dto/asignar-vehiculo.dto");
const asignar_conductor_dto_1 = require("./dto/asignar-conductor.dto");
const programar_servicios_dto_1 = require("./dto/programar-servicios.dto");
const pedidos_service_1 = require("./pedidos.service");
const create_pedido_dto_1 = require("./dto/create-pedido.dto");
let PedidosController = class PedidosController {
    constructor(pedidosService) {
        this.pedidosService = pedidosService;
    }
    create(dto) {
        return this.pedidosService.create(dto);
    }
    findAll() {
        return this.pedidosService.findAll();
    }
    findDisponibles() {
        return this.pedidosService.findDisponibles();
    }
    asignarVehiculo(id, body) {
        return this.pedidosService.asignarVehiculo(id, body.vehiculoId);
    }
    asignarConductor(id, body) {
        return this.pedidosService.asignarConductor(id, body.conductorId);
    }
    programar(id, body) {
        return this.pedidosService.programar(id, new Date(body.fechaProgramada));
    }
    marcarEnRuta(id) {
        return this.pedidosService.marcarEnRuta(id);
    }
    marcarEnEjecucion(id) {
        return this.pedidosService.marcarEnEjecucion(id);
    }
    finalizar(id) {
        return this.pedidosService.finalizar(id);
    }
};
exports.PedidosController = PedidosController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pedido_dto_1.CreatePedidoDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('disponibles'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "findDisponibles", null);
__decorate([
    (0, common_1.Patch)(':id/asignar-vehiculo'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, asignar_vehiculo_dto_1.AsignarVehiculoDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "asignarVehiculo", null);
__decorate([
    (0, common_1.Patch)(':id/asignar-conductor'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, asignar_conductor_dto_1.AsignarConductorDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "asignarConductor", null);
__decorate([
    (0, common_1.Patch)(':id/programar'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, programar_servicios_dto_1.ProgramarPedidoDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "programar", null);
__decorate([
    (0, common_1.Patch)(':id/en-ruta'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "marcarEnRuta", null);
__decorate([
    (0, common_1.Patch)(':id/en-ejecucion'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "marcarEnEjecucion", null);
__decorate([
    (0, common_1.Patch)(':id/finalizar'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "finalizar", null);
exports.PedidosController = PedidosController = __decorate([
    (0, common_1.Controller)('pedidos'),
    __metadata("design:paramtypes", [pedidos_service_1.PedidosService])
], PedidosController);
//# sourceMappingURL=pedidos.controller.js.map