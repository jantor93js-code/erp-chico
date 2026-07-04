export type ExecutiveSummaryItem = {
  label: string;
  value: string;
};

type ExecutiveSummaryProps = {
  items: ExecutiveSummaryItem[];
};

export default function ExecutiveSummary({ items }: ExecutiveSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Resumen ejecutivo</p>
          <p className="text-sm text-slate-500">Información clave para la toma de decisiones.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
