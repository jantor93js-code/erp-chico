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
    console.log('========== CHANGESET ==========');
    console.log('Contrato documentos:', contract.documentos.length);

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
        console.log('NO CHANGE:', codigoDocumento);
        console.log('código', codigoDocumento);
        console.log('nombre', doc.nombreDocumento);
        console.log('resultado del comparador', differences);
        console.log('motivo de la clasificación', 'sin diferencias');
        sinCambios.push({ codigoDocumento, contratoDocumento: doc, documentoBD });
      } else {
        actualizados.push({ codigoDocumento, contratoDocumento: doc, documentoBD, differences });
      }
    });

    const result = {
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

    console.log('RESUMEN CHANGESET');
    console.dir(result.resumen, { depth: null });
    console.log('NUEVOS');
    console.log(result.nuevos.length);
    console.log('ACTUALIZADOS');
    console.log(result.actualizados.length);
    console.log('SIN CAMBIOS');
    console.log(result.sinCambios.length);

    return result;
  }
}
