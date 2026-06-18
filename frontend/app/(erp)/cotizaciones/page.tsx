"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const [form, setForm] = useState({
  clienteId: "",
  ejecutivoId: "",
  tipoServicio: "MUDANZA",
  descripcion: "",
  origen: "",
  destino: "",
  valorCotizado: "",
});

  useEffect(() => {
    cargarCotizaciones();
    cargarClientes();
    cargarUsuarios();
  }, []);

  async function cargarCotizaciones() {
    try {
      const data = await apiGet("/cotizaciones");
      setCotizaciones(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarClientes() {
    try {
      const data = await apiGet("/clientes");
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarUsuarios() {
    try {
      const data = await apiGet("/users");
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function crearCotizacion() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/cotizaciones`,
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
            clienteId: form.clienteId,
            ejecutivoId: form.ejecutivoId,
            tipoServicio: form.tipoServicio,
descripcion: form.descripcion,
            origen: form.origen,
            destino: form.destino,
            valorCotizado: Number(
  form.valorCotizado
),
            estado: "PENDIENTE",
          }),
        }
      );

      if (!response.ok) {
        alert("Error creando cotización");
        return;
      }

      await cargarCotizaciones();

      setForm({
  clienteId: "",
  ejecutivoId: "",
  tipoServicio: "MUDANZA",
  descripcion: "",
  origen: "",
  destino: "",
  valorCotizado: "",
});

    } catch (error) {
      console.error(error);
    }
  }
async function aceptarCotizacion(id: string) {
  try {
    await fetch(
      `${API_URL}/cotizaciones/${id}/aceptar`,
      {
        method: "PATCH",
      }
    );

    await cargarCotizaciones();

  } catch (error) {
    console.error(error);
  }
}
async function rechazarCotizacion(id: string) {
  try {
    await fetch(
      `${API_URL}/cotizaciones/${id}/rechazar`,
      {
        method: "PATCH",
      }
    );

    await cargarCotizaciones();

  } catch (error) {
    console.error(error);
  }
}
  const valorTotal = cotizaciones.reduce(
    (acc, c) => acc + c.valorCotizado,
    0
  );

  const aceptadas = cotizaciones.filter(
    (c) => c.estado === "ACEPTADA"
  ).length;

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Cotizaciones
        </h1>

        <p className="text-gray-500">
          Gestión comercial de cotizaciones
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Total Cotizaciones
          </h3>

          <p className="text-2xl font-bold">
            {cotizaciones.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Valor Cotizado
          </h3>

          <p className="text-2xl font-bold">
            $
            {valorTotal.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Aceptadas
          </h3>

          <p className="text-2xl font-bold">
            {aceptadas}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="font-semibold mb-4">
          Nueva Cotización
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <select
            className="border rounded-lg p-3"
            value={form.clienteId}
            onChange={(e) =>
              setForm({
                ...form,
                clienteId: e.target.value,
              })
            }
          >
            <option value="">
              Seleccione cliente
            </option>

            {clientes.map((cliente) => (
              <option
                key={cliente.id}
                value={cliente.id}
              >
                {cliente.razonSocial}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-3"
            value={form.ejecutivoId}
            onChange={(e) =>
              setForm({
                ...form,
                ejecutivoId: e.target.value,
              })
            }
          >
            <option value="">
              Seleccione ejecutivo
            </option>

            {usuarios.map((usuario) => (
              <option
                key={usuario.id}
                value={usuario.id}
              >
                {usuario.email}
              </option>
            ))}
          </select>
<select
  className="border rounded-lg p-3"
  value={form.tipoServicio}
  onChange={(e) =>
    setForm({
      ...form,
      tipoServicio: e.target.value,
    })
  }
>
  <option value="MUDANZA">
    MUDANZA
  </option>

  <option value="TRANSPORTE">
    TRANSPORTE
  </option>

  <option value="BODEGAJE">
    BODEGAJE
  </option>

  <option value="PROYECTO_ESPECIAL">
    PROYECTO ESPECIAL
  </option>
</select>
      
<textarea
  className="border rounded-lg p-3 md:col-span-3"
  placeholder="Descripción del servicio"
  value={form.descripcion}
  onChange={(e) =>
    setForm({
      ...form,
      descripcion: e.target.value,
    })
  }
/>
          <input
            className="border rounded-lg p-3"
            placeholder="Origen"
            value={form.origen}
            onChange={(e) =>
              setForm({
                ...form,
                origen: e.target.value,
              })
            }
          />

          <input
            className="border rounded-lg p-3"
            placeholder="Destino"
            value={form.destino}
            onChange={(e) =>
              setForm({
                ...form,
                destino: e.target.value,
              })
            }
          />

          <input
            type="text"
            className="border rounded-lg p-3"
            placeholder="Valor Cotizado"
            value={
  form.valorCotizado
    ? Number(
        form.valorCotizado
      ).toLocaleString("es-CO")
    : ""
}
            onChange={(e) => {
  const soloNumeros =
    e.target.value.replace(/\D/g, "");

  setForm({
    ...form,
    valorCotizado: soloNumeros,
  });
}}
          />

        </div>

        <button
          onClick={crearCotizacion}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Crear Cotización
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">
  <table className="w-full">

          <thead className="border-b">
  <tr>

    <th className="p-4 text-left">
      Número
    </th>

    <th className="p-4 text-left">
      Cliente
    </th>
<th className="p-4 text-left">
  Tipo
</th>
    <th className="p-4 text-left">
      Ejecutivo
    </th>

    <th className="p-4 text-left">
      Ruta
    </th>

    <th className="p-4 text-left">
      Valor
    </th>

    <th className="p-4 text-left">
      Estado
    </th>

    <th className="p-4 text-left">
      Fecha
    </th>

    <th className="p-4 text-left">
      Acciones
    </th>

  </tr>
</thead>

          <tbody className="divide-y">

            {cotizaciones.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500"
                >
                  No hay cotizaciones registradas
                </td>
              </tr>
            )}

            {cotizaciones.map((cotizacion) => (
              <tr
                key={cotizacion.id}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >

                <td className="p-4">
                  {cotizacion.numeroCotizacion}
                </td>

                <td className="p-4">
                  {cotizacion.cliente?.razonSocial}
                </td>
<td className="p-4">
  {cotizacion.tipoServicio}
</td>
                <td className="p-4">
                  {cotizacion.ejecutivo?.email}
                </td>

                <td className="p-4">
                  {cotizacion.origen}
                  {" → "}
                  {cotizacion.destino}
                </td>

                <td className="p-4 font-medium">
                  $
                  {cotizacion.valorCotizado?.toLocaleString()}
                </td>

                <td className="p-4">

                  <span
                    className={
                      cotizacion.estado === "ACEPTADA"
                        ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                        : cotizacion.estado === "PENDIENTE"
                        ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                        : "bg-red-100 text-red-700 px-2 py-1 rounded"
                    }
                  >
                    {cotizacion.estado}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(
                    cotizacion.fechaCreacion
                  ).toLocaleDateString()}
                </td>
<td className="p-4">

  {cotizacion.estado === "PENDIENTE" && (

    <div className="flex gap-2">

      <button
        onClick={() =>
          aceptarCotizacion(cotizacion.id)
        }
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Aceptar
      </button>

      <button
        onClick={() =>
          rechazarCotizacion(cotizacion.id)
        }
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Rechazar
      </button>

    </div>

  )}

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
