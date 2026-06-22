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
        className="wave-x block h-9 w-[200%] md:h-12"
        style={dur ? { animationDuration: dur } : undefined}
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 Q180 10 360 40 T720 40 T1080 40 T1440 40 T1800 40 T2160 40 T2520 40 T2880 40 V0 H0 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
