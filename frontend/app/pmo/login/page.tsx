"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PmoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Credenciales inválidas");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      router.push("/pmo/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error iniciando sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pmo-shell min-h-screen flex items-center justify-center px-4" style={{ background: "#F4F5F7" }}>
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 mb-5 rounded-3xl bg-white shadow-sm" style={{ borderLeft: "3px solid #C89B2A" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "0.05em", color: "#1F2937" }}>M</span>
          </div>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#C89B2A" }}>
            MÉTRIC PMO
          </p>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
            Plataforma SaaS de dirección de proyectos y gobernanza.
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#D6D3D1] bg-white shadow-sm">
          <div className="px-8 pt-8 pb-3">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9CA3AF]">Bienvenido</p>
            <h1 className="mt-3 text-2xl font-semibold text-[#111827]">Accede a tu espacio de trabajo PMO</h1>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">Ingresa con tu correo institucional para continuar con el seguimiento de portafolio.</p>
          </div>

          <div className="space-y-4 px-8 pb-8 pt-6">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-2">
                Correo institucional
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                className="w-full rounded-2xl border border-[#D6D3D1] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none transition duration-150"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B2A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D6D3D1")}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#D6D3D1] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none transition duration-150"
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C89B2A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#D6D3D1")}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="mt-1 w-full rounded-2xl px-6 py-3 text-sm font-semibold tracking-[0.08em] text-white transition duration-150"
              style={{ background: loading ? "#D4AF37" : "#C89B2A" }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-[#6B7280]">
          Accede a tu panel de control de proyectos, riesgos y entregables distribuidos.
        </div>
      </div>
    </div>
  );
}
