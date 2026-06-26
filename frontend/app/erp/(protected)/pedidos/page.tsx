"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const [form, setForm] = useState({
    clienteId: "",
    ejecutivoId: "",
    descripcion: "",
    valorTotalPactado: "",
  });

  useEffect(() => {
    cargarPedidos();
    cargarClientes();
    cargarUsuarios();
  }, []);

  async function cargarPedidos() {
    try {
      const data = await apiGet("/pedidos");
      setPedidos(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarClientes() {
    try {
      const data = await apiGet("/clientes");
      setClientes(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cargarUsuarios() {
    try {
      const data = await apiGet("/users");
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function crearPedido() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${API_URL}/pedidos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId: "d07d9ffa-9267-41d0-8b43-14ddbb0823a0",
            clienteId: form.clienteId,
            ejecutivoId: form.ejecutivoId,
            descripcion: form.descripcion,
            valorTotalPactado: Number(form.valorTotalPactado),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(JSON.stringify(error.message));
        return;
      }

     await response.json();

     await cargarPedidos();

      setForm({
        clienteId: "",
        ejecutivoId: "",
        descripcion: "",
        valorTotalPactado: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error creando pedido");
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8">

  <h1 className="text-3xl font-bold">
    Pedidos
  </h1>

  <p className="text-gray-500">
    Gestión comercial de pedidos
  </p>
<div className="grid md:grid-cols-3 gap-4 mb-8">

  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-sm text-gray-500">
      Total pedidos
    </h3>

    <p className="text-2xl font-bold">
      {pedidos.length}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-sm text-gray-500">
      Clientes
    </h3>

    <p className="text-2xl font-bold">
      {clientes.length}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="text-sm text-gray-500">
      Ejecutivos
    </h3>

    <p className="text-2xl font-bold">
      {usuarios.length}
    </p>
  </div>

</div>
</div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
<h2 className="font-semibold mb-4">
  Nuevo Pedido
</h2>
        <select
  className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
  value={form.clienteId}
  onChange={(e) =>
    setForm({
      ...form,
      clienteId: e.target.value,
    })
  }
>
  <option value="">
    Seleccione cliente
  </option>

  {clientes.map((cliente) => (
    <option
      key={cliente.id}
      value={cliente.id}
    >
      {cliente.razonSocial}
    </option>
  ))}
</select>

<select
  className="border border-gray-300 bg-white text-zinc-900 p-2 mr-2 rounded"
  value={form.ejecutivoId}
  onChange={(e) =>
    setForm({
      ...form,
      ejecutivoId: e.target.value,
    })
  }
>
  <option value="">
    Seleccione ejecutivo
  </option>

  {usuarios.map((usuario) => (
    <option
      key={usuario.id}
      value={usuario.id}
    >
      {usuario.email}
    </option>
  ))}
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
    form.valorTotalPactado
      ? Number(
          form.valorTotalPactado
        ).toLocaleString("es-CO")
      : ""
  }
  onChange={(e) => {
    const soloNumeros =
      e.target.value.replace(/\D/g, "");

    setForm({
      ...form,
      valorTotalPactado: soloNumeros,
    });
  }}
/>

        <div>
          <button
            onClick={crearPedido}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Crear Pedido
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
  <table className="w-full">
 <thead>
  <tr className="border-b">

    <th className="p-3 text-left">
      Pedido
    </th>

    <th className="p-3 text-left">
      Cotización
    </th>

    <th className="p-3 text-left">
      Cliente
    </th>

<th className="p-3 text-left">
  Tipo
</th>

<th className="p-3 text-left">
  Descripción
</th>    <th className="p-3 text-left">
      Ruta
    </th>

    <th className="p-3 text-left">
      Valor
    </th>

    <th className="p-3 text-left">
      Estado
    </th>

  </tr>
</thead>

 <tbody className="divide-y">
  {pedidos.length === 0 && (
    <tr>
      <td
        colSpan={8}
        className="p-8 text-center text-gray-500"
      >
        No hay pedidos registrados
      </td>
    </tr>
  )}

  {pedidos.map((pedido) => (
    <tr
      key={pedido.id}
      className="hover:bg-gray-50 transition"
    >
      <td className="p-3 font-medium">
        {pedido.numeroPedido}
      </td>

      <td className="p-3">
        {pedido.cotizacion?.numeroCotizacion || "-"}
      </td>

      <td className="p-3">
        {pedido.cliente?.razonSocial}
      </td>

      <td className="p-3">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
          {pedido.tipoServicio || "-"}
        </span>
      </td>

      <td className="p-3 max-w-xs">
        {pedido.descripcion || "-"}
      </td>

      <td className="p-3">
        {pedido.origen}
        {" → "}
        {pedido.destino}
      </td>

      <td className="p-3">
        $
        {pedido.valorTotalPactado?.toLocaleString()}
      </td>

      <td className="p-3">
        <span
          className={
            pedido.estado === "SOLICITADO"
              ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs"
              : pedido.estado === "PROGRAMADO"
              ? "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
              : pedido.estado === "EN_PROCESO"
              ? "bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
              : pedido.estado === "FINALIZADO"
              ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
              : "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
          }
        >
          {pedido.estado}
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
