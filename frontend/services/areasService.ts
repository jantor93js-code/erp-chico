import { api } from '@/lib/axios';

interface Area {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  responsableId?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateAreaDto {
  nombre: string;
  codigo: string;
  descripcion?: string;
  responsableId?: string;
}

interface UpdateAreaDto {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  responsableId?: string;
}

export const areasService = {
  async getAll(skip?: number, take?: number) {
    const response = await api.get('/configuration/areas', {
      params: { skip, take },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/configuration/areas/${id}`);
    return response.data;
  },

  async search(query: string) {
    const response = await api.get('/configuration/areas/search', {
      params: { q: query },
    });
    return response.data;
  },

  async create(data: CreateAreaDto) {
    const response = await api.post('/configuration/areas', data);
    return response.data;
  },

  async update(id: string, data: UpdateAreaDto) {
    const response = await api.patch(`/configuration/areas/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/configuration/areas/${id}`);
    return response.data;
  },
};
