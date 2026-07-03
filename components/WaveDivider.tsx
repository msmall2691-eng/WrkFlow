"use client";

import { useEffect, useState } from "react";

/*
  WaveDivider — the drifting ocean wave between a dark section and the light
  Founder note. SPEED tracks the LIVE Portland tide (faster rising, slower
  falling); AMPLITUDE tracks offshore buoy 44007 (wave.amp from /api/maine).
  Decorative; reduced-motion freezes it via globals.css but leaves the
  data-shaped curve intact.
*/
export default function WaveDivider({
  className = "",
  fill = "#0b1722",
  position = "top",
}: {
  className?: string;
  fill?: string;
  position?: "top" | "bottom";
}) {
  const [dur, setDur] = useState<string>();
  const [amp, setAmp] = useState(0.5);

  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => {
        if (!on) return;
        const tide = j?.tide;
        setDur(tide === "rising" ? "9s" : tide === "falling" ? "20s" : undefined);
        if (typeof j?.wave?.amp === "number") setAmp(Math.max(0, Math.min(1, j.wave.amp)));
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  // Baseline y=44 in an 80-unit viewBox. Historic default control-y=4 → amplitude 40.
  const a = 10 + amp * 34;
  const crest = 44 - a;
  const d = `M0 44 Q180 ${crest} 360 44 T720 44 T1080 44 T1440 44 T1800 44 T2160 44 T2520 44 T2880 44 V0 H0 Z`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0 rotate-180"
      } overflow-hidden leading-[0] ${className}`}
    >
      <svg
        className="wave-x block h-12 w-[200%] md:h-20"
        style={dur ? { animationDuration: dur } : undefined}
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
      >
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}
