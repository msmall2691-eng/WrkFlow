"use client";

import { useEffect, useRef, useState } from "react";
import { work } from "@/lib/content";

/*
  LivePreview — a browser-framed, tabbed LIVE embed of the sites that allow
  framing (flagged `live` in content). Display-only (pointer-events-none) so it
  shows the real, current site without trapping scroll; "Visit site" opens it.
  Only the active tab's iframe mounts, and nothing loads until it scrolls in.
*/
const domain = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const SITES = work
  .filter((w) => !!w.url && w.live)
  .map((w) => ({ tag: w.tag, title: w.title, blurb: w.blurb, url: w.url as string }));

export default function LivePreview() {
  const [active, setActive] = useState(0);
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const site = SITES[active];

  useEffect(() => {
    const el = ref.current;
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

  if (!site) return null;

  return (
    <div ref={ref}>
      {SITES.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {SITES.map((s, i) => (
            <button
              key={s.url}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === i
                  ? "border-signal/50 bg-signal/10 text-signal"
                  : "border-line bg-surface text-muted hover:border-signal/40 hover:text-ink"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center gap-1.5 border-b border-line bg-base/60 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="ml-2 truncate rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-faint">
            {domain(site.url)}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-signal">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
            Live
          </span>
        </div>
        <div className="relative aspect-[16/10] bg-base">
          {load ? (
            <iframe
              key={site.url}
              src={site.url}
              title={`${site.title} — live`}
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ border: 0 }}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-faint">
              Loading live site…
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">{site.tag}</p>
          <h3 className="display-serif mt-1.5 text-lg text-ink">{site.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{site.blurb}</p>
        </div>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
        >
          Visit site
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
