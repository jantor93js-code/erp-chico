"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BrandHeader from "@/src/components/pmo/BrandHeader";
import PmoSidebar from "@/src/components/layout/PmoSidebar";

export default function PmoShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/pmo/login"); return; }
    const saved = localStorage.getItem("pmoSidebarCollapsed");
    if (saved) setCollapsed(saved === "true");
    setReady(true);
  }, [router]);

  function toggle() {
    setCollapsed((prev) => {
      localStorage.setItem("pmoSidebarCollapsed", String(!prev));
      return !prev;
    });
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/pmo/login");
  }

  if (!ready) return null;

  return (
    <div className="pmo-shell flex h-screen flex-col overflow-hidden" style={{ background: "#F5F3EF", color: "#1F2937" }}>
      <BrandHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — gris ejecutivo corporativo */}
        <aside
          className="flex shrink-0 flex-col transition-all duration-200"
          style={{
            background: "#374151",
            borderRight: "1px solid #4B5563",
            width: collapsed ? "52px" : "212px",
          }}
        >
          {/* Cabecera sidebar — branding MÉTRIC */}
          <div
            className="flex items-center px-4 py-5"
            style={{
              borderBottom: "1px solid #4B5563",
              justifyContent: collapsed ? "center" : "space-between",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#F8FAFC]">
                <span className="text-sm font-bold">M</span>
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C89B2A", lineHeight: 1 }}>
                    MÉTRIC PMO
                  </p>
                  <p style={{ fontSize: "9px", letterSpacing: "0.06em", color: "#D1D5DB", marginTop: "4px", fontWeight: 400 }}>
                    Plataforma de portafolio y gobernanza
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={toggle}
              className="flex h-6 w-6 shrink-0 items-center justify-center"
              style={{ color: "#9CA3AF" }}
              title={collapsed ? "Expandir" : "Colapsar"}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D1D5DB")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9CA3AF")}
            >
              {collapsed ? (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>

          {/* Navegación */}
          <div className="flex-1 overflow-y-auto px-2 py-3">
            <PmoSidebar collapsed={collapsed} />
          </div>

          {/* Pie */}
          <div className="px-3 py-4" style={{ borderTop: "1px solid #4B5563" }}>
            {!collapsed && (
              <p className="mb-2 text-[10px]" style={{ color: "#9CA3AF" }}>
                Gestión de portafolio · PMO SaaS
              </p>
            )}
            <button
              onClick={logout}
              className={`flex w-full items-center gap-2 px-2 py-2 text-[11px] transition ${collapsed ? "justify-center" : ""}`}
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "#FCA5A5"; el.style.background = "rgba(185,28,28,0.2)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "#9CA3AF"; el.style.background = "transparent"; }}
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!collapsed && "Cerrar sesión"}
            </button>
          </div>
        </aside>

        {/* Área principal — fondo crema institucional */}
        <main className="flex-1 min-w-0 overflow-auto" style={{ background: "#F5F3EF" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
