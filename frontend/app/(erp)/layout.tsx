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

      <div className="flex min-h-screen">

        <aside className="w-64 bg-gray-900 text-white p-6">

          <h1 className="text-2xl font-bold mb-8">
            ERP CHICO
          </h1>

          <nav className="space-y-3">

            <Link
              href="/dashboard"
              className="block hover:text-blue-400"
            >
              Dashboard
            </Link>

            <Link
              href="/clientes"
              className="block hover:text-blue-400"
            >
              Clientes
            </Link>

            <Link
              href="/pedidos"
              className="block hover:text-blue-400"
            >
              Pedidos
            </Link>

            <Link
              href="/servicios"
              className="block hover:text-blue-400"
            >
              Servicios
            </Link>

            <Link
              href="/facturas"
              className="block hover:text-blue-400"
            >
              Facturas
            </Link>

            <Link
              href="/pagos"
              className="block hover:text-blue-400"
            >
              Pagos
            </Link>

            <Link
              href="/vehiculos"
              className="block hover:text-blue-400"
            >
              Vehículos
            </Link>
            <Link
  href="/gastos-operativos"
  className="block hover:text-blue-400"
>
  Gastos Operativos
</Link>
<Link
  href="/cotizaciones"
  className="block hover:text-blue-400"
>
  Cotizaciones
</Link>
<Link
  href="/cartera"
  className="block hover:text-blue-400"
>
  Cartera
</Link>
<Link
  href="/conductores"
  className="block hover:text-blue-400"
>
  Conductores
</Link>
<Link
  href="/reportes"
  className="block hover:text-blue-400"
>
  Reportes
</Link>
<Link
  href="/evidencias"
  className="block hover:text-blue-400"
>
  Evidencias
</Link>
          </nav>

          <div className="mt-10">
            <LogoutButton />
          </div>

        </aside>

        <main
  className="
    flex-1
    bg-zinc-100
    text-zinc-900
    dark:bg-zinc-950
    dark:text-zinc-100
    p-8
  "
>
  {children}
</main>

      </div>

    </AuthGuard>
  );
}