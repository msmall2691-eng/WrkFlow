"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import ProjectVisual from "./ProjectVisual";
import { services } from "@/lib/content";

/*
  Services — every discipline M Studio works in, as an expandable list.
  Collapsed, each row is scannable (title, tagline, concrete "kinds" chips).
  Expanded, it shows the full case for it: what it is, the pain it solves,
  what changes after, and a real example. One open at a time keeps the
  section from turning into a wall of text.
*/
const AUDIENCES = [
  "Service companies",
  "Trades",
  "Property managers",
  "STR operators",
  "Founders",
  "Organizations",
  "Personal projects",
];

/*
  Specific things we've built (or can build) — a quick-scan companion to the
  deeper per-service breakdown above, not a duplicate of it.
*/
const CAPABILITIES = [
  "Booking apps",
  "CRMs",
  "Client portals",
  "Dashboards",
  "Quote calculators",
  "Workflow automations",
  "AI agents",
  "Stripe + payments",
];

export default function Services() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="services" className="relative overflow-hidden border-t border-line py-20 md:py-24">
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Services
            </p>
          </Reveal>
          <Reveal>
            <h2 className="display-serif text-[1.6rem] text-ink sm:text-3xl md:text-4xl">
              What M Studio can build.
            </h2>
          </Reveal>
        </div>

        <div className="space-y-3">
          {services.map((s, i) => {
            const isOpen = openId === s.id;
            return (
              <Reveal key={s.id} delay={i * 40}>
                <article className="overflow-hidden rounded-2xl border border-line bg-surface/60 transition-colors duration-300 hover:border-signal/40">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : s.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-4 p-6 text-left"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs text-faint">{s.index}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="display-serif text-lg text-ink md:text-xl">{s.title}</h3>
                        <span
                          aria-hidden="true"
                          className={`shrink-0 text-lg text-signal transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                        >
                          +
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{s.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {s.kinds.map((k) => (
                          <span
                            key={k}
                            className="rounded-full border border-line bg-base px-2.5 py-1 text-xs text-faint"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="grid gap-5 border-t border-line px-6 pb-6 pt-5 md:grid-cols-2">
                      {/* Two labeled boxes, one sentence each — the visual
                          example beside them carries the rest. */}
                      <div className="grid content-start gap-3">
                        <div className="rounded-xl border border-line bg-base/60 p-4">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
                            The problem
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-muted">{s.pain}</p>
                        </div>
                        <div className="rounded-xl border border-signal/30 bg-signal/[0.06] p-4">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
                            After
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-ink">{s.outcome}</p>
                        </div>
                        <a
                          href="#contact"
                          className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
                        >
                          Build this →
                        </a>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-line">
                        <div className="relative aspect-[4/3] bg-base">
                          {s.example.shot ? (
                            <Image
                              src={s.example.shot}
                              alt={s.example.client}
                              fill
                              sizes="(min-width: 768px) 400px, 100vw"
                              className="object-cover object-top"
                            />
                          ) : (
                            <ProjectVisual type={s.example.visual!} />
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
                            {s.example.client}
                          </p>
                          <p className="mt-1.5 text-sm text-muted">{s.example.built}</p>
                          <p className="mt-2 text-sm font-medium text-signal">{s.example.result}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Specifically — a wider chip cloud of concrete things we build */}
        <Reveal delay={180}>
          <div className="mt-10 border-t border-line pt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
              Specifically
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CAPABILITIES.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-base px-3 py-1.5 text-sm text-muted transition-colors hover:border-signal/40 hover:text-ink"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Who it's for — compact chip row */}
        <Reveal delay={220}>
          <div className="mt-8 border-t border-line pt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
              Who it&apos;s for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-line bg-base px-3 py-1.5 text-sm text-muted"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-8 text-sm text-muted">
            Or start from{" "}
            <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
              M Linx, the premade line →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
