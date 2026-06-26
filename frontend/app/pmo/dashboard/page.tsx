"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";
import PageHeader from "@/src/components/pmo/PageHeader";
import StatusBadge from "@/src/components/pmo/StatusBadge";
import { getUsers } from "@/src/services/pmo/users";
import { getClients } from "@/src/services/pmo/clients";
import { getProjects } from "@/src/services/pmo/projects";
import { getTasks } from "@/src/services/pmo/tasks";
import { getDocuments } from "@/src/services/pmo/documents";

export default function DashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [clientsData, projectsData, tasksData, usersData, documentsData] = await Promise.all([
        getClients(),
        getProjects(),
        getTasks(),
        getUsers(),
        getDocuments(),
      ]);

      setUsers(usersData);
      setClients(clientsData);
      setProjects(projectsData);
      setTasks(tasksData);
      setDocuments(documentsData);
    } catch (error) {
      console.error(error);
    }
  }

  const pendientes = tasks.filter((t) => t.estado === "PENDIENTE").length;
  const enCurso = tasks.filter((t) => t.estado === "EN_CURSO").length;
  const bloqueadas = tasks.filter((t) => t.estado === "BLOQUEADO").length;
  const finalizadas = tasks.filter((t) => t.estado === "FINALIZADO").length;
  const proyectosActivos = projects.filter((p) => p.estado === "ACTIVO").length;
  const documentosTotales = documents.length;
  const documentosActivos = documents.filter((d) => d.activo || d.estado === "ACTIVO").length;
  const documentosPorTipo = documents.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const latestTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <PmoShell>

      <PageHeader
        section="PMO"
        title="Dashboard Ejecutivo"
        description="Vista general del portafolio"
      />

      <div className="space-y-6 px-8 py-6">

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <ExecutiveCard
            label="Clientes"
            value={String(clients.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Proyectos"
            value={String(projects.length)}
            accent="green"
          />

          <ExecutiveCard
            label="Documentos"
            value={String(documentosTotales)}
            accent="gold"
          />

          <ExecutiveCard
            label="Usuarios PMO"
            value={String(users.length)}
            accent="green"
          />

        </div>

        <div className="grid gap-4 xl:grid-cols-[1.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="pmo-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Ritmo de ejecución</p>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">Visión rápida del portafolio y los frentes críticos.</p>
                </div>
                <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#92400E]">Activo</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#F8FAFC] p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]">Pendientes</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0F172A]">{pendientes}</p>
                </div>
                <div className="rounded-3xl bg-[#F8FAFC] p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]">En curso</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0F172A]">{enCurso}</p>
                </div>
                <div className="rounded-3xl bg-[#F8FAFC] p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]">Bloqueadas</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0F172A]">{bloqueadas}</p>
                </div>
                <div className="rounded-3xl bg-[#F8FAFC] p-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9CA3AF]">Finalizadas</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0F172A]">{finalizadas}</p>
                </div>
              </div>
            </div>

            <div className="pmo-card p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Últimas tareas</p>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">Tareas recién creadas o actualizadas en el portafolio.</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Top 5</span>
              </div>

              <div className="space-y-3">
                {latestTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0F172A]">{task.titulo}</p>
                      {task.responsable?.nombre && (
                        <p className="mt-1 text-xs text-[#6B7280]">Responsable: {task.responsable.nombre}</p>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <StatusBadge status={task.estado} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="pmo-card p-6">
              <p className="text-sm font-semibold text-[#0F172A]">Cartera y datos</p>
              <div className="mt-5 space-y-4 text-sm text-[#6B7280]">
                <div className="rounded-3xl bg-[#F8FAFC] p-4">
                  <p className="font-semibold text-[#0F172A]">Proyectos activos</p>
                  <p className="mt-1 text-3xl font-semibold">{proyectosActivos}</p>
                </div>
                <div className="rounded-3xl bg-[#F8FAFC] p-4">
                  <p className="font-semibold text-[#0F172A]">Clientes en portafolio</p>
                  <p className="mt-1 text-3xl font-semibold">{clients.length}</p>
                </div>
              </div>
            </div>

            <div className="pmo-card p-6">
              <p className="text-sm font-semibold text-[#0F172A]">Actividad reciente</p>
              <div className="mt-4 rounded-3xl bg-[#F8FAFC] p-4 text-sm text-[#6B7280]">
                <p className="font-medium text-[#0F172A]">Sincronicemos el equipo</p>
                <p className="mt-2 leading-6">Revise el estado de tareas y cierre brechas antes de la próxima revisión ejecutiva.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </PmoShell>
  );
}