"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import PageHeader from "@/src/components/pmo/PageHeader";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";

import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/src/services/pmo/clients";

interface Client {
  id: string;
  nombre: string;
  nit?: string;
  contacto?: string;
  email?: string;
  estado: string;
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] =
  useState(false);

const [editingClientId,
  setEditingClientId] =
  useState<string | null>(null);

const [newClient, setNewClient] =
  useState({
    nombre: "",
    nit: "",
    contacto: "",
    email: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const activos =
    clients.filter(
      (c) => c.estado === "ACTIVO",
    ).length;
async function handleCreateClient() {

  try {

    if (!newClient.nombre.trim()) {
      alert("Ingrese nombre");
      return;
    }

    if (editingClientId) {

      await updateClient(
        editingClientId,
        newClient
      );

    } else {

      await createClient({
        ...newClient,
        estado: "ACTIVO",
      });

    }

    setShowModal(false);

    setEditingClientId(null);

    setNewClient({
      nombre: "",
      nit: "",
      contacto: "",
      email: "",
    });

    await loadClients();

  } catch (error) {

    console.error(error);

    alert(
      "No fue posible guardar el cliente"
    );

  }
}

  return (
    <PmoShell>
      <PageHeader
        section="PMO · Clientes"
        title="Clientes"
        description="Gestión de clientes de MÉTRIC"
      />
<div className="px-8 pt-4">
  <button
    onClick={() => {

      setEditingClientId(null);

      setNewClient({
        nombre: "",
        nit: "",
        contacto: "",
        email: "",
      });

      setShowModal(true);

    }}
    className="px-4 py-2 text-sm font-medium"
    style={{
      background: "#C89B2A",
      color: "#FFFFFF",
    }}
  >
    + Nuevo Cliente
  </button>
</div>
      <div className="space-y-6 px-8 py-6">

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ExecutiveCard
            label="Clientes"
            value={String(clients.length)}
            accent="gold"
          />

          <ExecutiveCard
            label="Activos"
            value={String(activos)}
            accent="green"
          />

          <ExecutiveCard
            label="Inactivos"
            value={String(clients.length - activos)}
            accent="red"
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
            <table className="w-full">
              <thead>
  <tr
    style={{
      borderBottom:
        "1px solid #D6D3D1",
    }}
  >
    <th className="px-6 py-3 text-left">
      Cliente
    </th>

    <th className="px-6 py-3 text-left">
      Contacto
    </th>

    <th className="px-6 py-3 text-left">
      Email
    </th>

    <th className="px-6 py-3 text-left">
      NIT
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
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    style={{
                      borderBottom:
                        "1px solid #E5E7EB",
                    }}
                  >
                    <td className="px-6 py-4">
                      {client.nombre}
                    </td>

                   <td className="px-6 py-4">
  {client.contacto || "-"}
</td>
<td className="px-6 py-4">
  {client.email || "-"}
</td>

<td className="px-6 py-4">
  {client.nit || "-"}
</td>

                    <td className="px-6 py-4">
                      {client.estado}
                    </td>
                    <td className="px-6 py-4">

  <div className="flex gap-3">

    <button
      onClick={() => {

        setEditingClientId(
          client.id
        );

        setNewClient({
          nombre:
            client.nombre || "",

          nit:
            client.nit || "",

          contacto:
            client.contacto || "",

          email:
            client.email || "",
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
            `¿Eliminar cliente "${client.nombre}"?`
          );

        if (!ok) return;

        try {

          await deleteClient(
            client.id
          );

          await loadClients();

        } catch (error) {

          console.error(error);

          alert(
            "No fue posible eliminar el cliente"
          );

        }

      }}
      className="text-red-600"
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
          editingClientId
            ? "Editar Cliente"
            : "Nuevo Cliente"
        }
      </h2>

      <div className="space-y-4">

        <input
          placeholder="Nombre"
          className="w-full border p-2"
          value={newClient.nombre}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              nombre: e.target.value,
            })
          }
        />

        <input
          placeholder="NIT"
          className="w-full border p-2"
          value={newClient.nit}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              nit: e.target.value,
            })
          }
        />

        <input
          placeholder="Contacto"
          className="w-full border p-2"
          value={newClient.contacto}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              contacto: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="w-full border p-2"
          value={newClient.email}
          onChange={(e) =>
            setNewClient({
              ...newClient,
              email: e.target.value,
            })
          }
        />

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
          onClick={handleCreateClient}
          style={{
            background: "#C89B2A",
            color: "#FFF",
            padding: "8px 16px",
          }}
        >
          {
            editingClientId
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