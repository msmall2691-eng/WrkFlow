"use client";

import { useState } from "react";
import Image from "next/image";
import { services, type ServiceExample } from "@/lib/content";
import Reveal from "./Reveal";

export default function Services() {
  const [open, setOpen] = useState<string | null>(services[0].id);

  return (
    <section
      id="services"
      className="relative border-t border-line py-20 md:py-28"
    >
      {/* Hairline grid behind the section header */}
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <p className="marker mb-6">// What we build</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display-serif text-[2rem] text-ink sm:text-5xl md:text-[3.25rem]">
              Eight ways we build and optimize how you run.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Each of these is a real discipline, not a feature checkbox—and each
              comes with a real example. They compound: a great website needs clean
              data behind it, clean data makes automation trustworthy, automation
              makes AI useful, and a dashboard makes all of it visible.
            </p>
          </Reveal>
        </div>

        <div className="border-t border-line">
          {services.map((service, i) => {
            const isOpen = open === service.id;
            return (
              <Reveal key={service.id} delay={i * 40}>
                <div className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : service.id)}
                    aria-expanded={isOpen}
                    aria-controls={`service-panel-${service.id}`}
                    className={`group flex w-full items-center gap-5 rounded-lg border-l-2 px-3 py-5 text-left transition-colors md:gap-8 ${
                      isOpen
                        ? "border-signal bg-white/[0.03]"
                        : "border-transparent hover:border-signal/60 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="font-mono text-xs text-faint transition-colors group-hover:text-signal">
                      {service.index}
                    </span>
                    <span className="flex-1">
                      <span className="display-serif block text-xl text-ink transition-colors group-hover:text-signal md:text-[1.6rem]">
                        {service.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {service.tagline}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-2xl font-light text-faint transition-transform duration-300 group-hover:text-signal ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    id={`service-panel-${service.id}`}
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-8 pb-10 pl-0 md:grid-cols-12 md:pl-[calc(0.75rem+2rem)]">
                        <div className="grid gap-8 sm:grid-cols-3 md:col-span-7">
                          <Facet label="What it is" body={service.what} />
                          <Facet label="The pain it solves" body={service.pain} />
                          <Facet
                            label="What changes"
                            body={service.outcome}
                            signal
                          />
                        </div>
                        <div className="md:col-span-5">
                          <ExampleCard example={service.example} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExampleCard({ example }: { example: ServiceExample }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-elevated">
      {example.shot ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          <Image
            src={example.shot}
            alt={`${example.client} — preview`}
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_75%)] p-6 text-center">
          <p className="display-serif text-lg text-muted">{example.result}</p>
        </div>
      )}
      <figcaption className="border-t border-line p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
          Example · {example.client}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink">{example.built}</p>
        <p className="mt-3 flex items-start gap-2 text-sm text-muted">
          <span aria-hidden="true" className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>{example.result}</span>
        </p>
      </figcaption>
    </figure>
  );
}

function Facet({
  label,
  body,
  signal = false,
}: {
  label: string;
  body: string;
  signal?: boolean;
}) {
  return (
    <div>
      <p
        className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${
          signal ? "text-signal" : "text-faint"
        }`}
      >
        {label}
      </p>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
