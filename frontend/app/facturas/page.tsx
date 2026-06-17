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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Facturas
      </h1>

      <table className="w-full border table-fixed">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
  Factura
</th>

<th className="p-3 text-left">
  Pedido
</th>

<th className="p-3 text-left">
  Valor
</th>

<th className="p-3 text-left">
  Estado
</th>
          </tr>
        </thead>

        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id} className="border-b">
              <td className="p-3">
                {factura.numeroFactura}
              </td>

              <td className="p-3">
                {factura.pedido?.descripcion}
              </td>

              <td className="p-3">

  <span
    className={
      factura.estadoPago === "PAGADA"
        ? "bg-green-100 text-green-700 px-2 py-1 rounded"
        : factura.estadoPago === "ABONADA"
        ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
        : "bg-red-100 text-red-700 px-2 py-1 rounded"
    }
  >
    {factura.estadoPago}
  </span>

</td>

              <td className="p-3">
                {factura.estadoPago}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
