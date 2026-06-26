"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
      router.push("/erp/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error iniciando sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold mb-6">ERP CHICÓ</h1>

        <input
          className="border border-gray-300 bg-white text-zinc-900 p-3 w-full mb-4 rounded-3xl"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border border-gray-300 bg-white text-zinc-900 p-3 w-full mb-4 rounded-3xl"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-3 rounded-full w-full text-sm font-semibold transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Ingresando..." : "Ingresar al ERP"}
        </button>
      </div>
    </div>
  );
}
