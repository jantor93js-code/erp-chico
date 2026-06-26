import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white/95 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center p-10">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
              MÉTRIC PMO SaaS
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Gestión ágil de portafolios, proyectos y tareas para líderes de transformación.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Una experiencia premium de PMO que pone visibilidad, gobernanza y ritmo operativo en un solo tablero.
                Conecte a clientes, programas, iniciativas, proyectos y ejecución diaria sin dispersión.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/pmo/login"
                className="inline-flex items-center justify-center rounded-full bg-[#C89B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1871a]"
              >
                Iniciar sesión en MÉTRIC PMO
              </Link>
              <Link
                href="/pmo/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                Ver dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-lg shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Productividad estratégica</p>
            <h2 className="mt-4 text-3xl font-semibold">Decisiones basadas en ritmo, riesgo y resultados.</h2>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li>• Portafolio unificado de clientes, programas, iniciativas y proyectos.</li>
              <li>• Tareas con responsables, plazos, estados y alertas tempranas.</li>
              <li>• Reportes ejecutivos claros para la dirección y el comité.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
