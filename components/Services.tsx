"use client";

import { useState } from "react";
import Image from "next/image";
import { services, type Service } from "@/lib/content";
import Reveal from "./Reveal";
import ProjectVisual from "./ProjectVisual";

/*
  Services — the full "what M Studio builds" menu. Each discipline opens to its
  write-up (what it is, the problem, what changes) and a real example,
  shown as a screenshot when one genuinely fits or a branded visual when
  a shot would mislead. Custom (M Studio) here; premade (M Linx) a tap away.
*/
export default function Services() {
  // First one open by default so the section reads as alive, not inert.
  const [open, setOpen] = useState<Set<string>>(new Set([services[0]?.id]));

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section id="services" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
      />
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -right-24 top-28 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <h2 className="display-serif text-[1.6rem] text-ink sm:text-3xl md:text-4xl">
              What M Studio builds.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Built around how you run. Or start from{" "}
              <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
                M Linx, the premade line →
              </a>
            </p>
          </Reveal>
        </div>

        <div className="space-y-3">
          {services.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 50}>
              <ServiceRow
                svc={svc}
                isOpen={open.has(svc.id)}
                onToggle={() => toggle(svc.id)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  svc,
  isOpen,
  onToggle,
}: {
  svc: Service;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `svc-panel-${svc.id}`;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-surface/60 transition-colors ${
        isOpen ? "border-signal/40" : "border-line hover:border-signal/30"
      }`}
    >
      {/* Header — always visible, the whole bar is the toggle */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 px-5 py-5 text-left md:px-6"
      >
        <span className="mt-0.5 font-mono text-xs text-faint">{svc.index}</span>
        <span className="min-w-0 flex-1">
          <span className="block display-serif text-lg text-ink md:text-xl">{svc.title}</span>
          <span className="mt-1 block text-sm leading-relaxed text-muted">{svc.tagline}</span>
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 shrink-0 text-faint transition-transform duration-300 ${
            isOpen ? "rotate-180 text-signal" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Body — smooth grid-rows reveal */}
      <div
        id={panelId}
        className={`grid transition-all duration-500 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-8 border-t border-line px-5 py-6 md:grid-cols-2 md:gap-10 md:px-6">
            {/* Left — the write-up */}
            <div className="space-y-5">
              <Block label="What it is" body={svc.what} />
              <Block label="The problem" body={svc.pain} />
              <Block label="What changes" body={svc.outcome} accent />

              {svc.kinds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {svc.kinds.map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-line bg-base px-2.5 py-1 font-mono text-[10px] text-muted"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right — a real example */}
            <Example svc={svc} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div>
      <p
        className={`font-mono text-[10px] uppercase tracking-widest ${
          accent ? "text-signal" : "text-faint"
        }`}
      >
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Example({ svc }: { svc: Service }) {
  const { example } = svc;
  return (
    <figure className="flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-surface">
        {example.shot ? (
          <Image
            src={example.shot}
            alt={`${svc.title} — ${example.client}`}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover object-top"
          />
        ) : example.visual ? (
          <ProjectVisual type={example.visual} />
        ) : null}
      </div>
      <figcaption className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
          Example · {example.client}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{example.built}</p>
        <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-signal">
          {example.result}
        </p>
      </figcaption>
    </figure>
  );
}
