import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ERP CHICÓ",
  description: "Aplicación ERP CHICÓ para gestión operativa empresarial.",
};

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
