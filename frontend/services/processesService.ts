import { api } from '@/lib/axios';

interface Process {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  areaId?: string;
  responsableId?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateProcessDto {
  nombre: string;
  codigo: string;
  descripcion?: string;
  areaId?: string;
  responsableId?: string;
}

interface UpdateProcessDto {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  areaId?: string;
  responsableId?: string;
}

export const processesService = {
  async getAll(skip?: number, take?: number) {
    const response = await api.get('/configuration/processes', {
      params: { skip, take },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/configuration/processes/${id}`);
    return response.data;
  },

  async search(query: string) {
    const response = await api.get('/configuration/processes/search', {
      params: { q: query },
    });
    return response.data;
  },

  async getByArea(areaId: string) {
    const response = await api.get(`/configuration/processes/by-area/${areaId}`);
    return response.data;
  },

  async create(data: CreateProcessDto) {
    const response = await api.post('/configuration/processes', data);
    return response.data;
  },

  async update(id: string, data: UpdateProcessDto) {
    const response = await api.patch(`/configuration/processes/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/configuration/processes/${id}`);
    return response.data;
  },
};
