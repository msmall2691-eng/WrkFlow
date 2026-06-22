"use client";

import { useEffect, useState } from "react";

/*
  WaveDivider — the drifting ocean wave between a dark section and the light
  Founder note. The drift speed now tracks the LIVE Portland tide: faster as it
  comes in (rising), slower as it goes out (falling). Decorative; reduced-motion
  still freezes it via globals.css.
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

  useEffect(() => {
    let on = true;
    fetch("/api/maine")
      .then((r) => r.json())
      .then((j) => {
        if (!on) return;
        const tide = j?.tide;
        setDur(tide === "rising" ? "9s" : tide === "falling" ? "20s" : undefined);
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
        className="wave-x block h-12 w-[200%] md:h-20"
        style={dur ? { animationDuration: dur } : undefined}
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0 44 Q180 4 360 44 T720 44 T1080 44 T1440 44 T1800 44 T2160 44 T2520 44 T2880 44 V0 H0 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
