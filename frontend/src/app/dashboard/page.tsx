"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function DashboardPage() {
  const [servicios, setServicios] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const data = await apiGet("/servicios");
      setServicios(data);
    } catch (error) {
      console.error(error);
    }
  }

  const programados = servicios.filter(
    (s) => s.estado === "PROGRAMADO"
  ).length;

  const enRuta = servicios.filter(
    (s) => s.estado === "EN_RUTA"
  ).length;

  const entregados = servicios.filter(
    (s) => s.estado === "ENTREGADO"
  ).length;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-yellow-100 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">
            Programados
          </h2>

          <p className="text-4xl font-bold mt-2">
            {programados}
          </p>
        </div>

        <div className="bg-blue-100 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">
            En Ruta
          </h2>

          <p className="text-4xl font-bold mt-2">
            {enRuta}
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">
            Entregados
          </h2>

          <p className="text-4xl font-bold mt-2">
            {entregados}
          </p>
        </div>

      </div>
    </div>
  );
}