"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiGet("/dashboard")
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="p-10">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        ERP CHICO Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="border rounded p-4">
          <h2 className="font-bold">Clientes</h2>
          <p className="text-2xl">{data.clientes}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold">Pedidos</h2>
          <p className="text-2xl">{data.pedidos}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold">Servicios</h2>
          <p className="text-2xl">{data.servicios}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold">Conductores</h2>
          <p className="text-2xl">{data.conductores}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold">Facturas</h2>
          <p className="text-2xl">{data.facturas}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold">Total Pagado</h2>
          <p className="text-2xl">
            ${data.totalPagado?.toLocaleString()}
          </p>
        </div>
        <div className="border rounded p-4">
  <h2 className="font-bold">
    Saldo por Cobrar
  </h2>

  <p className="text-2xl">
    $
    {data.saldoPorCobrar?.toLocaleString()}
  </p>
</div>
        <div className="border rounded p-4">
  <h2 className="font-bold">
    Facturas Pendientes
  </h2>

  <p className="text-2xl">
    {data.facturasPendientes}
  </p>
</div>

<div className="border rounded p-4">
  <h2 className="font-bold">
    Facturas Pagadas
  </h2>

  <p className="text-2xl">
    {data.facturasPagadas}
  </p>
</div>

<div className="border rounded p-4">
  <h2 className="font-bold">
    Pagos Registrados
  </h2>

  <p className="text-2xl">
    {data.pagosRegistrados}
  </p>
</div>
        <div className="border rounded p-4">
  <h2 className="font-bold">
    Programados
  </h2>

  <p className="text-2xl">
    {data.serviciosProgramados}
  </p>
</div>

<div className="border rounded p-4">
  <h2 className="font-bold">
    En Ruta
  </h2>

  <p className="text-2xl">
    {data.serviciosEnRuta}
  </p>
</div>

<div className="border rounded p-4">
  <h2 className="font-bold">
    Entregados
  </h2>

  <p className="text-2xl">
    {data.serviciosEntregados}
  </p>
</div>
      </div>
    </div>
  );
}