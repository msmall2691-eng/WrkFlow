"use client";

import { useMaine } from "@/lib/useMaine";

/*
  TideLevel — the founder section's "water". A translucent accent fill that
  rises/falls to the LIVE Portland tide height (tideLevel 0..1 from /api/maine),
  capped by a drifting wave surface whose SPEED tracks the tide direction and
  whose AMPLITUDE tracks the offshore buoy (wave.amp 0..1 from buoy 44007).
  Low-opacity so text stays readable; reduced-motion freezes the drift but the
  amplitude — the data story — is still baked into the static curve.
*/
export default function TideLevel() {
  const d = useMaine();
  const level = Math.max(0, Math.min(1, d?.tideLevel ?? 0.4));
  const amp = Math.max(0, Math.min(1, d?.wave?.amp ?? 0.45));
  const dur = d?.tide === "rising" ? "11s" : d?.tide === "falling" ? "24s" : undefined;

  const h = 10 + level * 15; // 10% (low) → 25% (high) — stays clear of the text
  // Baseline y=22 in a 40-unit viewBox. Historical control-y ≈ 6 (a ≈ 16)
  // sits around amp≈0.5. Capped so a storm reading doesn't clip the crest
  // past the top of the viewBox.
  const a = 8 + amp * 14; // 8 (glass) → 22 (rolling)
  const crest = 22 - a;
  const path = `M0 22 Q180 ${crest} 360 22 T720 22 T1080 22 T1440 22 T1800 22 T2160 22 T2520 22 T2880 22`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden transition-[height] duration-1000 ease-out motion-reduce:transition-none"
      style={{ height: `${h}%` }}
    >
      {/* Water body — deep accent glow rising from the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-signal/18 via-signal/[0.07] to-transparent" />
      {/* Drifting wave surface */}
      <svg
        className="wave-x absolute inset-x-0 top-0 block h-6 w-[200%] md:h-8"
        style={dur ? { animationDuration: dur } : undefined}
        viewBox="0 0 2880 40"
        preserveAspectRatio="none"
      >
        <path d={`${path} V40 H0 Z`} fill="var(--color-signal)" fillOpacity="0.14" />
        <path d={path} stroke="var(--color-signal)" strokeWidth="2.5" strokeOpacity="0.5" fill="none" />
        {/* faint highlight on the crest — a little shimmer */}
        <path d={path} stroke="#dff3ef" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      </svg>
    </div>
  );
}
