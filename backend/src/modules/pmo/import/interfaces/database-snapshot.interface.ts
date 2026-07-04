import { Area, Document, DocumentStatusRef, DocumentTypeRef, Process, User } from '@prisma/client';

export interface DatabaseSnapshot {
  documentos: Document[];
  areas: Area[];
  procesos: Process[];
  estados: DocumentStatusRef[];
  responsables: User[];
  tiposDocumentales: DocumentTypeRef[];
  codigosArea: Array<{ id: string; codigo: string }>;
}
