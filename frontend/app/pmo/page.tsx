"use client";

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PmoHomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    router.replace(token ? "/pmo/dashboard" : "/pmo/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF] px-6 py-16">
      <div className="rounded-3xl border border-[#D6D3D1] bg-white px-8 py-10 text-center shadow-sm" style={{ maxWidth: "540px" }}>
        <p className="text-sm font-semibold text-[#111827]">Redireccionando a tu espacio PMO…</p>
        <p className="mt-4 text-sm text-[#6B7280]">Si no ocurre nada, revisa tu sesión o abre directamente /pmo/login.</p>
      </div>
    </div>
  );
}
