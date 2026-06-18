"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEvidenciaDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_evidencia_dto_1 = require("./create-evidencia.dto");
class UpdateEvidenciaDto extends (0, swagger_1.PartialType)(create_evidencia_dto_1.CreateEvidenciaDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateEvidenciaDto = UpdateEvidenciaDto;
//# sourceMappingURL=update-evidencia.dto.js.map