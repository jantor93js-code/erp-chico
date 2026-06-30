"use client";

import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type TaskUiEstado = "PENDIENTE" | "EN_CURSO" | "ATRASADO" | "FINALIZADO" | "CANCELADO";
export type TaskBackendEstado = "PENDIENTE" | "EN_CURSO" | "BLOQUEADO" | "FINALIZADO" | "CANCELADO";
export type TaskEstado = TaskUiEstado;
export type TaskPrioridad = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

export interface Task {
  id: string;
  codigo?: string;
  titulo: string;
  descripcion?: string;
  estado: TaskEstado;
  prioridad: TaskPrioridad;
  fechaInicio?: string;
  fechaFin?: string;
  fechaLimite?: string;
  responsableId?: string;
  creadorId?: string;
  responsable?: { id: string; email: string; nombre?: string };
  proyecto?: {
    id: string;
    nombre: string;
    iniciativa?: {
      id: string;
      nombre: string;
      programa?: {
        id: string;
        nombre: string;
        cliente?: {
          id: string;
          nombre: string;
        };
      };
    };
  };
  creador?: { id: string; email: string };
  comentarios?: TaskComment[];
  createdAt?: string;
  updatedAt?: string;
  avance?: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  usuarioId: string;
  comentario: string;
  usuario?: { id: string; email: string; nombre?: string };
  createdAt: string;
}

export interface PmoUser {
  id: string;
  email: string;
  role: { id: string; nombre: string; slug: string };
  tenant?: { id: string; nombre: string };
}

// ─── Normalización de estados ──────────────────────────────────────────────

export function normalizeTaskEstado(value?: string | null): TaskEstado {
  switch (String(value ?? "").toUpperCase()) {
    case "ATRASADO":
    case "ATRASADA":
    case "BLOQUEADO":
    case "BLOQUEADA":
      return "ATRASADO";
    case "FINALIZADO":
    case "COMPLETADO":
      return "FINALIZADO";
    case "EN_CURSO":
    case "EN PROGRESO":
      return "EN_CURSO";
    case "CANCELADO":
      return "CANCELADO";
    default:
      return "PENDIENTE";
  }
}

export function toBackendTaskEstado(value?: string | null): TaskBackendEstado {
  const normalized = normalizeTaskEstado(value);
  switch (normalized) {
    case "ATRASADO":
      return "BLOQUEADO";
    case "FINALIZADO":
      return "FINALIZADO";
    case "EN_CURSO":
      return "EN_CURSO";
    case "CANCELADO":
      return "CANCELADO";
    default:
      return "PENDIENTE";
  }
}

export function normalizeTask(task: any): Task {
  return {
    ...task,
    estado: normalizeTaskEstado(task?.estado),
    prioridad: task?.prioridad ?? "MEDIA",
    fechaInicio: task?.fechaInicio ?? task?.fecha_creacion ?? task?.createdAt,
    fechaFin: task?.fechaFin ?? task?.fechaLimite,
    fechaLimite: task?.fechaLimite ?? task?.fechaFin,
    avance: task?.avance ?? (normalizeTaskEstado(task?.estado) === "FINALIZADO" ? 100 : normalizeTaskEstado(task?.estado) === "EN_CURSO" ? 50 : 0),
    proyecto: task?.proyecto,
  } as Task;
}

export function getTaskStatusMeta(status?: string | null) {
  const normalized = normalizeTaskEstado(status);
  switch (normalized) {
    case "EN_CURSO":
      return { label: "En curso", accent: "green" as const };
    case "ATRASADO":
      return { label: "Atrasada", accent: "red" as const };
    case "FINALIZADO":
      return { label: "Finalizada", accent: "green" as const };
    case "CANCELADO":
      return { label: "Cancelada", accent: "gray" as const };
    default:
      return { label: "Pendiente", accent: "amber" as const };
  }
}

export function getTaskSummary(tasks: Array<Task | any>) {
  const normalized = tasks.map((task) => normalizeTask(task));
  const pendientes = normalized.filter((task) => task.estado === "PENDIENTE").length;
  const enCurso = normalized.filter((task) => task.estado === "EN_CURSO").length;
  const atrasadas = normalized.filter((task) => task.estado === "ATRASADO").length;
  const finalizadas = normalized.filter((task) => task.estado === "FINALIZADO").length;
  const avance = normalized.length > 0 ? Math.round((finalizadas / normalized.length) * 100) : 0;

  return { total: normalized.length, pendientes, enCurso, atrasadas, finalizadas, avance };
}

export function getTaskStatusColumns(tasks: Array<Task | any>) {
  const normalized = tasks.map((task) => normalizeTask(task));
  return [
    { id: "PENDIENTE", label: "Pendiente", accentBg: "#F5F3EF", accentText: "#6B7280", accentBorder: "#D6D3D1", dot: "#9CA3AF", tasks: normalized.filter((task) => task.estado === "PENDIENTE") },
    { id: "EN_CURSO", label: "En curso", accentBg: "#FEF3C7", accentText: "#92400E", accentBorder: "#FDE68A", dot: "#C89B2A", tasks: normalized.filter((task) => task.estado === "EN_CURSO") },
    { id: "ATRASADO", label: "Atrasada", accentBg: "#FEE2E2", accentText: "#991B1B", accentBorder: "#FECACA", dot: "#B91C1C", tasks: normalized.filter((task) => task.estado === "ATRASADO") },
    { id: "FINALIZADO", label: "Finalizada", accentBg: "#DCFCE7", accentText: "#15803D", accentBorder: "#BBF7D0", dot: "#16A34A", tasks: normalized.filter((task) => task.estado === "FINALIZADO") },
  ];
}

export const ESTADO_LABEL: Record<TaskEstado, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  ATRASADO: "Atrasada",
  FINALIZADO: "Finalizada",
  CANCELADO: "Cancelada",
};

export const PRIORIDAD_LABEL: Record<TaskPrioridad, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

// ─── Hook: Tareas ────────────────────────────────────────────────────────────

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet("/pmo/tasks");
      setTasks((data ?? []).map((task: any) => normalizeTask(task)));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create(dto: Omit<Task, "id" | "createdAt" | "comentarios">) {
    await apiPost("/pmo/tasks", { ...dto, estado: toBackendTaskEstado(dto.estado) });
    await load();
  }

  async function update(id: string, dto: Partial<Task>) {
    await apiPatch(`/pmo/tasks/${id}`, { ...dto, estado: dto.estado ? toBackendTaskEstado(dto.estado) : dto.estado });
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
  const [loading, setLoading] = useState(true);

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
  const [users, setUsers] = useState<PmoUser[]>([]);
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
    tareasAbiertas: tasks.filter((task) => task.estado !== "FINALIZADO" && task.estado !== "CANCELADO").length,
    tareasPendientes: tasks.filter((task) => task.estado === "PENDIENTE").length,
    tareasEnCurso: tasks.filter((task) => task.estado === "EN_CURSO").length,
    tareasAtrasadas: tasks.filter((task) => task.estado === "ATRASADO").length,
    tareasFinalizadas: tasks.filter((task) => task.estado === "FINALIZADO").length,
    avanceTareas: tasks.length > 0 ? Math.round((tasks.filter((task) => task.estado === "FINALIZADO").length / tasks.length) * 100) : 0,
  };

  return { stats, loading };
}
