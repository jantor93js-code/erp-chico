import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-10 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-sky-500">
              ERP CHICÓ
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
              Control integral de operación, administración y PMO.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Inicia sesión para acceder a tu panel operativo y descubre el nuevo espacio PMO para gestionar tareas, proyectos y resultados estratégicos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/pmo"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Ir a PMO
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-lg shadow-slate-900/10">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-400/90">
              Módulo PMO
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Visualiza prioridades y entregables en un solo lugar.
            </h2>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li>• Tablero ejecutivo para decisiones rápidas</li>
              <li>• Seguimiento unificado de tareas</li>
              <li>• Enfoque operativo con estado y prioridad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
