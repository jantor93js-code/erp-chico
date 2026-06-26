"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ConductoresPage() {
  const [conductores, setConductores] = useState<any[]>([]);

  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
  });

  useEffect(() => {
    cargarConductores();
  }, []);

  async function cargarConductores() {
    try {
      const data = await apiGet("/conductores");
      setConductores(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function crearConductor() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/conductores`,
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
            nombre: form.nombre,
            cedula: form.cedula,
            telefono: form.telefono,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}`
        );
      }

      await cargarConductores();

      setForm({
        nombre: "",
        cedula: "",
        telefono: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error creando conductor");
    }
  }

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Conductores
        </h1>

        <p className="text-gray-500">
          Administración de conductores
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Total Conductores
          </h3>

          <p className="text-2xl font-bold">
            {conductores.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Activos
          </h3>

          <p className="text-2xl font-bold">
            {
              conductores.filter(
                (c) => c.activo
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Inactivos
          </h3>

          <p className="text-2xl font-bold">
            {
              conductores.filter(
                (c) => !c.activo
              ).length
            }
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="font-semibold mb-4">
          Nuevo Conductor
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value,
              })
            }
          />

          <input
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            placeholder="Cédula"
            value={form.cedula}
            onChange={(e) =>
              setForm({
                ...form,
                cedula: e.target.value,
              })
            }
          />

          <input
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) =>
              setForm({
                ...form,
                telefono: e.target.value,
              })
            }
          />

        </div>

        <button
          onClick={crearConductor}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Crear Conductor
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">


          <thead className="border-b">
            <tr>

              <th className="p-4 text-left">
                Nombre
              </th>

              <th className="p-4 text-left">
                Cédula
              </th>

              <th className="p-4 text-left">
                Teléfono
              </th>

              <th className="p-4 text-left">
                Estado
              </th>

            </tr>
          </thead>

          <tbody className="divide-y">

            {conductores.map((conductor) => (
              <tr
                key={conductor.id}
                className="hover:bg-gray-50 transition"
              >

                <td className="p-4">
                  {conductor.nombre}
                </td>

                <td className="p-4">
                  {conductor.cedula}
                </td>

                <td className="p-4">
                  {conductor.telefono}
                </td>

                <td className="p-4">

                  <span
                    className={
                      conductor.activo
                        ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                        : "bg-red-100 text-red-700 px-2 py-1 rounded"
                    }
                  >
                    {conductor.activo
                      ? "ACTIVO"
                      : "INACTIVO"}
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
