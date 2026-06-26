import { apiDelete, apiGet, apiPatch, apiPost } from '@/src/lib/api';

type DocumentPayload = {
  nombre: string;
  codigo?: string;
  descripcion?: string;
  tipoId?: string;
  procesoId?: string;
  areaId?: string;
  version?: string;
  responsableActualizacion?: string;
  responsableRevision?: string;
  estadoDocumentalId?: string;
  estadoDocumental?: string;
  fechaCreacion?: string;
  fechaRevision?: string;
  observaciones?: string;
  enlace?: string;
  fuente?: string;
  activo?: boolean;
};

export async function getDocuments() {
  return apiGet('/pmo/documents');
}

export async function createDocument(data: DocumentPayload) {
  return apiPost('/pmo/documents', data);
}

export async function updateDocument(id: string, data: Partial<DocumentPayload>) {
  return apiPatch(`/pmo/documents/${id}`, data);
}

export async function deleteDocument(id: string) {
  return apiDelete(`/pmo/documents/${id}`);
}
