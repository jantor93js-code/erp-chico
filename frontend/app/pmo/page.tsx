"use client";

import AuthGuard from "@/src/components/AuthGuard";
import AppHeader from "@/src/components/layout/AppHeader";
import AppSidebar from "@/src/components/layout/AppSidebar";

const summaryCards = [
  { label: "Tareas abiertas", value: "42", accent: "text-sky-600" },
  { label: "En progreso", value: "18", accent: "text-amber-600" },
  { label: "Pendientes revisión", value: "10", accent: "text-violet-600" },
  { label: "Bloqueadas", value: "4", accent: "text-red-600" },
];

const chartCards = [
  { title: "Avance de proyectos", value: "72%", detail: "Progreso general en ejecución" },
  { title: "Carga por ejecutivo", value: "24 tareas", detail: "Equipo distribuyendo trabajo" },
  { title: "Tareas críticas", value: "9 tareas", detail: "Atención inmediata" },
  { title: "Última entrega", value: "48h", detail: "Tiempo ideal restante" },
];

export default function PmoPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-3xl bg-slate-950/95 p-6 text-slate-100 shadow-xl shadow-slate-900/20 ring-1 ring-white/10">
              <AppSidebar />
            </aside>

            <main className="space-y-6">
              <AppHeader />

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                      {card.label}
                    </p>
                    <p className={`mt-4 text-4xl font-semibold ${card.accent}`}>
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Actualizado al último ciclo.
                    </p>
                  </div>
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-3">
                <div className="col-span-2 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Progreso general</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">
                        Ciclos activos y entregables
                      </h3>
                    </div>
                    <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm text-sky-700">
                      72% completado
                    </span>
                  </div>

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400"></div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {chartCards.map((card) => (
                      <div key={card.title} className="rounded-3xl bg-slate-50 p-4">
                        <h4 className="text-sm font-semibold text-slate-900">{card.title}</h4>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                        <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                  <div>
                    <p className="text-sm text-slate-500">Prioridades</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Pendientes más importantes</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Revisión de cotizaciones", label: "Alta", color: "bg-red-100 text-red-700" },
                      { title: "Sprint de implementación", label: "Media", color: "bg-amber-100 text-amber-700" },
                      { title: "Evaluación de riesgos", label: "Baja", color: "bg-slate-100 text-slate-700" },
                    ].map((item) => (
                      <div key={item.title} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-semibold text-slate-900">{item.title}</h4>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>
                            {item.label}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          Actividad planificada para la siguiente semana.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Tareas recientes</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">Últimos movimientos</h3>
                  </div>
                  <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                    Ver tablero completo
                  </button>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {[
                    { title: "Definir plan mensual", status: "En progreso", owner: "Claudia", due: "Hoy" },
                    { title: "Aprobar presupuesto PMO", status: "Pendiente", owner: "Mario", due: "Mañana" },
                    { title: "Actualizar KPIs", status: "Bloqueada", owner: "Ana", due: "48h" },
                  ].map((task) => (
                    <div key={task.title} className="rounded-3xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {task.status}
                        </span>
                      </div>
                      <div className="mt-4 text-sm text-slate-600">
                        <p>{task.owner}</p>
                        <p className="mt-1 text-slate-500">Entrega {task.due}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
