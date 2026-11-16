import Image from "next/image";
import { approachSteps, work } from "@/lib/content";

/*
  Process: four steps and a strip of film, after Ostrander Signal's
  "Four takes. No reshoots." The steps are `approachSteps` from
  lib/content.ts. The film strip runs real captures from `work`, slowly,
  left to right on a loop, with sprocket holes top and bottom. It pauses
  under prefers-reduced-motion and when hovered.
*/

const SLATES = ["Walk-through", "Drawings", "Build", "Hand-over"];

export default function Process() {
  const frames = work.filter((w) => w.shot).map((w) => ({ src: w.shot!, title: w.title }));
  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <section aria-labelledby="process-heading" className="bp-light border-t border-[color:var(--bp-light-line)]">
      <div className="mx-auto max-w-[1400px] px-6 pt-24 lg:px-10">
        <p className="bp-eyebrow bp-eyebrow-light"><span className="text-[color:var(--bp-cyan-ink)]">[ 03 ]</span> How it works · four steps</p>
        <h2 id="process-heading" className="bp-h2 bp-h2-light mt-4">
          Four steps. <span className="bp-serif">No surprises.</span>
        </h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {approachSteps.map((s, i) => (
            <li key={s.index}>
              <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[color:var(--bp-cyan-ink)]">
                {s.index} — {SLATES[i] ?? s.title}
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--bp-light-ink)]">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="bp-film mt-14" aria-hidden="true">
        <div className="bp-film-track">
          {[...frames, ...frames].map((f, i) => (
            <figure key={i} className="bp-film-frame">
              <div className="relative h-full w-full">
                <Image src={f.src} alt="" fill sizes="360px" className="object-cover object-top" />
              </div>
              <figcaption className="bp-film-cap">MS {pad((i % frames.length) + 1)}A · {f.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="h-20" />
    </section>
  );
}
