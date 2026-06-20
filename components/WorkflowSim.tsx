"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

/*
  WorkflowSim — interactive "watch the busywork run itself".

  Pick a scenario (lead intake, missed-call text-back, quote → paid), fill a
  tiny form (or use a sample), and watch the automation run live, step by step,
  producing the real artifacts it would in production — populated from the input.
  Demonstrates the automation, not just a diagram.
*/

type Values = Record<string, string>;
type Field =
  | { key: string; label: string; type: "text" | "tel"; placeholder?: string }
  | { key: string; label: string; type: "select"; options: string[] };
type Step = { label: string; detail: string; artifact?: (v: Values, id: number) => React.ReactNode };
type Scenario = {
  id: string;
  label: string;
  headline: string;
  trigger: string;
  sample: Values;
  fields: Field[];
  steps: Step[];
  outro: string;
};

const SERVICES = ["Standard clean", "Deep clean", "Move-out clean", "Office clean"];
const first = (s: string) => (s || "").split(" ")[0] || "there";

const SCENARIOS: Scenario[] = [
  {
    id: "lead",
    label: "Lead intake",
    headline: "A new lead handles itself.",
    trigger: "Run the automation",
    sample: { name: "Dana Ruiz", service: "Move-out clean", message: "Need a move-out clean for a 2-bed this Friday — kind of urgent!" },
    fields: [
      { key: "name", label: "Lead name", type: "text", placeholder: "Lead name" },
      { key: "service", label: "Service", type: "select", options: SERVICES },
      { key: "message", label: "What they need", type: "text", placeholder: "What they need…" },
    ],
    outro: "Handled in seconds—nobody lifted a finger.",
    steps: [
      {
        label: "Validate & enrich",
        detail: "Clean the data, read intent & area",
        artifact: (v) => {
          const urgent = /asap|urgent|today|tomorrow|this (week|friday|monday)/i.test(v.message);
          return (
            <Artifact label="Enriched">
              <div className="flex flex-wrap gap-2">
                <Tag>Residential</Tag>
                <Tag>Service area ✓</Tag>
                <Tag tone={urgent ? "hot" : "warm"}>{urgent ? "High intent 🔥" : "Warm lead"}</Tag>
              </div>
            </Artifact>
          );
        },
      },
      {
        label: "Create CRM record",
        detail: "New contact, stage: New lead",
        artifact: (v, id) => (
          <Artifact label="CRM · new contact">
            <Row k="Name" v={v.name} />
            <Row k="Interested in" v={v.service} />
            <Row k="Stage" v="New lead" accent />
            <Row k="Record" v={`#L-${id}`} />
          </Artifact>
        ),
      },
      {
        label: "Alert the team",
        detail: "Post to #sales in Slack",
        artifact: (v) => {
          const urgent = /asap|urgent|today|tomorrow|this (week|friday|monday)/i.test(v.message);
          return (
            <Artifact label="Slack · #sales">
              <p className="text-sm leading-relaxed text-white/85">
                🟢 <b>New lead</b> — {v.name} wants a {v.service.toLowerCase()}.
                {urgent ? " Marked urgent — reply fast." : " Reply within SLA."}
              </p>
            </Artifact>
          );
        },
      },
      {
        label: "Send auto-reply",
        detail: "Warm, branded email back",
        artifact: (v) => (
          <Artifact label="Auto-reply · sent">
            <p className="text-xs text-white/40">To: {first(v.name).toLowerCase()}@email · Subject: We got your message 👋</p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Hey {first(v.name)}! Thanks for reaching out about a {v.service.toLowerCase()}. We&apos;ve
              got your details and a real human will follow up shortly to lock in timing and send an
              exact quote. Talk soon — the team 🧡
            </p>
          </Artifact>
        ),
      },
    ],
  },
  {
    id: "turnover",
    label: "Rental turnover",
    headline: "Spotless between guests, every turn.",
    trigger: "Guest checks out",
    sample: { property: "Harborview Cottage", checkin: "Sat, 3:00 PM" },
    fields: [
      { key: "property", label: "Property", type: "text", placeholder: "Property name" },
      { key: "checkin", label: "Next check-in", type: "text", placeholder: "Sat, 3:00 PM" },
    ],
    outro: "Turned over and guest-ready before the next ferry gets in. 🌊",
    steps: [
      {
        label: "Catch the checkout",
        detail: "The moment a guest leaves",
        artifact: (v) => (
          <Artifact label="Booking · checkout">
            <Row k="Property" v={v.property} />
            <Row k="Status" v="Guest departed" />
            <Row k="Next check-in" v={v.checkin} accent />
          </Artifact>
        ),
      },
      {
        label: "Dispatch the crew",
        detail: "Auto-scheduled before check-in",
        artifact: (v) => (
          <Artifact label="Crew · scheduled">
            <p className="text-sm leading-relaxed text-white/85">
              🧹 Turnover booked for <b>{v.property}</b> — crew assigned with a hard finish before{" "}
              <span className="text-[#6fd3c6]">{v.checkin}</span>.
            </p>
          </Artifact>
        ),
      },
      {
        label: "Clean, restock & inspect",
        detail: "Checklist + photo proof",
        artifact: () => (
          <Artifact label="Turnover checklist">
            <Row k="Linens & towels" v="✓" />
            <Row k="Restock + amenities" v="✓" />
            <Row k="Photo walkthrough" v="6 uploaded" accent />
          </Artifact>
        ),
      },
      {
        label: "Flip to ready + notify host",
        detail: "Listing live, host in the loop",
        artifact: (v) => (
          <Artifact label="Listing · ready">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/85">{v.property}</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                Guest-ready ✓
              </span>
            </div>
            <p className="mt-2 text-xs text-white/45">Host texted · calendar updated · welcome note queued</p>
          </Artifact>
        ),
      },
    ],
  },
  {
    id: "missed",
    label: "Missed-call text-back",
    headline: "No missed call goes cold.",
    trigger: "Simulate missed call",
    sample: { caller: "Sam Patel", phone: "(207) 555-0188" },
    fields: [
      { key: "caller", label: "Caller", type: "text", placeholder: "Caller name" },
      { key: "phone", label: "Phone", type: "tel", placeholder: "(555) 555-0123" },
    ],
    outro: "Every missed call is a lead saved—automatically.",
    steps: [
      {
        label: "Catch the missed call",
        detail: "Detect it the second it happens",
        artifact: (v) => (
          <Artifact label="Call log">
            <Row k="Missed call" v={v.caller} />
            <Row k="From" v={v.phone} />
            <Row k="Status" v="Auto-handling" accent />
          </Artifact>
        ),
      },
      {
        label: "Text them back instantly",
        detail: "Friendly auto-reply by SMS",
        artifact: (v) => (
          <Artifact label="SMS · sent">
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-signal px-4 py-2.5 text-sm leading-relaxed text-white">
                Hey {first(v.caller)}! Sorry we missed your call—we&apos;re out on a job. What can we
                help with? Reply here and we&apos;ll ring you right back. 🛠️
              </div>
            </div>
          </Artifact>
        ),
      },
      {
        label: "Log the activity",
        detail: "Straight onto the contact",
        artifact: (v) => (
          <Artifact label="CRM · activity">
            <Row k="Contact" v={v.caller} />
            <Row k="Logged" v="Missed call + text-back" />
            <Row k="Next" v="Awaiting reply" accent />
          </Artifact>
        ),
      },
      {
        label: "Nudge the team",
        detail: "So a human can close it",
        artifact: (v) => (
          <Artifact label="Slack · #front-desk">
            <p className="text-sm leading-relaxed text-white/85">
              📞 <b>{v.caller}</b> called &amp; got an instant text-back. Give them a ring when free?
            </p>
          </Artifact>
        ),
      },
    ],
  },
  {
    id: "quote",
    label: "Quote → paid",
    headline: "From yes to paid, on autopilot.",
    trigger: "Client accepts quote",
    sample: { client: "Riverside Café", service: "Website refresh", amount: "$1,250" },
    fields: [
      { key: "client", label: "Client", type: "text", placeholder: "Client name" },
      { key: "service", label: "Project", type: "text", placeholder: "What you're doing" },
      { key: "amount", label: "Amount", type: "text", placeholder: "$1,250" },
    ],
    outro: "Paperwork, payment, and onboarding—done before you switch tabs.",
    steps: [
      {
        label: "Generate the invoice",
        detail: "Branded, with the right line items",
        artifact: (v, id) => (
          <Artifact label="Invoice · drafted">
            <Row k="Bill to" v={v.client} />
            <Row k="For" v={v.service} />
            <Row k="Amount" v={v.amount} accent />
            <Row k="Invoice" v={`#INV-${id}`} />
          </Artifact>
        ),
      },
      {
        label: "Send a payment link",
        detail: "One tap to pay, card or ACH",
        artifact: (v) => (
          <Artifact label="Payment link · sent">
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-xs text-white/40">{v.client} · secure checkout</p>
              <div className="mt-3 flex items-center justify-center rounded-lg bg-signal py-2.5 text-sm font-semibold text-white">
                Pay {v.amount}
              </div>
            </div>
          </Artifact>
        ),
      },
      {
        label: "Mark paid + receipt",
        detail: "Reconciled the moment it clears",
        artifact: (v) => (
          <Artifact label="Payment · received">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-white">{v.amount}</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                Paid ✓
              </span>
            </div>
            <p className="mt-2 text-xs text-white/45">Receipt emailed to {v.client} · books updated</p>
          </Artifact>
        ),
      },
      {
        label: "Book & onboard",
        detail: "Kickoff scheduled, welcome sent",
        artifact: (v) => (
          <Artifact label="Onboarding · started">
            <Row k="Kickoff" v="Booked ✓" accent />
            <Row k="Welcome email" v="Sent" />
            <Row k="Project folder" v={`${first(v.client)}/…`} />
          </Artifact>
        ),
      },
    ],
  },
];

