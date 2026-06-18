"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGastosOperativoDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_gastos_operativo_dto_1 = require("./create-gastos-operativo.dto");
class UpdateGastosOperativoDto extends (0, swagger_1.PartialType)(create_gastos_operativo_dto_1.CreateGastosOperativoDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateGastosOperativoDto = UpdateGastosOperativoDto;
//# sourceMappingURL=update-gastos-operativo.dto.js.map