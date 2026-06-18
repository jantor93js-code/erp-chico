"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EvidenciasPage() {
  const [evidencias, setEvidencias] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);

  const [form, setForm] = useState({
    servicioId: "",
    tipo: "",
    urlArchivo: "",
    observacion: "",
  });

  useEffect(() => {
    cargarEvidencias();
    cargarServicios();
  }, []);

  async function cargarEvidencias() {
    try {
      const data = await apiGet("/evidencias");
      setEvidencias(data);
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

  async function crearEvidencia() {
    try {
      const response = await fetch(
        `${API_URL}/evidencias`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        alert("Error creando evidencia");
        return;
      }

      await cargarEvidencias();

      setForm({
        servicioId: "",
        tipo: "",
        urlArchivo: "",
        observacion: "",
      });

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Evidencias
        </h1>

        <p className="text-gray-500">
          Gestión documental y fotográfica
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Total Evidencias
          </h3>

          <p className="text-2xl font-bold">
            {evidencias.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Servicios
          </h3>

          <p className="text-2xl font-bold">
            {servicios.length}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="font-semibold mb-4">
          Nueva Evidencia
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <select
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            value={form.servicioId}
            onChange={(e) =>
              setForm({
                ...form,
                servicioId: e.target.value,
              })
            }
          >
            <option value="">
              Seleccione servicio
            </option>

            {servicios.map((servicio) => (
              <option
                key={servicio.id}
                value={servicio.id}
              >
                {servicio.tipoServicio}
                {" | "}
                {servicio.origen}
                {" → "}
                {servicio.destino}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            value={form.tipo}
            onChange={(e) =>
              setForm({
                ...form,
                tipo: e.target.value,
              })
            }
          >
            <option value="">
              Tipo
            </option>

            <option value="FOTO_INICIAL">
              FOTO_INICIAL
            </option>

            <option value="FOTO_FINAL">
              FOTO_FINAL
            </option>

            <option value="ACTA_ENTREGA">
              ACTA_ENTREGA
            </option>

            <option value="DOCUMENTO">
              DOCUMENTO
            </option>

            <option value="OTRO">
              OTRO
            </option>

          </select>

          <input
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            placeholder="URL archivo"
            value={form.urlArchivo}
            onChange={(e) =>
              setForm({
                ...form,
                urlArchivo: e.target.value,
              })
            }
          />

          <input
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            placeholder="Observación"
            value={form.observacion}
            onChange={(e) =>
              setForm({
                ...form,
                observacion: e.target.value,
              })
            }
          />

        </div>

        <button
          onClick={crearEvidencia}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Registrar Evidencia
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">
  <table className="w-full">

          <thead className="border-b">
            <tr>
              <th className="p-4 text-left">
                Tipo
              </th>

              <th className="p-4 text-left">
                Observación
              </th>

              <th className="p-4 text-left">
                Archivo
              </th>

              <th className="p-4 text-left">
                Fecha
              </th>
              <th className="p-4 text-left">
  Servicio
</th>

<th className="p-4 text-left">
  Pedido
</th>

<th className="p-4 text-left">
  Cliente
</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {evidencias.map((evidencia) => (
              <tr
                key={evidencia.id}
                className="hover:bg-gray-50"
              >
                <td className="p-4">
  {evidencia.servicio?.origen}
  {" → "}
  {evidencia.servicio?.destino}
</td>

<td className="p-4">
  {evidencia.servicio?.pedido?.numeroPedido}
</td>

<td className="p-4">
  {
    evidencia.servicio?.pedido
      ?.cliente?.razonSocial
  }
</td>
                <td className="p-4">
                  {evidencia.tipo}
                </td>

                <td className="p-4">
                  {evidencia.observacion}
                </td>

                <td className="p-4">
                  <a
                    href={evidencia.urlArchivo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Ver Archivo
                  </a>
                </td>

                <td className="p-4">
                  {new Date(
                    evidencia.createdAt
                  ).toLocaleDateString()}
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
