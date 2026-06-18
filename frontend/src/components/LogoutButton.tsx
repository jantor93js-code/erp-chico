"use client";

import { useRouter }
from "next/navigation";

export default function LogoutButton() {

  const router = useRouter();

  function logout() {

    localStorage.removeItem(
      "token"
    );

    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-3 py-2 rounded"
    >
      Salir
    </button>
  );
}