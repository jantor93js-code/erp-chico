"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CalendarioPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pmo/plan-de-trabajo");
  }, [router]);

  return null;
}
