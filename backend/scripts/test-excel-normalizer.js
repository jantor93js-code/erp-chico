"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const promises_1 = require("fs/promises");
const excel_reader_service_1 = require("../src/modules/pmo/import/services/excel-reader.service");
const excel_normalizer_service_1 = require("../src/modules/pmo/import/services/excel-normalizer.service");
async function main() {
    const inputPath = (0, path_1.resolve)(__dirname, '..', '..', 'pipeline', 'inputs', 'Listado_Maestro_2026__3_.xlsx');
    const outputPath = (0, path_1.resolve)(__dirname, '..', 'tmp', 'normalized-contract.json');
    const reader = new excel_reader_service_1.ExcelReaderService();
    const normalizer = new excel_normalizer_service_1.ExcelNormalizerService();
    try {
        const excelResult = await reader.read(inputPath);
        const expected = [
            'codigoDocumento',
            'nombreDocumento',
            'tipoDocumento',
            'area',
            'proceso',
            'version',
            'estado',
            'responsableActualizacion',
            'responsableRevision',
            'observaciones',
            'fechaCreacion',
            'fechaRevision',
        ];
        function normalizeKeyForCompare(raw) {
            return String(raw || '')
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/[^\p{L}\p{N} ]+/gu, '')
                .toLowerCase()
                .replace(/\s+/g, '')
                .normalize('NFD')
                .replace(/\p{M}/gu, '');
        }
        for (const sheet of excelResult.sheets) {
            const keys = new Set();
            for (const row of sheet.rows) {
                Object.keys(row || {}).forEach(k => keys.add(String(k)));
            }
            const detected = Array.from(keys);
            console.log(`Hoja: ${sheet.name}`);
            console.log('Columnas:', detected.join('|'));
            const detectedNormalized = detected.map(k => normalizeKeyForCompare(k));
            const expectedNormalized = expected.map(k => normalizeKeyForCompare(k));
            const present = expected.filter((e, i) => detectedNormalized.includes(expectedNormalized[i]));
            const missing = expected.filter((e, i) => !detectedNormalized.includes(expectedNormalized[i]));
            console.log('Esperadas (presentes):', present.join(',') || '<ninguna>');
            console.log('Esperadas (faltantes):', missing.join(',') || '<ninguna>');
            console.log('---');
        }
        const normalized = normalizer.normalize(excelResult);
        await (0, promises_1.mkdir)((0, path_1.resolve)(__dirname, '..', 'tmp'), { recursive: true });
        await (0, promises_1.writeFile)(outputPath, JSON.stringify(normalized, null, 2), 'utf8');
        const raw = await Promise.resolve(`${outputPath}`).then(s => require(s));
        const contract = raw.default || raw;
        const sheetCount = excelResult.sheets.length;
        const documentCount = (contract.documentos || []).length;
        const uniqueAreas = new Set(contract.catalogos.areas || []).size;
        const uniqueProcesos = new Set(contract.catalogos.procesos || []).size;
        const uniqueTipos = new Set(contract.catalogos.tiposDocumentales || []).size;
        const filasDescartadas = (contract.metadata && contract.metadata.filasDescartadas) || 0;
        const docs = contract.documentos || [];
        const checks = {
            codigoDocumento: docs.every(d => !!d.codigoDocumento),
            nombreDocumento: docs.every(d => !!d.nombreDocumento),
            tipoDocumento: docs.every(d => !!d.tipoDocumento),
            area: docs.every(d => !!d.area),
            proceso: docs.every(d => !!d.proceso),
            version: docs.every(d => !!d.version),
            estado: docs.every(d => !!d.estado),
            responsableActualizacion: docs.every(d => !!d.responsableActualizacion),
            responsableRevision: docs.every(d => !!d.responsableRevision),
            fechaCreacion: docs.every(d => d.fechaCreacion !== undefined && d.fechaCreacion !== null),
            fechaRevision: docs.every(d => d.fechaRevision !== undefined && d.fechaRevision !== null),
        };
        console.log(`Hojas leídas: ${sheetCount}`);
        console.log(`Documentos generados: ${documentCount}`);
        console.log(`Áreas: ${uniqueAreas}`);
        console.log(`Procesos: ${uniqueProcesos}`);
        console.log(`Tipos documentales: ${uniqueTipos}`);
        console.log(`Filas descartadas: ${filasDescartadas}`);
        console.log('Validación:');
        console.log(`${checks.codigoDocumento ? '✓' : '✗'} codigoDocumento`);
        console.log(`${checks.nombreDocumento ? '✓' : '✗'} nombreDocumento`);
        console.log(`${checks.tipoDocumento ? '✓' : '✗'} tipoDocumento`);
        console.log(`${checks.area ? '✓' : '✗'} area`);
        console.log(`${checks.proceso ? '✓' : '✗'} proceso`);
        console.log(`${checks.version ? '✓' : '✗'} version`);
        console.log(`${checks.estado ? '✓' : '✗'} estado`);
        console.log(`${checks.responsableActualizacion ? '✓' : '✗'} responsableActualizacion`);
        console.log(`${checks.responsableRevision ? '✓' : '✗'} responsableRevision`);
        console.log(`${checks.fechaCreacion ? '✓' : '✗'} fechaCreacion`);
        console.log(`${checks.fechaRevision ? '✓' : '✗'} fechaRevision`);
        const ready = documentCount > 0 && checks.codigoDocumento && uniqueTipos === 6 && (docs.filter(d => d.codigoDocumento).length === documentCount);
        console.log(`Contrato listo para importar: ${ready ? 'SÍ' : 'NO'}`);
    }
    catch (error) {
        console.error('Error al normalizar Excel:', error instanceof Error ? error.message : error);
        process.exitCode = 1;
    }
}
main();
//# sourceMappingURL=test-excel-normalizer.js.map