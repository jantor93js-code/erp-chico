"use client";

import Link from "next/link";
import AuthGuard from "@/src/components/AuthGuard";
import LogoutButton from "@/src/components/LogoutButton";

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row min-h-screen bg-zinc-100">

        {/* Sidebar */}
        <aside
          className="
            w-full
            md:w-64
            bg-gray-900
            text-white
            p-6
            md:min-h-screen
            overflow-y-auto
          "
        >
          <h1 className="text-2xl font-bold">
            ERP CHICÓ
          </h1>

          <p className="text-sm text-gray-400 mb-8">
            Gestión Operativa y Administrativa
          </p>

          <nav className="space-y-3">

            <Link
              href="/dashboard"
              className="block hover:text-blue-400 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/clientes"
              className="block hover:text-blue-400 transition"
            >
              Clientes
            </Link>

            <Link
              href="/cotizaciones"
              className="block hover:text-blue-400 transition"
            >
              Cotizaciones
            </Link>

            <Link
              href="/pedidos"
              className="block hover:text-blue-400 transition"
            >
              Pedidos
            </Link>

            <Link
              href="/servicios"
              className="block hover:text-blue-400 transition"
            >
              Servicios
            </Link>

            <Link
              href="/gastos-operativos"
              className="block hover:text-blue-400 transition"
            >
              Gastos Operativos
            </Link>

            <Link
              href="/evidencias"
              className="block hover:text-blue-400 transition"
            >
              Evidencias
            </Link>

            <Link
              href="/facturas"
              className="block hover:text-blue-400 transition"
            >
              Facturas
            </Link>

            <Link
              href="/pagos"
              className="block hover:text-blue-400 transition"
            >
              Pagos
            </Link>

            <Link
              href="/cartera"
              className="block hover:text-blue-400 transition"
            >
              Cartera
            </Link>

            <Link
              href="/vehiculos"
              className="block hover:text-blue-400 transition"
            >
              Vehículos
            </Link>

            <Link
              href="/conductores"
              className="block hover:text-blue-400 transition"
            >
              Conductores
            </Link>

            <Link
              href="/reportes"
              className="block hover:text-blue-400 transition"
            >
              Reportes
            </Link>

          </nav>

          <div className="mt-10">
            <LogoutButton />
          </div>
        </aside>

        {/* Contenido */}
        <main
          className="
            flex-1
            bg-zinc-100
            text-zinc-900
            p-4
            md:p-8
            overflow-auto
          "
        >
          {children}
        </main>

      </div>
    </AuthGuard>
  );
}