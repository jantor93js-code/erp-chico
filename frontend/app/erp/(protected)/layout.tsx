"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthGuard from "@/src/components/AuthGuard";
import LogoutButton from "@/src/components/LogoutButton";

const navItems = [
  { href: "/erp/dashboard", label: "Dashboard" },
  { href: "/erp/clientes", label: "Clientes" },
  { href: "/erp/cotizaciones", label: "Cotizaciones" },
  { href: "/erp/pedidos", label: "Pedidos" },
  { href: "/erp/servicios", label: "Servicios" },
  { href: "/erp/gastos-operativos", label: "Gastos Operativos" },
  { href: "/erp/evidencias", label: "Evidencias" },
  { href: "/erp/facturas", label: "Facturas" },
  { href: "/erp/pagos", label: "Pagos" },
  { href: "/erp/cartera", label: "Cartera" },
  { href: "/erp/vehiculos", label: "Vehículos" },
  { href: "/erp/conductores", label: "Conductores" },
  { href: "/erp/reportes", label: "Reportes" },
];

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("erpSidebarCollapsed");

    if (saved) {
      setCollapsed(saved === "true");
    }
  }, []);

  function toggleSidebar() {
    const next = !collapsed;

    localStorage.setItem(
      "erpSidebarCollapsed",
      String(next)
    );

    setCollapsed(next);
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen min-w-0 flex-col bg-zinc-100 md:flex-row">
        <aside
          className={`w-full overflow-y-auto bg-gray-900 p-4 text-white transition-all sm:p-6 md:min-h-screen ${
            collapsed ? "md:w-20" : "md:w-72"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1
                className={`text-2xl font-bold ${
                  collapsed ? "sr-only" : ""
                }`}
              >
                ERP CHICÓ
              </h1>

              {!collapsed && (
                <p className="text-sm text-gray-400">
                  Gestión Operativa y Administrativa
                </p>
              )}
            </div>

            <button
              onClick={toggleSidebar}
              className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
            >
              {collapsed ? ">>" : "<<"}
            </button>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white transition hover:bg-slate-800"
                title={item.label}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />

                {!collapsed && item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 md:mt-10">
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-auto bg-zinc-100 p-4 text-zinc-900 md:p-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}