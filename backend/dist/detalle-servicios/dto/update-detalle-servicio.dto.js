"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDetalleServicioDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_detalle_servicio_dto_1 = require("./create-detalle-servicio.dto");
class UpdateDetalleServicioDto extends (0, swagger_1.PartialType)(create_detalle_servicio_dto_1.CreateDetalleServicioDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateDetalleServicioDto = UpdateDetalleServicioDto;
//# sourceMappingURL=update-detalle-servicio.dto.js.map