"use client";

import Link from "next/link";
import { useState } from "react";
import { reefPins } from "@/lib/reef";
import StackedHeading from "@/components/StackedHeading";

/*
  The four services, annotated on the picture.

  **This is Meg's own HUD idea turned into the navigation.** Her Firefly
  still carried little labelled callouts pinned to parts of the scene, and
  that is the strongest thing in the set: the Like a King move of
  annotating the art. Each pin names one of the four services, and this is
  the one place on the homepage that asks a visitor which of them they came
  for.

  **Nov 25 2026: the pins name the service, and that is the whole of what
  was wrong here.** They read "01 THE LIGHT ABOVE", "02 ANEMONE AND
  CLOWNFISH", "03 THE REEF ITSELF" and "04 THE SHOALS", with the service
  title in the `sr-only` text and in the panel behind a click — so a
  contractor looking at the largest decision on the page saw four
  unexplained dots and had to click each one to find out what it sold.
  Meg's word for the page was "scrambled", and a navigation written in
  creature names is a fair part of why. The panel's analogy line went the
  same way: between a service's title and, a screen later, its price, "a
  clean exchange, both sides get something and neither negotiates" is
  asking a buyer to decode something instead of reading their own problem.
  It now carries `pain`, which is the sentence in `services[]` that names
  what they arrived with.

  The art is untouched. `lib/ocean.ts` keeps every creature and every
  still, /services still captions each picture with its analogy under the
  frame where it reads as a caption, and this section is still built on a
  photograph of a reef. What changed is that the words on top of it say
  what is for sale.

  **The labels come from `services[]`, never from here.** CLAUDE.md makes
  that list the single definition of what the studio sells, so `lib/reef.ts`
  adds only a position, and the index, the short label, the title, the pain
  and the tagline are the service's own. Change a service and this changes
  with it.

  **No invented telemetry.** Her original HUD read pH 8.1 and "BIODIVERSITY
  INDEX HIGH", which is ordinary scene dressing on an ocean picture and
  would be something else entirely on a page selling software. These pins
  carry names and sentences, and not one number.

  **Pins are buttons, and the panel is below the picture, not floating on
  it.** A tooltip that only exists on hover is a tooltip that does not exist
  on a phone. Tapping or focusing a pin opens the same panel in the same
  place, and the panel is in the document from the first render, so a
  keyboard and a screen reader get the whole thing in order.
*/

