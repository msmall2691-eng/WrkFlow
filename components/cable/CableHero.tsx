"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import BookCall from "../BookCall";
import PanelHeader from "../panel/PanelHeader";
import ProofStrip from "../ProofStrip";
import CableStill from "./CableStill";
import { CABLE_BRANCHES, type CableStage } from "@/lib/cable";

/*
  Follow the Cable — the hero.

  A fiber crosses a slab of granite, slips through a seam, and splits into
  the two things M Studio actually sells. The idea is that the thing being
  described is on screen being a thing, rather than described.

  **Every control here is real HTML.** The labels, the branch buttons, the
  panels and the back control are `<button>` and `<Link>`, never objects
  picked in the canvas. That is what makes the whole hero work by keyboard
  and by touch, and it is why the no-WebGL path costs almost nothing: the
  controls were never in the scene to begin with.

  **Nothing waits on the 3D.** `CableStill` is server-rendered SVG, so the
  headline, the buttons and a composed frame are in the first paint;
  `CableScene` is a `next/dynamic` import with `ssr: false` that fades in
  over the still when it is ready. There is no intro gate, no scroll jack,
  and the canvas is `pointer-events: none`, so a visitor can scroll past
  the hero at any stage, including mid-travel.

  **The scene is decoration; the branches are content.** When WebGL is
  missing the stage controls are hidden and both branch panels render
  open, one after the other, as ordinary HTML read from `lib/cable.ts`.
  Nobody loses the examples because their machine cannot draw a tube.

  **Layout.** On desktop the copy sits left in a quiet, high-contrast
  column and the scene takes the right and bleeds to the edge. On a phone
  the order is the spec's: headline and buttons first, then a compact
  scene with full-width tap targets under it.

  **One thing in the brief this deliberately does not do.** It asks the
  charcoal hero to end "against the site's existing warm cream". The site
  stopped being cream earlier the same day, at Meg's explicit word, and
  the proof points below are now Harbor dark. Building a cream band under
  this would reverse a decision she had just made, so the hero ends
  against the dark page instead, and this note is here rather than a
  silent choice.
*/

const CableScene = dynamic(() => import("./CableScene"), { ssr: false });

