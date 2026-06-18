"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);

  const [form, setForm] = useState({
    placa: "",
    tipoVehiculo: "",
    capacidadKg: "",
    esPropio: true,
  });

  useEffect(() => {
    cargarVehiculos();
  }, []);

  async function cargarVehiculos() {
    try {
      const data = await apiGet("/vehiculos");
      setVehiculos(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function crearVehiculo() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/vehiculos`,
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
            placa: form.placa,
            tipoVehiculo: form.tipoVehiculo,
            capacidadKg: Number(form.capacidadKg),
            esPropio: form.esPropio,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(JSON.stringify(error.message));
        return;
      }

      const nuevoVehiculo = await response.json();

      setVehiculos((prev) => [
        ...prev,
        nuevoVehiculo,
      ]);

      setForm({
        placa: "",
        tipoVehiculo: "",
        capacidadKg: "",
        esPropio: true,
      });
    } catch (error) {
      console.error(error);
      alert("Error creando vehículo");
    }
  }

  return (
    <div>

  <div className="mb-8">
    <h1 className="text-3xl font-bold">
      Vehículos
    </h1>

    <p className="text-gray-500">
      Administración de flota
    </p>
  </div>
<div className="grid md:grid-cols-2 gap-4 mb-8">

  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
    <h3 className="text-sm text-gray-500">
      Total Vehículos
    </h3>

    <p className="text-2xl font-bold">
      {vehiculos.length}
    </p>
  </div>

  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
    <h3 className="text-sm text-gray-500">
      Vehículos Propios
    </h3>

    <p className="text-2xl font-bold">
      {
        vehiculos.filter(
          (v) => v.esPropio
        ).length
      }
    </p>
  </div>

</div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 mb-8">

  <h2 className="font-semibold mb-4">
    Nuevo Vehículo
  </h2>

        <input
          className="border border-gray-400 p-2 mr-2 rounded"
          placeholder="Placa"
          value={form.placa}
          onChange={(e) =>
            setForm({
              ...form,
              placa: e.target.value,
            })
          }
        />

        <input
          className="border border-gray-400 p-2 mr-2 rounded"
          placeholder="Tipo Vehículo"
          value={form.tipoVehiculo}
          onChange={(e) =>
            setForm({
              ...form,
              tipoVehiculo: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="border border-gray-400 p-2 mr-2 rounded"
          placeholder="Capacidad Kg"
          value={form.capacidadKg}
          onChange={(e) =>
            setForm({
              ...form,
              capacidadKg: e.target.value,
            })
          }
        />

        <label className="block">
          <input
            type="checkbox"
            checked={form.esPropio}
            onChange={(e) =>
              setForm({
                ...form,
                esPropio: e.target.checked,
              })
            }
          />
          <span className="ml-2">
            Vehículo Propio
          </span>
        </label>

        <button
          onClick={crearVehiculo}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear Vehículo
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Placa
            </th>

            <th className="p-3 text-left">
              Tipo
            </th>

            <th className="p-3 text-left">
              Capacidad
            </th>

            <th className="p-3 text-left">
              Propio
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {vehiculos.map((vehiculo) => (
            <tr
  key={vehiculo.id}
  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
>
              <td className="p-3">
                {vehiculo.placa}
              </td>

              <td className="p-3">
                {vehiculo.tipoVehiculo}
              </td>

              <td className="p-3">
                {vehiculo.capacidadKg}
              </td>

              <td className="p-3">

  <span
    className={
      vehiculo.esPropio
        ? "bg-green-100 text-green-700 px-2 py-1 rounded"
        : "bg-gray-100 text-gray-700 px-2 py-1 rounded"
    }
  >
    {vehiculo.esPropio
      ? "Propio"
      : "Tercero"}
  </span>

</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}