"use client";

import { useEffect, useState } from "react";

/*
  WorkflowSpine — a fixed, numbered "linked" progress rail (desktop ≥xl).
  Frames the whole page as one connected workflow: a vertical thread links each
  step, the line fills + nodes light (accent) as you scroll, labels reveal on
  the active step / hover, and clicking a node jumps there. Reduced-motion safe.
*/

const STEPS = [
  { id: "services", label: "Services" },
  { id: "why", label: "Why M Studio" },
  { id: "work", label: "Work" },
  { id: "kit", label: "Linx" },
  { id: "approach", label: "Approach" },
  { id: "contact", label: "Contact" },
];

export default function WorkflowSpine() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const secs = STEPS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!secs.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = STEPS.findIndex((s) => s.id === (e.target as HTMLElement).id);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const fill = (active / (STEPS.length - 1)) * 100;

  return (
    <nav
      aria-label="Page progress"
      className="fixed left-2 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-6 2xl:left-10"
    >
      <ol className="relative flex flex-col gap-7">
        <span aria-hidden="true" className="absolute left-[5px] bottom-1 top-1 w-px bg-line" />
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-1 w-px bg-signal transition-all duration-500"
          style={{ height: `${fill}%` }}
        />
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(s.id)}
              aria-current={i === active ? "step" : undefined}
              title={`${String(i + 1).padStart(2, "0")} · ${s.label}`}
              className="group flex items-center gap-3"
            >
              <span
                className={`relative z-10 h-[11px] w-[11px] rounded-full border transition-colors ${
                  i <= active ? "border-signal bg-signal" : "border-line bg-base"
                }`}
              />
              <span
                className={`hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-widest transition-opacity duration-300 xl:inline-block ${
                  i === active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <span className="mr-1 text-signal">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink">{s.label}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
