"use client";

import { useEffect, useRef, useState } from "react";
import WorkflowDiagram, { type WorkflowStage } from "./WorkflowDiagram";

/*
  WorkflowDemo — the animated flow diagram: four labeled nodes with dashed
  connectors and a pulse dot travelling along each line, staggered so the
  signal reads as data moving down the pipeline.

  The markup lives in WorkflowDiagram, which has no client behaviour. All
  this file adds is the one thing that needs the client: an
  IntersectionObserver so the loop parks off-screen. A caller that wants the
  picture without the animation should render WorkflowDiagram directly with
  `live="still"` and pay no JavaScript for it.
*/
export type { WorkflowStage };

const STAGES: WorkflowStage[] = [
  { label: "Form" },
  { label: "CRM" },
  { label: "Email" },
  { label: "Notify" },
];

/* `stages` lets a case study pass its own chain for "How it works" — the
   generic Form/CRM/Email/Notify default stays for the marketplace page. */
export default function WorkflowDemo({
  stages = STAGES,
}: {
  stages?: WorkflowStage[];
}) {
  /*
    The pulse loops, so it has to stop. `is-live` is what un-pauses it (see
    `.flow-track:not(.is-live)` in globals.css): off-screen, the diagram is
    parked rather than compositing forever behind the fold. Default false, so
    a visitor who never scrolls here never pays for it.
  */
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* No IO means no way to pause it, so leave it running rather than
       shipping a diagram that is permanently frozen. */
    if (typeof IntersectionObserver === "undefined") {
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="corner-accents rounded-2xl border border-line bg-surface/60 p-6 md:p-8"
    >
      <WorkflowDiagram stages={stages} live={live} />
    </div>
  );
}
