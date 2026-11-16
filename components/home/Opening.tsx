import BookCall from "../BookCall";
import WeatherLayer from "../WeatherLayer";
import PanelStage from "../panel/PanelStage";
import PanelHeader from "../panel/PanelHeader";
import Link from "next/link";
import Image from "next/image";
import { smallProjects, welcomeBook } from "@/lib/content";

/* Three real, live sites, three different industries. Meg (Nov 15): the
   page should not centre on the cleaning company, so it is not here; it
   lives on /work and in its case study. */
const proof = [
  { name: "The Remote Admin", what: "Admin services", domain: "the-remote-admin.com", href: "https://www.the-remote-admin.com", image: "/shots/catalog/live-remote-admin.webp" },
  { name: "Nash Construction", what: "General contractor", domain: "nashconstructionnh.com", href: "https://www.nashconstructionnh.com", image: "/shots/catalog/live-nash.webp" },
  { name: "Arrowhead Explorers", what: "Childcare, with a parent portal", domain: "lacexplorers.online", href: "https://www.lacexplorers.online", image: "/shots/catalog/live-arrowhead.webp" },
];

/*
  Opening — the first screen, and now only the first screen.

  **This replaced a dashboard, and the reason is worth keeping written
  down.** The V2 panel put six things on one screen: the headline, a
  rotating window of four shipped screens, a tile listing four projects by
  name, a tile of three free tools, and the live readout. Below it came
  three case-study cards, which were the same four projects again. Meg's
  own words on the result: "it's very redundant and I cannot see anything
  that would make me want to have someone build something for me and it all
  just looks like it's all over the place."

  Measured, she was right. Four projects appeared three times each before a
  visitor reached anything new, and The Remote Admin and linx appeared with
  the same sentence copied between two of those blocks. Adding a service
  router between them stretched the repetition rather than fixing it.

  So the page is one argument now, in the order somebody actually asks it:
  what do you do (the four doors), show me one (the worked example), what
  else (four more), how do I start. This section is the first beat only: a
  headline, a sentence, one way in, and the operating history that answers
  "has this person done this before".

  **The numbers moved up here from the bottom of the old work section.**
  They are The Maine Cleaning Co's own, labelled as such in lib/content.ts,
  and they are the only hard evidence on the site that is confirmed. Buried
  under three cards they were the last thing a visitor read; the question
  they answer is the first one asked.

  Deliberately NOT a full 100svh: the old panel filled the screen exactly,
  so nothing below it was ever hinted at. 82svh leaves the top of the next
  section showing, which is what invites the scroll the rest of the page
  depends on.
*/
export default function Opening() {
  return (
    <PanelStage className="relative flex flex-col overflow-hidden lg:min-h-[82svh]">
      {/* The sky: aurora, a pointer glow, and live weather on top. The
          rotating product window that used to sit beside this is gone; the
          aurora is the only moving thing up here now. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="cp-aurora cp-a1" />
        <span className="cp-aurora cp-a2" />
        <span className="cp-aurora cp-a3" />
        <span className="cp-glow" />
      </div>
      <WeatherLayer />

      <PanelHeader />

      {/*
        Same `mx-auto max-w-6xl px-6` container as every section below.

        The first cut used the old panel's full-bleed `px-6 lg:px-10`, so at
        1440 the headline started at 56px and "What are you trying to fix?"
        started at 168px: one visible step in the left edge, at the exact
        point a visitor's eye drops from the hero to the page. Contained, the
        whole page has one left edge, and the space to the right of the
        headline reads as a margin rather than as something missing.
      */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-6 pb-14 pt-10 lg:pb-16" id="top">
        {/*
          Nov 15 2026, late: rewritten after a buyer review (founderos
          customer-proxy) read the old hero as a tech startup selling hype:
          gradient "real businesses", no face, no phone, no prices, and the
          first proof on the page was a row of invented demo businesses.
          Now: what it is in plain words, who is behind it, how to reach
          her, what things cost, and three REAL client sites as proof.
        */}
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col gap-5">
            <span className="text-[14px] text-[color:var(--cp-soft)]">
              Southern Maine · clients anywhere
            </span>
            <h1 className="m-0 font-display text-[clamp(2.3rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-balance text-[color:var(--cp-ink)]">
              More booked jobs, less busywork.
            </h1>
            <p className="m-0 max-w-[30em] text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
              Websites, booking tools and simple apps for small service
              businesses. Try each one before you buy.
            </p>

            <div className="flex items-center gap-3">
              <Image
                src="/meg.webp"
                alt="Megan Small"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover object-top"
              />
              <p className="m-0 text-[14px] leading-snug text-[color:var(--cp-soft)]">
                <span className="font-semibold text-[color:var(--cp-ink)]">Meg Small</span>, North Waterboro, Maine
                <br />
                Call or text{" "}
                <a href="tel:+12074329492" className="font-semibold text-[color:var(--cp-ink)] no-underline hover:underline">
                  (207) 432-9492
                </a>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <BookCall
                where="hero"
                className="cp-cta inline-flex items-center gap-2.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white no-underline transition-transform duration-150 hover:-translate-y-0.5"
              >
                Book a free 15-min call
              </BookCall>

            </div>

            {/* Real prices, each from its one source. */}
            <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1.5 p-0 text-[13.5px] text-[color:var(--cp-soft)]">
              <li>Fixes from{" "}<span className="font-semibold text-[color:var(--cp-ink)]">{smallProjects[0].price.split("–")[0]}</span></li>
              <li>
                <Link href="/welcome-book" className="inline-flex min-h-7 items-center gap-1 no-underline text-[color:var(--cp-soft)] hover:text-[color:var(--cp-ink)]">
                  Rental welcome book{" "}<span className="font-semibold text-[color:var(--cp-ink)]">${welcomeBook.introPrice}</span>
                </Link>
              </li>
              <li>Site care{" "}<span className="font-semibold text-[color:var(--cp-ink)]">$49/mo</span></li>
              <li>
                <Link href="/turnover" className="inline-flex min-h-7 items-center gap-1 no-underline text-[color:var(--cp-soft)] hover:text-[color:var(--cp-ink)]">
                  Turnover Planner{" "}<span className="font-semibold text-[color:var(--cp-ink)]">free</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Proof: three real, live client sites. Not demos. */}
          <div>
            <p className="m-0 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--cp-faint)]">
              Recent work
            </p>
            <ul className="m-0 mt-3 grid list-none gap-3 p-0">
              {proof.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cp-tile group flex items-center gap-4 overflow-hidden !rounded-xl p-2.5 pr-4 no-underline"
                  >
                    <span className="relative block aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-md bg-[color:var(--cp-well)] sm:w-40">
                      <Image unoptimized src={p.image} alt={`${p.name}, live site`} fill sizes="160px" className="object-cover object-top" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-semibold text-[color:var(--cp-ink)]">{p.name}</span>
                      <span className="block text-[12.5px] text-[color:var(--cp-muted)]">{p.what}</span>
                      <span className="mt-1 block text-[12px] font-medium text-[color:var(--cp-violet-ink)]">{p.domain} ↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </PanelStage>
  );
}
