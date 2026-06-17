"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

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
      const response = await fetch(
        "http://localhost:3001/api/v1/vehiculos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId:
              "4092474c-9ff7-4c2d-98f9-cd6904837d6f",
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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Vehículos
      </h1>

      <div className="mb-8 space-y-3">

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

      <table className="w-full border">
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

        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr
              key={vehiculo.id}
              className="border-b"
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
                {vehiculo.esPropio
                  ? "Sí"
                  : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}