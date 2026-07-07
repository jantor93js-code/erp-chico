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

    const headerKeywords = [
      'codigo',
      'codigo manual',
      'codigo area',
      'codigo contrato',
      'documento',
      'nombre del documento',
      'area',
      'area / cargo',
      'cargo',
      'proceso',
      'proceso asociado',
      'version',
      'versión',
      'estado',
      'estado del documento',
      'tipo de documento',
      'fecha de creacion',
      'fecha creacion',
    ];

    const exclusionTokens = ['listado maestro', 'version', 'una vez aprobado', 'instrucciones'];

    const sheets: ExcelSheet[] = workbook.SheetNames.map(name => {
      const worksheet = workbook.Sheets[name];

      // Read raw rows as arrays so we can detect header row dynamically
      const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

      // find header row index
      let headerIndex = -1;
      for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i] || [];
        let matches = 0;
        let nonEmpty = 0;
        let exclusionMatches = 0;
        for (const cell of row) {
          if (cell == null) continue;
          const text = String(cell).trim();
          if (text === '') continue;
          nonEmpty++;
          const normalized = text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

          for (const kw of headerKeywords) {
            if (normalized.includes(kw)) {
              matches++;
              break;
            }
          }

          for (const ex of exclusionTokens) {
            if (normalized.includes(ex)) {
              exclusionMatches++;
              break;
            }
          }
        }

        // Accept header only if at least 3 header keywords match
        if (matches >= 3) {
          headerIndex = i;
          break;
        }

        // If the row only contains exclusion tokens (like "Listado Maestro", "Version"), skip it
        if (nonEmpty > 0 && exclusionMatches === nonEmpty) {
          continue;
        }
        // otherwise keep searching
      }

      let headers: string[] = [];
      let rows: Record<string, unknown>[] = [];

      if (headerIndex >= 0) {
        const headerRow = rawRows[headerIndex] || [];
        headers = headerRow.map(h => (h == null ? '' : String(h).trim()));

        // Map subsequent rows to objects using detected headers
        for (let r = headerIndex + 1; r < rawRows.length; r++) {
          const rowArr = rawRows[r] || [];
          const obj: Record<string, unknown> = {};
          let nonEmpty = false;
          for (let c = 0; c < headers.length; c++) {
            const key = headers[c] || `col_${c}`;
            const val = c < rowArr.length ? rowArr[c] : null;
            obj[key] = val === undefined ? null : val;
            if (val != null && String(val).trim() !== '') nonEmpty = true;
          }
          if (nonEmpty) rows.push(obj);
        }

        console.log(`Hoja: ${name} Header detectado: fila ${headerIndex + 1} Columnas:${headers.join('|')}`);
      } else {
        // fallback to previous behavior
        const objs = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: null });
        rows = objs;
        // try to extract headers from the first object keys for logging
        const first = objs[0] || {};
        const detected = Object.keys(first);
        console.log(`Hoja: ${name} Header detectado: fila 1 (fallback) Columnas:${detected.join('|')}`);
      }

      return { name, rows };
    });

    return { sheets };
  }
}
