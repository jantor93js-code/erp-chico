"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function CarteraPage() {
  const [cartera, setCartera] = useState<any[]>([]);

  useEffect(() => {
    cargarCartera();
  }, []);

  async function cargarCartera() {
    try {
      const data = await apiGet("/cartera");
      setCartera(data);
    } catch (error) {
      console.error(error);
    }
  }

  const totalCartera = cartera.reduce(
    (acc, item) => acc + item.saldoPendiente,
    0
  );

  const vencidas = cartera.filter(
    (item) => item.diasVencidos > 0
  ).length;

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Cartera
        </h1>

        <p className="text-gray-500">
          Seguimiento de cuentas por cobrar
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Total Cartera
          </h3>

          <p className="text-2xl font-bold">
            $
            {totalCartera.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Facturas Pendientes
          </h3>

          <p className="text-2xl font-bold">
            {cartera.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-gray-500">
            Facturas Vencidas
          </h3>

          <p className="text-2xl font-bold">
            {vencidas}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="border-b">
            <tr>

              <th className="p-4 text-left">
                Factura
              </th>

              <th className="p-4 text-left">
                Cliente
              </th>

              <th className="p-4 text-left">
                Valor
              </th>

              <th className="p-4 text-left">
                Pagado
              </th>

              <th className="p-4 text-left">
                Saldo
              </th>

              <th className="p-4 text-left">
                Estado
              </th>

              <th className="p-4 text-left">
                Vencimiento
              </th>

              <th className="p-4 text-left">
                Días
              </th>

            </tr>
          </thead>

          <tbody className="divide-y">

            {cartera.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-gray-500"
                >
                  No hay cartera pendiente
                </td>
              </tr>
            )}

            {cartera.map((item) => (
              <tr
                key={item.facturaId}
                className="hover:bg-gray-50 transition"
              >

                <td className="p-4">
                  {item.numeroFactura}
                </td>

                <td className="p-4">
                  {item.cliente}
                </td>

                <td className="p-4">
                  $
                  {item.valorFactura?.toLocaleString()}
                </td>

                <td className="p-4 text-green-600 font-medium">
                  $
                  {item.totalPagado?.toLocaleString()}
                </td>

                <td className="p-4 text-red-600 font-medium">
                  $
                  {item.saldoPendiente?.toLocaleString()}
                </td>

                <td className="p-4">

                  <span
                    className={
                      item.estadoPago === "PAGADA"
                        ? "bg-green-100 text-green-700 px-2 py-1 rounded"
                        : item.estadoPago === "ABONADA"
                        ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                        : "bg-red-100 text-red-700 px-2 py-1 rounded"
                    }
                  >
                    {item.estadoPago}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(
                    item.fechaVencimiento
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <span
                    className={
                      item.diasVencidos > 0
                        ? "text-red-600 font-bold"
                        : "text-green-600"
                    }
                  >
                    {item.diasVencidos}
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
