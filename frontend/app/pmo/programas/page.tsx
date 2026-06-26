"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import PageHeader from "@/src/components/pmo/PageHeader";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";

import {
  getPrograms,
} from "@/src/services/pmo/programs";

import {
  getClients,
} from "@/src/services/pmo/clients";

import {
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/src/services/pmo/programs";

interface Program {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: string;
  cliente: {
    id: string;
    nombre: string;
  };
}

interface Client {
  id: string;
  nombre: string;
}

export default function ProgramasPage() {

  const [programs, setPrograms] =
    useState<Program[]>([]);

  const [clients, setClients] =
    useState<Client[]>([]);

  const [loading, setLoading] =
    useState(true);
  useEffect(() => {
    loadData();
  }, []);

  const [showModal, setShowModal] =
  useState(false);

const [editingProgramId,
  setEditingProgramId] =
  useState<string | null>(null);

const [newProgram, setNewProgram] =
  useState({
    clientId: "",
    nombre: "",
    descripcion: "",
    estado: "ACTIVO",
  });

  async function loadData() {

    try {

      const [
        programsData,
        clientsData,
      ] = await Promise.all([
        getPrograms(),
        getClients(),
      ]);

      setPrograms(programsData);
      setClients(clientsData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  const activos =
    programs.filter(
      (p) => p.estado === "ACTIVO"
    ).length;
async function handleSaveProgram() {

  try {

    if (!newProgram.clientId) {
      alert("Seleccione un cliente");
      return;
    }

    if (!newProgram.nombre.trim()) {
      alert("Ingrese el nombre");
      return;
    }

    if (editingProgramId) {

      await updateProgram(
        editingProgramId,
        newProgram
      );

    } else {

      await createProgram(
        newProgram
      );

    }

    setShowModal(false);

    setEditingProgramId(null);

  setNewProgram({
  clientId: "",
  nombre: "",
  descripcion: "",
  estado: "ACTIVO",
});

    await loadData();

  } catch (error) {

    console.error(error);

    alert(
      "No fue posible guardar el programa"
    );

  }

}
  return (

    <PmoShell>

      <PageHeader
        section="PMO · Programas"
        title="Programas"
        description="Gestión de Programas"
      />

<div className="px-8 pt-4">

  <button
    onClick={() => {

      setEditingProgramId(null);

     setNewProgram({
  clientId: "",
  nombre: "",
  descripcion: "",
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
    + Nuevo Programa
  </button>

</div>

      <div className="space-y-6 px-8 py-6">

        <div className="grid gap-4 sm:grid-cols-3">

          <ExecutiveCard
            label="Programas"
            value={String(programs.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Activos"
            value={String(activos)}
            accent="green"
          />

          <ExecutiveCard
            label="Clientes"
            value={String(clients.length)}
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
          Cliente
        </th>

        <th className="px-6 py-3 text-left">
          Programa
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

      {programs.map((program) => (

        <tr
          key={program.id}
          style={{
            borderBottom:
              "1px solid #E5E7EB",
          }}
        >

          <td className="px-6 py-4">
            {program.cliente?.nombre}
          </td>

          <td className="px-6 py-4">
            {program.nombre}
          </td>

          <td className="px-6 py-4">
            {program.estado}
          </td>

          <td className="px-6 py-4">

  <div className="flex gap-3">

    <button
      onClick={() => {

        setEditingProgramId(
          program.id
        );

        setNewProgram({

          clientId:
  program.cliente?.id || "",

          nombre:
            program.nombre || "",

          descripcion:
            program.descripcion || "",

          estado:
            program.estado || "ACTIVO",

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
            `¿Eliminar el programa "${program.nombre}"?`
          );

        if (!ok) return;

        try {

          await deleteProgram(
            program.id
          );

          await loadData();

        } catch (error) {

          console.error(error);

          alert(
            "No fue posible eliminar el programa"
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
          editingProgramId
            ? "Editar Programa"
            : "Nuevo Programa"
        }
      </h2>

      <div className="space-y-4">

        <select
          className="w-full border p-2"
          value={newProgram.clientId}
          onChange={(e) =>
            setNewProgram({
              ...newProgram,
              clientId: e.target.value,
            })
          }
        >

          <option value="">
            Seleccione un cliente
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

        <input
          placeholder="Nombre"
          className="w-full border p-2"
          value={newProgram.nombre}
          onChange={(e) =>
            setNewProgram({
              ...newProgram,
              nombre: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Descripción"
          className="w-full border p-2"
          rows={4}
          value={newProgram.descripcion}
          onChange={(e) =>
            setNewProgram({
              ...newProgram,
              descripcion: e.target.value,
            })
          }
        />

        <select
          className="w-full border p-2"
          value={newProgram.estado}
          onChange={(e) =>
            setNewProgram({
              ...newProgram,
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
          onClick={handleSaveProgram}
          style={{
            background: "#C89B2A",
            color: "#FFF",
            padding: "8px 16px",
          }}
        >
          {
            editingProgramId
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