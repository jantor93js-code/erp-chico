import { Injectable } from '@nestjs/common';
import { DifferenceDetail } from '../interfaces/change-set.interface';
import { ContractDocument } from '../interfaces/pmo-import-contract.interface';
import { Document } from '@prisma/client';

@Injectable()
export class DocumentComparerService {
  compare(
    contratoDocumento: ContractDocument,
    documentoBD: Document,
  ): DifferenceDetail[] {
    const differences: DifferenceDetail[] = [];

    const normalize = (v: unknown): string | null => {
      if (v === null || v === undefined) return null;
      if (v instanceof Date) return v.toISOString();
      if (typeof v === 'string') {
        const t = v.trim();
        return t === '' ? null : t;
      }
      try {
        return String(v).trim() || null;
      } catch {
        return null;
      }
    };

    const normalizeEnum = (v: unknown): string | null => {
      const n = normalize(v);
      return n ? n.toUpperCase() : null;
    };

    const parseDate = (v: unknown): string | null => {
      if (v === null || v === undefined) return null;
      if (v instanceof Date) return new Date(v).toISOString();
      if (typeof v === 'string') {
        const t = v.trim();
        if (t === '') return null;
        const d = new Date(t);
        if (Number.isNaN(d.getTime())) return null;
        return d.toISOString();
      }
      return null;
    };

    const compareField = (
      diffs: DifferenceDetail[],
      field: string,
      contractValue: unknown,
      dbValue: unknown,
      options?: { asEnum?: boolean; asDate?: boolean }
    ) => {
      let c: string | null;
      let b: string | null;

      if (options?.asDate) {
        c = parseDate(contractValue);
        b = parseDate(dbValue);
      } else if (options?.asEnum) {
        c = normalizeEnum(contractValue);
        b = normalizeEnum(dbValue);
      } else {
        c = normalize(contractValue);
        b = normalize(dbValue);
      }

      const different = (c === null && b !== null) || (c !== null && b === null) || (c !== null && b !== null && c !== b);

      if (different) {
        diffs.push({
          field,
          databaseValue: b,
          contractValue: c,
        });
      }
    };

    // Map and compare requested fields
    compareField(differences, 'nombreDocumento', contratoDocumento.nombreDocumento, documentoBD.nombre);
    compareField(differences, 'descripcion', contratoDocumento['descripcion'], documentoBD.descripcion);
    compareField(differences, 'tipo', contratoDocumento['tipoDocumento'] ?? contratoDocumento['tipo'], documentoBD.tipo, { asEnum: true });
    compareField(differences, 'estadoDocumental', contratoDocumento.estado ?? contratoDocumento['estadoDocumental'], documentoBD.estadoDocumental);
    compareField(differences, 'area', contratoDocumento.area, documentoBD.area);
    compareField(differences, 'proceso', contratoDocumento.proceso, documentoBD.proceso);
    compareField(differences, 'version', contratoDocumento.version, documentoBD.version);
    compareField(differences, 'responsableActualizacion', contratoDocumento.responsableActualizacion, documentoBD.responsableActualizacion);
    compareField(differences, 'responsableRevision', contratoDocumento.responsableRevision, documentoBD.responsableRevision);
    compareField(differences, 'observaciones', contratoDocumento['observaciones'], documentoBD.observaciones);
    compareField(differences, 'enlace', contratoDocumento['enlace'], documentoBD.enlace);
    compareField(differences, 'fechaCreacion', contratoDocumento['fechaCreacion'], documentoBD.fechaCreacion, { asDate: true });
    compareField(differences, 'fechaRevision', contratoDocumento['fechaRevision'], documentoBD.fechaRevision, { asDate: true });
    compareField(differences, 'codigoDependencia', contratoDocumento['codigoDependencia'], documentoBD.codigoDependencia);

    return differences;
  }
}
