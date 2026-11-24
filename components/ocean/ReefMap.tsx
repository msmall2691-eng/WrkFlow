"use client";

import Link from "next/link";
import { useState } from "react";
import { reefPins } from "@/lib/reef";
import StackedHeading from "@/components/StackedHeading";

/*
  The reef, annotated.

  **This is Meg's own HUD idea turned into the navigation.** Her Firefly
  still carried little labelled callouts pinned to parts of the scene, and
  that is the strongest thing in the set: it is the Like a King move of
  annotating the art, except the thing being annotated is a metaphor for
  what she sells. Each pin names one of the four services.

  **The labels come from `services[]`, never from here.** CLAUDE.md makes
  that list the single definition of what the studio sells, so `lib/reef.ts`
  adds only a position and the reef's half of the sentence, and the title
  and tagline are the service's own. Change a service and this changes with
  it.

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
      className="cp-night relative border-t border-white/10 py-12 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          [ The ecosystem ]
        </p>
        <div className="mt-5">
          <StackedHeading id="reef-heading" lead="A reef has" trail="no manager." />
        </div>
        <p className="m-0 mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-white/65">
          Nobody assigns the cleaner shrimp to the eel. Every organism does one
          job, its output is the next one&apos;s input, and the whole thing runs
          unsupervised. Your booking form, your calendar, your invoices and your
          inbox should work the same way.
        </p>

        <div className="mt-10 grid gap-6 lg:gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          {/* The picture, with the pins on it. */}
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ocean/reef.webp"
              alt="A deep reef at night: an octopus on the rocks, shoals of lit fish, anemones and a shaft of light from the surface."
              className="block h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />

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
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2dd4bf]"
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
                  <span className="sr-only">
                    {p.creature}: {p.service.title}
                  </span>
                  {/* The label beside the dot, hidden on small screens where
                      there is no room for it over the picture. */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 lg:block ${
                      p.side === "right" ? "left-[2.4rem]" : "right-[2.4rem]"
                    } ${on ? "text-[#2dd4bf]" : "text-white/60"}`}
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)" }}
                  >
                    {p.service.index} {p.creature}
                  </span>
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
                {active.service.index} · {active.creature}
              </p>
              <h3 className="m-0 mt-3 text-[1.35rem] font-semibold leading-snug text-[#EDEBE6]">
                {active.service.title}
              </h3>
              <p className="m-0 mt-3 border-l-2 border-[#2dd4bf]/40 pl-4 text-[14px] italic leading-relaxed text-white/55">
                {active.reef}
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
