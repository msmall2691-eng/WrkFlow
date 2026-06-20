"use client";

import { useEffect, useRef } from "react";

/*
  HeroWordmark — a giant brand word hidden in the hero, revealed by a cursor
  "spotlight" (wipe-the-fog-off-glass). Follows the pointer on hover; gently
  auto-sweeps when idle / on touch so mobile sees it too. Decorative.
*/
export default function HeroWordmark({ text = "M STUDIO" }: { text?: string }) {
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
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Faint base — the word always sits in the fog */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="whitespace-nowrap font-display text-[13vw] font-bold leading-none tracking-tighter text-white/[0.022] [-webkit-text-stroke:1px_rgba(255,255,255,0.03)]">
          {text}
        </span>
      </div>

      {/* Revealed — soft sea-glass letters, masked to a spotlight at the cursor */}
      <div
        ref={reveal}
        className="absolute inset-0 flex items-center justify-center opacity-70"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle 200px at var(--mx,50%) var(--my,50%), #000 0%, rgba(0,0,0,0.3) 45%, transparent 72%)",
          maskImage:
            "radial-gradient(circle 200px at var(--mx,50%) var(--my,50%), #000 0%, rgba(0,0,0,0.3) 45%, transparent 72%)",
        }}
      >
        <span
          className="whitespace-nowrap font-display text-[13vw] font-bold leading-none tracking-tighter text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(120deg, var(--color-signal), #7fd8cd 50%, var(--color-signal))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
