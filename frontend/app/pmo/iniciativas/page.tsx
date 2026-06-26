"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import PageHeader from "@/src/components/pmo/PageHeader";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";
import { getUsers } from "@/src/services/pmo/users";

import {
  getInitiatives,
  createInitiative,
  updateInitiative,
  deleteInitiative,
} from "@/src/services/pmo/initiatives";

import {
  getPrograms,
} from "@/src/services/pmo/programs";

interface Initiative {
  id: string;
  nombre: string;
  descripcion?: string;
  responsable?: {
  id: string;
  nombre: string;
  email: string;
};
  estado: string;
  avance: number;
  programa: {
    id: string;
    nombre: string;
  };
}

interface Program {
  id: string;
  nombre: string;
}

interface User {
  id: string;
  nombre: string;
  email: string;
  scope: string;
  roleId: string;

  role?: {
    id: string;
    nombre: string;
    slug: string;
  };
}

export default function InitiativesPage() {

const [users, setUsers] = useState<User[]>([]);

  const [initiatives, setInitiatives] =
    useState<Initiative[]>([]);

  const [programs, setPrograms] =
    useState<Program[]>([]);

  const [loading, setLoading] =
    useState(true);
useEffect(() => {
  loadData();
  loadUsers();
}, []);

  const [showModal, setShowModal] =
  useState(false);

const [editingInitiativeId,
  setEditingInitiativeId] =
  useState<string | null>(null);

const [newInitiative, setNewInitiative] =
  useState({
    programId: "",
    nombre: "",
    descripcion: "",
    responsableId: "",
    avance: 0,
    estado: "ACTIVO",
  });

async function loadUsers() {
  try {
    const data = await getUsers();
    setUsers(data);
  } catch (error) {
    console.error(error);
  }
}

  async function loadData() {

    try {

      const [
        initiativesData,
        programsData,
      ] = await Promise.all([
        getInitiatives(),
        getPrograms(),
      ]);

      setInitiatives(initiativesData);
      setPrograms(programsData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const activos =
    initiatives.filter(
      (i) => i.estado === "ACTIVO"
    ).length;
async function handleSaveInitiative() {

  try {

    if (!newInitiative.programId) {
      alert("Seleccione un programa");
      return;
    }

    if (!newInitiative.nombre.trim()) {
      alert("Ingrese el nombre");
      return;
    }

    if (editingInitiativeId) {

      await updateInitiative(
        editingInitiativeId,
        newInitiative
      );

    } else {

      await createInitiative(
        newInitiative
      );

    }

    setShowModal(false);

    setEditingInitiativeId(null);

    setNewInitiative({
      programId: "",
      nombre: "",
      descripcion: "",
      responsableId: "",
      avance: 0,
      estado: "ACTIVO",
    });

    await loadData();

  } catch (error) {

    console.error(error);

    alert(
      "No fue posible guardar la iniciativa"
    );

  }

}
  return (

    <PmoShell>

      <PageHeader
        section="PMO · Iniciativas"
        title="Iniciativas"
        description="Gestión de Iniciativas"
      />

<div className="px-8 pt-4">

  <button
    onClick={() => {

      setEditingInitiativeId(null);

      setNewInitiative({
        programId: "",
        nombre: "",
        descripcion: "",
        responsableId: "",
        avance: 0,
        estado: "ACTIVO",
      });

      setShowModal(true);

    }}
    className="px-4 py-2 text-sm font-medium"
    style={{
      background:"#C89B2A",
      color:"#FFFFFF",
    }}
  >
    + Nueva Iniciativa
  </button>

</div>

      <div className="space-y-6 px-8 py-6">

        <div className="grid gap-4 sm:grid-cols-3">

          <ExecutiveCard
            label="Iniciativas"
            value={String(initiatives.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Activos"
            value={String(activos)}
            accent="green"
          />

          <ExecutiveCard
            label="Programas"
            value={String(programs.length)}
            accent="red"
          />

        </div>

        <div
          style={{
            background:"#FFFFFF",
            border:"1px solid #D6D3D1",
          }}
          className="p-8"
        >

          {loading ? (
  <div className="p-8">
    Cargando...
  </div>
) : (
  <table className="w-full">
    <thead>
      <tr
        style={{
          borderBottom: "1px solid #D6D3D1",
        }}
      >
        <th className="px-6 py-3 text-left">
          Programa
        </th>

        <th className="px-6 py-3 text-left">
          Iniciativa
        </th>

        <th className="px-6 py-3 text-left">
          Responsable
        </th>

        <th className="px-6 py-3 text-left">
          Avance
        </th>

        <th className="px-6 py-3 text-left">
          Estado
        </th>

        <th className="px-6 py-3 text-left">
          Acciones
        </th>
      </tr>
    </thead>

    <tbody>

      {initiatives.map((initiative) => (

        <tr
          key={initiative.id}
          style={{
            borderBottom:
              "1px solid #E5E7EB",
          }}
        >

          <td className="px-6 py-4">
            {initiative.programa?.nombre}
          </td>

          <td className="px-6 py-4">
            {initiative.nombre}
          </td>

          <td className="px-6 py-4">
            {initiative.responsable?.nombre ?? "-"}
          </td>

          <td className="px-6 py-4">
            {initiative.avance}%
          </td>

          <td className="px-6 py-4">
            {initiative.estado}
          </td>

          <td className="px-6 py-4">

  <div className="flex gap-3">

    <button
      onClick={() => {

        setEditingInitiativeId(
          initiative.id
        );

        setNewInitiative({

          programId:
            initiative.programa?.id || "",

          nombre:
            initiative.nombre || "",

          descripcion:
            initiative.descripcion || "",

          responsableId:
  initiative.responsable?.id || "",

          avance:
            initiative.avance || 0,

          estado:
            initiative.estado || "ACTIVO",

        });

        setShowModal(true);

      }}
    >
      ✏️ Editar
    </button>

    <button
      className="text-red-600"
      onClick={async () => {

        const ok =
          confirm(
            `¿Eliminar la iniciativa "${initiative.nombre}"?`
          );

        if (!ok) return;

        try {

          await deleteInitiative(
            initiative.id
          );

          await loadData();

        } catch (error) {

          console.error(error);

          alert(
            "No fue posible eliminar la iniciativa"
          );

        }

      }}
    >
      🗑️ Eliminar
    </button>

  </div>

</td>

        </tr>

      ))}

    </tbody>

  </table>
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
          editingInitiativeId
            ? "Editar Iniciativa"
            : "Nueva Iniciativa"
        }
      </h2>

      <div className="space-y-4">

        <select
          className="w-full border p-2"
          value={newInitiative.programId}
          onChange={(e) =>
            setNewInitiative({
              ...newInitiative,
              programId: e.target.value,
            })
          }
        >

          <option value="">
            Seleccione un programa
          </option>

          {programs.map((program) => (

            <option
              key={program.id}
              value={program.id}
            >
              {program.nombre}
            </option>

          ))}

        </select>

        <input
          placeholder="Nombre"
          className="w-full border p-2"
          value={newInitiative.nombre}
          onChange={(e) =>
            setNewInitiative({
              ...newInitiative,
              nombre: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Descripción"
          className="w-full border p-2"
          rows={4}
          value={newInitiative.descripcion}
          onChange={(e) =>
            setNewInitiative({
              ...newInitiative,
              descripcion: e.target.value,
            })
          }
        />

       <select
  className="w-full border p-2"
  value={newInitiative.responsableId}
  onChange={(e) =>
    setNewInitiative({
      ...newInitiative,
      responsableId: e.target.value,
    })
  }
>
  <option value="">
    Seleccione responsable
  </option>

  {users.map((user) => (
    <option
      key={user.id}
      value={user.id}
    >
      {user.nombre}
    </option>
  ))}
</select>

        <input
          type="number"
          placeholder="Avance (%)"
          className="w-full border p-2"
          value={newInitiative.avance}
          onChange={(e) =>
            setNewInitiative({
              ...newInitiative,
              avance: Number(e.target.value),
            })
          }
        />

        <select
          className="w-full border p-2"
          value={newInitiative.estado}
          onChange={(e) =>
            setNewInitiative({
              ...newInitiative,
              estado: e.target.value,
            })
          }
        >

          <option value="ACTIVO">
            ACTIVO
          </option>

          <option value="PAUSADO">
            PAUSADO
          </option>

          <option value="FINALIZADO">
            FINALIZADO
          </option>

        </select>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() =>
            setShowModal(false)
          }
        >
          Cancelar
        </button>

        <button
          onClick={handleSaveInitiative}
          style={{
            background: "#C89B2A",
            color: "#FFF",
            padding: "8px 16px",
          }}
        >
          {
            editingInitiativeId
              ? "Actualizar"
              : "Crear"
          }
        </button>

      </div>

    </div>

  </div>

)}
    </PmoShell>

  );

}