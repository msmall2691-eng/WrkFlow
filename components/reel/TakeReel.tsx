"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { planets as takes } from "@/lib/planets";

/*
  The take reel: a browser window pinned on the right, four takes swapping
  inside it, the take number and the client on the left.

  **This replaces the project planets at Meg's direct ask:** "i dont like
  the globes wish they were cards instead". A sphere is a shape a project
  is painted onto; a browser window is the thing she actually makes. The
  capture inside is the deliverable, at the size somebody looks at it.

  Built from two references she sent together. The LINX prompt's section 1
  and 2 (the film locks into a 16:10 browser window on the right 60%, then
  four takes swap inside it while a huge mono take number sits left) and
  motionvault.site, which does the same move as a "1 of 4" step: window on
  the right in perspective, copy on the left, content swapping as you
  scroll.

  **It is DOM and CSS, not WebGL, and that is the point.** Everything this
  section does is a crossfade, a scale settle and a progress tick. Putting
  it on a canvas would buy nothing, cost a GPU context on a page that
  already runs one, and break for anybody without WebGL. The scene stays
  where a scene is needed.

  **No result number per take, because there is not one.** The prompt asks
  each take for a cyan metric that counts up: "+212% preorders", "4.1M
  launch-week views". Every `metric` field in `lib/content.ts` is empty,
  and that file says why: "A single REAL outcome number. Never fabricate,
  leave undefined until Meg confirms." So a take carries the client, where
  they are, what was built and a link. The counters live in the stats band
  instead, where the numbers are real and attributed.
*/

/** How long the pinned sequence runs, in screen heights. */
const REEL_VH = 320;
const REEL_VH_MOBILE = 180;

/*
  The URL shown in the window chrome. Taken from the project's own link
  when it is a real site, because the chrome lying about where something
  lives is the one thing a browser frame must not do.
*/
function chromeUrl(href: string, external: boolean): string {
  if (!external) return `mlinx.studio${href}`;
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return "mlinx.studio";
  }
}

