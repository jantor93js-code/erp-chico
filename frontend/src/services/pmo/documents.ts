import { apiDelete, apiGet, apiPatch, apiPost, apiPostForm } from '@/src/lib/api';

type DocumentPayload = {
  nombre: string;
  codigo?: string;
  codigoDependencia?: string;
  descripcion?: string;
  tipoId?: string;
  procesoId?: string;
  areaId?: string;
  version?: string;
  responsableActualizacion?: string;
  responsableRevision?: string;
  estado?: string;
  estadoDocumentalId?: string;
  estadoDocumental?: string;
  vigencia?: string;
  fechaCreacion?: string;
  fechaRevision?: string;
  observaciones?: string;
  enlace?: string;
  fuente?: string;
  activo?: boolean;
};

export async function getDocuments(query?: Record<string, string>) {
  const queryString = query
    ? `?${new URLSearchParams(query).toString()}`
    : '';
  return apiGet(`/pmo/documents${queryString}`);
}

export async function getDocumentsDashboard() {
  return apiGet('/pmo/documents/dashboard');
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

export async function importDocuments(records: unknown[] | File) {
  if (records instanceof File) {
    const formData = new FormData();
    formData.append('file', records, records.name);
    return apiPostForm('/pmo/documents/import', formData);
  }

  return apiPost('/pmo/documents/import', records);
}
