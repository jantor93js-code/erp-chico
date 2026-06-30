"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProgramasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pmo/plan-de-trabajo");
  }, [router]);

  return null;
}