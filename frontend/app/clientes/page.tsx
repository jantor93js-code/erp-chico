"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);

  const [form, setForm] = useState({
    identificacion: "",
    razonSocial: "",
    tipoCliente: "",
  });

  useEffect(() => {
    apiGet("/clientes")
      .then(setClientes)
      .catch(console.error);
  }, []);

  async function crearCliente() {
    const response = await fetch(
      "http://localhost:3001/api/v1/clientes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId: "4092474c-9ff7-4c2d-98f9-cd6904837d6f",
          identificacion: form.identificacion,
          razonSocial: form.razonSocial,
          tipoCliente: form.tipoCliente,
        }),
      }
    );

    const nuevoCliente = await response.json();

    setClientes([...clientes, nuevoCliente]);

    setForm({
      identificacion: "",
      razonSocial: "",
      tipoCliente: "",
    });
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Clientes
      </h1>

      <div className="mb-8 space-y-2">
        <input
          className="border p-2 mr-2"
          placeholder="Identificación"
          value={form.identificacion}
          onChange={(e) =>
            setForm({
              ...form,
              identificacion: e.target.value,
            })
          }
        />

        <input
          className="border p-2 mr-2"
          placeholder="Razón Social"
          value={form.razonSocial}
          onChange={(e) =>
            setForm({
              ...form,
              razonSocial: e.target.value,
            })
          }
        />

        <input
          className="border p-2 mr-2"
          placeholder="Tipo Cliente"
          value={form.tipoCliente}
          onChange={(e) =>
            setForm({
              ...form,
              tipoCliente: e.target.value,
            })
          }
        />

        <div>
          <button
            onClick={crearCliente}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crear Cliente
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Razón Social</th>
            <th className="p-2 text-left">Identificación</th>
            <th className="p-2 text-left">Tipo</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="border-b">
              <td className="p-2">{cliente.razonSocial}</td>
              <td className="p-2">{cliente.identificacion}</td>
              <td className="p-2">{cliente.tipoCliente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}