"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

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
        "http://localhost:3001/api/v1/pagos",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
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
      });

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Pagos
      </h1>

      <div className="mb-8 space-y-3">

        <select
          className="border p-2 rounded"
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
          className="border p-2 rounded ml-2"
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

        <input
          className="border p-2 rounded ml-2"
          placeholder="Método pago"
          value={form.metodoPago}
          onChange={(e) =>
            setForm({
              ...form,
              metodoPago:
                e.target.value,
            })
          }
        />

        <button
          onClick={crearPago}
          className="bg-green-600 text-white px-4 py-2 rounded ml-2"
        >
          Registrar Pago
        </button>

      </div>

      <table className="w-full border table-fixed">

        <thead>
          <tr className="border-b">
           <th className="p-3 text-left">
  Factura
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

        <tbody>
          {pagos.map((pago) => (
            <tr
              key={pago.id}
              className="border-b"
            >
              <td className="p-3">
                {
                  pago.factura
                    ?.numeroFactura
                }
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
  );
}