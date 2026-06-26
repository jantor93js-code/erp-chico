"use client";

interface Props {
  className?: string;
}

export default function ClientLogo({ className }: Props) {
  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ""}`.trim()}>
      <div
        className="flex h-8 w-8 items-center justify-center rounded bg-[#F8FAFC] text-xs font-bold text-[#C89B2A]"
        style={{ border: "1px solid #E5E7EB" }}
      >
        C
      </div>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8" }}>Cliente</span>
    </div>
  );
}
