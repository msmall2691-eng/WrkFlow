"use client";

import { useEffect, useRef } from "react";

/*
  PanelStage — the homepage's one screen, and the only place it listens to
  the pointer.

  Two jobs, both cheap:
    · it writes the pointer position into CSS variables (--px, --py, -0.5..0.5)
      once per animation frame. The product window tilts toward the cursor and
      a soft glow follows it; both read those variables in a `transform`, so
      React never re-renders on mouse move.
    · it marks itself off-screen (data-off) when scrolled past, which pauses
      every looping animation inside it: the aurora, the ticker. Hidden tabs
      pause on their own.

  Reduced motion: no pointer listener at all. The variables stay at 0, so the
  window sits flat and the glow sits centered.
*/
export default function PanelStage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) delete el.dataset.off;
        else el.dataset.off = "";
      },
      { threshold: 0 },
    );
    io.observe(el);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();
    if (!matchMedia("(pointer: fine)").matches) return () => io.disconnect();

    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width - 0.5;
      y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`cp-stage ${className}`}>
      {children}
    </div>
  );
}
