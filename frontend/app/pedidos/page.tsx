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
      const response = await fetch(
        "http://localhost:3001/api/v1/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId: "4092474c-9ff7-4c2d-98f9-cd6904837d6f",
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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Pedidos
      </h1>

      <div className="mb-8 space-y-2">

        <select
  className="border border-gray-300 bg-white text-black p-2 mr-2 rounded"
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
  className="border border-gray-300 bg-white text-black p-2 mr-2 rounded"
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
          className="border p-2 mr-2"
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
          className="border p-2 mr-2"
          placeholder="Valor"
          value={form.valorTotalPactado}
          onChange={(e) =>
            setForm({
              ...form,
              valorTotalPactado: e.target.value,
            })
          }
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

      <table className="w-full border table-fixed">
  <thead>
    <tr className="border-b">
      <th className="p-3 text-left w-1/5">
        Cliente
      </th>

      <th className="p-3 text-left w-1/5">
        Ejecutivo
      </th>

      <th className="p-3 text-left w-2/5">
        Descripción
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
    {pedidos.map((pedido) => (
      <tr
        key={pedido.id}
        className="border-b"
      >
        <td className="p-3">
          {pedido.cliente?.razonSocial}
        </td>

        <td className="p-3">
          {pedido.ejecutivo?.email}
        </td>

        <td className="p-3">
          {pedido.descripcion}
        </td>

        <td className="p-3">
          $
          {pedido.valorTotalPactado?.toLocaleString()}
        </td>

        <td className="p-3">
          {pedido.estado}
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}