"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PagosPage() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [facturas, setFacturas] = useState<any[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] =
  useState<any>(null);

  const [form, setForm] = useState({
  facturaId: "",
  valor: "",
  metodoPago: "",
  tipoPago: "ANTICIPO",
});

  useEffect(() => {
    cargarPagos();
    cargarFacturas();
  }, []);

  async function cargarPagos() {
    try {
      const data = await apiGet("/pagos");
      setPagos(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarFacturas() {
    try {
      const data = await apiGet("/facturas");

      setFacturas(
        data.filter(
          (f: any) =>
  f.estadoPago !== "PAGADA"
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function crearPago() {
    try {
      const token = localStorage.getItem("token");
      const valorNumerico = Number(
  form.valor.replace(/\./g, "")
);

if (
  facturaSeleccionada &&
  valorNumerico >
    facturaSeleccionada.saldoPendiente
) {
  alert(
    "El valor supera el saldo pendiente de la factura"
  );
  return;
}
      const response = await fetch(
        `${API_URL}/pagos`,
        {
          method: "POST",
          headers: {
  "Content-Type": "application/json",
  Authorization: token
    ? `Bearer ${token}`
    : "",
},
          body: JSON.stringify({
            facturaId: form.facturaId,
            valor: Number(
  form.valor.replace(/\./g, "")
),
            metodoPago:
              form.metodoPago,
          }),
        }
      );

      if (!response.ok) {
        alert("Error creando pago");
        return;
      }

      await cargarPagos();
      await cargarFacturas();

      setForm({
  facturaId: "",
  valor: "",
  metodoPago: "",
  tipoPago: "ANTICIPO",
});

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">

      <h1 className="text-3xl font-bold mb-8">
        Pagos
      </h1>
<p className="text-gray-500 mb-8">
  Registro y control de pagos
</p>
<div className="grid md:grid-cols-3 gap-4 mb-8">

  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-sm text-gray-500">
      Pagos registrados
    </h3>

    <p className="text-2xl font-bold">
      {pagos.length}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-sm text-gray-500">
      Facturas pendientes
    </h3>

    <p className="text-2xl font-bold">
      {facturas.length}
    </p>
  </div>

</div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <select
          className="border border-gray-300 bg-white text-zinc-900 p-2 rounded"
          value={form.facturaId}
          onChange={(e) => {
  const factura = facturas.find(
    (f) => f.id === e.target.value
  );

  setFacturaSeleccionada(factura);

setForm({
  ...form,
  facturaId: e.target.value,

  valor:
    form.tipoPago === "TOTAL"
      ? factura?.saldoPendiente
        ? factura.saldoPendiente.toLocaleString("es-CO")
        : ""
      : form.valor,
});
}}
        >
          <option value="">
            Seleccione factura
          </option>

          {facturas.map((factura) => (
            <option
  key={factura.id}
  value={factura.id}
>
  {factura.numeroFactura}
  {" | Saldo $"}
  {factura.saldoPendiente?.toLocaleString()}
</option>
          ))}
        </select>

{facturaSeleccionada && (
  <div className="border rounded p-4 mt-3">

    <p>
  <strong>Valor factura:</strong>
  {" "}
  $
  {facturaSeleccionada.valor?.toLocaleString()}
</p>

<p>
  <strong>Estado:</strong>
  {" "}
  {facturaSeleccionada.estadoPago}
</p>

<p>
  <strong>Pagado:</strong>
  {" "}
  $
  {(facturaSeleccionada.totalPagado || 0)
    .toLocaleString()}
</p>

<p>
  <strong>Saldo pendiente:</strong>
  {" "}
  $
  {(facturaSeleccionada.saldoPendiente || 0)
    .toLocaleString()}
</p>

    

  </div>
)}

<div className="mt-3">

  <label className="mr-4">
    <input
      type="radio"
      className="border-gray-300 bg-white text-zinc-900"
      name="tipoPago"
      value="ANTICIPO"
      checked={
        form.tipoPago === "ANTICIPO"
      }
      onChange={(e) =>
        setForm({
          ...form,
          tipoPago: e.target.value,
          valor: "",
        })
      }
    />

    <span className="ml-1">
      Anticipo
    </span>
  </label>

  <label>
    <input
      type="radio"
      className="border-gray-300 bg-white text-zinc-900"
      name="tipoPago"
      value="TOTAL"
      checked={
        form.tipoPago === "TOTAL"
      }
      onChange={(e) =>
        setForm({
          ...form,
          tipoPago: e.target.value,
          valor:
  facturaSeleccionada?.saldoPendiente
    ? facturaSeleccionada.saldoPendiente
        .toLocaleString("es-CO")
    : "",
        })
      }
    />

    <span className="ml-1">
      Pago total
    </span>
  </label>

</div>
        <input
          className="border border-gray-300 bg-white text-zinc-900 p-2 rounded ml-2"
          placeholder="Valor"
          value={form.valor}
          disabled={form.tipoPago === "TOTAL"}
          onChange={(e) => {
  const soloNumeros =
    e.target.value.replace(/\D/g, "");

  const valorFormateado =
    Number(soloNumeros).toLocaleString(
      "es-CO"
    );

  setForm({
    ...form,
    valor:
      soloNumeros === ""
        ? ""
        : valorFormateado,
  });
}}
        />

        <select
  className="border border-gray-300 bg-white text-zinc-900 rounded-lg p-3"
  value={form.metodoPago}
  onChange={(e) =>
    setForm({
      ...form,
      metodoPago: e.target.value,
    })
  }
>
  <option value="">
    Método de pago
  </option>

  <option value="EFECTIVO">
    EFECTIVO
  </option>

  <option value="TRANSFERENCIA">
    TRANSFERENCIA
  </option>

  <option value="NEQUI">
    NEQUI
  </option>

  <option value="DAVIPLATA">
    DAVIPLATA
  </option>

  <option value="TARJETA">
    TARJETA
  </option>
</select>

        <button
          onClick={crearPago}
          className="bg-green-600 text-white px-4 py-2 rounded ml-2"
        >
          Registrar Pago
        </button>

      </div>

      <div className="overflow-x-auto">
  <table className="w-full">

        <thead>
  <tr className="border-b">

    <th className="p-3 text-left">
      Factura
    </th>

    <th className="p-3 text-left">
      Cliente
    </th>

    <th className="p-3 text-left">
      Pedido
    </th>

    <th className="p-3 text-left">
      Valor
    </th>

    <th className="p-3 text-left">
      Método
    </th>

    <th className="p-3 text-left">
      Fecha
    </th>

  </tr>
</thead>

        <tbody className="divide-y">
          {pagos.length === 0 && (
  <tr>
    <td
      
      colSpan={6}
  className="p-8 text-center text-gray-500"
>
      No hay pagos registrados
    </td>
  </tr>
)}
          {pagos.map((pago) => (
            <tr
  key={pago.id}
  className="hover:bg-gray-50 transition"
>

  <td className="p-3">
    {pago.factura?.numeroFactura}
  </td>

  <td className="p-3">
    {pago.factura?.pedido?.cliente?.razonSocial}
  </td>

  <td className="p-3">
    {pago.factura?.pedido?.numeroPedido}
  </td>

  <td className="p-3">
    $
    {pago.valor?.toLocaleString()}
  </td>

  <td className="p-3">
    {pago.metodoPago}
  </td>

  <td className="p-3">
    {new Date(
      pago.fechaPago
    ).toLocaleString()}
  </td>

</tr>
          ))}
        </tbody>

      </table>
</div>

    </div>
  );
}
