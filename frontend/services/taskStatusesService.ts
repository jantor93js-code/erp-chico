import { api } from '@/lib/axios';

interface TaskStatus {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskStatusDto {
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo?: boolean;
}

interface UpdateTaskStatusDto {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  activo?: boolean;
}

export const taskStatusesService = {
  async getAll(skip?: number, take?: number) {
    const response = await api.get('/configuration/task-statuses', {
      params: { skip, take },
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/configuration/task-statuses/${id}`);
    return response.data;
  },

  async search(query: string) {
    const response = await api.get('/configuration/task-statuses/search', {
      params: { q: query },
    });
    return response.data;
  },

  async getAllActive() {
    const response = await api.get('/configuration/task-statuses/all/active');
    return response.data;
  },

  async create(data: CreateTaskStatusDto) {
    const response = await api.post('/configuration/task-statuses', data);
    return response.data;
  },

  async update(id: string, data: UpdateTaskStatusDto) {
    const response = await api.patch(`/configuration/task-statuses/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/configuration/task-statuses/${id}`);
    return response.data;
  },
};
