"use client";

import { useState } from "react";

export default function MetricLogo({ className }: { className?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`inline-flex items-center gap-2 ${className ?? ""}`}
        style={{ userSelect: "none" }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded"
          style={{ background: "rgba(200,155,42,0.15)", border: "1px solid rgba(200,155,42,0.3)" }}
        >
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#C89B2A" }}>M</span>
        </div>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "#C89B2A" }}>MÉTRIC</p>
          <p style={{ fontSize: "8px", letterSpacing: "0.08em", color: "#64748b", marginTop: "1px" }}>Millán Advisory Group</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src="/metric-logo.svg"
      alt="MÉTRIC Logo"
      className={className}
      onError={() => setError(true)}
    />
  );
}
