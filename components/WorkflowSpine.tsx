"use client";

import { useEffect, useState } from "react";

/*
  WorkflowSpine — a fixed, numbered "linked" progress rail (desktop ≥xl).
  Frames the whole page as one connected workflow: a vertical thread links each
  step, the line fills + nodes light (accent) as you scroll, labels reveal on
  the active step / hover, and clicking a node jumps there. Reduced-motion safe.
*/

/*
  The rail used to carry its own hardcoded list of sections, which is exactly
  how it silently fell a section behind: Stack was added to the page and the
  list was not, so from Stack downward the rail highlighted the wrong step and
  the numbering was off by one for the rest of the scroll.

  It now reads the sections the page actually rendered, in document order, so
  a new section joins the rail by existing. Two sections are skipped on
  purpose — the hero, which the rail starts from rather than points at, and
  the operator band, which is a statement rather than a step. That is a
  decision recorded here, not another list to forget to update.
*/
const SKIP = new Set(["top", "founder"]);

/* Labels the rail prefers; anything unlisted falls back to its own id. */
const LABELS: Record<string, string> = {
  services: "Services",
  tools: "Free tools",
  work: "Work",
  stack: "Stack",
  approach: "Approach",
  faq: "FAQ",
  pricing: "Pricing",
  contact: "Contact",
};

type Step = { id: string; label: string };

const titleCase = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

/* Rendered on the server too, so start from the order the page ships in and
   let the DOM correct it on mount — the rail never paints empty. */
const INITIAL: Step[] = Object.entries(LABELS).map(([id, label]) => ({ id, label }));

export default function WorkflowSpine() {
  const [active, setActive] = useState(0);
  const [steps, setSteps] = useState<Step[]>(INITIAL);

  useEffect(() => {
    const found: Step[] = Array.from(document.querySelectorAll("main section[id]"))
      .map((el) => (el as HTMLElement).id)
      .filter((id) => id && !SKIP.has(id))
      .map((id) => ({ id, label: LABELS[id] ?? titleCase(id) }));
    if (found.length) setSteps(found);
  }, []);

  useEffect(() => {
    const secs = steps.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!secs.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = steps.findIndex((s) => s.id === (e.target as HTMLElement).id);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [steps]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const fill = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;

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
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(s.id)}
              aria-current={i === active ? "step" : undefined}
              title={s.label}
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
                {/* Numbers dropped (brief A5): they implied a sequence the
                    page does not have — these are sections, not steps. */}
                <span className="text-ink">{s.label}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
