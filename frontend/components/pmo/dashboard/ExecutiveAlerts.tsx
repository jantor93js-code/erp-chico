import { useEffect, useState, type MouseEvent } from 'react';
import ExpandToggle from '@/components/pmo/dashboard/ExpandToggle';

export type ExecutiveAlertsProps = {
  alerts: {
    sinResponsable: number;
    sinCodigo: number;
    sinEnlace: number;
    proximos: number;
    vencidos: number;
  };
  onFilter: (filterKey: 'sinResponsable' | 'sinCodigo' | 'sinEnlace' | 'proximos' | 'vencidos') => void;
};

const riskItems = [
  {
    key: 'vencidos' as const,
    label: 'No vigentes',
    description: 'Documentos no vigentes que requieren atención inmediata.',
    severityClass: 'badge--red',
  },
  {
    key: 'sinResponsable' as const,
    label: 'Sin responsable',
    description: 'Documentos sin responsable de actualización o revisión.',
    severityClass: 'badge--orange',
  },
  {
    key: 'sinCodigo' as const,
    label: 'Sin código',
    description: 'Documentos sin código asignado para identificación.',
    severityClass: 'badge--yellow',
  },
  {
    key: 'sinEnlace' as const,
    label: 'Sin enlace',
    description: 'Documentos sin enlace de acceso o referencia.',
    severityClass: 'badge--yellow',
  },
  {
    key: 'proximos' as const,
    label: 'Próximos',
    description: 'Documentos próximos a vencer dentro de 30 días.',
    severityClass: 'badge--yellow',
  },
];

type RiskKey = (typeof riskItems)[number]['key'];

type RiskExpandedState = Record<RiskKey, boolean>;

export default function ExecutiveAlerts({ alerts, onFilter }: ExecutiveAlertsProps) {
  const [expandedItems, setExpandedItems] = useState<RiskExpandedState>(() =>
    riskItems.reduce((acc, risk) => {
      acc[risk.key] = risk.key === 'vencidos' && alerts.vencidos > 0;
      return acc;
    }, {} as RiskExpandedState)
  );

  useEffect(() => {
    setExpandedItems((current) => ({
      ...current,
      vencidos: alerts.vencidos > 0,
    }));
  }, [alerts.vencidos]);

  const metricMap = {
    sinResponsable: alerts.sinResponsable,
    sinCodigo: alerts.sinCodigo,
    sinEnlace: alerts.sinEnlace,
    proximos: alerts.proximos,
    vencidos: alerts.vencidos,
  };

  const toggleRisk = (key: RiskKey) => {
    setExpandedItems((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const expandAll = () => {
    setExpandedItems(
      riskItems.reduce((acc, risk) => ({ ...acc, [risk.key]: true }), {} as RiskExpandedState)
    );
  };

  const collapseAll = () => {
    setExpandedItems(
      riskItems.reduce((acc, risk) => ({ ...acc, [risk.key]: false }), {} as RiskExpandedState)
    );
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Riesgos operativos</p>
          <p className="text-sm text-slate-500">Indicadores críticos de seguimiento.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Expandir todo
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Colapsar todo
          </button>
          <span className="badge badge--red">Alerta</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {riskItems.map((risk) => {
          const value = metricMap[risk.key];
          const isExpanded = expandedItems[risk.key];
          const isReduced = (risk.key === 'sinCodigo' || risk.key === 'sinEnlace') && value === 0;
          return (
            <div
              key={risk.key}
              className={`rounded-3xl border border-slate-200 bg-slate-50 transition hover:border-slate-300 ${isReduced ? 'opacity-70' : ''}`}
            >
              <button
                type="button"
                onClick={() => toggleRisk(risk.key)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-3.5 w-3.5 rounded-full ${isReduced ? 'bg-slate-400' : risk.severityClass === 'badge--red' ? 'bg-red-600' : risk.severityClass === 'badge--orange' ? 'bg-orange-600' : 'bg-amber-600'}`} />
                  <div>
                    <div className={`text-sm font-semibold ${isReduced ? 'text-slate-500' : 'text-slate-900'}`}>{risk.label}</div>
                    <div className={`text-xs ${isReduced ? 'text-slate-500' : 'text-slate-500'}`}>{value} documentos</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      onFilter(risk.key);
                    }}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition hover:border-slate-300 hover:bg-slate-100 ${isReduced ? 'border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    Ver en tabla
                  </span>
                  <ExpandToggle
                    as="span"
                    expanded={isExpanded}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleRisk(risk.key);
                    }}
                    label="Ver detalle"
                    ariaLabel={`Alternar detalle de ${risk.label}`}
                    className="text-slate-700"
                  />
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-40 px-4 pb-4' : 'max-h-0 px-4'}`}>
                {isExpanded && (
                  <p className="text-sm leading-6 text-slate-600">{risk.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations removed from UI as requested */}
    </section>
  );
}
