"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCotizacioneDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_cotizacione_dto_1 = require("./create-cotizacione.dto");
class UpdateCotizacioneDto extends (0, swagger_1.PartialType)(create_cotizacione_dto_1.CreateCotizacioneDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCotizacioneDto = UpdateCotizacioneDto;
//# sourceMappingURL=update-cotizacione.dto.js.map