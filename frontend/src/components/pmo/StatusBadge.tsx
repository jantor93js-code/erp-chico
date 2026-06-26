// Semáforo corporativo — optimizado para fondos claros
const variants: Record<string, { bg: string; text: string; dot: string }> = {
  "En curso":     { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" },
  "En Ejecución": { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" },
  "En tiempo":    { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" },
  Mitigado:       { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" },
  Aprobada:       { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" },
  Activo:         { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" },
  Normal:         { bg: "#DCFCE7", text: "#15803D", dot: "#16A34A" },
  // Oro institucional
  Pendiente:      { bg: "#FEF3C7", text: "#92400E", dot: "#C89B2A" },
  "En riesgo":    { bg: "#FEF3C7", text: "#92400E", dot: "#C89B2A" },
  Monitoreo:      { bg: "#FEF3C7", text: "#92400E", dot: "#C89B2A" },
  Planificado:    { bg: "#F3F4F6", text: "#4B5563", dot: "#9CA3AF" },
  // Rojo corporativo oscuro — no neón
  Retrasado:      { bg: "#FEE2E2", text: "#991B1B", dot: "#B91C1C" },
  Crítico:        { bg: "#FEE2E2", text: "#991B1B", dot: "#B91C1C" },
  Rechazada:      { bg: "#FEE2E2", text: "#991B1B", dot: "#B91C1C" },
  Alto:           { bg: "#FEE2E2", text: "#991B1B", dot: "#B91C1C" },
  Alta:           { bg: "#FEE2E2", text: "#991B1B", dot: "#B91C1C" },
  // Ámbar sobrio
  Medio:          { bg: "#FEF3C7", text: "#92400E", dot: "#D97706" },
  Media:          { bg: "#FEF3C7", text: "#92400E", dot: "#D97706" },
  // Neutro
  Pausado:        { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
  Inactivo:       { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
  Bajo:           { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
  Baja:           { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
};

const fallback = { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" };

interface Props {
  status: string;
  dot?: boolean;
  size?: "xs" | "sm";
}

export default function StatusBadge({ status, dot = true, size = "xs" }: Props) {
  const v = variants[status] ?? fallback;
  const fontSize = size === "xs" ? "10px" : "11px";

  return (
    <span
      className="inline-flex items-center gap-1.5 font-semibold tracking-wide"
      style={{
        background: v.bg,
        color: v.text,
        fontSize,
        paddingLeft: "7px",
        paddingRight: "7px",
        paddingTop: "2px",
        paddingBottom: "2px",
        borderRadius: "2px",
        letterSpacing: "0.02em",
      }}
    >
      {dot && (
        <span
          className="shrink-0"
          style={{ width: "5px", height: "5px", borderRadius: "50%", background: v.dot, display: "inline-block" }}
        />
      )}
      {status}
    </span>
  );
}
