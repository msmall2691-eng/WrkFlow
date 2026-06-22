"use client";

import { useEffect, useRef, useState } from "react";
import { work } from "@/lib/content";

/*
  LivePreview — a horizontal, gently auto-scrolling rail of the LIVE sites
  (those flagged `live` in content). It showcases them moving; hover pauses the
  drift and makes that site interactive so you can actually scroll/explore it.
  Touch devices just swipe the rail. Lazy: nothing loads until it scrolls in.
*/
const domain = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const SITES = work
  .filter((w) => !!w.url && w.live)
  .map((w) => ({ tag: w.tag, title: w.title, blurb: w.blurb, url: w.url as string }));

export default function LivePreview() {
  const railRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hoverable, setHoverable] = useState(false);

  useEffect(() => {
    setHoverable(matchMedia("(hover: hover)").matches);
    const el = railRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gentle ping-pong auto-scroll; paused on hover/touch and for reduced-motion.
  useEffect(() => {
    if (!load) return;
    const el = railRef.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      if (pausedRef.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 2) return;
      // Continuous, gentle one-way drift — loops at the end (no bouncing).
      el.scrollLeft = el.scrollLeft >= max - 1 ? 0 : el.scrollLeft + 0.4;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [load]);

  if (!SITES.length) return null;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-faint">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
        {hoverable ? "Live sites · hover to pause & explore" : "Live sites · swipe to explore"}
      </div>

      <div
        ref={railRef}
        onPointerEnter={() => {
          pausedRef.current = true;
        }}
        onPointerLeave={() => {
          pausedRef.current = false;
          setActive(null);
        }}
        className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SITES.map((s, i) => (
          <article
            key={s.url}
            onPointerEnter={() => setActive(i)}
            className="group relative w-[88%] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-surface sm:w-[460px]"
          >
            {/* Browser frame */}
            <div className="flex items-center gap-1.5 border-b border-line bg-base/60 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="ml-2 truncate rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-faint">
                {domain(s.url)}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-signal">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
                Live
              </span>
            </div>

            {/* Live embed */}
            <div className="relative aspect-[16/10] bg-base">
              {load ? (
                <iframe
                  key={s.url}
                  src={s.url}
                  title={`${s.title} — live`}
                  loading="lazy"
                  className="absolute left-0 top-0"
                  style={{
                    border: 0,
                    // Render at 2x the card width, then scale down — shows the full
                    // desktop layout "zoomed out" instead of a cropped close-up.
                    width: "200%",
                    height: "200%",
                    transform: "scale(0.5)",
                    transformOrigin: "top left",
                    pointerEvents: hoverable && active === i ? "auto" : "none",
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-xs text-faint">
                  Loading live site…
                </div>
              )}
              {hoverable && active !== i && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/45 to-transparent p-2">
                  <span className="rounded-full bg-base/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-faint backdrop-blur">
                    Hover to explore
                  </span>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-faint">{s.tag}</p>
                <h3 className="display-serif mt-1 text-base text-ink">{s.title}</h3>
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-signal transition-colors hover:text-ink"
              >
                Visit <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
        <div className="w-2 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}
