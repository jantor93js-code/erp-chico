"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServicioDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateServicioDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { tenantId: { required: true, type: () => String }, pedidoId: { required: true, type: () => String }, vehiculoId: { required: false, type: () => String }, origen: { required: true, type: () => String }, destino: { required: true, type: () => String }, fechaProgramada: { required: true, type: () => Date } };
    }
}
exports.CreateServicioDto = CreateServicioDto;
//# sourceMappingURL=srcserviciosdtocreate-servicio.dto.js.map