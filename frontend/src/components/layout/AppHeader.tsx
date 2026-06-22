import Link from "next/link";

export default function AppHeader() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/90 p-5 shadow-sm shadow-zinc-900/5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-500">
          Oficina PMO
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Tablero ejecutivo de productividad
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl">
          Visión centralizada de proyectos, tareas y hitos operativos para la gestión estratégica.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/pmo"
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        >
          Ver PMO completo
        </Link>
      </div>
    </div>
  );
}
