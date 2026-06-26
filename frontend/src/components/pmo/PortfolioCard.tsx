import StatusBadge from "./StatusBadge";

interface Props {
  name: string;
  desc: string;
  owner: string;
  status: string;
  pct: number;
  projects: number;
}

function barColor(pct: number) {
  if (pct >= 75) return "#15803D";
  if (pct >= 50) return "#C89B2A";
  if (pct >= 30) return "#D97706";
  return "#B91C1C";
}

const initial = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export default function PortfolioCard({ name, desc, owner, status, pct, projects }: Props) {
  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid #D6D3D1",
        borderTop: "2px solid #C89B2A",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center text-xs font-bold"
          style={{ background: "#F5F3EF", color: "#92701A", border: "1px solid #D6D3D1" }}
        >
          {initial(name)}
        </div>
        <StatusBadge status={status} />
      </div>

      <div>
        <h3 className="font-semibold" style={{ color: "#1F2937" }}>{name}</h3>
        <p className="mt-1 text-xs leading-5" style={{ color: "#9CA3AF" }}>{desc}</p>
      </div>

      <div className="flex items-center gap-3 text-xs" style={{ color: "#9CA3AF" }}>
        <span>{owner}</span>
        <span style={{ color: "#D6D3D1" }}>·</span>
        <span>{projects} proyectos</span>
      </div>

      <div>
        <div className="mb-1.5 flex justify-between" style={{ fontSize: "11px" }}>
          <span style={{ color: "#9CA3AF" }}>Avance</span>
          <span style={{ fontWeight: 600, color: "#374151" }}>{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden" style={{ background: "#E5E7EB" }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, background: barColor(pct) }}
          />
        </div>
      </div>
    </div>
  );
}
