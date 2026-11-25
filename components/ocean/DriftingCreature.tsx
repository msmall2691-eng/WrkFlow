"use client";

import { useEffect, useRef } from "react";

/*
  A creature that moves at its own speed as the page goes past it.

  **This is the asset that was sitting unused the longest.** Meg sent a
  cutout with a real alpha channel — the octopus, a manta, a shark, the
  clownfish, the anglerfish, and no background at all — which is the one
  piece in the whole set actually built to float over something. The site
  had it for a day and never put it on a page, which is the same failure
  as using one clip out of nine: the art was the point and the art was in
  a folder.

  **Parallax, done the only way it is allowed here.** CLAUDE.md permits
  `transform` and `opacity` and nothing else, so this reads scroll and
  writes one `translate3d`. No `top`, no margin, no layout, so the
  browser can keep it on the compositor and the page does not reflow
  while somebody scrolls.

  Four things keep it honest:

  * **Reads and writes are split.** Scroll fires far more often than the
    screen refreshes, so the handler only records a position and a single
    rAF does the write. Writing a transform inside the scroll handler is
    how a parallax ends up janky on exactly the cheap laptop it is
    supposed to impress.
  * **It stops when it is not on screen.** An IntersectionObserver gates
    the loop entirely, so a creature three sections up costs nothing.
  * **`prefers-reduced-motion` leaves it exactly where it sits.** It is
    still there, still part of the composition; it simply does not move,
    and the preference is subscribed to rather than read once.
  * **It never takes a click** and is `aria-hidden`: it is scenery, and a
    screen reader being told about an octopus is noise.

  The movement is deliberately small. `range` is the total travel in
  pixels across the whole time the element is on screen, and at 90 that
  is a creature holding its position in a current rather than something
  flying across the page. A big number here would read as a gimmick, and
  this is meant to read as water.
*/
export default function DriftingCreature({
  src,
  alt = "",
  className = "",
  range = 90,
}: {
  src: string;
  alt?: string;
  className?: string;
  /** Total parallax travel in px over the element's time on screen. */
  range?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onScreen = false;
    let raf = 0;
    let pending = false;

    function write() {
      pending = false;
      if (!el || !onScreen || mq.matches) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      /* 0 when the element's top is at the bottom of the viewport, 1 when
         its bottom has reached the top: its whole pass across the screen,
         independent of how tall it or the window is. */
      const progress = (vh - r.top) / (vh + r.height);
      const clamped = Math.max(0, Math.min(1, progress));
      /* Centred on zero so the creature sits where the layout put it at
         the midpoint of its pass, rather than always starting low. */
      const y = (clamped - 0.5) * -range;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    function onScroll() {
      if (pending || !onScreen) return;
      pending = true;
      raf = requestAnimationFrame(write);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          onScreen = e.isIntersecting;
          if (onScreen) onScroll();
        }
      },
      { rootMargin: "10% 0px 10% 0px" },
    );
    io.observe(el);

    function onPreference() {
      if (mq.matches && el) el.style.transform = "";
      else onScroll();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mq.addEventListener("change", onPreference);
    onScroll();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onPreference);
    };
  }, [range]);

  return (
    <div
      ref={ref}
      data-creature=""
      aria-hidden="true"
      className={`pointer-events-none will-change-transform ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full" />
    </div>
  );
}
