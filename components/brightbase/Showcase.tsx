"use client";

import { useState } from "react";
import Image from "next/image";
import { brightbase, type Role, type Shot } from "@/lib/brightbase";

/*
  The two interactive parts of /brightbase: the pipeline strip and the role
  tabs. Both are motion caused by the visitor (a click swaps the panel), so
  neither loops and neither needs a reduced-motion fallback beyond the
  150ms color transition, which `transition-colors` already respects.
*/

/* The caption every capture carries. One string, because it is a claim
   about what is in the picture and a second copy of it is how one frame
   quietly stops making it. */
const DEMO_NOTE = "Demo data. A fictional company, not real customers.";

const Caption = () => (
  <figcaption className="text-center text-[12px] text-[color:var(--cp-faint)]">{DEMO_NOTE}</figcaption>
);

/* The window chrome, which only a desktop capture wears. */
const Chrome = () => (
  <div className="flex items-center gap-2 border-b border-[color:var(--cp-line)] px-4 py-2.5" aria-hidden="true">
    <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--cp-fill-strong)]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--cp-fill-strong)]" />
    <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--cp-fill-strong)]" />
  </div>
);

export function Frame({ shot, priority = false }: { shot?: Shot; priority?: boolean }) {
  if (!shot) return null;
  const phone = Boolean(shot.phone);
  return (
    <figure className={`m-0 flex flex-col gap-2 ${phone ? "mx-auto w-full max-w-[300px]" : "w-full"}`}>
      <div className={`cp-tile relative overflow-hidden ${phone ? "rounded-[34px] p-2.5" : ""}`}>
        {!phone ? <Chrome /> : null}
        <div
          className={`relative w-full ${
            phone ? "aspect-[9/19.5] overflow-hidden rounded-[26px]" : "aspect-[16/10]"
          } bg-[color:var(--cp-well)]`}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            priority={priority}
            sizes={phone ? "300px" : "(min-width: 1024px) 60vw, 100vw"}
            className="object-cover object-top"
          />
        </div>
      </div>
      {shot.demo ? <Caption /> : null}
    </figure>
  );
}

/*
  **The hero shows all three apps rather than saying there are three.**

  "Three apps in one" is this page's central claim and it used to be made
  in a heading two screens below the fold, while the hero showed a single
  office dashboard. The office screen, the crew's phone and the
  customer's are here instead, from `heroPhones`, which are the same two
  captures their roles use further down.

  The phones are cropped to the top of the screen rather than shrunk
  whole: a 390-wide capture at 160 CSS px is readable, and the same
  capture at its full 9/19.5 would be a 350px-tall sliver that doubles
  the height of the hero to say one thing. One caption for the three,
  because it is one sentence about all of them.
*/
export function HeroShots() {
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="cp-tile relative overflow-hidden">
        <Chrome />
        <div className="relative aspect-[16/10] w-full bg-[color:var(--cp-well)]">
          <Image
            src={brightbase.hero.src}
            alt={brightbase.hero.alt}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        {brightbase.heroPhones.map((s) => (
          <div key={s.src} className="cp-tile w-full max-w-[158px] overflow-hidden rounded-[28px] p-2">
            <div className="relative aspect-[9/12] w-full overflow-hidden rounded-[22px] bg-[color:var(--cp-well)]">
              <Image src={s.src} alt={s.alt} fill sizes="158px" className="object-cover object-top" />
            </div>
          </div>
        ))}
      </div>
      <Caption />
    </figure>
  );
}

export function Pipeline() {
  const [i, setI] = useState(0);
  const steps = brightbase.pipeline;
  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="How a job moves through BrightBase" className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {steps.map((s, n) => {
          const on = n === i;
          return (
            <button
              key={s.step}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="bb-step"
              onClick={() => setI(n)}
              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[14px] font-medium transition-colors duration-150 ${
                on
                  ? "border-[color:var(--cp-violet-line)] bg-[color:var(--cp-violet-wash)] text-[color:var(--cp-ink)]"
                  : "border-[color:var(--cp-line)] bg-[color:var(--cp-fill)] text-[color:var(--cp-muted)] hover:text-[color:var(--cp-ink)]"
              }`}
            >
              <span className="font-mono text-[11px] text-[color:var(--cp-faint)]">{String(n + 1).padStart(2, "0")}</span>
              {s.step}
            </button>
          );
        })}
      </div>
      <div id="bb-step" role="tabpanel" className="grid grid-cols-12 items-center gap-y-6 lg:gap-x-6">
        <p className="min-w-0 col-span-12 m-0 max-w-[40ch] text-[18px] leading-relaxed text-[color:var(--cp-soft)] lg:col-span-4">
          {steps[i].body}
        </p>
        <div className="min-w-0 col-span-12 lg:col-span-8">
          <Frame key={steps[i].step} shot={steps[i].shot} />
        </div>
      </div>
    </div>
  );
}

export function Roles() {
  const roles = brightbase.roles as Role[];
  const [id, setId] = useState<Role["id"]>("office");
  const [pick, setPick] = useState(0);
  const role = roles.find((r) => r.id === id) ?? roles[0];
  // The screen follows the feature the visitor picked; a feature with no
  // capture of its own falls back to the first one in its role that has one.
  const shot = role.features[pick]?.shot ?? role.features.find((f) => f.shot)?.shot ?? role.shot;
  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Who uses it" className="flex flex-wrap gap-2">
        {roles.map((r) => {
          const on = r.id === id;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="bb-role"
              onClick={() => {
                setId(r.id);
                setPick(0);
              }}
              className={`min-h-11 rounded-full border px-5 py-2.5 text-[14px] font-medium transition-colors duration-150 ${
                on
                  ? "border-[color:var(--cp-ink)] bg-[color:var(--cp-ink)] text-[color:var(--cp-on-ink)]"
                  : "border-[color:var(--cp-hairline-strong)] bg-[color:var(--cp-fill)] text-[color:var(--cp-soft)] hover:text-[color:var(--cp-ink)]"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      <div id="bb-role" role="tabpanel" className="grid grid-cols-12 items-start gap-y-6 lg:gap-x-6">
        <div className={`min-w-0 col-span-12 flex flex-col gap-3 ${shot?.phone ? "lg:col-span-7" : "lg:col-span-5"}`}>
          <p className="m-0 text-[14px] text-[color:var(--cp-faint)]">{role.who}</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {role.features.map((f, n) => {
              const on = n === pick;
              return (
                <li key={f.title}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPick(n)}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors duration-150 ${
                      on
                        ? "border-[color:var(--cp-violet-line)] bg-[color:var(--cp-violet-wash)]"
                        : "border-[color:var(--cp-line)] bg-[color:var(--cp-option-bg)] hover:border-[color:var(--cp-hairline-strong)]"
                    }`}
                  >
                    <span className="block text-[15.5px] font-semibold text-[color:var(--cp-ink)]">{f.title}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-[color:var(--cp-muted)]">{f.body}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={`min-w-0 col-span-12 lg:sticky lg:top-6 ${shot?.phone ? "lg:col-span-5" : "lg:col-span-7"}`}>
          <Frame key={shot?.src} shot={shot} />
        </div>
      </div>
    </div>
  );
}
