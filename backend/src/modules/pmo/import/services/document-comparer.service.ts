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

    const nombreDocumento = typeof contratoDocumento.nombreDocumento === 'string'
      ? contratoDocumento.nombreDocumento.trim()
      : '';
    const version = typeof contratoDocumento.version === 'string'
      ? contratoDocumento.version.trim()
      : '';

    const bdNombre = typeof documentoBD.nombre === 'string'
      ? documentoBD.nombre.trim()
      : '';
    const bdVersion = typeof documentoBD.version === 'string'
      ? documentoBD.version.trim()
      : '';

    if (nombreDocumento !== bdNombre) {
      differences.push({
        field: 'nombreDocumento',
        databaseValue: bdNombre || null,
        contractValue: nombreDocumento || null,
      });
    }

    if (version !== bdVersion) {
      differences.push({
        field: 'version',
        databaseValue: bdVersion || null,
        contractValue: version || null,
      });
    }

    return differences;
  }
}
