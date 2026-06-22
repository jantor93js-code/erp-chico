import Link from "next/link";

export default function AppSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          CHICÓ ERP
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          Oficina de gestión, operaciones y control.
        </p>
      </div>

      <div className="rounded-3xl bg-zinc-950/90 p-5 shadow-lg shadow-black/20 ring-1 ring-white/10">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300/90">
          Navegación
        </p>

        <nav className="mt-4 flex flex-col gap-2 text-sm text-slate-200">
          <Link href="/dashboard" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Dashboard
          </Link>
          <Link href="/clientes" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Clientes
          </Link>
          <Link href="/cotizaciones" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Cotizaciones
          </Link>
          <Link href="/pedidos" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Pedidos
          </Link>
          <Link href="/servicios" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Servicios
          </Link>
          <Link href="/pmo" className="rounded-2xl px-3 py-2 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 transition">
            PMO
          </Link>
          <Link href="/gastos-operativos" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Gastos Operativos
          </Link>
          <Link href="/evidencias" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Evidencias
          </Link>
          <Link href="/facturas" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Facturas
          </Link>
          <Link href="/pagos" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Pagos
          </Link>
          <Link href="/cartera" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Cartera
          </Link>
          <Link href="/vehiculos" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Vehículos
          </Link>
          <Link href="/conductores" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Conductores
          </Link>
          <Link href="/reportes" className="rounded-2xl px-3 py-2 hover:bg-white/10 transition">
            Reportes
          </Link>
        </nav>
      </div>
    </div>
  );
}
