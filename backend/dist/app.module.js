"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const vehiculos_module_1 = require("./vehiculos/vehiculos.module");
const pedidos_module_1 = require("./pedidos/pedidos.module");
const clientes_module_1 = require("./clientes/clientes.module");
const servicios_module_1 = require("./servicios/servicios.module");
const conductores_module_1 = require("./conductores/conductores.module");
const facturas_module_1 = require("./facturas/facturas.module");
const pagos_module_1 = require("./pagos/pagos.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const cotizaciones_module_1 = require("./cotizaciones/cotizaciones.module");
const detalle_servicios_module_1 = require("./detalle-servicios/detalle-servicios.module");
const evidencias_module_1 = require("./evidencias/evidencias.module");
const cartera_module_1 = require("./cartera/cartera.module");
const gastos_operativos_module_1 = require("./gastos-operativos/gastos-operativos.module");
const reportes_module_1 = require("./reportes/reportes.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            vehiculos_module_1.VehiculosModule,
            pedidos_module_1.PedidosModule,
            clientes_module_1.ClientesModule,
            servicios_module_1.ServiciosModule,
            conductores_module_1.ConductoresModule,
            facturas_module_1.FacturasModule,
            pagos_module_1.PagosModule,
            dashboard_module_1.DashboardModule,
            cotizaciones_module_1.CotizacionesModule,
            detalle_servicios_module_1.DetalleServiciosModule,
            evidencias_module_1.EvidenciasModule,
            cartera_module_1.CarteraModule,
            gastos_operativos_module_1.GastosOperativosModule,
            reportes_module_1.ReportesModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map