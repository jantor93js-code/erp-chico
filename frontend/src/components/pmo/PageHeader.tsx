interface Props {
  section: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ section, title, description, actions }: Props) {
  return (
    <div
      className="flex items-start justify-between gap-6 px-8 py-7"
      style={{ background: "#F5F3EF", borderBottom: "1px solid #D6D3D1" }}
    >
      <div>
        <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C89B2A" }}>
          {section}
        </p>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1F2937", marginTop: "4px", letterSpacing: "-0.01em" }}>
          {title}
        </h1>
        {description && (
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px", lineHeight: "1.6", maxWidth: "600px" }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}