export default function TakeReel() {
  const section = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [vh, setVh] = useState(REEL_VH);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setVh(narrow.matches ? REEL_VH_MOBILE : REEL_VH);
      setStill(reduced.matches);
    };
    sync();
    narrow.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      narrow.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel));
      setProgress(p);
      /* Four equal slices. `min` rather than a clamp on the index so the
         last take holds to the end instead of wrapping to the first. */
      setActive(Math.min(takes.length - 1, Math.floor(p * takes.length)));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [vh]);

  const take = takes[active];

  return (
    <section
      ref={section}
      aria-labelledby="reel-heading"
      /*
        **Reduced motion gets the takes stacked, not pinned.** The prompt's
        own accessibility line asks for exactly this: no scroll-scrubbing,
        show the final states. A pinned sequence IS scroll-scrubbing, so
        under `reduce` the section collapses to its natural height and every
        take renders as an ordinary card below the next.
      */
      /* Translucent since the homepage became a dive: this is the tallest
         section on the page, so an opaque stage here was a black band in
         the middle of the ocean. The browser frames inside keep their own
         solid grounds, which is where the contrast actually matters. */
      className="cp-night relative bg-[rgba(14,15,18,0.78)]"
      style={still ? undefined : { height: `${vh}svh` }}
    >
      <h2 id="reel-heading" className="sr-only">
        Selected work
      </h2>

      {still ? (
        /*
          Stacked: every take, in order, no pin, **and its capture.**

          The fallback is the pinned sequence's end state rather than a
          summary of it, which is the rule this page is built on and the
          thing the first version of this branch got wrong: it rendered
          `TakePanel` alone, so a reduced-motion visitor read five project
          descriptions and saw a picture of none of them. `BrowserWindow`
          is the only component that draws `take.shot`.

          So each take keeps the same two-column shape it has when pinned,
          with the same source order, and only the pinning and the
          crossfade are dropped. What is lost under `reduce` is the
          motion; nothing about the work goes with it.
        */
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          {/* The stacked branch has no sticky layer, so it carries its own
              copy of the label rather than going unnamed. */}
          <span
            aria-hidden="true"
            className="mb-10 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/45"
          >
            [ Selected work ]
          </span>
          <ul className="m-0 list-none space-y-24 p-0">
            {takes.map((t, i) => (
              <li
                key={t.id}
                className="grid gap-10 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-center"
              >
                <TakePanel take={t} index={i} />
                <BrowserWindow take={t} index={i} still />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          {/*
            The four ticks along the top edge, filling with scroll. The
            prompt puts them on the window; here they run the full width,
            which is what reads at 390 where the window is the width.
          */}
          {/*
            **The label, and why it is here rather than on the `<h2>`.**

            This is the tallest section on the page — 2,880px, about a
            fifth of it — and for its whole life its only heading was
            `sr-only`. A visitor scrolled three screens through Meg's
            five best builds with nothing on screen saying what they
            were looking at, which is most of why she described the page
            as a maze, and it is why "The rest of it" lands wrong 3,000px
            later: the rest of something never named.

            It cannot go on the `<h2>`, which sits at the top of a 320svh
            block and would scroll away in the first flick. It lives in
            the sticky layer instead, beside the progress ticks, so it
            holds for the whole run. The `<h2>` keeps the accessible
            name; this is its visible twin and so is `aria-hidden`.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 flex items-center gap-4 px-6 pt-5"
          >
              <span
                aria-hidden="true"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45"
              >
                [ Selected work ]
              </span>
            {takes.map((t, i) => {
              const slice = progress * takes.length - i;
              const fill = Math.min(1, Math.max(0, slice));
              return (
                <span key={t.id} className="h-px flex-1 bg-white/15">
                  <span
                    className="block h-px bg-[#2dd4bf]"
                    style={{ width: `${fill * 100}%` }}
                  />
                </span>
              );
            })}
          </div>

          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-center">
            <TakePanel take={take} index={active} />
            <BrowserWindow take={take} index={active} />
          </div>
        </div>
      )}
    </section>
  );
}

function TakePanel({
  take,
  index,
}: {
  take: (typeof takes)[number];
  index: number;
}) {
  return (
    /* `stacked` is gone rather than defaulted: its only job was to strip
       the order classes for a one-column fallback, and that fallback is
       now the same two-column grid, so a second opinion about source
       order would be a way for the two layouts to drift apart. */
    <div className="order-2 md:order-1">
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
        [ Take {String(index + 1).padStart(2, "0")} of{" "}
        {String(takes.length).padStart(2, "0")} ]
      </p>

      {/* The huge mono take number the prompt asks for. */}
      <p className="m-0 mt-2 font-mono text-[clamp(3.4rem,9vw,7rem)] leading-none text-white/12">
        {String(index + 1).padStart(2, "0")}
      </p>

      <p className="m-0 mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#2dd4bf]">
        {take.tag}
      </p>

      {/*
        The prompt's two-line title: a sans first line and a serif italic
        second. Fraunces rather than Instrument Serif, because Fraunces is
        already loaded in exactly that role and `app/layout.tsx` records
        what happened the last time this page carried five families.
      */}
      <h3 className="m-0 mt-2 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] font-semibold leading-[1.05] tracking-tight text-[#EDEBE6]">
        {take.title}
      </h3>

      <p className="m-0 mt-5 max-w-[34ch] text-[0.98rem] leading-relaxed text-white/60">
        {take.blurb}
      </p>

      {take.external ? (
        <a
          href={take.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-11 items-center rounded-full border border-[#2dd4bf]/45 px-5 text-[13px] font-medium text-[#2dd4bf] no-underline transition-colors duration-150 hover:border-[#2dd4bf]"
        >
          View the live site <span aria-hidden="true">&nbsp;→</span>
        </a>
      ) : (
        <Link
          href={take.href}
          className="mt-7 inline-flex min-h-11 items-center rounded-full border border-[#2dd4bf]/45 px-5 text-[13px] font-medium text-[#2dd4bf] no-underline transition-colors duration-150 hover:border-[#2dd4bf]"
        >
          View take <span aria-hidden="true">&nbsp;→</span>
        </Link>
      )}
    </div>
  );
}

function BrowserWindow({
  take,
  index,
  still = false,
}: {
  take: (typeof takes)[number];
  index: number;
  still?: boolean;
}) {
  return (
    <div className="order-1 md:order-2">
      <div className="overflow-hidden rounded-[14px] border border-white/12 bg-[#15161a] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* Chrome: three dots and the URL, which changes per take. */}
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/18" />
          </span>
          <span className="truncate rounded-md bg-white/6 px-3 py-1 font-mono text-[11px] text-white/50">
            {chromeUrl(take.href, take.external)}
          </span>
        </div>

        {/*
          The capture, 16:10, crossfading between takes with the prompt's
          1.06 to 1 scale settle. Every take is rendered and only the
          active one is opaque, so the swap is a real crossfade rather
          than a swap with a gap in the middle.
        */}
        <div className="relative aspect-[16/10] w-full bg-[#0E0F12]">
          {still ? (
            /* One capture, drawn once. The crossfade below renders every
               take and hides all but one, which is right when they are
               swapping in place and wrong here: stacked, each window
               shows its own take for good, so the other four would be
               four more downloads nobody will ever see. */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={take.shot}
              alt={`${take.title}, as it runs today`}
              className="h-full w-full object-cover object-top"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            takes.map((t, i) => (
              <div
                key={t.id}
                aria-hidden={i === index ? undefined : true}
                className="absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: i === index ? 1 : 0,
                  transform: i === index ? "scale(1)" : "scale(1.06)",
                }}
              >
                {/* No empty branch: `lib/planets.ts` filters out a take with no
                  capture, so this frame is never drawn around nothing. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.shot}
                  alt={`${t.title}, as it runs today`}
                  className="h-full w-full object-cover object-top"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
