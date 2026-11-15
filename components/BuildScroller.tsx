"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CaseStudyBuild } from "@/lib/content";

/*
  BuildScroller — the "What was built" sequence on a case study.

  The screen stays pinned while the bullets scroll past it; whichever bullet
  owns the middle of the viewport is the screen you are looking at. That is
  CSS `position: sticky` plus one IntersectionObserver, the same technique the
  old left-hand rail used. No scroll library, no scroll listener.

  Three layouts, one component:
    · >=768px with motion allowed — screen pinned left, bullets right
    · <768px                      — no pinning; each bullet carries its screen
    · prefers-reduced-motion      — the stacked layout, at every width

  The stacked layout is the truth and the pinned one is a presentation of it,
  so the fallback is the same code path the phone layout uses and gets tested
  for free.

  `stacked` starts computed rather than false: a project with fewer than two
  captures has nothing to swap between, and a one-screen "sequence" just
  looks broken. It depends only on props, so SSR and first client render
  agree and there is no hydration mismatch.

  Careful: `position: sticky` dies inside an `overflow: hidden` ancestor —
  the clipped box becomes the scroll container. Almost every section wrapper
  in this repo has `overflow-hidden`, so the section that renders this one
  must not.
*/
export default function BuildScroller({ items }: { items: CaseStudyBuild[] }) {
  const [active, setActive] = useState(0);
  const [stacked, setStacked] = useState(
    items.filter((i) => i.shot).length < 2,
  );
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStacked(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setStacked(true);
      return;
    }
    const nodes = steps.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = nodes.indexOf(e.target as HTMLElement);
          if (i >= 0) setActive(i);
        });
      },
      /* A band across the middle of the viewport: whatever is in it is what
         the visitor is reading. */
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items.length]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={stacked ? "" : "grid gap-10 md:grid-cols-2 md:gap-12"}>
      {!stacked && (
        <div className="hidden md:block">
          {/* top-24 clears the fixed h-16 nav with a little air. */}
          <div className="sticky top-24">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-base">
              {items.map((it, i) =>
                it.shot ? (
                  <Image
                    key={it.shot.src}
                    src={it.shot.src}
                    alt={it.shot.alt}
                    fill
                    sizes="(min-width: 768px) 560px, 100vw"
                    priority={i === 0}
                    className={`object-cover object-top transition-opacity duration-500 ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ) : null,
              )}
            </div>
            <p className="mt-3 text-xs text-faint">
              <span className="font-mono tabular-nums">
                {pad(active + 1)} / {pad(items.length)}
              </span>
              {" · "}
              {items[active]?.label}
            </p>
          </div>
        </div>
      )}

      <ol className="space-y-10 md:space-y-0">
        {items.map((it, i) => (
          <li
            key={it.label}
            ref={(el) => {
              steps.current[i] = el;
            }}
            /* The min-height is the scroll distance that makes the swap
               readable. The phone layout gets none and simply stacks. */
            className={
              stacked
                ? ""
                : "md:flex md:min-h-[72svh] md:flex-col md:justify-center"
            }
          >
            <span className="font-mono text-xs text-signal tabular-nums">
              {pad(i + 1)}
            </span>
            <h3 className="display mt-2 text-lg text-ink md:text-xl">
              {it.label}
            </h3>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">
              {it.body}
            </p>
            {it.shot && (
              /* The per-bullet screen. Always in the DOM; `display:none` at
                 md+ when pinning is on, which also takes it out of the
                 accessibility tree — so each alt string is announced exactly
                 once and no aria-hidden juggling is needed. */
              <div
                className={`relative mt-4 aspect-[16/10] overflow-hidden rounded-xl border border-line bg-base ${
                  stacked ? "" : "md:hidden"
                }`}
              >
                <Image
                  src={it.shot.src}
                  alt={it.shot.alt}
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
