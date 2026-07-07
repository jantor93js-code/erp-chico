import { Injectable } from '@nestjs/common';
import { ExcelReadResult } from './excel-reader.service';

export interface ExcelNormalizedDocument {
  codigoDocumento?: string;
  nombreDocumento?: string;
  tipoDocumento?: string;
  area?: string;
  proceso?: string;
  version?: string;
  estado?: string;
  responsableActualizacion?: string;
  responsableRevision?: string;
  observaciones?: string;
  fechaCreacion?: string;
  fechaRevision?: string;
  hojaOrigen?: string;
  filaOrigen?: number;
}

export interface ExcelNormalizedContract {
  metadata: {
    fechaGeneracion: string;
    origen: 'EXCEL';
    versionNormalizador: '1.0';
    versionTransformador: '1.0.0';
  };
  catalogos: {
    areas: string[];
    procesos: string[];
    responsables: string[];
    responsablesActualizacion: string[];
    responsablesRevision: string[];
    codigosArea: string[];
    tiposDocumentales: string[];
    estados: string[];
  };
  documentos: ExcelNormalizedDocument[];
}

const SHEET_TYPE_MAP: Array<[RegExp, string]> = [
  [/^manual/i, 'MANUAL'],
  [/^proceso/i, 'PROCESO'],
  [/^proced/i, 'PROCEDIMIENTO'],
  [/^instruct/i, 'INSTRUCTIVO'],
  [/^format/i, 'FORMATO'],
  [/^pol[ií]tic/i, 'POLITICA'],
];

@Injectable()
export class ExcelNormalizerService {
  normalize(input: ExcelReadResult): ExcelNormalizedContract {
    const contract: ExcelNormalizedContract = {
      metadata: {
        fechaGeneracion: new Date().toISOString(),
        origen: 'EXCEL',
        versionNormalizador: '1.0',
        versionTransformador: '1.0.0',
      },
      catalogos: {
        areas: [],
        procesos: [],
        responsables: [],
        responsablesActualizacion: [],
        responsablesRevision: [],
        codigosArea: [],
        tiposDocumentales: [],
        estados: [],
      },
      documentos: [],
    };

    const areaSet = new Set<string>();
    const procesoSet = new Set<string>();
    const responsablesSet = new Set<string>();
    const responsablesActualizacionSet = new Set<string>();
    const responsablesRevisionSet = new Set<string>();
    const codigoAreaSet = new Set<string>();
    const tipoDocumentoSet = new Set<string>();
    const estadoSet = new Set<string>();
    let totalFilasLeidas = 0;
    let filasConCodigo = 0;
    let filasDescartadas = 0;

    // fixed canonical tipos mapping
    const CANONICAL_TYPES = {
      MANUAL: 'MANUAL',
      PROCESO: 'PROCESO',
      PROCEDIMIENTO: 'PROCEDIMIENTO',
      INSTRUCTIVO: 'INSTRUCTIVO',
      FORMATO: 'FORMATO',
      POLITICA: 'POLITICA',
    };

    for (const sheet of input.sheets) {
      // determine canonical tipo from sheet name
      const detected = this.detectTipoDocumento(sheet.name);
      const tipoDocumentoPorHoja = this.mapToCanonicalTipo(detected);
      const sheetCodeUsage = new Map<string, number>();

      for (const row of sheet.rows) {
        if (this.isRowEmpty(row)) {
          continue;
        }

        totalFilasLeidas++;

        const documento = this.buildDocumento(row, sheet.name, totalFilasLeidas);
        documento.codigoDocumento = this.resolveCodigoDocumento(documento.codigoDocumento, sheet.name, sheetCodeUsage);
        // Only import rows that have codigoDocumento
        if (!documento.codigoDocumento) {
          filasDescartadas++;
          continue;
        }

        filasConCodigo++;

        documento.tipoDocumento = this.resolveTipoDocumento(documento, sheet.name, tipoDocumentoPorHoja);

        if (documento.area) {
          areaSet.add(documento.area);
        }
        if (documento.proceso) {
          procesoSet.add(documento.proceso);
        }
        if (documento.estado) {
          estadoSet.add(documento.estado);
        }
        if (documento.tipoDocumento) {
          tipoDocumentoSet.add(documento.tipoDocumento);
        }
        if (documento.responsableActualizacion) {
          responsablesSet.add(documento.responsableActualizacion);
          responsablesActualizacionSet.add(documento.responsableActualizacion);
        }
        if (documento.responsableRevision) {
          responsablesSet.add(documento.responsableRevision);
          responsablesRevisionSet.add(documento.responsableRevision);
        }

        const codigoArea = this.extractCodigoArea(row);
        if (codigoArea) {
          codigoAreaSet.add(codigoArea);
        }

        contract.documentos.push(documento);
      }
    }

    // Ensure all canonical tipos appear in catalog, even if no docs
    const canonicalOrder = [
      CANONICAL_TYPES.MANUAL,
      CANONICAL_TYPES.PROCESO,
      CANONICAL_TYPES.PROCEDIMIENTO,
      CANONICAL_TYPES.INSTRUCTIVO,
      CANONICAL_TYPES.FORMATO,
      CANONICAL_TYPES.POLITICA,
    ];
    canonicalOrder.forEach(t => tipoDocumentoSet.add(t));

    contract.catalogos.areas = Array.from(areaSet);
    contract.catalogos.procesos = Array.from(procesoSet);
    // normalize double spaces and ensure canonical ordering
    const tiposArr = Array.from(tipoDocumentoSet).map(t => String(t).replace(/\s{2,}/g, ' ').trim());
    // prefer canonical order
    const orderedTipos = ['MANUAL', 'PROCESO', 'PROCEDIMIENTO', 'INSTRUCTIVO', 'FORMATO', 'POLITICA'];
    contract.catalogos.tiposDocumentales = orderedTipos.filter(t => tiposArr.includes(t)).length === orderedTipos.length ? orderedTipos : tiposArr;
    contract.catalogos.estados = Array.from(estadoSet);
    contract.catalogos.responsables = Array.from(responsablesSet);
    contract.catalogos.responsablesActualizacion = Array.from(responsablesActualizacionSet).sort((a, b) => a.localeCompare(b));
    contract.catalogos.responsablesRevision = Array.from(responsablesRevisionSet).sort((a, b) => a.localeCompare(b));
    contract.catalogos.codigosArea = Array.from(codigoAreaSet).sort((a, b) => a.localeCompare(b));

    // attach stats to metadata
    (contract.metadata as any).totalFilasLeidas = totalFilasLeidas;
    (contract.metadata as any).filasDescartadas = filasDescartadas;

    return contract;
  }

