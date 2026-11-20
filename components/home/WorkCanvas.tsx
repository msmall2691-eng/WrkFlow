"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import BookCall from "../BookCall";
import PanelHeader from "../panel/PanelHeader";
import { canvasTiles, type CanvasTile } from "@/lib/canvasTiles";
import { statusLabels } from "@/lib/catalog";

/*
  The hero: everything Meg has built, as a wall you drag through, with an
  index you can read instead.

  **The register is the one she chose after three tries.** She sent the
  dark cinematic portfolio templates twice and then said "i want something
  like these holy smoke i love them". Of the ones with a live demo, the
  infinite drag canvas is the only one whose content can be honest here:
  the rest are carried by invented cinematic imagery this project does not
  have and may not generate. This one is carried by an archive, and she
  has one, twenty-eight real captures deep.

  **So the hero is the shop.** Her first brief on this page was that it
  was "hard to see what is for sale that's tangible", and the fix then was
  to move the shelf up. This goes further: every tile is a thing with a
  price, and clicking it goes to that thing. The cinematic treatment and
  the commercial point are the same object rather than two competing ones.

  **Canvas and Index are one list shown two ways.** The toggle is from the
  reference and it earns its place: a wall is for wandering and a table is
  for deciding, and somebody who arrived knowing what they want should not
  have to drag for it. The Index is also what a keyboard and a screen
  reader get, which is why the canvas is `aria-hidden` and the Index is
  not: the picture is a presentation of the list, never the only copy of
  it.
*/

/*
  **The scene is the film strip now, and the drag wall is gone.** Meg
  picked Aperture & Line out of the templates once the question became
  which one could be built completely: its frames are project
  thumbnails, and she has twenty-eight real ones. The wall was the right
  shape for the same content and this is the one she chose.
*/
const FilmStripScene = dynamic(() => import("./FilmStripScene"), {
  ssr: false,
});


type View = "strip" | "index";

