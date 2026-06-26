"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ClientesPage() {
const [clientes, setClientes] = useState<any[]>([]);

const [form, setForm] = useState({
identificacion: "",
razonSocial: "",
tipoCliente: "",
contactoPrincipal: "",
});

async function cargarClientes() {
try {
const data = await apiGet("/clientes");
setClientes(data);
} catch (error) {
console.error(error);
}
}

useEffect(() => {
cargarClientes();
}, []);

async function crearCliente() {
try {
const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/clientes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
          ? `Bearer ${token}`
          : "",
      },

      body: JSON.stringify({
        tenantId:
          "d07d9ffa-9267-41d0-8b43-14ddbb0823a0",

        identificacion:
          form.identificacion,

        razonSocial:
          form.razonSocial,

        tipoCliente:
          form.tipoCliente,

        contactoPrincipal:
          form.contactoPrincipal,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}`
    );
  }

  await cargarClientes();

  setForm({
    identificacion: "",
    razonSocial: "",
    tipoCliente: "",
    contactoPrincipal: "",
  });
} catch (error) {
  console.error(error);
}

}

return ( <div>

  <div className="flex justify-between items-center mb-8">

    <div>
      <h1 className="text-3xl font-bold">
        Clientes
      </h1>

      <p className="text-gray-500">
        Gestión de clientes
      </p>

<p className="text-sm text-gray-500 mt-1">
  Total clientes: {clientes.length}
</p>

    </div>

  </div>

  <div className="bg-white rounded-xl shadow p-6 mb-8">

    <h2 className="font-semibold mb-4">
      Nuevo Cliente
    </h2>

    <div className="grid md:grid-cols-4 gap-4">

      <input
        className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
        placeholder="Identificación"
        value={form.identificacion}
        onChange={(e) =>
          setForm({
            ...form,
            identificacion:
              e.target.value,
          })
        }
      />

      <input
        className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
        placeholder="Razón Social"
        value={form.razonSocial}
        onChange={(e) =>
          setForm({
            ...form,
            razonSocial:
              e.target.value,
          })
        }
      />

      <select
  className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
  value={form.tipoCliente}
  onChange={(e) =>
    setForm({
      ...form,
      tipoCliente: e.target.value,
    })
  }
>
  <option value="">
    Seleccione tipo
  </option>

  <option value="EMPRESA">
    EMPRESA
  </option>

  <option value="PERSONA">
    PERSONA
  </option>
</select>

      <input
        className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
        placeholder="Contacto"
        value={form.contactoPrincipal}
        onChange={(e) =>
          setForm({
            ...form,
            contactoPrincipal:
              e.target.value,
          })
        }
      />

    </div>

    <button
      onClick={crearCliente}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Crear Cliente
    </button>

  </div>

  <div className="bg-white rounded-xl shadow overflow-hidden">

    <div className="overflow-x-auto">
  <table className="w-full">

      <thead className="border-b">

        <tr>

          <th className="text-left p-4">
            Identificación
          </th>

          <th className="text-left p-4">
            Razón Social
          </th>

          <th className="text-left p-4">
            Tipo
          </th>

          <th className="text-left p-4">
            Contacto
          </th>

        </tr>

      </thead>

      <tbody className="divide-y">
{clientes.length === 0 && (
  <tr>
    <td
      colSpan={4}
      className="p-8 text-center text-gray-500"
    >
      No hay clientes registrados
    </td>
  </tr>
)}
        {clientes.map((cliente) => (
          <tr
  key={cliente.id}
  className="hover:bg-gray-50 transition"
>
            <td className="p-4">
              {cliente.identificacion}
            </td>

            <td className="p-4">
              {cliente.razonSocial}
            </td>

           <td className="p-4">
  <span
    className={
      cliente.tipoCliente === "EMPRESA"
        ? "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
        : "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
    }
  >
    {cliente.tipoCliente}
  </span>
</td>

            <td className="p-4">
              {cliente.contactoPrincipal}
            </td>
          </tr>
        ))}

      </tbody>

    </table>
</div>

  </div>

</div>

);
}
