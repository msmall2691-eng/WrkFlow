/*
  Aurora — the unified Deep Harbor backdrop for every dark section.

  "Dusk on the pier": deep harbor-blue and sea-glass teal anchor the water
  below, with a warm brass/amber glow up top. Blurred blobs blended additively
  over the harbor-navy base. One calm, premium, readable look shared by the
  hero, dashboard, and contact closer. Honors reduced-motion.
*/

const BLOBS = [
  { c: "#16506b", size: "52vw", top: "-18%", left: "-12%", anim: "auroraA 26s ease-in-out infinite", op: 0.55 },
  { c: "#0e8f86", size: "44vw", top: "40%", left: "-12%", anim: "auroraC 32s ease-in-out infinite", op: 0.4 },
  { c: "#d9a441", size: "40vw", top: "-12%", left: "54%", anim: "auroraB 28s ease-in-out infinite", op: 0.3 },
  { c: "#e0833c", size: "34vw", top: "46%", left: "60%", anim: "auroraA 24s ease-in-out infinite reverse", op: 0.26 },
  { c: "#2bb3a3", size: "28vw", top: "60%", left: "30%", anim: "auroraB 34s ease-in-out infinite", op: 0.22 },
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
