"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";
import PageHeader from "@/src/components/pmo/PageHeader";

import { getClients } from "@/src/services/pmo/clients";
import { getProjects } from "@/src/services/pmo/projects";
import { getTasks } from "@/src/services/pmo/tasks";
import { getTaskSummary } from "@/src/lib/pmo";

export default function KpisPage() {

  const [clients, setClients] =
    useState<any[]>([]);

  const [projects, setProjects] =
    useState<any[]>([]);

  const [tasks, setTasks] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {
      const results = await Promise.allSettled([
        getClients(),
        getProjects(),
        getTasks(),
      ]);

      const [clientsRes, projectsRes, tasksRes] = results;

      if (clientsRes.status === 'fulfilled') setClients(clientsRes.value);
      else {
        console.error('getClients failed:', (clientsRes as any).reason);
        setClients([]);
      }

      if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value);
      else {
        console.error('getProjects failed:', (projectsRes as any).reason);
        setProjects([]);
      }

      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value);
      else {
        console.error('getTasks failed:', (tasksRes as any).reason);
        setTasks([]);
      }

    } catch (error) {
      console.error('Unexpected loadData error', error);
      setClients([]);
      setProjects([]);
      setTasks([]);
    }
  }
  const summary = getTaskSummary(tasks);
  const pendientes = summary.pendientes;
  const enCurso = summary.enCurso;
  const atrasadas = summary.atrasadas;
  const finalizadas = summary.finalizadas;

  const cumplimiento =
    tasks.length
      ? Math.round(
          (finalizadas * 100) /
          tasks.length
        )
      : 0;

  const responsables =
    Object.entries(

      tasks.reduce(
        (acc: any, task: any) => {

          const email =
            task.responsable?.email ||
            "Sin responsable";

          acc[email] =
            (acc[email] || 0) + 1;

          return acc;

        },
        {}
      )

    );

  const proyectos =
    [...projects]
      .sort(
        (a, b) =>
          (b.tasks?.length || 0) -
          (a.tasks?.length || 0)
      );
        return (
    <PmoShell>

      <PageHeader
        section="PMO · KPIs"
        title="Indicadores de Desempeño"
        description="Indicadores ejecutivos del portafolio de transformación."
      />

      <div className="space-y-6 px-8 py-6">

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">

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
            label="Tareas"
            value={String(tasks.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Pendientes"
            value={String(pendientes)}
            accent="amber"
          />

          <ExecutiveCard
            label="En Curso"
            value={String(enCurso)}
            accent="green"
          />

          <ExecutiveCard
            label="Finalizadas"
            value={String(finalizadas)}
            accent="green"
          />

          <ExecutiveCard
            label="Atrasadas"
            value={String(atrasadas)}
            accent="red"
          />

        </div>

        <ExecutiveCard
          label="Cumplimiento General"
          value={`${cumplimiento}%`}
          accent={
            cumplimiento >= 80
              ? "green"
              : cumplimiento >= 50
              ? "gold"
              : "red"
          }
        />

        <div className="grid gap-6 xl:grid-cols-2">

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #D6D3D1",
            }}
          >

            <div
              className="px-6 py-4"
              style={{
                borderBottom:
                  "1px solid #E5E7EB",
              }}
            >
              <h2 className="font-semibold">
                Carga por Responsable
              </h2>
            </div>

            <table className="w-full">

              <thead>

                <tr>

                  <th className="px-6 py-3 text-left">
                    Responsable
                  </th>

                  <th className="px-6 py-3 text-left">
                    Tareas
                  </th>

                </tr>

              </thead>

              <tbody>

                {responsables.map(
                  ([email, total]: any) => (

                    <tr
                      key={email}
                      style={{
                        borderTop:
                          "1px solid #E5E7EB",
                      }}
                    >

                      <td className="px-6 py-4">
                        {email}
                      </td>

                      <td className="px-6 py-4">
                        {total}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #D6D3D1",
            }}
          >

            <div
              className="px-6 py-4"
              style={{
                borderBottom:
                  "1px solid #E5E7EB",
              }}
            >
              <h2 className="font-semibold">
                Proyectos con más tareas
              </h2>
            </div>

            <table className="w-full">

              <thead>

                <tr>

                  <th className="px-6 py-3 text-left">
                    Proyecto
                  </th>

                  <th className="px-6 py-3 text-left">
                    Tareas
                  </th>

                </tr>

              </thead>

              <tbody>

                {proyectos.map(
                  (project: any) => (

                    <tr
                      key={project.id}
                      style={{
                        borderTop:
                          "1px solid #E5E7EB",
                      }}
                    >

                      <td className="px-6 py-4">
                        {project.nombre}
                      </td>

                      <td className="px-6 py-4">
                        {
                          project.tasks
                            ?.length || 0
                        }
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </PmoShell>
  );
}