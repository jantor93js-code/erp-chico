"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PmoAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/pmo/login");
  }, [router]);

  return <>{children}</>;
}
