export type ExecutiveMetricItem = {
  label: string;
  value: number;
  badgeLabel: string;
  badgeClassName: string;
  reduced?: boolean;
};

type ExecutiveMetricsProps = {
  metrics: ExecutiveMetricItem[];
};

export default function ExecutiveMetrics({ metrics }: ExecutiveMetricsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-4">
      {metrics.map((metric) => {
        const isReduced = Boolean(metric.reduced);
        return (
          <div
            key={metric.label}
            className={`kpi-card ${isReduced ? 'opacity-70 bg-slate-50' : ''}`}
          >
            <div className="left">
              <div className="meta">
                <div className={`num ${isReduced ? 'text-slate-500 text-2xl' : ''}`}>{metric.value}</div>
                <div className={`label ${isReduced ? 'text-slate-500' : ''}`}>{metric.label}</div>
              </div>
            </div>
            <div className={`${isReduced ? 'badge badge--gray opacity-50' : metric.badgeClassName}`}>{metric.badgeLabel}</div>
          </div>
        );
      })}
    </section>
  );
}
