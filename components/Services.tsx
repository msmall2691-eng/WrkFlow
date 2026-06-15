"use client";

import { useState } from "react";
import { services } from "@/lib/content";
import Reveal from "./Reveal";

export default function Services() {
  const [open, setOpen] = useState<string | null>(services[0].id);

  return (
    <section
      id="services"
      className="relative border-t border-line py-28 md:py-36"
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
            <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
              Seven ways to own your operations.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Each of these is a real discipline, not a feature checkbox. They
              compound: a clean database makes automation trustworthy,
              automation makes AI useful, and a dashboard makes all of it
              visible.
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
                    className="group flex w-full items-center gap-5 py-6 text-left md:gap-8"
                  >
                    <span className="font-mono text-xs text-faint transition-colors group-hover:text-signal">
                      {service.index}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-xl font-medium text-ink transition-colors group-hover:text-signal md:text-2xl">
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
                      <div className="grid gap-8 pb-10 pl-0 md:grid-cols-3 md:pl-[calc(0.75rem+2rem)]">
                        <Facet label="What it is" body={service.what} />
                        <Facet label="The pain it solves" body={service.pain} />
                        <Facet
                          label="What changes"
                          body={service.outcome}
                          signal
                        />
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
