"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PmoProtectedIndex() {
  const router = useRouter();
  useEffect(() => { router.replace("/pmo/dashboard"); }, [router]);
  return null;
}
