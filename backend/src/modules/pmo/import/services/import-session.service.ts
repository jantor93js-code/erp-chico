import { Injectable } from '@nestjs/common';
import { ImportSession, ImportSessionState } from '../interfaces/import-session.interface';

function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Injectable()
export class ImportSessionService {
  create(tenantId: string, usuario: string, archivoOrigen: string, totalOperaciones: number): ImportSession {
    return {
      id: generateUuidV4(),
      tenantId,
      usuario,
      fechaInicio: new Date().toISOString(),
      estado: 'CREATED',
      archivoOrigen,
      totalOperaciones,
      operacionesEjecutadas: 0,
      errores: [],
      warnings: [],
    };
  }

  start(session: ImportSession): ImportSession {
    return {
      ...session,
      estado: 'RUNNING',
    };
  }

  complete(session: ImportSession): ImportSession {
    return {
      ...session,
      estado: 'COMPLETED',
    };
  }

  fail(session: ImportSession, errores: string[], warnings: string[] = []): ImportSession {
    return {
      ...session,
      estado: 'FAILED',
      errores,
      warnings,
    };
  }
}
