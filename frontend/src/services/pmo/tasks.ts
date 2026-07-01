import { normalizeTask, toBackendTaskEstado } from '@/src/lib/pmo';

const API = process.env.NEXT_PUBLIC_API_URL;

const BACKEND_TASK_TIPOS = ['PROCEDIMIENTO', 'INSTRUCTIVO', 'MANUAL', 'FORMATO', 'MATRIZ', 'ACTIVIDAD', 'OTRO'] as const;

type BackendTaskTipo = (typeof BACKEND_TASK_TIPOS)[number];

function toBackendTaskTipo(value: unknown): BackendTaskTipo | undefined {
  if (!value) return undefined;
  const normalized = String(value).toUpperCase();
  if (BACKEND_TASK_TIPOS.includes(normalized as BackendTaskTipo)) {
    return normalized as BackendTaskTipo;
  }
  return 'ACTIVIDAD';
}

function buildPayload(data: unknown) {
  if (!data || typeof data !== 'object') return data;

  const payload = { ...(data as Record<string, unknown>) };

  const estadoValue = payload.estado;
  if (typeof estadoValue === 'string') {
    payload.estado = toBackendTaskEstado(estadoValue);
  }

  const tipoValue = payload.tipo;
  if (tipoValue !== undefined) {
    payload.tipo = toBackendTaskTipo(tipoValue);
  }

  if (payload.fechaInicio instanceof Date) {
    payload.fechaInicio = payload.fechaInicio.toISOString();
  }
  if (payload.fechaFin instanceof Date) {
    payload.fechaFin = payload.fechaFin.toISOString();
  }
  if (payload.fechaLimite instanceof Date) {
    payload.fechaLimite = payload.fechaLimite.toISOString();
  }

  return payload;
}

export async function getTasks() {
  if (!API) {
    console.warn('NEXT_PUBLIC_API_URL is not set; getTasks will return []');
    return [];
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API}/pmo/tasks`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('getTasks non-ok response', res.status);
      return [];
    }

    const data = await res.json();
    return (data ?? []).map((task: unknown) => normalizeTask(task));
  } catch (err) {
    console.error('getTasks fetch failed', err);
    return [];
  }
}

export async function createTask(data: unknown) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/pmo/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildPayload(data)),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;

    try {
      const body = JSON.parse(text);
      message = body.message || body.error || text;
    } catch {
      message = text;
    }

    throw new Error(message || `Error creando tarea (${res.status})`);
  }

  return normalizeTask(await res.json());
}

export async function deleteTask(id: string) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/pmo/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Error eliminando tarea');
  }

  return true;
}

export async function updateTask(id: string, data: unknown) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API}/pmo/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildPayload(data)),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;

    try {
      const body = JSON.parse(text);
      message = body.message || body.error || body?.error?.message || text;
    } catch {
      message = text;
    }

    throw new Error(message || `Error actualizando tarea (${res.status})`);
  }

  return normalizeTask(await res.json());
}