export default function ReefMap() {
  const [open, setOpen] = useState(reefPins[0]?.id ?? "");
  const active = reefPins.find((p) => p.id === open) ?? reefPins[0];

  return (
    <section
      id="reef"
      aria-labelledby="reef-heading"
      /* No ground of its own any more: the page's dive shows through here,
         which is the point of the backdrop. The wash that keeps this
         readable is the backdrop's, applied once for every section rather
         than re-decided per section. */
      className="night-band cp-night relative border-t border-white/10 py-12 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/*
          **The metaphor is gone and the section is not.** This read "A
          reef has no manager", under "[ The ecosystem ]", and opened
          "Nobody assigns the cleaner shrimp to the eel." Meg's verdict
          was that it sounds ridiculous, and on a page selling websites
          to contractors and admin firms she is right: it asks a buyer
          to enjoy an analogy before they have been told what is for
          sale.

          What the section *does* is load-bearing and stays untouched —
          it is the one place on this page that asks a visitor which of
          the four services they came for, with the labels read from
          `services[]`. Only the framing changed, and the one true idea
          inside the metaphor is kept in plain words: the systems should
          hand work to each other instead of needing her in the middle.
        */}
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          [ Start here ]
        </p>
        <div className="mt-5">
          <StackedHeading id="reef-heading" lead="Pick the one" trail="you came for." />
        </div>
        {/*
          **This sentence says the controls are controls**, which is the
          other half of what was wrong here: four dots on a photograph
          announce nothing, and on a phone they have no labels at all.

          It also no longer opens with "your booking form, your calendar,
          your invoices and your inbox should pass work to each other",
          which survived the metaphor's removal and should not have. That
          is service 04's pitch, it has its own pin and its own `pain`
          sentence two inches away, and leading the section with it put
          one of four doors in front of the other three.
        */}
        <p className="m-0 mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-white/65">
          Four things. Choose one to see what it covers and what it costs.
        </p>

        <div className="mt-10 grid gap-6 lg:gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          {/*
            The picture, with the pins on it.

            **The mask is on the picture alone, not on this container.**
            The pins and the thread are siblings of the image inside it,
            and `ocean-bleed` fades all four edges to nothing — put on the
            container, it would fade the annotations too, and `software`
            sits at 88% across, right where the falloff bites. So the
            image gets its own wrapper to dissolve in and the pins stay at
            full strength on top of it.
          */}
          <div className="relative">
            <div className="ocean-bleed relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              /* Meg's clean 2000px render, not the frame grabbed out of
                 Shot_01 that shipped first. The composition is the same
                 and the detail is not: the anemones, the clownfish and
                 the anglerfish along the floor were all but black in the
                 video frame. Every pin was re-measured for it. */
              src="/ocean/reef-wide.webp"
              alt="A deep reef at night: an octopus on the rocks, a turtle and a ray above it, shoals of lit fish, anemones with clownfish, and light reaching down from the surface."
              className="block h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            </div>

            {/*
              **The thread.** Meg asked after "the video of the rope" — there
              is no rope in either clip, and what she was remembering is the
              glowing fiber from the Cable hero that this replaced. It comes
              back here instead, as a line running pin to pin: the cable
              through the ecosystem, which is also exactly what the fourth
              service is. Faint on purpose, because it is a connection and
              not a diagram.
            */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <polyline
                points={reefPins.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="0.18"
                strokeOpacity="0.3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {reefPins.map((p) => {
              const on = p.id === active?.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOpen(p.id)}
                  onFocus={() => setOpen(p.id)}
                  aria-pressed={on}
                  /* `hidden lg:block` rather than merely hiding the label:
                     below this width the row under the picture is the
                     control, and a button that is `display:none` leaves
                     the accessibility tree with it. Hiding only the words
                     would have left eight controls for four services on a
                     phone, four of them unlabelled dots. */
                  className="absolute hidden -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2dd4bf] lg:block"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {/* A generous invisible hit area around a small dot: the
                      target is 44px even though the mark is 10px. */}
                  <span className="flex h-11 w-11 items-center justify-center">
                    <span
                      aria-hidden="true"
                      className={`block rounded-full transition-all duration-200 ${
                        on
                          ? "h-3 w-3 bg-[#2dd4bf] shadow-[0_0_0_5px_rgba(45,212,191,0.22)]"
                          : "h-2.5 w-2.5 bg-white/70 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
                      }`}
                    />
                  </span>
                  {/* Four identical dots, so the accessible name has to be
                      what pressing one *does*. It used to lead with the
                      creature, which named the scenery and buried the
                      service behind a colon. */}
                  <span className="sr-only">{p.service.title}</span>
                  {/* The label beside the dot, hidden on small screens where
                      there is no room for it over the picture. */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                      p.side === "right" ? "left-[2.4rem]" : "right-[2.4rem]"
                    } ${on ? "text-[#2dd4bf]" : "text-white/85"}`}
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)" }}
                  >
                    {p.service.index} {p.service.short}
                  </span>
                </button>
              );
            })}

            {/*
              The same pins below `lg`, as markers rather than controls:
              the picture keeps its annotation and the row underneath does
              the work. They are `aria-hidden` because the buttons in that
              row already say all four names.
            */}
            {reefPins.map((p) => (
              <span
                key={`marker-${p.id}`}
                aria-hidden="true"
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 lg:hidden"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span
                  className={`block rounded-full transition-all duration-200 ${
                    p.id === active?.id
                      ? "h-3 w-3 bg-[#2dd4bf] shadow-[0_0_0_5px_rgba(45,212,191,0.22)]"
                      : "h-2.5 w-2.5 bg-white/70 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
                  }`}
                />
              </span>
            ))}
          </div>

          {/*
            **The four, in words, on a phone.** This is the half of the
            section that did not exist: the labels beside the pins are
            `lg:block`, so under 1024px a visitor got a photograph with
            four unexplained dots and a panel showing service 01, with
            nothing on screen saying there were four of anything or that
            the dots did something. Most of Meg's buyers reach this on a
            phone, and it is the page's only "what do you need" question.
          */}
          <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
            {reefPins.map((p) => {
              const on = p.id === active?.id;
              return (
                <button
                  key={`pick-${p.id}`}
                  type="button"
                  onClick={() => setOpen(p.id)}
                  aria-pressed={on}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                    on
                      ? "border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]"
                      : "border-white/15 text-white/70"
                  }`}
                >
                  {p.service.index} {p.service.short}
                </button>
              );
            })}
          </div>

          {/* The panel. Always rendered, always in the same place. */}
          {active ? (
            <div className="overflow-hidden rounded-xl border border-white/12 bg-white/[0.035]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={active.art}
                src={active.art}
                alt={active.artAlt}
                className="block aspect-[16/9] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6">
              <p className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                {active.service.index}
              </p>
              <h3 className="m-0 mt-3 text-[1.35rem] font-semibold leading-snug text-[#EDEBE6]">
                {active.service.title}
              </h3>
              {/* The problem, then the answer. `pain` is quieter and set
                  off by the rule so it reads as the thing the visitor
                  arrived with; the tagline under it is what they get. The
                  italic went with the analogy it was for: a quotation
                  style on a sentence about the reader's own business reads
                  as somebody else's words. */}
              <p className="m-0 mt-3 border-l-2 border-[#2dd4bf]/40 pl-4 text-[13.5px] leading-relaxed text-white/60">
                {active.service.pain}
              </p>
              <p className="m-0 mt-4 text-[14.5px] leading-relaxed text-white/70">
                {active.service.tagline}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {active.service.kinds.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-white/60"
                  >
                    {k}
                  </li>
                ))}
              </ul>

              <Link
                href="/services"
                className="mt-6 inline-flex min-h-11 items-center text-[13.5px] font-semibold text-[#2dd4bf] no-underline"
              >
                What this costs <span aria-hidden="true">&nbsp;→</span>
              </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
