"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [conductores, setConductores] = useState<any[]>([]);

  const [form, setForm] = useState({
    pedidoId: "",
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
      async function iniciarServicio(id: string) {
try {
await fetch(
`http://localhost:3001/api/v1/servicios/${id}/iniciar`,
{
method: "PATCH",
}
);

```
await cargarServicios();
```

} catch (error) {
console.error(error);
alert("Error iniciando servicio");
}
}

async function entregarServicio(id: string) {
try {
await fetch(
`http://localhost:3001/api/v1/servicios/${id}/entregar`,
{
method: "PATCH",
}
);

```
await cargarServicios();
```

} catch (error) {
console.error(error);
alert("Error entregando servicio");
}
}

      const data = await apiGet("/servicios");
      setServicios(data);
    } catch (error) {
      console.error(error);
    }
  }

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
    const response = await fetch(
      "http://localhost:3001/api/v1/servicios",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId:
            "4092474c-9ff7-4c2d-98f9-cd6904837d6f",
          pedidoId: form.pedidoId,
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
    await fetch(
      `http://localhost:3001/api/v1/servicios/${id}/iniciar`,
      {
        method: "PATCH",
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
    await fetch(
      `http://localhost:3001/api/v1/servicios/${id}/entregar`,
      {
        method: "PATCH",
      }
    );

    await cargarServicios();
  } catch (error) {
    console.error(error);
    alert("Error entregando servicio");
  }
}

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Servicios
      </h1>

      <div className="mb-8 space-y-3">

        <select
          className="border border-gray-400 bg-white text-black p-2 mr-2 rounded"
          value={form.pedidoId}
          onChange={(e) =>
            setForm({
              ...form,
              pedidoId: e.target.value,
            })
          }
        >
          <option value="">
            Seleccione pedido
          </option>

          {pedidos.map((pedido) => (
            <option
              key={pedido.id}
              value={pedido.id}
            >
              {pedido.descripcion}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-400 bg-white text-black p-2 mr-2 rounded"
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
          className="border border-gray-400 bg-white text-black p-2 mr-2 rounded"
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
          className="border border-gray-400 p-2 mr-2 rounded"
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
          className="border border-gray-400 p-2 mr-2 rounded"
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
          className="border border-gray-400 p-2 mr-2 rounded"
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

      <table className="w-full border table-fixed">
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

        <tbody>
  {servicios.map((servicio) => (
    <tr
      key={servicio.id}
      className="border-b"
    >
      <td className="p-3">
        {servicio.pedido?.descripcion}
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
        {servicio.estado === "PROGRAMADO" && (
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
  );
}