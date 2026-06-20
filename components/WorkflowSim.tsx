"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/*
  WorkflowSim — an interactive "lead intake autopilot".

  The visitor submits a mock lead; the automation runs live, step by step, and
  produces the actual artifacts it would in production — an enriched record, a
  CRM card, a team alert, and a personalized auto-reply — all populated from
  what they typed. Demonstrates the automation, not just a diagram.
*/

const SERVICES = ["Standard clean", "Deep clean", "Move-out clean", "Office clean"];

const STEPS = [
  { key: "enrich", label: "Validate & enrich", detail: "Clean the data, detect intent & area" },
  { key: "crm", label: "Create CRM record", detail: "New contact, stage: New lead" },
  { key: "alert", label: "Alert the team", detail: "Post to #sales in Slack" },
  { key: "reply", label: "Send auto-reply", detail: "Branded email back to the lead" },
] as const;

type Status = "idle" | "pending" | "running" | "done";
type Lead = { name: string; service: string; message: string };

export default function WorkflowSim() {
  const [name, setName] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [message, setMessage] = useState("");
  const [statuses, setStatuses] = useState<Status[]>(STEPS.map(() => "idle"));
  const [lead, setLead] = useState<Lead | null>(null);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = (sample?: Lead) => {
    if (running) return;
    const data: Lead =
      sample ?? {
        name: name.trim() || "there",
        service,
        message: message.trim(),
      };
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setLead(data);
    setStatuses(STEPS.map((_, i) => (i === 0 ? "running" : "pending")));

    STEPS.forEach((_, i) => {
      // finish step i
      timers.current.push(
        setTimeout(() => {
          setStatuses((prev) => {
            const next = [...prev];
            next[i] = "done";
            if (i + 1 < STEPS.length) next[i + 1] = "running";
            return next;
          });
          if (i === STEPS.length - 1) setRunning(false);
        }, 750 * (i + 1)),
      );
    });
  };

  const useSample = () => {
    const s: Lead = {
      name: "Dana Ruiz",
      service: "Move-out clean",
      message: "Need a move-out clean for a 2-bed apartment this Friday — pretty urgent!",
    };
    setName(s.name);
    setService(s.service);
    setMessage(s.message);
    run(s);
  };

  const firstName = (lead?.name ?? "").split(" ")[0] || "there";
  const urgent = /asap|urgent|today|tomorrow|this (week|friday|monday)/i.test(lead?.message ?? "");
  const crmId = useRef(Math.floor(1000 + Math.random() * 9000));
  const done = (k: (typeof STEPS)[number]["key"]) =>
    statuses[STEPS.findIndex((s) => s.key === k)] === "done";

  return (
    <section id="flow" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-6">// See it run</p>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
                Watch a new lead handle itself.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-muted">
                Submit a lead like a customer would. The automation runs live—
                enriching, logging, alerting your team, and replying—in seconds.
                This is the kind of flow we wire up behind your site.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Lead form */}
        <Reveal delay={120}>
          <div className="mt-10 rounded-2xl border border-line bg-surface p-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-faint">
              Incoming lead
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lead name"
                className="rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-signal/60 focus:outline-none"
              />
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink focus:border-signal/60 focus:outline-none"
              >
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What they need…"
                className="rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-signal/60 focus:outline-none"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => run()}
                disabled={running}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {running ? "Running…" : "Run the automation"}
                <span aria-hidden="true">▸</span>
              </button>
              <button
                type="button"
                onClick={useSample}
                disabled={running}
                className="text-sm text-muted transition-colors hover:text-ink disabled:opacity-60"
              >
                or use a sample lead
              </button>
            </div>
          </div>
        </Reveal>

        {lead && (
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
            {/* Steps timeline */}
            <Reveal>
              <div className="rounded-2xl border border-line bg-surface p-6">
                <ol className="space-y-5">
                  {STEPS.map((s, i) => {
                    const st = statuses[i];
                    return (
                      <li key={s.key} className="flex gap-4">
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${
                            st === "done"
                              ? "border-signal bg-signal text-white"
                              : st === "running"
                                ? "border-signal text-signal"
                                : "border-line text-faint"
                          }`}
                        >
                          {st === "done" ? "✓" : st === "running" ? <Spinner /> : i + 1}
                        </span>
                        <div>
                          <p className={`text-sm font-semibold ${st === "idle" || st === "pending" ? "text-muted" : "text-ink"}`}>
                            {s.label}
                          </p>
                          <p className="mt-0.5 text-sm text-faint">{s.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Reveal>

            {/* Artifacts */}
            <div className="space-y-4">
              {done("enrich") && (
                <Artifact label="Enriched" delay={0}>
                  <div className="flex flex-wrap gap-2">
                    <Tag>Residential</Tag>
                    <Tag>Service area ✓</Tag>
                    <Tag tone={urgent ? "hot" : "warm"}>{urgent ? "High intent 🔥" : "Warm lead"}</Tag>
                  </div>
                </Artifact>
              )}

              {done("crm") && (
                <Artifact label="CRM · new contact" delay={0}>
                  <div className="space-y-1.5 text-sm">
                    <Row k="Name" v={lead.name} />
                    <Row k="Interested in" v={lead.service} />
                    <Row k="Stage" v="New lead" accent />
                    <Row k="Record" v={`#L-${crmId.current}`} />
                  </div>
                </Artifact>
              )}

              {done("alert") && (
                <Artifact label="Slack · #sales" delay={0}>
                  <p className="text-sm leading-relaxed text-white/85">
                    🟢 <span className="font-semibold">New lead</span> — {lead.name} wants a{" "}
                    {lead.service.toLowerCase()}.{urgent ? " Marked urgent — reply fast." : " Reply within SLA."}
                  </p>
                </Artifact>
              )}

              {done("reply") && (
                <Artifact label="Auto-reply · sent" delay={0}>
                  <p className="text-xs text-white/40">To: {firstName.toLowerCase()}@email · Subject: We got your request 👋</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    Hi {firstName}, thanks for reaching out about a {lead.service.toLowerCase()}!
                    We&apos;ve logged your request and a team member will follow up shortly to
                    confirm timing and send an exact quote.{urgent ? " We saw it’s time-sensitive—we’re on it." : ""} — The team
                  </p>
                </Artifact>
              )}

              {!running && done("reply") && (
                <p className="pt-1 text-center text-sm text-muted">
                  Handled in seconds—no one lifted a finger.{" "}
                  <a href="#contact" className="text-signal hover:underline">Want this for your business?</a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-signal border-t-transparent" />
  );
}

function Artifact({ label, children }: { label: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className="animate-[fadeUp_.4s_ease] rounded-2xl bg-[#0b0e16] p-5 text-white shadow-[0_14px_40px_-16px_rgba(0,0,0,0.4)]">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8aa9ff]">{label}</p>
      {children}
    </div>
  );
}

function Row({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/45">{k}</span>
      <span className={accent ? "font-semibold text-[#8aa9ff]" : "text-white/85"}>{v}</span>
    </div>
  );
}

function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "warm" | "hot" }) {
  const cls =
    tone === "hot"
      ? "border-rose-400/40 text-rose-200"
      : tone === "warm"
        ? "border-amber-400/40 text-amber-200"
        : "border-white/15 text-white/70";
  return (
    <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${cls}`}>{children}</span>
  );
}
