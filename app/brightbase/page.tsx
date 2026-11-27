import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { brightbase } from "@/lib/brightbase";
import PanelHeader from "@/components/panel/PanelHeader";
import OfferLink from "@/components/OfferLink";
import BookCall from "@/components/BookCall";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import { Frame, Pipeline, Roles } from "@/components/brightbase/Showcase";
import DataModel from "@/components/brightbase/DataModel";
import StackedHeading from "@/components/StackedHeading";

/*
  /brightbase — the showcase for the operations app Meg built and runs her
  cleaning company on. First inner page in the V2 style (`.cp`).

  Content lives in lib/brightbase.ts, with the rules for what may be listed.
  The short version: built and in use, or it goes under "In progress".
*/
export const metadata: Metadata = pageMeta({
  title: "BrightBase, the operations app for cleaning companies",
  description:
    "Leads, quotes, scheduling, a crew phone app, invoicing and Stripe payouts in one system. Built by Meg Small and run daily at The Maine Cleaning Co.",
  path: "/brightbase",
});

const Eyebrow = ({ children, tone = "violet" }: { children: React.ReactNode; tone?: "violet" | "teal" | "pink" }) => (
  <span
    className={`text-[13px] font-medium ${
      tone === "teal" ? "text-[color:var(--cp-teal)]" : tone === "pink" ? "text-[color:var(--cp-pink)]" : "text-[color:var(--cp-violet-ink)]"
    }`}
  >
    {children}
  </span>
);

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="m-0 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-[color:var(--cp-ink)]">
    {children}
  </h2>
);

export default function BrightBasePage() {

  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>
        <div className="relative z-10">
          <PanelHeader current="/brightbase" />
        </div>

        <main className="relative z-10 mx-auto flex max-w-[1240px] flex-col gap-24 px-6 pb-24 pt-8 lg:px-10">
          {/* Hero */}
          <section className="grid grid-cols-12 items-center gap-y-10 lg:gap-x-10">
            <div className="min-w-0 col-span-12 flex flex-col gap-6 lg:col-span-6">
              <Eyebrow tone="teal">BrightBase · in daily use</Eyebrow>
              {/* The split is lopsided on purpose. This hero is the one
                  two-column one on the site, so the heading lives in a
                  ~480px grid column rather than the full width, and at 72px
                  that wraps hard. Split evenly, the stepped-back half ran to
                  three grey lines and read as a wrap accident rather than a
                  composition. A long lead and a two-word trail keeps exactly
                  one line stepped, which is the gesture. */}
              <StackedHeading
                as="h1"
                lead="The system an eight-year-old cleaning company"
                trail="runs on."
              />
              <p className="m-0 max-w-[36em] text-[17px] leading-relaxed text-[color:var(--cp-muted)]">{brightbase.summary}</p>
              <div className="flex flex-wrap gap-3">
                <OfferLink
                  offer="brightbase"
                  className="cp-cta inline-flex items-center gap-2.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white no-underline transition-transform duration-150 hover:-translate-y-0.5"
                >
                  Get a demo <span aria-hidden="true">→</span>
                </OfferLink>
                <a
                  href="#inside"
                  className="inline-flex items-center rounded-xl border border-[color:var(--cp-hairline-strong)] px-5 py-3.5 text-[15px] font-medium text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:border-[color:var(--cp-hairline-strong)]"
                >
                  See what&apos;s inside
                </a>
              </div>
            </div>
            <div className="min-w-0 col-span-12 lg:col-span-6">
              <Frame shot={brightbase.hero} />
            </div>
          </section>

          {/* Pipeline */}
          <section aria-labelledby="bb-flow" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow>How a job moves</Eyebrow>
              <H2 id="bb-flow">From first message to paid, in one place.</H2>
            </div>
            <Pipeline />
          </section>

          {/* Roles */}
          <section id="inside" aria-labelledby="bb-roles" className="flex scroll-mt-8 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow>What&apos;s inside</Eyebrow>
              <H2 id="bb-roles">Three apps in one: the office, the crew, and your customers.</H2>
            </div>
            <Roles />
          </section>

          {/* Data model */}
          <section id="data" aria-labelledby="bb-data" className="flex scroll-mt-8 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow tone="pink">The data model</Eyebrow>
              <H2 id="bb-data">Built around the client, not around screens.</H2>
              <p className="m-0 max-w-[62ch] text-[16px] leading-relaxed text-[color:var(--cp-muted)]">
                Most small-business tools keep leads in one place, jobs in another and messages in a third. In BrightBase every record
                points back to one client, and a client is found by any email or phone number they have ever used. Pick a record to
                see how it connects.
              </p>
            </div>
            <DataModel />
          </section>

          {/* Integrations */}
          <section aria-labelledby="bb-int" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow tone="teal">Connects to</Eyebrow>
              <H2 id="bb-int">Works with the tools you already pay for.</H2>
            </div>
            <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4">
              {brightbase.integrations.map((it) => (
                <li key={it.name} className="cp-tile flex flex-col gap-1 p-4">
                  <span className="text-[15px] font-semibold text-[color:var(--cp-ink)]">{it.name}</span>
                  <span className="text-[13px] text-[color:var(--cp-muted)]">{it.what}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Proof + in progress */}
          <section aria-label="Proof and what is next" className="grid grid-cols-12 gap-4">
            {brightbase.proof.map((p) => (
              <div
                key={p.label}
                /* The span follows the count. These tiles were three at
                   `md:col-span-4`, filling the twelve-column row exactly;
                   dropping the "4,000+ automated checks" tile left 4 columns
                   of hole before the col-span-7 tile below, which wraps. */
                className={`cp-tile col-span-12 flex flex-col gap-1 p-6 ${
                  brightbase.proof.length === 2 ? "md:col-span-6" : "md:col-span-4"
                }`}
              >
                <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-[color:var(--cp-ink)]">{p.value}</span>
                <span className="text-[14px] text-[color:var(--cp-muted)]">{p.label}</span>
              </div>
            ))}
            <div className="cp-tile col-span-12 flex flex-col gap-4 p-6 md:col-span-7">
              <Eyebrow tone="pink">In progress</Eyebrow>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {brightbase.comingNext.map((c) => (
                  <li key={c.title} className="flex flex-col gap-0.5">
                    <span className="text-[15.5px] font-semibold text-[color:var(--cp-ink)]">{c.title}</span>
                    <span className="text-[14px] text-[color:var(--cp-muted)]">{c.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cp-tile cp-tile-cta col-span-12 flex flex-col justify-between gap-5 p-6 md:col-span-5">
              <h2 className="m-0 font-display text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[color:var(--cp-ink)]">
                Run a cleaning company? See it with your own jobs.
              </h2>
              <div className="flex flex-wrap gap-3">
                <BookCall
                  where="brightbase"
                  className="rounded-[10px] bg-[color:var(--cp-ink)] px-4 py-3 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline transition-transform duration-150 hover:-translate-y-0.5"
                >
                  Book a 15-min demo
                </BookCall>
                <OfferLink offer="brightbase" className="rounded-[10px] border border-[color:var(--cp-hairline-strong)] px-4 py-3 text-[14px] font-medium text-[color:var(--cp-ink)] no-underline">
                  Ask a question
                </OfferLink>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}
