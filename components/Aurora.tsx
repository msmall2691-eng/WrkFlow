"use client";

import { useEffect, useRef } from "react";

/*
  Aurora — the unified Deep Harbor backdrop for every dark section.

  "Dusk on the pier": deep harbor-blue and sea-glass teal anchor the water
  below, with a warm brass/amber glow up top. Blurred blobs blended additively
  over the harbor-navy base. Reacts subtly to the cursor (parallax) so the dark
  theme feels alive. Honors reduced-motion (no drift, no parallax).
*/

const BLOBS = [
  { c: "#16506b", size: "52vw", top: "-18%", left: "-12%", anim: "auroraA 26s ease-in-out infinite", op: 0.55, depth: 26 },
  { c: "#0e8f86", size: "44vw", top: "40%", left: "-12%", anim: "auroraC 32s ease-in-out infinite", op: 0.4, depth: 16 },
  { c: "#d9a441", size: "40vw", top: "-12%", left: "54%", anim: "auroraB 28s ease-in-out infinite", op: 0.3, depth: 34 },
  { c: "#e0833c", size: "34vw", top: "46%", left: "60%", anim: "auroraA 24s ease-in-out infinite reverse", op: 0.26, depth: 22 },
  { c: "#2bb3a3", size: "28vw", top: "60%", left: "30%", anim: "auroraB 34s ease-in-out infinite", op: 0.22, depth: 12 },
];

export default function Aurora({
  intensity = 1,
  interactive = true,
  className = "",
}: {
  /** Scales blob opacity — lower for subtler backdrops. */
  intensity?: number;
  /** Parallax-shift the blobs toward the cursor. */
  interactive?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      // -1..1 across the viewport
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const kids = el.children;
      for (let i = 0; i < kids.length; i++) {
        const d = Number((kids[i] as HTMLElement).dataset.depth ?? 16);
        (kids[i] as HTMLElement).style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`;
      }
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [interactive]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div ref={ref} className="absolute inset-0">
        {BLOBS.map((b, i) => (
          // Each blob drifts (CSS) inside a wrapper the cursor parallax moves.
          <span
            key={i}
            data-depth={b.depth}
            className="absolute inset-0 block will-change-transform"
          >
            <span
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
          </span>
        ))}
      </div>
    </div>
  );
}
