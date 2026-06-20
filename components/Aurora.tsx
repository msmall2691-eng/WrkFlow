/*
  Aurora — a slow chromatic gradient backdrop for dark sections.

  Drifting blurred blobs in the brand spectrum (ion blue → indigo → cyan →
  coastal teal), blended additively over a dark background. Gives the hero and
  dashboard a living, premium glow that ties the whole dark theme together.
  Decorative only; honors reduced-motion via the .aurora-blob CSS.
*/

const BLOBS = [
  { c: "#2563eb", size: "46vw", top: "-12%", left: "-6%", anim: "auroraA 24s ease-in-out infinite", op: 0.5 },
  { c: "#6366f1", size: "40vw", top: "18%", left: "52%", anim: "auroraB 30s ease-in-out infinite", op: 0.42 },
  { c: "#22d3ee", size: "34vw", top: "52%", left: "8%", anim: "auroraC 28s ease-in-out infinite", op: 0.34 },
  { c: "#14b8a6", size: "30vw", top: "40%", left: "68%", anim: "auroraA 26s ease-in-out infinite reverse", op: 0.3 },
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
