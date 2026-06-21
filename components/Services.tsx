"use client";

import { useState } from "react";
import Image from "next/image";
import { services, type Service, type ServiceExample } from "@/lib/content";
import Reveal from "./Reveal";
import ProjectVisual from "./ProjectVisual";

/*
  Services — a calm "service explorer". A numbered index on the left (hover or
  tap to scrub through), a steady detail panel on the right. Editorial and
  interactive without the content-jump of an accordion. On mobile the detail
  drops inline beneath the active row.
*/
export default function Services() {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId)!;

  return (
    <section id="services" className="relative border-t border-line py-16 md:py-24">
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <p className="marker mb-4">// What we do</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display-serif text-[1.6rem] text-ink sm:text-3xl md:text-4xl">
              Eight things we build, connect, and optimize.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-sm text-faint">
              Pick one to see it—or grab a head start from{" "}
              <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
                Linx, our premade line →
              </a>
            </p>
          </Reveal>
        </div>

        <div className="grid gap-x-12 gap-y-2 md:grid-cols-12">
          {/* Index */}
          <div className="md:col-span-5 lg:col-span-4">
            <ul className="md:border-l md:border-line">
              {services.map((s) => {
                const isActive = s.id === activeId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(s.id)}
                      onMouseEnter={() => setActiveId(s.id)}
                      aria-current={isActive}
                      className={`group flex w-full items-baseline gap-4 py-3 pl-0 text-left transition-all md:-ml-px md:border-l-2 md:pl-5 ${
                        isActive
                          ? "md:border-signal"
                          : "md:border-transparent md:hover:border-line"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs transition-colors ${
                          isActive ? "text-signal" : "text-faint"
                        }`}
                      >
                        {s.index}
                      </span>
                      <span
                        className={`display-serif flex-1 text-lg transition-colors md:text-xl ${
                          isActive ? "text-ink" : "text-muted group-hover:text-ink"
                        }`}
                      >
                        {s.title}
                      </span>
                    </button>

                    {/* Mobile inline detail */}
                    {isActive && (
                      <div className="pb-6 pt-1 md:hidden">
                        <ServiceDetail service={active} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail panel (desktop) */}
          <div className="hidden md:col-span-7 md:block lg:col-span-8">
            <div key={active.id} className="animate-[fadeUp_0.4s_var(--ease-out-expo)] md:sticky md:top-24">
              <ServiceDetail service={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceDetail({ service }: { service: Service }) {
  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-6 md:p-8">
      <div className="grid items-center gap-6 md:grid-cols-2">
        <p className="display-serif text-xl text-ink md:text-2xl">{service.tagline}</p>
        <ExampleCard example={service.example} />
      </div>
    </div>
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
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 40vw, 100vw"
            className="object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : example.visual ? (
        <div className="aspect-[16/10]">
          <ProjectVisual type={example.visual} />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_75%)]" />
      )}
      <figcaption className="border-t border-line px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
          Example · {example.client}
        </p>
      </figcaption>
    </figure>
  );
}
