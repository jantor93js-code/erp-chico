type ExecutiveHeaderProps = {
  title: string;
  description: string;
  subtitle?: string;
  activeAreaName: string;
  areaSelected: boolean;
  onNewDocument: () => void;
  actionLabel?: string;
};

export default function ExecutiveHeader({
  title,
  description,
  subtitle,
  activeAreaName,
  areaSelected,
  onNewDocument,
  actionLabel = '+ Nuevo documento',
}: ExecutiveHeaderProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Panel ejecutivo</p>
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          <div className="space-y-2">
            <p className="text-sm leading-6 text-slate-600">{description}</p>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          {areaSelected && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="badge badge--blue">Área activa: {activeAreaName}</span>
            </div>
          )}
        </div>

        <button onClick={onNewDocument} className="btn btn--primary">
          {actionLabel}
        </button>
      </div>
    </section>
  );
}
