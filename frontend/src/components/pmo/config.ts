// Punto único de configuración para la identidad PMO
export const PMO_CONFIG = {
  metric: {
    name: "MÉTRIC",
    firm: "Millán Advisory Group",
    tagline: "Governance SaaS",
    logoSrc: "/metric-logo.svg",
  },
} as const;

// Paleta corporativa — NO modificar sin aprobación
export const COLORS = {
  bg:        "#0F172A",
  surface:   "#1E293B",
  border:    "#334155",
  gold:      "#C89B2A",
  goldLight: "#D4AF37",
  text:      "#F8FAFC",
  muted:     "#94A3B8",
  subtle:    "#CBD5E1",
} as const;
