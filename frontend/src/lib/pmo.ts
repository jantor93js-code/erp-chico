"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type TaskEstado   = "PENDIENTE" | "EN_CURSO" | "BLOQUEADO" | "FINALIZADO" | "CANCELADO";
export type TaskPrioridad = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

export interface Task {
  id: string;
  codigo: string;
  titulo: string;
  descripcion?: string;
  estado: TaskEstado;
  prioridad: TaskPrioridad;
  fechaLimite?: string;
  responsableId?: string;
  creadorId?: string;
  responsable?: { id: string; email: string };
  creador?: { id: string; email: string };
  comentarios?: TaskComment[];
  createdAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  usuarioId: string;
  comentario: string;
  usuario?: { id: string; email: string };
  createdAt: string;
}

export interface PmoUser {
  id: string;
  email: string;
  role: { id: string; nombre: string; slug: string };
  tenant?: { id: string; nombre: string };
}

// ─── Mapeos de display ───────────────────────────────────────────────────────

export const ESTADO_LABEL: Record<TaskEstado, string> = {
  PENDIENTE:  "Pendiente",
  EN_CURSO:   "En Progreso",
  BLOQUEADO:  "Bloqueada",
  FINALIZADO: "Finalizada",
  CANCELADO:  "Cancelado",
};

export const PRIORIDAD_LABEL: Record<TaskPrioridad, string> = {
  BAJA:   "Baja",
  MEDIA:  "Media",
  ALTA:   "Alta",
  CRITICA:"Crítica",
};

// ─── Hook: Tareas ────────────────────────────────────────────────────────────

export function useTasks() {
  const [tasks, setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet("/pmo/tasks");
      setTasks(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create(dto: Omit<Task, "id" | "createdAt" | "comentarios">) {
    await apiPost("/pmo/tasks", dto);
    await load();
  }

  async function update(id: string, dto: Partial<Task>) {
    await apiPatch(`/pmo/tasks/${id}`, dto);
    await load();
  }

  async function remove(id: string) {
    await apiDelete(`/pmo/tasks/${id}`);
    await load();
  }

  return { tasks, loading, error, reload: load, create, update, remove };
}

// ─── Hook: Comentarios ───────────────────────────────────────────────────────

export function useComments(taskId: string) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const data = await apiGet(`/pmo/tasks/${taskId}/comments`);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { load(); }, [load]);

  async function addComment(comentario: string) {
    await apiPost(`/pmo/tasks/${taskId}/comments`, { taskId, comentario });
    await load();
  }

  return { comments, loading, addComment, reload: load };
}

// ─── Hook: Usuarios ──────────────────────────────────────────────────────────

export function usePmoUsers() {
  const [users, setUsers]     = useState<PmoUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/users")
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}

// ─── Hook: Dashboard stats desde tareas reales ───────────────────────────────

export function useDashboardStats() {
  const { tasks, loading } = useTasks();

  const stats = {
    tareasAbiertas:  tasks.filter(t => t.estado !== "FINALIZADO" && t.estado !== "CANCELADO").length,
    tareasPendientes:tasks.filter(t => t.estado === "PENDIENTE").length,
    tareasEnCurso:   tasks.filter(t => t.estado === "EN_CURSO").length,
    tareasBloqueadas:tasks.filter(t => t.estado === "BLOQUEADO").length,
    tareasFinalizadas:tasks.filter(t => t.estado === "FINALIZADO").length,
    avanceTareas: tasks.length > 0
      ? Math.round((tasks.filter(t => t.estado === "FINALIZADO").length / tasks.length) * 100)
      : 0,
  };

  return { stats, loading };
}
