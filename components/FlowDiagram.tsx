"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/*
  FlowDiagram — an interactive automation pipeline.

  A real-shaped workflow (trigger → actions → output) drawn as connected nodes
  with data tokens continuously streaming along the edges (SVG <animate>, so it
  stays smooth and cheap). Hover a step to focus it; hit "Run it" to watch a job
  travel the whole pipeline, lighting each step as it lands. Light-themed to sit
  in the body of the page.
*/

type Step = { tag: string; label: string; sub: string };

const STEPS: Step[] = [
  { tag: "trigger", label: "Form submitted", sub: "New lead hits your site" },
  { tag: "action", label: "Validate & enrich", sub: "Clean data, add context" },
  { tag: "action", label: "Update CRM", sub: "Create the record" },
  { tag: "action", label: "Notify the team", sub: "Slack the right person" },
  { tag: "output", label: "Send confirmation", sub: "Auto-reply to the lead" },
];

// SVG layout (viewBox units).
const W = 1000;
const H = 200;
const BOX_W = 168;
const BOX_H = 92;
const Y = (H - BOX_H) / 2;
const X0 = 8;
const X_LAST = W - 8 - BOX_W;
const STEP_X = (X_LAST - X0) / (STEPS.length - 1);
const nodeX = (i: number) => X0 + i * STEP_X;
const CENTER_Y = H / 2;

export default function FlowDiagram() {
  const [hover, setHover] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (running) return;
    setRunning(true);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setActive(i), i * 520));
    });
    timers.current.push(
      setTimeout(() => {
        setActive(null);
        setRunning(false);
      }, STEPS.length * 520 + 400),
    );
  };

  return (
    <section
      id="how"
      className="relative border-t border-line py-28 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-6">// How we wire it up</p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
                One trigger. The whole job runs itself.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-muted">
                This is what an automation looks like under the hood—each step
                wired to the next, data moving between your tools with no one
                re-typing anything.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={120}>
          <div className="mt-12 rounded-2xl border border-line bg-surface p-4 elevate sm:p-8">
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full min-w-[760px]"
                role="img"
                aria-label="Automation pipeline: form submitted, validate and enrich, update CRM, notify the team, send confirmation."
              >
                {/* Connectors + streaming tokens */}
                {STEPS.slice(0, -1).map((_, i) => {
                  const x1 = nodeX(i) + BOX_W;
                  const x2 = nodeX(i + 1);
                  const lit = running && active !== null && active > i;
                  return (
                    <g key={`edge-${i}`}>
                      <line
                        x1={x1}
                        y1={CENTER_Y}
                        x2={x2}
                        y2={CENTER_Y}
                        className={lit ? "stroke-signal" : "stroke-line"}
                        strokeWidth={2}
                      />
                      {[0, 0.9].map((delay, k) => (
                        <circle
                          key={k}
                          r={3.5}
                          cy={CENTER_Y}
                          className="fill-signal"
                        >
                          <animate
                            attributeName="cx"
                            values={`${x1 + 4};${x2 - 4}`}
                            dur="1.8s"
                            begin={`${i * 0.3 + delay}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            dur="1.8s"
                            begin={`${i * 0.3 + delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      ))}
                    </g>
                  );
                })}

                {/* Step nodes */}
                {STEPS.map((s, i) => {
                  const x = nodeX(i);
                  const focused = hover === i || active === i;
                  const isTrigger = i === 0;
                  return (
                    <g
                      key={s.label}
                      transform={`translate(${x}, ${Y})`}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      className="cursor-default"
                    >
                      <rect
                        width={BOX_W}
                        height={BOX_H}
                        rx={16}
                        className={`fill-base transition-all ${
                          focused
                            ? "stroke-signal"
                            : isTrigger
                              ? "stroke-signal/40"
                              : "stroke-line"
                        }`}
                        strokeWidth={focused ? 2.5 : 1.5}
                        style={
                          focused
                            ? { filter: "drop-shadow(0 6px 16px rgba(37,99,235,0.18))" }
                            : undefined
                        }
                      />
                      {/* status dot */}
                      <circle
                        cx={20}
                        cy={22}
                        r={4}
                        className={
                          focused ? "fill-signal" : "fill-faint"
                        }
                      />
                      <text
                        x={34}
                        y={26}
                        className="fill-faint font-mono"
                        style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}
                      >
                        {s.tag}
                      </text>
                      <text
                        x={20}
                        y={56}
                        className="fill-ink"
                        style={{ fontSize: 18, fontWeight: 600 }}
                      >
                        {s.label}
                      </text>
                      <text
                        x={20}
                        y={76}
                        className="fill-muted"
                        style={{ fontSize: 12.5 }}
                      >
                        {s.sub}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {running ? "Running…" : "Run it"}
                <span aria-hidden="true">▸</span>
              </button>
              <p className="font-mono text-xs uppercase tracking-widest text-faint">
                Hover a step · watch data flow between your tools
              </p>
            </div>
          </div>
        </Reveal>

        {/* Accessible description of the pipeline */}
        <ol className="sr-only">
          {STEPS.map((s) => (
            <li key={s.label}>
              {s.label}: {s.sub}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
