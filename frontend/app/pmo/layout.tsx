import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MÉTRIC PMO",
  description: "Oficina de Gestión de Proyectos y Transformación Empresarial.",
};

export default function PmoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
