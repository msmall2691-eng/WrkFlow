"use client";

import { useEffect, useRef } from "react";

/*
  HeroWordmark — a giant brand word hidden in the hero, revealed by a cursor
  "spotlight" (wipe-the-fog-off-glass). Follows the pointer on hover; gently
  auto-sweeps when idle / on touch so mobile sees it too. Decorative.
*/
export default function HeroWordmark({
  text = "M STUDIO",
  size = "text-[13vw]",
  /*
    Where the word sits inside its section. The default fills the section,
    which is right when the section's text is narrow enough to clear it. On
    /marketplace it was not: the headline and intro paragraph ran straight
    through the middle of the letters and the paragraph became hard to read.
    Pages with wide text pass a box that holds only empty space.
  */
  position = "inset-0",
}: {
  text?: string;
  size?: string;
  position?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const rv = reveal.current;
    if (!el || !rv) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5, last = -9999, raf = 0;
    const apply = () => {
      rv.style.setProperty("--mx", `${(mx * 100).toFixed(2)}%`);
      rv.style.setProperty("--my", `${(my * 100).toFixed(2)}%`);
    };

    const host = el.parentElement!;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      last = performance.now();
    };
    host.addEventListener("pointermove", onMove);

    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      // Idle or touch → drift the spotlight on its own.
      if (now - last > 1400 && !reduce) {
        const t = (now - t0) / 1000;
        tx = 0.5 + 0.34 * Math.sin(t * 0.55);
        ty = 0.5 + 0.14 * Math.sin(t * 0.9 + 1);
      }
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      apply();
    };
    apply();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-hidden ${position}`}
    >
      {/* Faint base — the word always sits in the fog */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`whitespace-nowrap font-display ${size} font-bold leading-none tracking-tighter`}
          style={{
            color: "var(--wm-ink)",
            WebkitTextStroke: "1.5px var(--wm-stroke)",
          }}
        >
          {text}
        </span>
      </div>

      {/* Revealed — soft sea-glass letters, masked to a spotlight at the cursor */}
      <div
        ref={reveal}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle 300px at var(--mx,50%) var(--my,50%), #000 0%, #000 30%, rgba(0,0,0,0.45) 58%, transparent 80%)",
          maskImage:
            "radial-gradient(circle 300px at var(--mx,50%) var(--my,50%), #000 0%, #000 30%, rgba(0,0,0,0.45) 58%, transparent 80%)",
        }}
      >
        <span
          className={`whitespace-nowrap font-display ${size} font-bold leading-none tracking-tighter text-transparent`}
          style={{
            backgroundImage:
              "linear-gradient(120deg, var(--color-signal), #b9f0e6 45%, #ffffff 55%, var(--color-signal))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 26px var(--color-signal-glow))",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
