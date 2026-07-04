import { Injectable } from '@nestjs/common';
import { ImportChangeSet } from '../interfaces/change-set.interface';
import { PersistencePlan, PersistenceOperation } from '../interfaces/persistence-plan.interface';

@Injectable()
export class PersistencePlannerService {
  plan(changeSet: ImportChangeSet): PersistencePlan {
    const operations: PersistenceOperation[] = [];

    changeSet.nuevos.forEach(document => {
      operations.push({
        type: 'CREATE_DOCUMENT',
        codigoDocumento: document.codigoDocumento,
        payload: document.contratoDocumento,
      });
    });

    changeSet.actualizados.forEach(document => {
      operations.push({
        type: 'UPDATE_DOCUMENT',
        codigoDocumento: document.codigoDocumento,
        payload: {
          contract: document.contratoDocumento,
          database: document.documentoBD,
          differences: document.differences,
        },
      });
    });

    changeSet.sinCambios.forEach(document => {
      operations.push({
        type: 'SKIP_DOCUMENT',
        codigoDocumento: document.codigoDocumento,
      });
    });

    changeSet.sinCodigo.forEach((document, index) => {
      operations.push({
        type: 'SKIP_DOCUMENT',
        codigoDocumento: `sinCodigo-${index}`,
        payload: document.contratoDocumento,
      });
    });

    return { operations };
  }
}
