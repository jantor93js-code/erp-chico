"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function login() {
    try {
      setLoading(true);

      const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001/api/v1";

const response = await fetch(
  `${API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      if (!response.ok) {
        alert(
          "Credenciales inválidas"
        );
        return;
      }

      const data =
        await response.json();

      localStorage.setItem(
        "token",
        data.access_token
      );

      router.push(
        "/dashboard"
      );

    } catch (error) {
      console.error(error);

      alert(
        "Error iniciando sesión"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        ERP CHICO
      </h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Correo"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Contraseña"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <button
        onClick={login}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading
          ? "Ingresando..."
          : "Ingresar"}
      </button>

    </div>
  );
}