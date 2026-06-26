"use client";

import PmoShell from "@/src/components/layout/PmoShell";
import StatusBadge from "@/src/components/pmo/StatusBadge";
import PageHeader from "@/src/components/pmo/PageHeader";

const decisions = [
  { title: "Aprobar presupuesto PMO Q3 2026",              owner: "Carmen Ruiz",  date: "15 jul 2026", status: "Pendiente", impact: "ERP CHICÓ · División Financiera" },
  { title: "Priorizar CRM Comercial vs Portal Cliente",    owner: "Javier Mora",  date: "20 jul 2026", status: "Pendiente", impact: "CRM Comercial · Portal Cliente" },
  { title: "Definir arquitectura técnica Blueprint",       owner: "Laura Vega",   date: "30 jul 2026", status: "Pendiente", impact: "Blueprint Organizacional" },
  { title: "Seleccionar herramienta de conciliación",      owner: "Rosa Díaz",    date: "10 jul 2026", status: "Pendiente", impact: "División Financiera" },
  { title: "Ampliar alcance MVP Portal Cliente",           owner: "Andrés Gil",   date: "5 jul 2026",  status: "Aprobada",  impact: "Portal Cliente" },
  { title: "Contratar consultor externo Modelo Operativo", owner: "Mario Niño",   date: "1 jul 2026",  status: "Aprobada",  impact: "Modelo Operativo" },
  { title: "Congelar módulo de reportes ERP hasta Q4",     owner: "Pedro Salas",  date: "25 jun 2026", status: "Rechazada", impact: "ERP CHICÓ" },
];

const grouped = {
  Pendiente: decisions.filter((d) => d.status === "Pendiente"),
  Aprobada:  decisions.filter((d) => d.status === "Aprobada"),
  Rechazada: decisions.filter((d) => d.status === "Rechazada"),
};

const sectionMeta: Record<string, { label: string; bar: string }> = {
  Pendiente: { label: "Pendientes de resolución", bar: "#C89B2A" },
  Aprobada:  { label: "Decisiones aprobadas",     bar: "#15803D" },
  Rechazada: { label: "Decisiones rechazadas",    bar: "#991B1B" },
};

const ownerInitials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function DecisionesPage() {
  return (
    <PmoShell>
      <PageHeader section="PMO · Decisiones" title="Registro de Decisiones" description="Actas y decisiones del Comité Ejecutivo con estado de resolución y responsables." />

      <div className="space-y-8 px-8 py-6">
        {(["Pendiente", "Aprobada", "Rechazada"] as const).map((statusKey) => {
          const items = grouped[statusKey];
          if (!items.length) return null;
          const { label, bar } = sectionMeta[statusKey];
          return (
            <div key={statusKey}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-4 w-0.5" style={{ background: bar, display: "inline-block" }} />
                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#9CA3AF" }}>
                  {label}
                </p>
                <span
                  className="px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: "#F5F3EF", color: "#6B7280", border: "1px solid #D6D3D1" }}
                >
                  {items.length}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((d) => (
                  <div
                    key={d.title}
                    className="flex flex-col gap-3 p-5"
                    style={{ background: "#FFFFFF", border: "1px solid #D6D3D1", borderTop: `2px solid ${bar}` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold leading-snug" style={{ color: "#1F2937" }}>{d.title}</p>
                      <StatusBadge status={d.status} dot size="xs" />
                    </div>
                    <p className="text-[11px]" style={{ color: "#9CA3AF" }}>Impacta: {d.impact}</p>
                    <div
                      className="flex items-center justify-between gap-3 pt-3"
                      style={{ borderTop: "1px solid #E5E7EB" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center text-[9px] font-bold"
                          style={{ background: "#F5F3EF", color: "#92701A", border: "1px solid #D6D3D1" }}
                        >
                          {ownerInitials(d.owner)}
                        </div>
                        <span className="text-xs" style={{ color: "#6B7280" }}>{d.owner}</span>
                      </div>
                      <span className="text-[11px]" style={{ color: "#9CA3AF" }}>{d.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PmoShell>
  );
}
