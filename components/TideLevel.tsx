"use client";

import { useEffect, useState } from "react";
import { useMaine } from "@/lib/useMaine";

/*
  TideLevel — the founder section's "water". A translucent accent fill that
  rises/falls to the LIVE Portland tide height, capped by a drifting wave
  surface. SPEED tracks tide direction; AMPLITUDE tracks buoy 44007's WVHT
  (via wave.amp). Testable via `?wave=X` in the URL, where X is 0..1
  (0 = glass calm, 1 = rolling storm) — useful for previewing without
  waiting for weather.
*/
export default function TideLevel() {
  const d = useMaine();
  const [override, setOverride] = useState<number | null>(null);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("wave");
      const n = parseFloat(p ?? "");
      if (Number.isFinite(n) && n >= 0 && n <= 1) setOverride(n);
    } catch {
      /* ignore */
    }
  }, []);

  const level = Math.max(0, Math.min(1, d?.tideLevel ?? 0.4));
  const amp = override ?? Math.max(0, Math.min(1, d?.wave?.amp ?? 0.5));
  const dur = d?.tide === "rising" ? "11s" : d?.tide === "falling" ? "24s" : "16s";

  const h = 10 + level * 15; // 10% (low) → 25% (high) — stays clear of text
  // Bumped so calm-day readings still show clear wave motion. Historic
  // default around a≈16; storm-day max around a≈26 (crest peeks past the
  // viewBox top — that's intentional for extreme conditions).
  const a = 12 + amp * 14;
  const crest = 22 - a;
  const path = `M0 22 Q180 ${crest} 360 22 T720 22 T1080 22 T1440 22 T1800 22 T2160 22 T2520 22 T2880 22`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden transition-[height] duration-1000 ease-out motion-reduce:transition-none"
      style={{ height: `${h}%` }}
    >
      {/* Water body — deep accent glow rising from the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-signal/25 via-signal/[0.10] to-transparent" />
      {/* Drifting wave surface — a bit taller now so amplitude is legible */}
      <svg
        className="wave-x absolute inset-x-0 top-0 block h-8 w-[200%] md:h-12"
        style={{ animationDuration: dur }}
        viewBox="0 0 2880 40"
        preserveAspectRatio="none"
      >
        <path d={`${path} V40 H0 Z`} fill="var(--color-signal)" fillOpacity="0.2" />
        <path d={path} stroke="var(--color-signal)" strokeWidth="2.5" strokeOpacity="0.65" fill="none" />
        {/* Faint crest highlight — a little shimmer */}
        <path d={path} stroke="#dff3ef" strokeWidth="1" strokeOpacity="0.35" fill="none" />
      </svg>
    </div>
  );
}
