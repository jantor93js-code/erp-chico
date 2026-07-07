"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const synchronization_engine_service_1 = require("../src/modules/pmo/import/services/synchronization-engine.service");
async function main() {
    const defaultPath = (0, path_1.resolve)(__dirname, '..', '..', 'pipeline', 'json-pmo.json');
    const inputPath = process.argv[2] || defaultPath;
    const resolvedPath = (0, path_1.resolve)(inputPath);
    try {
        const content = (0, fs_1.readFileSync)(resolvedPath, 'utf-8');
        const engine = new synchronization_engine_service_1.SynchronizationEngineService(new (require('../src/modules/pmo/import/services/contract-reader.service').ContractReaderService)(), new (require('../src/modules/pmo/import/services/contract-validator.service').ContractValidatorService)(), new (require('../src/modules/pmo/import/services/statistics-builder.service').StatisticsBuilderService)(), new (require('../src/modules/pmo/import/services/preview-builder.service').PreviewBuilderService)());
        const preview = await engine.preview(content);
        console.log('====================================');
        console.log('IMPORT PREVIEW');
        console.log('====================================');
        console.log('Metadata:');
        console.log(JSON.stringify(preview.metadata ?? {}, null, 2));
        console.log('------------------------------------');
        console.log('Summary:');
        console.log(JSON.stringify(preview.summary, null, 2));
        console.log('------------------------------------');
        console.log('Statistics:');
        console.log(JSON.stringify(preview.statistics, null, 2));
        console.log('------------------------------------');
        console.log('Warnings:');
        console.log(JSON.stringify(preview.warnings, null, 2));
        console.log('------------------------------------');
        console.log('Errors:');
        console.log(JSON.stringify(preview.errors, null, 2));
        console.log('------------------------------------');
        console.log('Executive Summary:');
        console.log(preview.resumenEjecutivo);
        console.log('====================================');
        if (preview.errors.length > 0) {
            console.log('El contrato es inválido. Corrige los errores estructurales antes de continuar.');
            process.exitCode = 1;
        }
    }
    catch (error) {
        console.error('Error al ejecutar el Preview:', error instanceof Error ? error.message : error);
        process.exitCode = 1;
    }
}
main();
//# sourceMappingURL=run-preview-example.js.map