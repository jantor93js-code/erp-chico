import { Injectable } from '@nestjs/common';
import { Document } from '@prisma/client';
import { ContractDocument, PmoImportContract } from '../interfaces/pmo-import-contract.interface';
import { DatabaseSnapshot } from '../interfaces/database-snapshot.interface';
import { ImportChangeSet } from '../interfaces/change-set.interface';
import { DocumentComparerService } from './document-comparer.service';

@Injectable()
export class ChangeSetBuilderService {
  constructor(private readonly documentComparer: DocumentComparerService) {}

  build(contract: PmoImportContract, snapshot: DatabaseSnapshot): ImportChangeSet {
    const codigoToDocumento = new Map<string, Document>();
    snapshot.documentos.forEach(doc => {
      if (doc.codigo) {
        codigoToDocumento.set(doc.codigo, doc);
      }
    });

    const nuevos: Array<{ codigoDocumento: string; contratoDocumento: ContractDocument }> = [];
    const sinCambios: Array<{ codigoDocumento: string; contratoDocumento: ContractDocument; documentoBD: Document }> = [];
    const actualizados: Array<{ codigoDocumento: string; contratoDocumento: ContractDocument; documentoBD: Document; differences: Array<{ field: string; databaseValue: string | null; contractValue: string | null }> }> = [];
    const sinCodigo: Array<{ contratoDocumento: ContractDocument }> = [];

    contract.documentos.forEach(doc => {
      const codigoDocumento = typeof doc.codigoDocumento === 'string' ? doc.codigoDocumento.trim() : '';
      if (!codigoDocumento) {
        sinCodigo.push({ contratoDocumento: doc });
        return;
      }

      const documentoBD = codigoToDocumento.get(codigoDocumento);
      if (!documentoBD) {
        nuevos.push({ codigoDocumento, contratoDocumento: doc });
        return;
      }

      const differences = this.documentComparer.compare(doc, documentoBD);
      if (differences.length === 0) {
        sinCambios.push({ codigoDocumento, contratoDocumento: doc, documentoBD });
      } else {
        actualizados.push({ codigoDocumento, contratoDocumento: doc, documentoBD, differences });
      }
    });

    return {
      nuevos,
      sinCambios,
      actualizados,
      sinCodigo,
      resumen: {
        totalContrato: contract.documentos.length,
        totalBD: snapshot.documentos.length,
        totalNuevos: nuevos.length,
        totalSinCambios: sinCambios.length,
        totalActualizados: actualizados.length,
        totalSinCodigo: sinCodigo.length,
      },
    };
  }
}