export default function CableHero() {
  const [stage, setStage] = useState<CableStage>("rest");
  const [sceneUp, setSceneUp] = useState(false);
  const onReady = useCallback(() => setSceneUp(true), []);
  /* The ride ends at the split; the stage machine moves on so the branch
     labels appear exactly when the camera arrives rather than on a timer
     that could disagree with it. */
  const onTravelEnd = useCallback(() => setStage("split"), []);

  /*
    **Exactly one canvas, ever.** The desktop slot and the phone slot are
    different places in the DOM, so both were being rendered and hidden
    with CSS, which mounted two WebGL contexts and ran two render loops on
    every desktop load. `null` until mount means neither mounts during SSR
    and the server-rendered still is what the first paint shows, which it
    was going to be anyway.
  */
  const [narrow, setNarrow] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const branch = CABLE_BRANCHES.find((b) => b.id === stage);

  return (
    <section
      className="cp-night relative isolate overflow-hidden bg-[#0E0F12]"
      aria-labelledby="hero-heading"
    >
      {/* The scene, and the still underneath it. On md+ it is the right
          half and bleeds off the edge; on a phone it is a band under the
          buttons, so it cannot push the headline down. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] md:block"
      >
        <CableStill
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            sceneUp ? "opacity-0" : "opacity-100"
          }`}
        />
        {narrow === false ? (
          <CableScene stage={stage} onReady={onReady} onTravelEnd={onTravelEnd} />
        ) : null}
      </div>

      {/* Keeps the type legible over the stone. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(14,15,18,0.97)_0%,rgba(14,15,18,0.92)_34%,rgba(14,15,18,0.4)_66%,rgba(14,15,18,0.15)_100%)] md:block"
      />

      <div className="relative">
        <PanelHeader />
      </div>

      <div className="relative mx-auto flex min-h-[82svh] w-full max-w-6xl flex-col justify-between gap-10 px-6 pb-10 pt-14">
        <div className="flex flex-1 flex-col justify-center">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            [ Custom software · Southern Maine · clients anywhere ]
          </p>

          <h1
            id="hero-heading"
            className="m-0 mt-6 max-w-[16ch] text-[clamp(2.5rem,5.4vw,4.6rem)] font-semibold leading-[0.95] tracking-tight text-[#EDEBE6]"
          >
            <span className="block font-display">Software that</span>
            <span className="mt-1 block font-serif font-normal italic">
              runs real businesses<span className="text-[#2dd4bf]">.</span>
            </span>
          </h1>

          <p className="m-0 mt-7 max-w-[40ch] text-[1rem] leading-relaxed text-white/65">
            Websites, web apps and custom tools for small businesses. Built to
            bring work in, and to cut the manual parts out.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <BookCall
              where="hero"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2dd4bf] px-6 text-[14px] font-semibold text-[#0E0F12] no-underline transition-transform duration-150 hover:-translate-y-0.5"
            >
              Start a take <span aria-hidden="true">→</span>
            </BookCall>
            <a
              href="#shelf"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-[14px] font-medium text-[#EDEBE6] no-underline transition-colors duration-150 hover:border-white/60"
            >
              See everything, with prices
            </a>
          </div>

          {/* The phone scene: after the headline and buttons, as the spec
              asks, and a fixed band so it never shifts the copy. */}
          <div className="relative mt-10 h-[38vh] min-h-[220px] overflow-hidden rounded-xl border border-white/10 md:hidden">
            <CableStill
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
                sceneUp ? "opacity-0" : "opacity-100"
              }`}
            />
            {narrow === true ? (
              <CableScene stage={stage} onReady={onReady} onTravelEnd={onTravelEnd} />
            ) : null}
          </div>

          <CableControls
            stage={stage}
            setStage={setStage}
            branch={branch}
            sceneUp={sceneUp}
          />
        </div>

        <ProofStrip />
      </div>
    </section>
  );
}

function CableControls({
  stage,
  setStage,
  branch,
  sceneUp,
}: {
  stage: CableStage;
  setStage: (s: CableStage) => void;
  branch: (typeof CABLE_BRANCHES)[number] | undefined;
  sceneUp: boolean;
}) {
  const pill =
    "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-[13px] font-medium text-[#EDEBE6] transition-colors duration-150 hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2dd4bf]";

  return (
    <div className="mt-8">
      {/*
        **The no-WebGL path is this element's `else`, not a second
        component.** When the scene never comes up, the stage controls are
        meaningless (there is no camera to move), so they are replaced by
        both branch panels rendered open. The examples stay reachable,
        which is the promise; the camera move is what is lost, and that was
        always decoration.
      */}
      {!sceneUp ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {CABLE_BRANCHES.map((b) => (
            <BranchPanel key={b.id} branch={b} />
          ))}
        </div>
      ) : stage === "rest" ? (
        <button type="button" className={pill} onClick={() => setStage("travel")}>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf]"
          />
          Follow the cable
        </button>
      ) : stage === "travel" || stage === "split" ? (
        <div>
          <p className="m-0 mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
            The cable splits. Two things it can do:
          </p>
          <div className="flex flex-wrap gap-3">
            {CABLE_BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                className={pill}
                onClick={() => setStage(b.id)}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: b.tint }}
                />
                {b.label}
              </button>
            ))}
          </div>
        </div>
      ) : branch ? (
        <div className="max-w-xl">
          <BranchPanel branch={branch} />
          <button
            type="button"
            className={`${pill} mt-4`}
            onClick={() => setStage("split")}
          >
            <span aria-hidden="true">←</span> Back to split
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BranchPanel({ branch }: { branch: (typeof CABLE_BRANCHES)[number] }) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/[0.035] p-5">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: branch.tint }}
        />
        <h2 className="m-0 text-[1rem] font-semibold text-[#EDEBE6]">{branch.label}</h2>
        {/* The spec asks for the examples to be clearly labelled as demos,
            and CLAUDE.md's first rule is that nothing here invents proof.
            The names in the steps are made up; this says so. */}
        <span className="ml-auto rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
          Example
        </span>
      </div>

      <p className="m-0 mt-2 text-[13.5px] leading-relaxed text-white/60">{branch.blurb}</p>

      <ol className="mt-4 flex flex-col gap-2">
        {branch.steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-[13px] leading-snug text-white/70">
            <span className="font-mono text-[11px] text-white/35">
              {String(i + 1).padStart(2, "0")}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <Link
        href={branch.href}
        className="mt-4 inline-flex min-h-11 items-center text-[13px] font-semibold no-underline"
        style={{ color: branch.tint }}
      >
        {branch.cta} <span aria-hidden="true">&nbsp;→</span>
      </Link>
    </div>
  );
}