export default function WorkCanvas() {
  const [view, setView] = useState<View>("strip");
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const [hover, setHover] = useState<CanvasTile | null>(null);

  useEffect(() => {
    let ok = false;
    try {
      const probe = document.createElement("canvas");
      const gl =
        probe.getContext("webgl2") ??
        probe.getContext("webgl") ??
        probe.getContext("experimental-webgl");
      ok = !!gl;
      (gl as WebGLRenderingContext | null)
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext();
    } catch {
      ok = false;
    }
    if (!ok) {
      /*
        No WebGL means no wall, so the index is not a degraded view, it is
        the whole hero. Switching rather than showing an empty frame.
      */
      setView("index");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(reduced.matches);
    sync();
    reduced.addEventListener("change", sync);
    setReady(true);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  return (
    <section
      /* `cp-night` re-declares the palette tokens for this subtree, so the
         header and anything else token-driven renders for near-black
         instead of for the cream page around it. */
      className="cp-night relative isolate overflow-hidden bg-[#0a0a0c]"
      aria-labelledby="canvas-heading"
    >
      {/* The wall. */}

      <div
        id="film-strip"
        aria-hidden="true"
        className={`absolute inset-0 touch-pan-y ${
          view === "strip" ? "" : "pointer-events-none opacity-0"
        } transition-opacity duration-300`}
      >
        {ready && view === "strip" ? (
          <FilmStripScene tiles={canvasTiles} still={still} onFrame={setHover} />
        ) : null}
      </div>

      {/*
        A wash from the top so the headline always has something to sit
        on, whatever capture happens to drift under it. Without it the
        type is legible over a dark screenshot and gone over a white one,
        which is a thing that only shows up on the fourth drag.
      */}
      {view === "strip" ? (
        <div
          aria-hidden="true"
          /* Top-to-bottom on a phone, where the strip is vertical and the copy
             sits above it; left-to-right on a wide screen, where the copy owns
             the left column and the frames own the right. A single direction
             cannot do both: the left-to-right version put the headline half on
             black and half on a white screenshot at 390px. */
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,12,0.96)_0%,rgba(10,10,12,0.9)_30%,rgba(10,10,12,0.45)_72%,rgba(10,10,12,0.7)_100%)] md:bg-[linear-gradient(to_right,rgba(10,10,12,0.95)_0%,rgba(10,10,12,0.86)_34%,rgba(10,10,12,0.3)_68%,rgba(10,10,12,0.55)_100%)]"
        />
      ) : null}

      {/*
        `pointer-events-none` on the wrapper, and back on for the two
        things a visitor touches. Without it this div sat over the wall
        and swallowed every pointer move before it arrived: the cursor
        light never lit and the caption never named a tile, while the
        page looked completely correct. Marking only the inner column was
        not enough, because the hit test stops at the first ancestor that
        accepts events, not at the first one that draws something.
      */}
      {/*
        **The nav and the shop button live here, and both have now been
        lost twice by replacing the hero.** They were inside the old hero
        components, so each rewrite took Work, Demos, Services, Catalog,
        About and the one button pointing at the prices off the homepage
        with it. Nothing failed to build either time; `e2e/smoke.spec.ts`
        caught it both times, which is the argument for those two tests
        existing at all.
      */}
      <div className="pointer-events-auto relative">
        <PanelHeader />
      </div>

      <div className="pointer-events-none relative mx-auto flex min-h-[78svh] w-full max-w-6xl flex-col px-6 py-10">
        {/*
          **The copy block carries its own ground below `md`.** The page
          scrim cannot do it: on a phone the strip is vertical and always
          fills the view, so whatever the gradient does there is a
          near-white capture of a web app somewhere behind white serif.
          A local backdrop is the only thing that holds at every scroll
          position, and it disappears at `md` where the frames keep to
          the right-hand side on their own.
        */}
        <div className="pointer-events-none -mx-2 flex flex-1 flex-col justify-center rounded-2xl bg-[rgba(10,10,12,0.78)] px-2 py-10 backdrop-blur-[2px] md:mx-0 md:rounded-none md:bg-transparent md:px-0 md:backdrop-blur-none">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
            Custom software · Southern Maine · clients anywhere
          </p>
          <h1
            id="canvas-heading"
            className="m-0 mt-5 font-serif text-[clamp(2.6rem,6vw,5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-white"
          >
            Software that
            <br />
            <em className="font-normal italic text-white/85">
              runs real businesses.
            </em>
          </h1>
          <p className="m-0 mt-6 max-w-[38ch] text-[1rem] leading-relaxed text-white/70">
            Websites, web apps and custom tools for small businesses. Built to
            bring work in, and to cut the manual parts out.
          </p>

          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
            <BookCall
              where="hero"
              className="cp-cta inline-flex items-center gap-2.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white no-underline transition-transform duration-150 hover:-translate-y-0.5"
            >
              Book a free 15-min call <span aria-hidden="true">→</span>
            </BookCall>
            <a
              href="#shelf"
              className="inline-flex items-center rounded-xl border border-white/25 px-5 py-3.5 text-[15px] font-medium text-white no-underline transition-colors duration-150 hover:border-white/60"
            >
              See everything, with prices
            </a>
          </div>
        </div>

        {/* The index, when it is the view. */}
        {view === "index" ? (
          <div className="pointer-events-auto relative mt-2 mb-8 max-h-[46svh] overflow-y-auto">
            <ol className="m-0 list-none p-0">
              {canvasTiles.map((t, i) => {
                const row = (
                  <>
                    <span className="w-9 shrink-0 font-mono text-[11px] text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-serif text-[1.15rem] text-white">
                      {t.name}
                    </span>
                    <span className="hidden w-40 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45 sm:block">
                      {statusLabels[t.status].label}
                    </span>
                    <span className="w-44 shrink-0 text-right font-mono text-[11px] leading-snug text-white/60">
                      {t.price}
                    </span>
                  </>
                );
                return (
                  <li key={t.id} className="border-t border-white/10">
                    {t.href ? (
                      <Link
                        href={t.href}
                        className="flex min-h-11 items-center gap-4 py-3 no-underline transition-colors duration-150 hover:bg-white/[0.06]"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="flex min-h-11 items-center gap-4 py-3">{row}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}

        {/* The foot: what you are looking at, and how to look at it. */}
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <p className="m-0 min-h-[1.4em] font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
            {view === "strip" && hover ? (
              <>
                <span className="text-white">{hover.name}</span> ·{" "}
                {statusLabels[hover.status].label} · {hover.price}
              </>
            ) : (
              <>
                {canvasTiles.length} things built · scroll the strip
              </>
            )}
          </p>

          <div
            className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur-md"
            role="group"
            aria-label="How to view the work"
          >
            {(["strip", "index"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                disabled={v === "strip" && !ready}
                className={`min-h-9 rounded-full px-4 text-[13px] capitalize transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
                  view === v
                    ? "bg-white text-[#0a0a0c]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