  private detectTipoDocumento(sheetName: string): string {
    const normalized = String(sheetName || '').trim();
    // remove leading numeric prefixes and separators, e.g. "2 Procesos" -> "Procesos"
    const cleaned = normalized.replace(/^[\s\d\W_]+/, '').trim();
    for (const [pattern, value] of SHEET_TYPE_MAP) {
      if (pattern.test(cleaned) || pattern.test(normalized)) {
        return value;
      }
    }
    return cleaned.toUpperCase() || normalized.toUpperCase();
  }

  private mapToCanonicalTipo(detected: string): string {
    const d = String(detected || '').toLowerCase();
    if (d.includes('manual')) return 'MANUAL';
    if (d.includes('proceso')) return 'PROCESO';
    if (d.includes('proced')) return 'PROCEDIMIENTO';
    if (d.includes('instruct')) return 'INSTRUCTIVO';
    if (d.includes('for') || d.includes('mz') || d.includes('form')) return 'FORMATO';
    if (d.includes('polit')) return 'POLITICA';
    // default: return uppercase cleaned detected
    return String(detected || '').toUpperCase();
  }

  private buildDocumento(row: Record<string, unknown>, hojaOrigen: string, filaOrigen: number): ExcelNormalizedDocument {
    const document: ExcelNormalizedDocument = {
      hojaOrigen,
      filaOrigen,
    };

    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = this.normalizeHeader(key);
      let normalizedValue = this.normalizeValue(value);
      if (!normalizedKey) continue;
      if (normalizedValue == null) continue;
      // try to fix mojibake only when it looks suspicious
      normalizedValue = this.fixEncodingIfNeeded(normalizedValue);

      // compact key (remove spaces) and strip diacritics to match variants like "Código Documento" -> "codigodocumento"
      const compact = normalizedKey.replace(/\s+/g, '');
      const keyId = compact.normalize('NFD').replace(/\p{M}/gu, '');

      switch (keyId) {
        // Código manual / contrato codigo
        case 'codigodocumento':
        case 'codigomanual':
        case 'codigocontrato':
        case 'codigo':
          document.codigoDocumento = this.normalizeCodigo(normalizedValue);
          break;
        case 'nombredocumento':
        case 'nombredeldocumento':
        case 'nombredoc':
        case 'nombre':
        case 'documento':
          document.nombreDocumento = normalizedValue;
          break;
        case 'tipodocumento':
        case 'tipo':
          document.tipoDocumento = normalizedValue;
          break;
        case 'area':
        case 'areacargo':
          document.area = normalizedValue;
          break;
        case 'proceso':
        case 'procesoasociado':
          document.proceso = normalizedValue;
          break;
        case 'version':
          document.version = normalizedValue;
          break;
        case 'estado':
        case 'estadodeldocumento':
          document.estado = normalizedValue;
          break;
        case 'responsableactualizacion':
        case 'responsabledeactualizacion':
        case 'encargado1':
        case 'encargado':
        case 'responsable':
        case 'responsable1':
          document.responsableActualizacion = normalizedValue;
          break;
        case 'responsablerevision':
        case 'responsablerevisionaprobacion':
        case 'responsablederevision':
        case 'responsablerevison':
          document.responsableRevision = normalizedValue;
          break;
        case 'observaciones':
          document.observaciones = normalizedValue;
          break;
        case 'fechacreacion':
        case 'fechadecreacion':
        case 'fechaultimaactualizacion':
          document.fechaCreacion = this.parseExcelDate(normalizedValue);
          break;
        case 'fecharevision':
        case 'fechaderevision':
        case 'fechaproximarevision':
        case 'fechaproximarevision':
          document.fechaRevision = this.parseExcelDate(normalizedValue);
          break;
        default:
          break;
      }
    }

