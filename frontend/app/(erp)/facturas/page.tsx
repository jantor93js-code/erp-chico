"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([]);

  useEffect(() => {
    cargarFacturas();
  }, []);

  async function cargarFacturas() {
    try {
      const data = await apiGet("/facturas");
      setFacturas(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Facturas
        </h1>

        <p className="text-gray-500">
          Gestión de facturación
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="border-b">
  <tr>
    <th className="p-4 text-left">
      Factura
    </th>

    <th className="p-4 text-left">
      Pedido
    </th>

    <th className="p-4 text-left">
      Cotización
    </th>

    <th className="p-4 text-left">
      Cliente
    </th>

    <th className="p-4 text-left">
      Servicio
    </th>

    <th className="p-4 text-left">
      Valor
    </th>

    <th className="p-4 text-left">
      Saldo
    </th>

    <th className="p-4 text-left">
      Estado
    </th>
  </tr>
</thead>
          

          <tbody className="divide-y">
  {facturas.map((factura) => (
    <tr key={factura.id}>

  <td className="p-4 font-medium">
  {factura.numeroFactura}
</td>

<td className="p-4">
  {factura.pedido?.numeroPedido || "-"}
</td>

<td className="p-4">
  {factura.pedido?.cotizacion?.numeroCotizacion || "-"}
</td>

<td className="p-4">
  {factura.pedido?.cliente?.razonSocial || "-"}
</td>

<td className="p-4">
  <div>
    <div className="font-medium">
      {factura.pedido?.tipoServicio || "-"}
    </div>

    <div className="text-xs text-gray-500">
      {factura.pedido?.descripcion || "-"}
    </div>
  </div>
</td>

<td className="p-4">
  $
  {factura.valor?.toLocaleString()}
</td>

<td className="p-4 text-red-600 font-medium">
  $
  {factura.saldoPendiente?.toLocaleString()}
</td>

<td className="p-4">
  <span
    className={
      factura.estadoPago === "PAGADA"
        ? "bg-green-100 text-green-700 px-2 py-1 rounded"
        : factura.estadoPago === "PARCIAL"
        ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
        : "bg-red-100 text-red-700 px-2 py-1 rounded"
    }
  >
    {factura.estadoPago}
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