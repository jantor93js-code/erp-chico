"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function ReportesPage() {
  const [financiero, setFinanciero] = useState<any>(null);
  const [clientesTop, setClientesTop] = useState<any[]>([]);
  const [conductoresTop, setConductoresTop] = useState<any[]>([]);

  useEffect(() => {
    cargarReportes();
  }, []);

  async function cargarReportes() {
    try {
      const financieroData =
        await apiGet("/reportes/financiero");

      const clientesData =
        await apiGet("/reportes/clientes-top");

      const conductoresData =
        await apiGet("/reportes/conductores-top");

      setFinanciero(financieroData);
      setClientesTop(clientesData);
      setConductoresTop(conductoresData);

    } catch (error) {
      console.error(error);
    }
  }

  if (!financiero) {
    return (
      <div>
        Cargando reportes...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Reportes
        </h1>

        <p className="text-gray-500">
          Indicadores gerenciales del ERP
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Ingresos
          </h3>

          <p className="text-2xl font-bold">
            $
            {financiero.ingresos?.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Gastos
          </h3>

          <p className="text-2xl font-bold">
            $
            {financiero.gastos?.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Utilidad
          </h3>

          <p className="text-2xl font-bold text-green-600">
            $
            {financiero.utilidad?.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Rentabilidad
          </h3>

          <p className="text-2xl font-bold">
            {financiero.rentabilidad}%
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden">

          <div className="p-4 border-b">
            <h2 className="font-semibold">
              Clientes Top
            </h2>
          </div>

          <div className="overflow-x-auto">
  <table className="w-full">

            <thead className="border-b">
              <tr>
                <th className="p-4 text-left">
                  Cliente
                </th>

                <th className="p-4 text-left">
                  Facturación
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {clientesTop.map((cliente) => (
                <tr key={cliente.cliente}>
                  <td className="p-4">
                    {cliente.cliente}
                  </td>

                  <td className="p-4">
                    $
                    {cliente.facturacion?.toLocaleString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden">

          <div className="p-4 border-b">
            <h2 className="font-semibold">
              Conductores Top
            </h2>
          </div>

          <div className="overflow-x-auto">
  <table className="w-full">

            <thead className="border-b">
              <tr>

                <th className="p-4 text-left">
                  Conductor
                </th>

                <th className="p-4 text-left">
                  Servicios
                </th>

              </tr>
            </thead>

            <tbody className="divide-y">

              {conductoresTop.map(
                (conductor) => (
                  <tr
                    key={conductor.conductorId}
                  >
                    <td className="p-4">
                      {conductor.nombre}
                    </td>

                    <td className="p-4">
                      {conductor.servicios}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>
</div>
</div>
        </div>

      </div>

    </div>
  );
}