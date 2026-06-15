"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturasModule = void 0;
const common_1 = require("@nestjs/common");
const facturas_service_1 = require("./facturas.service");
const facturas_controller_1 = require("./facturas.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let FacturasModule = class FacturasModule {
};
exports.FacturasModule = FacturasModule;
exports.FacturasModule = FacturasModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [facturas_service_1.FacturasService],
        controllers: [facturas_controller_1.FacturasController],
    })
], FacturasModule);
//# sourceMappingURL=facturas.module.js.map