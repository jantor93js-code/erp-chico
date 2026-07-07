"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const excel_reader_service_1 = require("../src/modules/pmo/import/services/excel-reader.service");
const path_1 = require("path");
async function main() {
    const filePath = (0, path_1.resolve)(__dirname, '..', 'test.xlsx');
    const reader = new excel_reader_service_1.ExcelReaderService();
    try {
        const result = await reader.read(filePath);
        console.log(`Found ${result.sheets.length} sheet(s)`);
        for (const sheet of result.sheets) {
            console.log(`Sheet: ${sheet.name} rows=${sheet.rows.length}`);
        }
    }
    catch (error) {
        console.error('Excel read failed:', error instanceof Error ? error.message : error);
        process.exitCode = 1;
    }
}
main();
//# sourceMappingURL=test-excel-reader.js.map