type Status = "idle" | "pending" | "running" | "done";

export default function WorkflowSim() {
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === sid)!;
  const [values, setValues] = useState<Values>(SCENARIOS[0].sample);
  const [snapshot, setSnapshot] = useState<Values | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [running, setRunning] = useState(false);
  const [idNum, setIdNum] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const switchScenario = (id: string) => {
    timers.current.forEach(clearTimeout);
    const ns = SCENARIOS.find((s) => s.id === id)!;
    setSid(id);
    setValues(ns.sample);
    setSnapshot(null);
    setStatuses([]);
    setRunning(false);
  };

  const run = (useSample = false) => {
    if (running) return;
    const snap: Values = {};
    scenario.fields.forEach((f) => {
      snap[f.key] = (useSample ? "" : (values[f.key] ?? "").trim()) || scenario.sample[f.key];
    });
    if (useSample) setValues(scenario.sample);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSnapshot(snap);
    setIdNum(Math.floor(1000 + Math.random() * 9000));
    setRunning(true);
    setStatuses(scenario.steps.map((_, i) => (i === 0 ? "running" : "pending")));

    scenario.steps.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setStatuses((prev) => {
            const next = [...prev];
            next[i] = "done";
            if (i + 1 < scenario.steps.length) next[i + 1] = "running";
            return next;
          });
          if (i === scenario.steps.length - 1) setRunning(false);
        }, 750 * (i + 1)),
      );
    });
  };

  const allDone = statuses.length > 0 && statuses.every((s) => s === "done");

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
                Watch the busywork run itself.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-muted">
                Pick a scenario, hit go, and watch a real automation handle it—
                live. This is the kind of flow we wire up behind your site.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Scenario picker */}
        <Reveal delay={120}>
          <div className="mt-10 inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => switchScenario(s.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  sid === s.id ? "bg-signal text-white" : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Trigger form */}
        <Reveal delay={160}>
          <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-faint">
              {scenario.headline}
            </p>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${scenario.fields.length}, minmax(0, 1fr))` }}
            >
              {scenario.fields.map((f) =>
                f.type === "select" ? (
                  <select
                    key={f.key}
                    value={values[f.key] ?? f.options[0]}
                    onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink focus:border-signal/60 focus:outline-none"
                  >
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    key={f.key}
                    type={f.type}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-signal/60 focus:outline-none"
                  />
                ),
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => run(false)}
                disabled={running}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {running ? "Running…" : scenario.trigger}
                <span aria-hidden="true">▸</span>
              </button>
              <button
                type="button"
                onClick={() => run(true)}
                disabled={running}
                className="text-sm text-muted transition-colors hover:text-ink disabled:opacity-60"
              >
                or use a sample
              </button>
            </div>
          </div>
        </Reveal>

        {snapshot && (
          <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
            {/* Steps */}
            <Reveal>
              <div className="rounded-2xl border border-line bg-surface p-6 md:sticky md:top-24">
                <ol className="space-y-5">
                  {scenario.steps.map((s, i) => {
                    const st = statuses[i];
                    return (
                      <li key={s.label} className="flex gap-4">
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
              {scenario.steps.map((s, i) =>
                statuses[i] === "done" && s.artifact ? (
                  <div key={i}>{s.artifact(snapshot, idNum)}</div>
                ) : null,
              )}
              {allDone && (
                <p className="pt-1 text-center text-sm text-muted">
                  {scenario.outro}{" "}
                  <a href="#contact" className="text-signal hover:underline">
                    Want this for your business?
                  </a>
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
  return <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-signal border-t-transparent" />;
}

function Artifact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="animate-[fadeUp_.4s_ease] space-y-1.5 rounded-2xl bg-[#0e1c28] p-5 text-white shadow-[0_14px_40px_-16px_rgba(0,0,0,0.4)]">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6fd3c6]">{label}</p>
      {children}
    </div>
  );
}

function Row({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/45">{k}</span>
      <span className={accent ? "font-semibold text-[#6fd3c6]" : "text-white/85"}>{v}</span>
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
  return <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${cls}`}>{children}</span>;
}
