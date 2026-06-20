/*
  Aurora — the unified chromatic backdrop for every dark section.

  Drifting blurred blobs in a "sunset over the harbor" palette (harbor blue +
  dusk indigo anchoring the lower field, warm amber/orange/rose glowing above),
  blended additively over a deep-navy base. One calm, premium, readable look
  shared by the hero, dashboard, and contact closer. Honors reduced-motion.
*/

const BLOBS = [
  { c: "#2563eb", size: "50vw", top: "-16%", left: "-10%", anim: "auroraA 26s ease-in-out infinite", op: 0.5 },
  { c: "#4338ca", size: "44vw", top: "38%", left: "-12%", anim: "auroraC 32s ease-in-out infinite", op: 0.4 },
  { c: "#f59e0b", size: "40vw", top: "-12%", left: "54%", anim: "auroraB 28s ease-in-out infinite", op: 0.34 },
  { c: "#f97316", size: "34vw", top: "46%", left: "60%", anim: "auroraA 24s ease-in-out infinite reverse", op: 0.3 },
  { c: "#fb7185", size: "28vw", top: "60%", left: "30%", anim: "auroraB 34s ease-in-out infinite", op: 0.22 },
];

export default function Aurora({
  intensity = 1,
  className = "",
}: {
  /** Scales blob opacity — lower for subtler backdrops. */
  intensity?: number;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="aurora-blob"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            opacity: b.op * intensity,
            background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
            animation: b.anim,
          }}
        />
      ))}
    </div>
  );
}
