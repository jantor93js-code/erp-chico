"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";
import AuthGuard from "@/src/components/AuthGuard";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiGet("/dashboard")
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <AuthGuard>
      {!data ? (
        <div className="p-10">
          Cargando dashboard...
        </div>
      ) : (
        <div className="space-y-8">

          <div>
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-500">
              Resumen general de la operación
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Clientes
              </p>

              <p className="text-3xl font-bold mt-2">
                {data.clientes}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Pedidos
              </p>

              <p className="text-3xl font-bold mt-2">
                {data.pedidos}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Servicios
              </p>

              <p className="text-3xl font-bold mt-2">
                {data.servicios}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Facturas
              </p>

              <p className="text-3xl font-bold mt-2">
                {data.facturas}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Saldo por Cobrar
              </p>

              <p className="text-3xl font-bold mt-2">
                $
                {data.saldoPorCobrar?.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Pagado
              </p>

              <p className="text-3xl font-bold mt-2">
                $
                {data.totalPagado?.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Programados
              </p>

              <p className="text-3xl font-bold mt-2 text-yellow-600">
                {data.serviciosProgramados}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                En Ruta
              </p>

              <p className="text-3xl font-bold mt-2 text-blue-600">
                {data.serviciosEnRuta}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Entregados
              </p>

              <p className="text-3xl font-bold mt-2 text-green-600">
                {data.serviciosEntregados}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Facturado Mes
              </p>

              <p className="text-3xl font-bold mt-2">
                $
                {data.facturadoMes?.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Gastos Mes
              </p>

              <p className="text-3xl font-bold mt-2">
                $
                {data.gastosMes?.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Utilidad Mes
              </p>

              <p className="text-3xl font-bold mt-2 text-green-600">
                $
                {data.utilidadMes?.toLocaleString()}
              </p>
            </div>

          </div>
<h2 className="text-xl font-semibold mt-8 mb-4">
  Indicadores Financieros
</h2>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Facturado Histórico
    </p>

    <p className="text-3xl font-bold mt-2">
      $
      {data.totalFacturado?.toLocaleString()}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Gastos Operativos
    </p>

    <p className="text-3xl font-bold mt-2 text-red-600">
      $
      {data.totalGastosOperativos?.toLocaleString()}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Utilidad Operativa
    </p>

    <p className="text-3xl font-bold mt-2 text-green-600">
      $
      {data.utilidadOperativa?.toLocaleString()}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Rentabilidad
    </p>

    <p className="text-3xl font-bold mt-2 text-blue-600">
      {data.rentabilidadPromedio}%
    </p>
  </div>

</div>
<h2 className="text-xl font-semibold mt-8 mb-4">
  Cartera
</h2>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Facturas Pendientes
    </p>

    <p className="text-3xl font-bold mt-2">
      {data.facturasPendientes}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Facturas Pagadas
    </p>

    <p className="text-3xl font-bold mt-2">
      {data.facturasPagadas}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Pagos Registrados
    </p>

    <p className="text-3xl font-bold mt-2">
      {data.pagosRegistrados}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Saldo por Cobrar
    </p>

    <p className="text-3xl font-bold mt-2 text-red-600">
      $
      {data.saldoPorCobrar?.toLocaleString()}
    </p>
  </div>

</div>
<h2 className="text-xl font-semibold mt-8 mb-4">
  Actividad del Mes
</h2>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Pedidos Mes
    </p>

    <p className="text-3xl font-bold mt-2">
      {data.pedidosMes}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Servicios Mes
    </p>

    <p className="text-3xl font-bold mt-2">
      {data.serviciosMes}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Facturado Mes
    </p>

    <p className="text-3xl font-bold mt-2">
      $
      {data.facturadoMes?.toLocaleString()}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Utilidad Mes
    </p>

    <p className="text-3xl font-bold mt-2 text-green-600">
      $
      {data.utilidadMes?.toLocaleString()}
    </p>
  </div>

</div>
        </div>
      )}
    </AuthGuard>
  );
}
