"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [conductores, setConductores] = useState<any[]>([]);

  const [form, setForm] = useState({
  pedidoId: "",
  tipoServicio: "MUDANZA",
  vehiculoId: "",
  conductorId: "",
  origen: "",
  destino: "",
  fechaProgramada: "",
});

  useEffect(() => {
    cargarServicios();
    cargarPedidos();
    cargarVehiculos();
    cargarConductores();
  }, []);


 async function cargarServicios() {
  try {
    const data = await apiGet("/servicios");
    setServicios(data);
  } catch (error) {
    console.error(error);
  }
}

async function cargarPedidos() {
  try {
    const data = await apiGet("/pedidos/disponibles");
    setPedidos(data);
  } catch (error) {
    console.error(error);
  }
}

async function cargarVehiculos() {
  try {
    const data = await apiGet("/vehiculos");
    setVehiculos(data);
  } catch (error) {
    console.error(error);
  }
}

async function cargarConductores() {
  try {
    const data = await apiGet("/conductores");
    setConductores(data);
  } catch (error) {
    console.error(error);
  }
}

async function crearServicio() {
  try {

    const token =
      localStorage.getItem("token");


    const response = await fetch(
      `${API_URL}/servicios`,
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
          pedidoId: form.pedidoId,
          tipoServicio: form.tipoServicio,
          vehiculoId: form.vehiculoId,
          conductorId: form.conductorId,
          origen: form.origen,
          destino: form.destino,
          fechaProgramada: new Date(
            form.fechaProgramada
          ).toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      alert(JSON.stringify(error.message));
      return;
    }

    await cargarServicios();

    setForm({
  pedidoId: "",
  tipoServicio: "",
  vehiculoId: "",
  conductorId: "",
  origen: "",
  destino: "",
  fechaProgramada: "",
});
  } catch (error) {
    console.error(error);
    alert("Error creando servicio");
  }
}

async function iniciarServicio(id: string) {
  try {
    const token = localStorage.getItem("token");
    await fetch(
  `${API_URL}/servicios/${id}/iniciar`,
  {
    method: "PATCH",
    headers: {
      Authorization: token
        ? `Bearer ${token}`
        : "",
    },
  }
);

    await cargarServicios();
  } catch (error) {
    console.error(error);
    alert("Error iniciando servicio");
  }
}

async function entregarServicio(id: string) {
  try {
    const token = localStorage.getItem("token");
    await fetch(
  `${API_URL}/servicios/${id}/entregar`,
  {
    method: "PATCH",
    headers: {
      Authorization: token
        ? `Bearer ${token}`
        : "",
    },
  }
);

    await cargarServicios();
  } catch (error) {
    console.error(error);
    alert("Error entregando servicio");
  }
}

  return (
    <div>
      <div className="mb-8">

  <h1 className="text-3xl font-bold">
    Servicios
  </h1>

  <p className="text-gray-500">
    Programación y seguimiento operativo
  </p>

</div>
<div className="bg-white rounded-xl shadow p-6 mb-8">

  <h2 className="font-semibold mb-4">
    Nuevo Servicio
  </h2>

        <select
          className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
          value={form.pedidoId}
          onChange={(e) => {

  const pedido =
    pedidos.find(
      (p) => p.id === e.target.value
    );

  setForm({
    ...form,
    pedidoId: e.target.value,

    origen:
      pedido?.origen || "",

    destino:
      pedido?.destino || "",
  });
}}
        >
          <option value="">
            Seleccione pedido
          </option>

          {pedidos.map((pedido) => (
  <option
    key={pedido.id}
    value={pedido.id}
  >
    {pedido.numeroPedido}
    {" | "}
    {pedido.origen}
    {" → "}
    {pedido.destino}
  </option>
))}
        </select>
<select
  className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
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
        <select
          className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
          value={form.vehiculoId}
          onChange={(e) =>
            setForm({
              ...form,
              vehiculoId: e.target.value,
            })
          }
          
        >
          
          <option value="">
            Seleccione vehículo
          </option>

          {vehiculos.map((vehiculo) => (
            <option
              key={vehiculo.id}
              value={vehiculo.id}
            >
              {vehiculo.placa}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
          value={form.conductorId}
          onChange={(e) =>
            setForm({
              ...form,
              conductorId: e.target.value,
            })
          }
        >
          <option value="">
            Seleccione conductor
          </option>

          {conductores.map((conductor) => (
            <option
              key={conductor.id}
              value={conductor.id}
            >
              {conductor.nombre}
            </option>
          ))}
        </select>

        <input
          className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
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
          className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
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
          type="datetime-local"
          className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
          value={form.fechaProgramada}
          onChange={(e) =>
            setForm({
              ...form,
              fechaProgramada: e.target.value,
            })
          }
        />

        <div>
          <button
            onClick={crearServicio}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Crear Servicio
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
  <table className="w-full">
       <thead>
  <tr className="border-b">
    <th className="p-3 text-left">
      Pedido
    </th>

    <th className="p-3 text-left">
      Vehículo
    </th>

    <th className="p-3 text-left">
      Conductor
    </th>

    <th className="p-3 text-left">
      Origen
    </th>

    <th className="p-3 text-left">
      Destino
    </th>

    <th className="p-3 text-left">
      Fecha
    </th>

    <th className="p-3 text-left">
      Estado
    </th>

    <th className="p-3 text-left">
      Acciones
    </th>
  </tr>
</thead>

        <tbody className="divide-y">
  {servicios.map((servicio) => (
    <tr
  key={servicio.id}
  className="hover:bg-gray-50 transition"
>
      <td className="p-3">
  {servicio.pedido?.numeroPedido}
  <br />
  <span className="text-xs text-gray-500">
    {servicio.pedido?.origen}
    {" → "}
    {servicio.pedido?.destino}
  </span>
</td>

      <td className="p-3">
        {servicio.vehiculo?.placa}
      </td>

      <td className="p-3">
        {servicio.conductor?.nombre}
      </td>

      <td className="p-3">
        {servicio.origen}
      </td>

      <td className="p-3">
        {servicio.destino}
      </td>

      <td className="p-3">
        {new Date(
          servicio.fechaProgramada
        ).toLocaleString()}
      </td>

      <td className="p-3">
        <span
          className={
            servicio.estado === "PROGRAMADO"
              ? "bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
              : servicio.estado === "EN_RUTA"
              ? "bg-blue-100 text-blue-800 px-2 py-1 rounded"
              : "bg-green-100 text-green-800 px-2 py-1 rounded"
          }
        >
          {servicio.estado}
        </span>
      </td>

      <td className="p-3 space-x-2">
        {(servicio.estado === "PROGRAMADO" ||
  servicio.estado === "PENDIENTE") && (
          <button
            onClick={() =>
              iniciarServicio(servicio.id)
            }
            className="bg-blue-600 text-white px-2 py-1 rounded"
          >
            Iniciar
          </button>
        )}

        {servicio.estado === "EN_RUTA" && (
          <button
            onClick={() =>
              entregarServicio(servicio.id)
            }
            className="bg-green-600 text-white px-2 py-1 rounded"
          >
            Entregar
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
      </table>
</div>
    </div>
  );
}
