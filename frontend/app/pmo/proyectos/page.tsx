"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import StatusBadge from "@/src/components/pmo/StatusBadge";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";
import PageHeader from "@/src/components/pmo/PageHeader";
import { useRouter } from "next/navigation";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/src/services/pmo/projects";

interface Project {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: string;
  avance: number;
  fechaInicio?: string;
  fechaFin?: string;

  tasks?: {
    id: string;
    estado: string;
  }[];

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
    responsable?: {
      id: string;
      nombre: string;
      email?: string;
    };
  };
}


function barColor(pct: number) {
  if (pct >= 75) return "#15803D";
  if (pct >= 50) return "#C89B2A";
  if (pct >= 30) return "#D97706";
  return "#B91C1C";
}

const TH = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "#9CA3AF",
};

export default function ProyectosPage() {

  const [projects, setProjects] =
    useState<Project[]>([]);

    const [clients, setClients] =
  useState<any[]>([]);

  const [programs, setPrograms] =
  useState<any[]>([]);

  const [initiatives, setInitiatives] =
  useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

const [showModal, setShowModal] =
  useState(false);

const [editingProjectId,
  setEditingProjectId] =
  useState<string | null>(null);

const [newProject, setNewProject] =
  useState({
    nombre: "",
    descripcion: "",
    initiativeId: "",
    programId: "",
    clientId: "",
  });

  useEffect(() => {
  loadProjects();
  loadClients();
  loadPrograms();
  loadInitiatives();
}, []);

async function loadProjects() {
  try {

    const data =
      await getProjects();

    console.log(
      "PROJECTS:",
      data
    );

    setProjects(data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function loadClients() {
  try {
    const { getClients } =
      await import(
        "@/src/services/pmo/clients"
      );
    const data =
      await getClients();
    setClients(data);
  } catch (error) {
    console.error(error);
  }
}

async function loadPrograms() {
  try {
    const { getPrograms } =
      await import(
        "@/src/services/pmo/programs"
      );
    const data =
      await getPrograms();
    setPrograms(data);
  } catch (error) {
    console.error(error);
  }
}

async function loadInitiatives() {
  try {
    const { getInitiatives } =
      await import(
        "@/src/services/pmo/initiatives"
      );
    const data =
      await getInitiatives();
    setInitiatives(data);
  } catch (error) {
    console.error(error);
  }
}

  const activos =
    projects.filter(
      p => p.estado === "ACTIVO"
    ).length;

  const filteredPrograms =
    programs.filter(
      (program) =>
        program.clientId === newProject.clientId
    );

  const filteredInitiatives =
    initiatives.filter(
      (initiative) =>
        initiative.programId === newProject.programId
    );

async function handleCreateProject() {
  try {

    if (editingProjectId) {
      await updateProject(
        editingProjectId,
        {
          nombre: newProject.nombre,
          descripcion: newProject.descripcion,
          initiativeId: newProject.initiativeId,
        }
      );
    } else {
      await createProject({
        nombre: newProject.nombre,
        descripcion: newProject.descripcion,
        initiativeId: newProject.initiativeId,
      });
    }

    setShowModal(false);

    setEditingProjectId(null);

    setNewProject({
      nombre: "",
      descripcion: "",
      clientId: "",
      programId: "",
      initiativeId: "",
    });

    loadProjects();

  } catch (error) {
    console.error(error);
  }
}
  return (
    <PmoShell>

      <PageHeader
        section="PMO · Proyectos"
        title="Proyectos"
        description="Proyectos asociados a iniciativas"
      />
<div className="px-8 pt-4">
  <button
  onClick={() => setShowModal(true)}
  className="px-4 py-2 text-sm font-medium"
  style={{
    background: "#C89B2A",
    color: "#FFFFFF",
  }}
>
  + Nuevo Proyecto
</button>
</div>
      <div className="space-y-6 px-8 py-6">

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <ExecutiveCard
            label="Total proyectos"
            value={String(projects.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Activos"
            value={String(activos)}
            accent="green"
          />

          <ExecutiveCard
            label="Inactivos"
            value={String(projects.length - activos)}
            accent="red"
          />

          <ExecutiveCard
            label="Avance promedio"
            value={
              `${projects.length
                ? Math.round(
                    projects.reduce(
                      (a, b) => a + b.avance,
                      0
                    ) / projects.length
                  )
                : 0}%`
            }
            accent="gold"
          />

        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #D6D3D1",
          }}
        >

          {loading ? (
            <div className="p-8">
              Cargando...
            </div>
          ) : (

            <div className="overflow-x-auto">

              <table
                className="w-full text-sm"
                style={{ minWidth: "700px" }}
              >

                <thead>
                  <tr
                    style={{
                      borderBottom:
                        "1px solid #D6D3D1",
                    }}
                  >
                    {

[
  "Cliente",
  "Programa",
  "Iniciativa",
  "Proyecto",
  "Estado",
  "Avance",
  "Responsable",
  "Tareas",
  "Acciones",
]

                       .map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left"
                        style={TH}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>



  {projects.map((p, i) => {

  const totalTasks =
    p.tasks?.length || 0;

  const completedTasks =
    p.tasks?.filter(
      (t) =>
        t.estado === "FINALIZADO"
    ).length || 0;

  const avanceCalculado =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks * 100) /
          totalTasks
        );

  return (

    <tr
      key={p.id}
      style={{
        borderBottom:
          "1px solid #E5E7EB",
        background:
          i % 2 === 0
            ? "#FFFFFF"
            : "#FAFAF9",
      }}
    >

      <td className="px-6 py-3.5">
        {p.iniciativa?.programa?.cliente?.nombre || "-"}
      </td>

      <td className="px-6 py-3.5">
        {p.iniciativa?.programa?.nombre || "-"}
      </td>

      <td className="px-6 py-3.5">
        {p.iniciativa?.nombre || "-"}
      </td>

      <td className="px-6 py-3.5 font-semibold">
        <button
          onClick={() =>
            window.location.href =
              `/pmo/tareas?projectId=${p.id}`
          }
          className="text-left hover:underline"
        >
          {p.nombre}
        </button>
      </td>

      <td className="px-6 py-3.5">
        <StatusBadge status={p.estado} />
      </td>

      <td className="px-6 py-3.5">
        {avanceCalculado}%
      </td>

      <td className="px-6 py-3.5">
        {p.iniciativa?.responsable?.nombre || "-"}
      </td>

      <td className="px-6 py-3.5">
        {totalTasks}
      </td>

      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="h-1.5 w-24 overflow-hidden"
            style={{ background: "#E5E7EB" }}
          >
            <div
              className="h-full"
              style={{
                width: `${avanceCalculado}%`,
                background: barColor(avanceCalculado),
              }}
            />
          </div>
          <span>{avanceCalculado}%</span>
        </div>
      </td>

      <td className="px-6 py-3.5">
        <div className="flex items-center gap-4">

          <button
            onClick={() => {
              setEditingProjectId(p.id);
              setNewProject({
                nombre: p.nombre || "",
                descripcion: p.descripcion || "",
                clientId:
                  p.iniciativa?.programa?.cliente?.id || "",
                programId:
                  p.iniciativa?.programa?.id || "",
                initiativeId:
                  p.iniciativa?.id || "",
              });
              setShowModal(true);
            }}
          >
            ✏️ Editar
          </button>

          <button
            onClick={async () => {

              const ok =
                confirm(
                  `¿Eliminar proyecto "${p.nombre}"?`
                );

              if (!ok) return;

              try {

                await deleteProject(
                  p.id
                );

                loadProjects();

              } catch (error) {

                console.error(error);

                alert(
                  "No fue posible eliminar el proyecto"
                );

              }

            }}
          >
            🗑️ Eliminar
          </button>

          <button
            onClick={() =>
              window.location.href =
                `/pmo/tareas?projectId=${p.id}`
            }
          >
            📋 Tareas
          </button>

        </div>

      </td>

    </tr>

  );

})}

</tbody>

              </table>

            </div>

          )}

        </div>

      </div>
{showModal && (
  <div
    className="fixed inset-0 flex items-center justify-center"
    style={{
      background: "rgba(0,0,0,0.45)",
    }}
  >
    <div
      className="w-full max-w-lg p-6"
      style={{
        background: "#FFFFFF",
      }}
    >
      <h2 className="mb-4 text-lg font-semibold">
  {
    editingProjectId
      ? "Editar Proyecto"
      : "Nuevo Proyecto"
  }
</h2>

      <div className="space-y-4">

        <input
          placeholder="Nombre"
          className="w-full border p-2"
          value={newProject.nombre}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              nombre: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Descripción"
          className="w-full border p-2"
          value={newProject.descripcion}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              descripcion: e.target.value,
            })
          }
        />

        <select
          className="w-full border p-2"
          value={newProject.clientId}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              clientId: e.target.value,
              programId: "",
              initiativeId: "",
            })
          }
        >
          <option value="">
            Seleccione cliente
          </option>

          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
            >
              {client.nombre}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2"
          value={newProject.programId}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              programId: e.target.value,
              initiativeId: "",
            })
          }
          disabled={!newProject.clientId}
        >
          <option value="">
            Seleccione programa
          </option>

          {filteredPrograms.map((program) => (
            <option
              key={program.id}
              value={program.id}
            >
              {program.nombre}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2"
          value={newProject.initiativeId}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              initiativeId: e.target.value,
            })
          }
          disabled={!newProject.programId}
        >
          <option value="">
            Seleccione iniciativa
          </option>

          {filteredInitiatives.map((initiative) => (
            <option
              key={initiative.id}
              value={initiative.id}
            >
              {initiative.nombre}
            </option>
          ))}
        </select>

      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border"
        >
          Cancelar
        </button>

        <button
          onClick={handleCreateProject}
          className="px-4 py-2 text-white"
          style={{ background: "#15803D" }}
        >
          {editingProjectId ? "Actualizar" : "Crear"}
        </button>
      </div>
    </div>
  </div>
)}
    </PmoShell>
  );
}