"use client";

import { useEffect, useState } from "react";

/*
  TideWave — a subtle, refined accent wave for the founder section. Two thin
  stroked lines (not heavy fills) that drift sideways; the drift speed tracks
  the LIVE Portland tide: quicker coming in (rising), slower going out
  (falling). Decorative; reduced-motion freezes it via globals.css (.wave-x).
*/
export default function TideWave({
  className = "",
  position = "top",
}: {
  className?: string;
  position?: "top" | "bottom";
}) {
  const [dur, setDur] = useState<string>();

  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => {
        if (!on) return;
        const t = j?.tide;
        setDur(t === "rising" ? "11s" : t === "falling" ? "24s" : "16s");
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0 rotate-180"
      } overflow-hidden leading-[0] ${className}`}
    >
      <svg
        className="wave-x block h-8 w-[200%] md:h-10"
        style={dur ? { animationDuration: dur } : undefined}
        viewBox="0 0 2880 60"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 26 Q180 10 360 26 T720 26 T1080 26 T1440 26 T1800 26 T2160 26 T2520 26 T2880 26"
          stroke="var(--color-signal)"
          strokeWidth="2"
          strokeOpacity="0.38"
        />
        <path
          d="M0 36 Q180 22 360 36 T720 36 T1080 36 T1440 36 T1800 36 T2160 36 T2520 36 T2880 36"
          stroke="var(--color-signal)"
          strokeWidth="1.5"
          strokeOpacity="0.18"
        />
      </svg>
    </div>
  );
}
