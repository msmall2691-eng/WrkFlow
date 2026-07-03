"use client";

import { useEffect, useState } from "react";

/*
  TideWave — a subtle, refined accent wave for the founder section. Two thin
  stroked lines (not heavy fills) that drift sideways; SPEED tracks the LIVE
  Portland tide (quicker coming in, slower going out), AMPLITUDE tracks the
  offshore buoy (wave.amp from /api/maine). Reduced-motion freezes the drift
  but the amplitude — the data story — stays in the static curve.
*/
export default function TideWave({
  className = "",
  position = "top",
}: {
  className?: string;
  position?: "top" | "bottom";
}) {
  const [dur, setDur] = useState<string>();
  const [amp, setAmp] = useState(0.45);

  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => {
        if (!on) return;
        const t = j?.tide;
        setDur(t === "rising" ? "11s" : t === "falling" ? "24s" : "16s");
        if (typeof j?.wave?.amp === "number") setAmp(Math.max(0, Math.min(1, j.wave.amp)));
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  // 60-unit viewBox; baseline y=26 for the top line, y=36 for the bottom line.
  // Amplitude scales the control-point rise so the whole curve breathes.
  const a = 3 + amp * 22;
  const c1 = 26 - a * 0.8;
  const c2 = 36 - a * 0.6;
  const d1 = `M0 26 Q180 ${c1} 360 26 T720 26 T1080 26 T1440 26 T1800 26 T2160 26 T2520 26 T2880 26`;
  const d2 = `M0 36 Q180 ${c2} 360 36 T720 36 T1080 36 T1440 36 T1800 36 T2160 36 T2520 36 T2880 36`;

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
        <path d={d1} stroke="var(--color-signal)" strokeWidth="2" strokeOpacity="0.38" />
        <path d={d2} stroke="var(--color-signal)" strokeWidth="1.5" strokeOpacity="0.18" />
      </svg>
    </div>
  );
}
