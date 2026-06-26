import StatusBadge from "./StatusBadge";

interface Props {
  name: string;
  sub?: string;
  owner: string;
  status: string;
  pct: number;
  priority?: string;
}

function barColor(pct: number) {
  if (pct >= 75) return "#15803D";
  if (pct >= 50) return "#C89B2A";
  if (pct >= 30) return "#D97706";
  return "#B91C1C";
}

export default function ProgressCard({ name, sub, owner, status, pct, priority }: Props) {
  return (
    <div
      className="p-4"
      style={{ background: "#FFFFFF", border: "1px solid #D6D3D1" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" style={{ color: "#1F2937" }}>{name}</p>
          {sub && <p className="mt-0.5 truncate text-xs" style={{ color: "#9CA3AF" }}>{sub}</p>}
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{owner}</span>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151" }}>{pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden" style={{ background: "#E5E7EB" }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, background: barColor(pct) }}
          />
        </div>
      </div>

      {priority && (
        <div className="mt-2.5">
          <StatusBadge status={priority} dot={false} size="xs" />
        </div>
      )}
    </div>
  );
}
