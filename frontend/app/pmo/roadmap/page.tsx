"use client";

import PmoShell from "@/src/components/layout/PmoShell";
import StatusBadge from "@/src/components/pmo/StatusBadge";
import PageHeader from "@/src/components/pmo/PageHeader";

const quarters = [
  {
    id: "q3-2026", label: "Q3 2026", range: "Jul – Sep 2026", current: true,
    items: [
      { name: "ERP CHICÓ — Módulo Core",            initiative: "ERP CHICÓ",           status: "En curso",    pct: 90 },
      { name: "ERP CHICÓ — Integración Facturación",initiative: "ERP CHICÓ",           status: "En curso",    pct: 75 },
      { name: "Dashboard Financiero v1",             initiative: "División Financiera", status: "En curso",    pct: 70 },
      { name: "Pipeline CRM Comercial",              initiative: "CRM Comercial",       status: "En curso",    pct: 65 },
      { name: "Onboarding Portal Cliente",           initiative: "Portal Cliente",      status: "Retrasado",   pct: 35 },
    ],
  },
  {
    id: "q4-2026", label: "Q4 2026", range: "Oct – Dic 2026", current: false,
    items: [
      { name: "ERP CHICÓ — Reportes Gerenciales",   initiative: "ERP CHICÓ",           status: "Planificado", pct: 60 },
      { name: "Conciliación Automática",             initiative: "División Financiera", status: "Planificado", pct: 20 },
      { name: "Seguimiento Leads CRM",               initiative: "CRM Comercial",       status: "Planificado", pct: 50 },
      { name: "Portal de Documentos",                initiative: "Portal Cliente",      status: "Pausado",     pct: 25 },
      { name: "Manual de Procesos v1",               initiative: "Modelo Operativo",    status: "Planificado", pct: 40 },
    ],
  },
  {
    id: "q1-2027", label: "Q1 2027", range: "Ene – Mar 2027", current: false,
    items: [
      { name: "ERP CHICÓ — Cierre y estabilización",initiative: "ERP CHICÓ",            status: "Planificado", pct: 0 },
      { name: "Estructura Organizacional v2",        initiative: "Blueprint Org.",       status: "Planificado", pct: 18 },
      { name: "Modelo Operativo — Implementación",   initiative: "Modelo Operativo",     status: "Planificado", pct: 0 },
      { name: "Portal Cliente — Go Live",            initiative: "Portal Cliente",       status: "Planificado", pct: 0 },
    ],
  },
  {
    id: "q2-2027", label: "Q2 2027", range: "Abr – Jun 2027", current: false,
    items: [
      { name: "Cierre programa PMO",                 initiative: "MÉTRIC PMO",           status: "Planificado", pct: 0 },
      { name: "Transferencia de conocimiento",       initiative: "Blueprint Org.",        status: "Planificado", pct: 0 },
      { name: "Entrega final Blueprint",             initiative: "Blueprint Org.",        status: "Planificado", pct: 0 },
    ],
  },
];

function barColor(pct: number) {
  if (pct >= 75) return "#15803D";
  if (pct >= 50) return "#C89B2A";
  if (pct >= 25) return "#D97706";
  return "#B91C1C";
}

export default function RoadmapPage() {
  return (
    <PmoShell>
      <PageHeader section="PMO · Roadmap" title="Roadmap del Programa" description="Planificación temporal por trimestre del portafolio de transformación 2026–2027." />
      <div className="px-8 py-6 space-y-6">

        {/* Línea de tiempo */}
        <div className="hidden xl:flex items-center">
          {quarters.map((q, i) => (
            <div key={q.id} className="flex flex-1 items-center">
              <div
                className="flex h-7 shrink-0 items-center gap-2 px-3 text-[11px] font-bold"
                style={q.current
                  ? { background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }
                  : { background: "#F5F3EF", color: "#9CA3AF", border: "1px solid #D6D3D1" }
                }
              >
                <span
                  className="h-1.5 w-1.5"
                  style={{ borderRadius: "50%", background: q.current ? "#C89B2A" : "#D6D3D1", display: "inline-block" }}
                />
                {q.label}
              </div>
              {i < quarters.length - 1 && (
                <div className="flex-1 h-px mx-2" style={{ background: "#D6D3D1" }} />
              )}
            </div>
          ))}
        </div>

        {/* Columnas por trimestre */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quarters.map((q) => (
            <div
              key={q.id}
              className="p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #D6D3D1",
                borderTop: q.current ? "2px solid #C89B2A" : "2px solid #D6D3D1",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold" style={{ color: q.current ? "#92400E" : "#1F2937" }}>{q.label}</p>
                  <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{q.range}</p>
                </div>
                {q.current && (
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
                  >
                    Activo
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {q.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-3"
                    style={{ background: "#F5F3EF", border: "1px solid #D6D3D1" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] font-semibold leading-snug" style={{ color: "#1F2937" }}>{item.name}</p>
                      <StatusBadge status={item.status} dot={false} />
                    </div>
                    <p className="mt-0.5 text-[10px]" style={{ color: "#9CA3AF" }}>{item.initiative}</p>
                    {item.pct > 0 && (
                      <div className="mt-2">
                        <div className="h-1 overflow-hidden" style={{ background: "#D6D3D1" }}>
                          <div className="h-full" style={{ width: `${item.pct}%`, background: barColor(item.pct) }} />
                        </div>
                        <p className="mt-0.5 text-right text-[10px]" style={{ color: "#9CA3AF" }}>{item.pct}%</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PmoShell>
  );
}