    document.codigoDocumento ??= undefined;
    document.nombreDocumento ??= 'SIN_NOMBRE';
    document.tipoDocumento ??= 'SIN_TIPO';
    document.area ??= 'SIN_AREA';
    document.proceso ??= 'SIN_PROCESO';
    document.version ??= 'SIN_VERSION';
    document.estado ??= 'SIN_ESTADO';
    document.responsableActualizacion ??= 'SIN_RESPONSABLE_ACTUALIZACION';
    document.responsableRevision ??= 'SIN_RESPONSABLE_REVISION';
    document.observaciones ??= 'SIN_OBSERVACIONES';
    document.fechaCreacion ??= '';
    document.fechaRevision ??= '';

    return document;
  }

  private normalizeHeader(header: string): string {
    return String(header || '')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\p{L}\p{N} ]+/gu, '')
      .toLowerCase();
  }

  private resolveTipoDocumento(documento: ExcelNormalizedDocument, sheetName: string, tipoDocumentoPorHoja: string): string {
    if (!this.isProcesosSheet(sheetName)) {
      return tipoDocumentoPorHoja;
    }

    const tipoDesdeTexto = this.inferTipoDocumentoPorTexto(documento.nombreDocumento);
    return tipoDesdeTexto ?? tipoDocumentoPorHoja;
  }

  private inferTipoDocumentoPorTexto(texto?: string): string | undefined {
    const normalized = String(texto || '')
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase();

    if (/\bprocedimiento\b/.test(normalized)) {
      return 'PROCEDIMIENTO';
    }

    if (/\bproceso\b/.test(normalized)) {
      return 'PROCESO';
    }

    return undefined;
  }

  private resolveCodigoDocumento(codigoDocumento: string | undefined, sheetName: string, sheetCodeUsage: Map<string, number>): string | undefined {
    if (!codigoDocumento || !this.isProcesosSheet(sheetName)) {
      return codigoDocumento;
    }

    const baseCode = this.normalizeCodigo(codigoDocumento);
    const occurrence = (sheetCodeUsage.get(baseCode) ?? 0) + 1;
    sheetCodeUsage.set(baseCode, occurrence);

    if (occurrence <= 1) {
      return baseCode;
    }

    return `${baseCode}-${occurrence}`;
  }

  private isProcesosSheet(sheetName: string): boolean {
    const normalized = String(sheetName || '').trim().toLowerCase();
    const cleaned = normalized.replace(/^[\s\d\W_]+/, '').trim();
    return /procesos?/.test(cleaned) && !/procedimiento/.test(cleaned);
  }

  private extractCodigoArea(row: Record<string, unknown>): string | undefined {
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = this.normalizeHeader(key);
      if (!normalizedKey) continue;
      const compact = normalizedKey.replace(/\s+/g, '').normalize('NFD').replace(/\p{M}/gu, '');
      if (compact === 'codigoarea') {
        return this.normalizeValue(value);
      }
    }
    return undefined;
  }

  private normalizeValue(value: unknown): string | undefined {
    if (value == null) {
      return undefined;
    }

    const text = String(value).trim();
    return text === '' ? undefined : text;
  }

  private fixEncodingIfNeeded(s: string): string {
    // if string contains known mojibake markers, attempt latin1->utf8 fix
    if (/Ã|Â/.test(s)) {
      try {
        return Buffer.from(s, 'latin1').toString('utf8');
      } catch (_e) {
        return s;
      }
    }
    return s;
  }

  private normalizeCodigo(s: string): string {
    if (!s) return s;
    // replace various dash-like unicode characters with ASCII hyphen
    const replaced = s.replace(/[‐–—−‒‑]/g, '-');
    // remove non-ascii control characters
    return replaced.normalize('NFKD').replace(/[^ -]/g, '');
  }

  private parseExcelDate(val: string): string | undefined {
    if (!val) return undefined;
    const n = Number(val);
    if (!isNaN(n)) {
      // Excel serial to JS date
      // Excel incorrectly treats 1900 as leap year; adjust for serial >= 61
      const serial = Math.floor(n);
      const offset = serial > 60 ? serial - 1 : serial;
      const epoch = Date.UTC(1899, 11, 31); // 1899-12-31
      const date = new Date(epoch + offset * 24 * 60 * 60 * 1000);
      return date.toISOString();
    }
    // try ISO parse
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d.toISOString();
    return undefined;
  }

  private isRowEmpty(row: Record<string, unknown>): boolean {
    return Object.values(row).every(value => {
      const normalized = this.normalizeValue(value);
      return normalized === undefined;
    });
  }
}
