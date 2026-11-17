import type { Metadata } from "next";
import StorefrontEngineScene from "@/components/StorefrontEngineScene";

/*
  The three-act demo layout, exactly as the brief describes it.

  **It is at /scene rather than at app/page.tsx, and that is the one
  thing in the brief I have not done literally.** The brief says to
  create the three-section layout in `app/page.tsx`. Doing that would
  delete the homepage: the priced shelf, the case study, the
  integrations band and the contact form, which is every price and every
  piece of proof on the site. That is a business change rather than a
  layout change, and it is not obviously what a pasted template is
  asking for.

  So it is built here, complete and viewable, and swapping it onto the
  homepage is one line whenever Meg says so. Nothing is lost either way,
  and the decision stays hers rather than being taken by a file write.

  Everything else is the brief: `#scroll-container` with
  `pointer-events-none`, three `min-h-screen` sections matching the three
  scroll acts, and every card and control `pointer-events-auto` with
  `backdrop-blur-md bg-slate-950/65` so the copy stays sharp and both the
  buttons AND the 3D nodes underneath stay clickable.
*/

export const metadata: Metadata = {
  title: "The glass storefront",
  description:
    "A site people buy from, and the back office running underneath it.",
  robots: { index: false, follow: false },
};

const ACTS = [
  {
    kicker: "Act one",
    title: "The storefront",
    body: "The part your customer sees: a site built to be bought from, not just looked at. Scroll, and the floor comes off.",
    cta: { label: "See everything, with prices", href: "/#shelf" },
  },
  {
    kicker: "Act two",
    title: "The wiring",
    body: "Every form, payment and booking drops straight through the glass into the system that handles it. The pulses are the data going down.",
    cta: { label: "The tools these already talk to", href: "/#connects" },
  },
  {
    kicker: "Act three",
    title: "The engine",
    body: "CRM, billing, follow-up and the modules bolted on after. Hover any block to see what it does.",
    cta: { label: "Book a free 15-min call", href: "/#contact" },
  },
] as const;

export default function ScenePage() {
  return (
    <>
      <StorefrontEngineScene />

      {/*
        `pointer-events-none` on the container is what lets a click reach
        the 3D nodes behind the copy. Everything a visitor needs to touch
        turns it back on explicitly.
      */}
      <main id="scroll-container" className="relative pointer-events-none">
        {ACTS.map((act) => (
          <section
            key={act.kicker}
            className="flex min-h-screen items-center px-6 py-24"
          >
            <div className="pointer-events-auto mx-auto w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950/65 p-8 backdrop-blur-md sm:p-10">
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                {act.kicker}
              </p>
              <h2 className="m-0 mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {act.title}
              </h2>
              <p className="m-0 mt-4 text-[1.0625rem] leading-relaxed text-slate-300">
                {act.body}
              </p>
              <a
                href={act.cta.href}
                className="pointer-events-auto mt-7 inline-flex min-h-11 items-center rounded-[10px] bg-white px-5 text-[14px] font-semibold text-slate-950 no-underline hover:opacity-90"
              >
                {act.cta.label}
                <span aria-hidden="true">&nbsp;→</span>
              </a>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
