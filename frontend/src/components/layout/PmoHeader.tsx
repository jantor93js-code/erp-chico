// Componente legacy — la cabecera principal es BrandHeader en PmoShell.
// Mantenido por compatibilidad con cualquier uso directo.
export default function PmoHeader() {
  return (
    <div
      className="px-8 py-5"
      style={{ background: "#1E293B", borderBottom: "1px solid #334155" }}
    >
      <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C89B2A" }}>
        Dashboard Ejecutivo · Millán Advisory Group
      </p>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F8FAFC", marginTop: "4px", letterSpacing: "-0.01em" }}>
        MÉTRIC PMO
      </h1>
      <p style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
        Oficina de Gestión de Proyectos y Transformación Empresarial
      </p>
    </div>
  );
}
