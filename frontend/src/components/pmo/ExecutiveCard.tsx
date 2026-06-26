import StatusBadge from "./StatusBadge";

interface Props {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  status?: string;
  accent?: "gold" | "green" | "red" | "amber" | "neutral" | "cyan" | "emerald" | "rose" | "violet" | "sky";
}

const valueColor: Record<string, string> = {
  gold:    "#92701A",
  green:   "#15803D",
  red:     "#991B1B",
  amber:   "#92400E",
  neutral: "#374151",
  cyan:    "#92701A",
  emerald: "#15803D",
  rose:    "#991B1B",
  violet:  "#92701A",
  sky:     "#92701A",
};

export default function ExecutiveCard({ label, value, delta, deltaUp, status, accent = "gold" }: Props) {
  const color = valueColor[accent] ?? "#374151";

  return (
    <div
      className="relative p-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid #D6D3D1",
        borderLeft: "3px solid #C89B2A",
      }}
    >
      <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF" }}>
        {label}
      </p>

      <p style={{ fontSize: "28px", fontWeight: 700, color, marginTop: "10px", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
        {value}
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        {delta !== undefined && (
          <span style={{ fontSize: "11px", fontWeight: 600, color: deltaUp !== false ? "#15803D" : "#991B1B" }}>
            {deltaUp !== false ? "▲" : "▼"} {delta}
          </span>
        )}
        {status && <StatusBadge status={status} dot={false} size="xs" />}
      </div>
    </div>
  );
}
