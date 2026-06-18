"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarteraDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_cartera_dto_1 = require("./create-cartera.dto");
class UpdateCarteraDto extends (0, swagger_1.PartialType)(create_cartera_dto_1.CreateCarteraDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCarteraDto = UpdateCarteraDto;
//# sourceMappingURL=update-cartera.dto.js.map