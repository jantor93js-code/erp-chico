import { api } from '@/lib/axios';

interface DocumentStatus {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  color?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateDocumentStatusDto {
  nombre: string;
  codigo: string;
  descripcion?: string;
  color?: string;
  activo?: boolean;
}

interface UpdateDocumentStatusDto {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  color?: string;
  activo?: boolean;
}

export const documentStatusesService = {
  async getAll(skip?: number, take?: number) {
    const response = await api.get('/configuration/document-statuses', {
      params: { skip, take },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/configuration/document-statuses/${id}`);
    return response.data;
  },

  async search(query: string) {
    const response = await api.get('/configuration/document-statuses/search', {
      params: { q: query },
    });
    return response.data;
  },

  async getAllActive() {
    const response = await api.get('/configuration/document-statuses/all/active');
    return response.data;
  },

  async create(data: CreateDocumentStatusDto) {
    const response = await api.post('/configuration/document-statuses', data);
    return response.data;
  },

  async update(id: string, data: UpdateDocumentStatusDto) {
    const response = await api.patch(`/configuration/document-statuses/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/configuration/document-statuses/${id}`);
    return response.data;
  },
};
