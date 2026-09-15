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
  .map((w) => ({
    tag: w.tag,
    title: w.title,
    blurb: w.blurb,
    url: w.url as string,
    // Chrome label — falls back to the real host (site survey O-03).
    label: w.displayDomain ?? domain(w.url as string),
    shot: w.shot,
  }));

export default function LivePreview() {
  const railRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hoverable, setHoverable] = useState(false);
  /*
    Snap and indicators (site survey O-06). Snap points can't coexist with the
    idle drift — the browser would keep yanking the rail back onto a card while
    the rAF loop nudges it forward — so the first real swipe or wheel stops the
    drift for good and hands the rail over to scroll-snap. Until then the dots
    are still a live position readout.
  */
  const [taken, setTaken] = useState(false);
  const [index, setIndex] = useState(0);
  /*
    Which embeds have actually arrived. The iframe used to be painted over the
    poster the moment it was created, so the comment below ("what remains is
    still a picture of the site") was not true of the rendered page: a slow,
    offline or extension-blocked embed covered the screenshot with a broken
    frame instead of falling back to it. Now the iframe stays transparent
    until its own load event fires, and a card whose embed never arrives is
    left showing the poster — or, where there is no poster, a plain panel
    with the address on it rather than a browser error.

    One case this can't catch: a site that answers with X-Frame-Options DENY
    still fires `load` (on the browser's own refusal page), and a cross-origin
    frame can't be inspected to tell the difference. Neither site in `work` is
    flagged `live` unless it frames — if one starts refusing, drop its `live`
    flag and it falls back to the poster card.
  */
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const readyRef = useRef<Record<string, boolean>>({});

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

  // Track which card is centred, for the indicator dots.
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement && c.tagName === "ARTICLE",
      );
      if (!cards.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestGap = Infinity;
      cards.forEach((c, i) => {
        const gap = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (gap < bestGap) {
          bestGap = gap;
          best = i;
        }
      });
      setIndex(best);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [load]);

  // Gentle one-way auto-scroll; paused on hover, and retired for good once the
  // visitor takes the rail over themselves.
  useEffect(() => {
    if (!load || taken) return;
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
  }, [load, taken]);

  // Nothing arrived in eight seconds → stop waiting and keep the fallback.
  useEffect(() => {
    if (!load) return;
    const id = setTimeout(() => {
      setFailed((f) => {
        const next = { ...f };
        SITES.forEach((s) => {
          if (!readyRef.current[s.url]) next[s.url] = true;
        });
        return next;
      });
    }, 8000);
    return () => clearTimeout(id);
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
        onPointerDown={() => setTaken(true)}
        onWheel={(e) => {
          // Only a sideways wheel/trackpad gesture is the visitor taking the
          // rail over — a vertical wheel is just the page scrolling past it.
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) setTaken(true);
        }}
        onKeyDown={() => setTaken(true)}
        className={`flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          taken ? "snap-x snap-mandatory" : ""
        }`}
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
                {s.label}
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-signal">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
                Live
              </span>
            </div>

            {/* Live embed.

                The screenshot sits underneath as a poster rather than being an
                either/or with the iframe. Two reasons: the card shows the real
                site immediately instead of an empty "loading" box on first
                paint, and if an embed is slow or refuses to frame at all, what
                remains is still a picture of the site rather than a blank
                panel. The iframe simply covers it once it arrives. */}
            <div className="relative aspect-[16/10] bg-base">
              {s.shot && (
                <img
                  src={s.shot}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              )}
              {load ? (
                <iframe
                  key={s.url}
                  src={s.url}
                  title={`${s.title} — live`}
                  loading="lazy"
                  onLoad={() => {
                    readyRef.current[s.url] = true;
                    setReady((r) => ({ ...r, [s.url]: true }));
                  }}
                  className="absolute left-0 top-0 transition-opacity duration-500 motion-reduce:transition-none"
                  style={{
                    border: 0,
                    opacity: ready[s.url] ? 1 : 0,
                    // Render at 2x the card width, then scale down — shows the full
                    // desktop layout "zoomed out" instead of a cropped close-up.
                    width: "200%",
                    height: "200%",
                    transform: "scale(0.5)",
                    transformOrigin: "top left",
                    pointerEvents: hoverable && active === i ? "auto" : "none",
                  }}
                />
              ) : null}
              {!s.shot && !ready[s.url] && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-base px-4 text-center">
                  <span className="font-mono text-[11px] text-faint">{s.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                    {failed[s.url] ? "Open it in a new tab →" : "Loading live site…"}
                  </span>
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
                <h3 className="display-serif mt-1 text-[1rem] text-ink">{s.title}</h3>
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

      {/* Position indicator — 1240px of rail in a 327px window gave no sense of
          how much was left (site survey O-06). Also a way to jump. */}
      {SITES.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {SITES.map((s, i) => (
            <button
              key={s.url}
              type="button"
              aria-label={`Show ${s.title}`}
              aria-current={i === index}
              onClick={() => {
                setTaken(true);
                const card = railRef.current?.children[i];
                card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className="group flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-signal" : "w-1.5 bg-line group-hover:bg-muted"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
