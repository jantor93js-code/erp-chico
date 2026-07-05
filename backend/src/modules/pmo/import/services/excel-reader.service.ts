import { Injectable, BadRequestException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as XLSX from 'xlsx';

export interface ExcelSheet {
  name: string;
  rows: Record<string, unknown>[];
}

export interface ExcelReadResult {
  sheets: ExcelSheet[];
}

@Injectable()
export class ExcelReaderService {
  async read(filePath: string): Promise<ExcelReadResult> {
    if (!filePath || typeof filePath !== 'string') {
      throw new BadRequestException('File path is required');
    }

    const fileBuffer = await readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const sheets: ExcelSheet[] = workbook.SheetNames.map(name => {
      const worksheet = workbook.Sheets[name];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: null });
      return { name, rows };
    });

    return { sheets };
  }
}
