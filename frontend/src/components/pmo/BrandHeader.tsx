"use client";

import { useState } from "react";
import MetricLogo from "@/src/components/MetricLogo";

function parseTokenName() {
  if (typeof window === "undefined") return "Usuario PMO";
  const token = localStorage.getItem("token");
  if (!token) return "Usuario PMO";

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")))));
    return decoded.nombre || decoded.name || decoded.email?.split("@")[0] || "Usuario PMO";
  } catch {
    return "Usuario PMO";
  }
}

export default function BrandHeader() {
  const [userLabel] = useState<string>(() => parseTokenName());

  return (
    <header
      className="flex items-center justify-between gap-4 px-8 py-4"
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div className="flex items-center gap-4">
        <MetricLogo className="h-9 w-auto" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#C89B2A]">MÉTRIC PMO</p>
          <p className="text-base font-semibold text-[#111827]">Gestión del portafolio de transformación</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C89B2A]/15 text-[#92400E] font-bold">
          M
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111827]">{userLabel}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">Cuenta PMO</p>
        </div>
      </div>
    </header>
  );
}
