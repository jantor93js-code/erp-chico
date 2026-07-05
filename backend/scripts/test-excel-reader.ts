import { ExcelReaderService } from '../src/modules/pmo/import/services/excel-reader.service';
import { resolve } from 'path';

async function main() {
  const filePath = resolve(__dirname, '..', 'test.xlsx');
  const reader = new ExcelReaderService();

  try {
    const result = await reader.read(filePath);
    console.log(`Found ${result.sheets.length} sheet(s)`);
    for (const sheet of result.sheets) {
      console.log(`Sheet: ${sheet.name} rows=${sheet.rows.length}`);
    }
  } catch (error) {
    console.error('Excel read failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

main();
