"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GastosOperativosPage() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);

  const [form, setForm] = useState({
    servicioId: "",
    tipo: "",
    descripcion: "",
    valor: "",
  });

  useEffect(() => {
    cargarGastos();
    cargarServicios();
  }, []);

  async function cargarGastos() {
    try {
      const data = await apiGet("/gastos-operativos");
      setGastos(data);
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

  async function crearGasto() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/gastos-operativos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
              ? `Bearer ${token}`
              : "",
          },
          body: JSON.stringify({
            servicioId: form.servicioId,
            tipo: form.tipo,
            descripcion: form.descripcion,
            valor: Number(form.valor),
          }),
        }
      );

      if (!response.ok) {
        alert("Error creando gasto");
        return;
      }

      await cargarGastos();

      setForm({
        servicioId: "",
        tipo: "",
        descripcion: "",
        valor: "",
      });

    } catch (error) {
      console.error(error);
    }
  }

  const totalGastos = gastos.reduce(
    (acc, gasto) => acc + gasto.valor,
    0
  );

  const promedio =
    gastos.length > 0
      ? Math.round(totalGastos / gastos.length)
      : 0;

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Gastos Operativos
        </h1>

        <p className="text-gray-500">
          Registro y control de gastos
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Total Gastos
          </h3>

          <p className="text-2xl font-bold">
            $
            {totalGastos.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Cantidad Gastos
          </h3>

          <p className="text-2xl font-bold">
            {gastos.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Promedio
          </h3>

          <p className="text-2xl font-bold">
            $
            {promedio.toLocaleString()}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="font-semibold mb-4">
          Nuevo Gasto
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
              Tipo gasto
            </option>

            <option value="COMBUSTIBLE">
              COMBUSTIBLE
            </option>

            <option value="PEAJE">
              PEAJE
            </option>

            <option value="VIATICOS">
              VIATICOS
            </option>

            <option value="PARQUEADERO">
              PARQUEADERO
            </option>

            <option value="TERCEROS">
              TERCEROS
            </option>

            <option value="OTROS">
              OTROS
            </option>
          </select>

          <input
            className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm({
                ...form,
                descripcion: e.target.value,
              })
            }
          />

         <input
  type="text"
  className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
  placeholder="Valor"
  value={
    form.valor
      ? Number(
          form.valor
        ).toLocaleString("es-CO")
      : ""
  }
  onChange={(e) => {
    const soloNumeros =
      e.target.value.replace(/\D/g, "");

    setForm({
      ...form,
      valor: soloNumeros,
    });
  }}
/>

        </div>

        <button
          onClick={crearGasto}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Registrar Gasto
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">
  <table className="w-full">

          <thead className="border-b">
            <tr>
              <th className="p-4 text-left">
                Servicio
              </th>

              <th className="p-4 text-left">
                Tipo
              </th>

              <th className="p-4 text-left">
                Descripción
              </th>

              <th className="p-4 text-left">
                Valor
              </th>

              <th className="p-4 text-left">
                Fecha
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {gastos.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-500"
                >
                  No hay gastos registrados
                </td>
              </tr>
            )}

            {gastos.map((gasto) => (
              <tr
                key={gasto.id}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                <td className="p-4">
                  {gasto.servicio?.tipoServicio}
                </td>

                <td className="p-4">

                  <span
                    className={
                      gasto.tipo === "COMBUSTIBLE"
                        ? "bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        : gasto.tipo === "PEAJE"
                        ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                        : gasto.tipo === "VIATICOS"
                        ? "bg-purple-100 text-purple-700 px-2 py-1 rounded"
                        : gasto.tipo === "PARQUEADERO"
                        ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                        : "bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    }
                  >
                    {gasto.tipo}
                  </span>

                </td>

                <td className="p-4">
                  {gasto.descripcion}
                </td>

                <td className="p-4 font-medium">
                  $
                  {gasto.valor?.toLocaleString()}
                </td>

                <td className="p-4">
                  {new Date(
                    gasto.fecha
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
