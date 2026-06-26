import { api } from '@/lib/axios';

interface DocumentType {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateDocumentTypeDto {
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo?: boolean;
}

interface UpdateDocumentTypeDto {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
}

export const documentTypesService = {
  async getAll(skip?: number, take?: number) {
    const response = await api.get('/configuration/document-types', {
      params: { skip, take },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/configuration/document-types/${id}`);
    return response.data;
  },

  async search(query: string) {
    const response = await api.get('/configuration/document-types/search', {
      params: { q: query },
    });
    return response.data;
  },

  async getAllActive() {
    const response = await api.get('/configuration/document-types/all/active');
    return response.data;
  },

  async create(data: CreateDocumentTypeDto) {
    const response = await api.post('/configuration/document-types', data);
    return response.data;
  },

  async update(id: string, data: UpdateDocumentTypeDto) {
    const response = await api.patch(`/configuration/document-types/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/configuration/document-types/${id}`);
    return response.data;
  },
};
