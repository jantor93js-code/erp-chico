"use client";

import PmoShell from "@/src/components/layout/PmoShell";
import StatusBadge from "@/src/components/pmo/StatusBadge";
import PageHeader from "@/src/components/pmo/PageHeader";

const risks = [
  { risk: "Resistencia al cambio — ERP",          impact: "Alto",  prob: "Alta",  owner: "Carmen Ruiz",  mitigation: "Plan de gestión del cambio y capacitación continua",       status: "Activo" },
  { risk: "Retraso en entrega Portal Cliente",     impact: "Alto",  prob: "Alta",  owner: "Andrés Gil",   mitigation: "Repriorizar alcance y reducir MVP inicial",                status: "Activo" },
  { risk: "Presupuesto insuficiente — Financiera", impact: "Medio", prob: "Media", owner: "Javier Mora",  mitigation: "Revisión mensual de presupuesto con comité ejecutivo",      status: "Activo" },
  { risk: "Integración deficiente módulos ERP",    impact: "Alto",  prob: "Baja",  owner: "Pedro Salas",  mitigation: "Pruebas de integración end-to-end en cada sprint",          status: "Mitigado" },
  { risk: "Datos sin limpiar — migración CRM",     impact: "Medio", prob: "Media", owner: "Sofía Pinto",  mitigation: "Auditoría de datos previa y proceso de limpieza",           status: "Activo" },
  { risk: "Dependencia proveedor externo",         impact: "Bajo",  prob: "Media", owner: "Mario Niño",   mitigation: "Contratos con SLA definidos y alternativas identificadas",  status: "Monitoreo" },
];

// Semáforo corporativo — colores para fondo claro
const matrixCell: Record<string, { bg: string; border: string; text: string }> = {
  Alto:  { bg: "#FEE2E2", border: "#FECACA", text: "#991B1B" },
  Medio: { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E" },
  Bajo:  { bg: "#DCFCE7", border: "#BBF7D0", text: "#15803D" },
};

const matrix = [
  { prob: "Alta",  cells: [
    { level: "Bajo",  items: [] as string[] },
    { level: "Medio", items: [] as string[] },
    { level: "Alto",  items: ["Resistencia al cambio — ERP", "Retraso Portal Cliente"] },
  ]},
  { prob: "Media", cells: [
    { level: "Bajo",  items: [] as string[] },
    { level: "Medio", items: ["Presupuesto insuficiente — Financiera", "Datos sin limpiar — CRM"] },
    { level: "Alto",  items: [] as string[] },
  ]},
  { prob: "Baja",  cells: [
    { level: "Bajo",  items: ["Dependencia proveedor externo"] },
    { level: "Medio", items: [] as string[] },
    { level: "Alto",  items: ["Integración módulos ERP"] },
  ]},
];

const TH = { fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#9CA3AF" };

export default function RiesgosPage() {
  return (
    <PmoShell>
      <PageHeader section="PMO · Riesgos" title="Registro de Riesgos" description="Matriz de riesgos identificados con probabilidad, impacto y plan de mitigación." />
      <div className="space-y-6 px-8 py-6">

        {/* Matriz semáforo */}
        <div className="p-6" style={{ background: "#FFFFFF", border: "1px solid #D6D3D1" }}>
          <p className="mb-5" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9CA3AF" }}>
            Matriz de calor — Probabilidad × Impacto
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ minWidth: "400px" }}>
              <thead>
                <tr>
                  <th className="pb-3 pr-4 text-left" style={{ color: "#6B7280", fontWeight: 600 }}>Prob. \ Impacto</th>
                  {["Bajo", "Medio", "Alto"].map((h) => (
                    <th key={h} className="pb-3 px-3 text-center" style={{ color: "#6B7280", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.prob}>
                    <td className="py-1.5 pr-4 font-semibold" style={{ color: "#6B7280" }}>{row.prob}</td>
                    {row.cells.map((cell, ci) => {
                      const s = matrixCell[cell.level];
                      return (
                        <td key={ci} className="px-2 py-1.5">
                          <div
                            className="min-h-[52px] p-2.5"
                            style={{ background: s.bg, border: `1px solid ${s.border}` }}
                          >
                            {cell.items.length > 0
                              ? cell.items.map((item) => (
                                  <p key={item} className="truncate text-[10px] leading-relaxed" style={{ color: s.text }}>{item}</p>
                                ))
                              : <p className="text-[10px]" style={{ color: "#D6D3D1" }}>—</p>
                            }
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla completa */}
        <div style={{ background: "#FFFFFF", border: "1px solid #D6D3D1" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #D6D3D1" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9CA3AF" }}>
              Registro completo
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "700px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #D6D3D1" }}>
                  {["Riesgo", "Impacto", "Probabilidad", "Estado", "Responsable", "Mitigación"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left" style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {risks.map((r, i) => (
                  <tr key={r.risk} style={{ borderBottom: "1px solid #E5E7EB", background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF9" }}>
                    <td className="px-6 py-4 font-semibold" style={{ color: "#1F2937" }}>{r.risk}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.impact} dot={false} /></td>
                    <td className="px-6 py-4"><StatusBadge status={r.prob} dot={false} /></td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4" style={{ color: "#6B7280" }}>{r.owner}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "#9CA3AF" }}>{r.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PmoShell>
  );
}
