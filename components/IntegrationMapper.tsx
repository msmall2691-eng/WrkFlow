"use client";

import { useMemo } from "react";
import Reveal from "./Reveal";
import SaveResult from "./SaveResult";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  IntegrationMapper — shows how the tools you already use can connect.

  Pick the tools you already run; the map wires them into one hub and lists the
  automations that become possible. A live picture of what M Studio connects.
*/

type ToolId =
  | "website" | "crm" | "stripe" | "quickbooks" | "calendar"
  | "gmail" | "sms" | "airbnb" | "sheets" | "slack";

const TOOLS: { id: ToolId; label: string; icon: string }[] = [
  { id: "website", label: "Website", icon: "🌐" },
  { id: "crm", label: "CRM", icon: "🗂️" },
  { id: "stripe", label: "Payments", icon: "💳" },
  { id: "quickbooks", label: "Accounting", icon: "📒" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "gmail", label: "Email", icon: "✉️" },
  { id: "sms", label: "Text/SMS", icon: "💬" },
  { id: "airbnb", label: "Airbnb/VRBO", icon: "🏠" },
  { id: "sheets", label: "Spreadsheets", icon: "📊" },
  { id: "slack", label: "Team chat", icon: "🔔" },
];

const LABEL: Record<ToolId, string> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t.label]),
) as Record<ToolId, string>;

const ICON: Record<ToolId, string> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t.icon]),
) as Record<ToolId, string>;

// Automations that unlock when all `needs` tools are selected.
const RULES: { needs: ToolId[]; text: string }[] = [
  { needs: ["website", "crm"], text: "New form submissions create a contact in your CRM automatically." },
  { needs: ["website", "stripe"], text: "Customers pay on your site and the payment lands instantly." },
  { needs: ["website", "calendar"], text: "Online bookings drop straight onto your calendar." },
  { needs: ["stripe", "quickbooks"], text: "Every payment is reconciled in your books—no manual entry." },
  { needs: ["calendar", "sms"], text: "Automatic text reminders go out before each appointment." },
  { needs: ["gmail", "crm"], text: "Emails are logged to the right customer record automatically." },
  { needs: ["airbnb", "calendar"], text: "Bookings from every platform sync to one master calendar." },
  { needs: ["airbnb", "sms"], text: "Guests get automatic check-in texts the moment they book." },
  { needs: ["crm", "sheets"], text: "Reports and lists update themselves from live CRM data." },
  { needs: ["crm", "slack"], text: "New leads ping your team in chat the second they arrive." },
  { needs: ["stripe", "sms"], text: "Paid invoices trigger an automatic thank-you text." },
  { needs: ["website", "gmail"], text: "Inquiries get an instant, branded auto-reply while you sleep." },
  { needs: ["quickbooks", "sheets"], text: "Financials flow into a live dashboard you read every day." },
  { needs: ["calendar", "slack"], text: "The team sees the day's jobs in chat every morning." },
];

export default function IntegrationMapper() {
  const [selected, setSelected] = useLocalStorage<ToolId[]>(
    "tool-map-selected",
    ["website", "crm", "stripe", "calendar"],
  );

  const toggle = (id: ToolId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const sel = TOOLS.filter((t) => selected.includes(t.id)).map((t) => t.id);

  const automations = useMemo(
    () => RULES.filter((r) => r.needs.every((n) => sel.includes(n))),
    [sel],
  );

  // Node geometry — arrange selected tools in a ring around the hub.
  const size = 360;
  const c = size / 2;
  const R = 132;
  const nodes = sel.map((id, i) => {
    const angle = (-90 + (360 / Math.max(sel.length, 1)) * i) * (Math.PI / 180);
    return { id, x: c + R * Math.cos(angle), y: c + R * Math.sin(angle) };
  });

  const summary = [
    "M Studio — Your integration map",
    "",
    `Tools: ${sel.map((id) => LABEL[id]).join(", ") || "none selected"}`,
    "",
    "What becomes possible:",
    ...(automations.length
      ? automations.map((a) => `• ${a.text}`)
      : ["• Pick a few more tools to see the connections."]),
    "",
    "Mapped at mlinx.studio",
  ].join("\n");

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
      {/* Tool picker */}
      <Reveal>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">
          Which of these do you use?
        </p>
        <div className="flex flex-wrap gap-2">
          {TOOLS.map((t) => {
            const on = selected.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggle(t.id)}
                aria-pressed={on}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm transition-colors ${
                  on
                    ? "border-signal/50 bg-signal/15 text-ink"
                    : "border-line bg-base text-muted hover:text-ink"
                }`}
              >
                <span aria-hidden="true">{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
        {/* The map */}
        <Reveal>
          <div className="rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_40%,var(--color-elevated)_0%,var(--color-base)_75%)] p-4">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="mx-auto block h-auto w-full max-w-[360px]"
              role="img"
              aria-label="A map linking your selected tools to one central hub"
            >
              {/* Connector lines */}
              {nodes.map((n) => (
                <line
                  key={`l-${n.id}`}
                  x1={c}
                  y1={c}
                  x2={n.x}
                  y2={n.y}
                  stroke="var(--color-signal)"
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  className="flow-line"
                />
              ))}

              {/* Hub */}
              <circle cx={c} cy={c} r={34} fill="var(--color-signal)" />
              <circle cx={c} cy={c} r={34} fill="none" stroke="var(--color-signal)" strokeOpacity={0.3} strokeWidth={10} />
              <text x={c} y={c} textAnchor="middle" dominantBaseline="central" className="font-display" fill="#fff" fontSize={22} fontWeight={700}>
                M
              </text>

              {/* Nodes */}
              {nodes.map((n) => (
                <g key={`n-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={24} fill="var(--color-base)" stroke="var(--color-signal)" strokeOpacity={0.5} strokeWidth={1.5} />
                  <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize={20}>
                    {ICON[n.id]}
                  </text>
                  <text x={n.x} y={n.y + 38} textAnchor="middle" fill="var(--color-muted)" fontSize={10} className="font-mono">
                    {LABEL[n.id]}
                  </text>
                </g>
              ))}

              {sel.length === 0 && (
                <text x={c} y={c + 70} textAnchor="middle" fill="var(--color-faint)" fontSize={11} className="font-mono">
                  pick a tool to start
                </text>
              )}
            </svg>
          </div>
        </Reveal>

        {/* Resulting automations */}
        <Reveal delay={80}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-signal">
              What becomes possible
              {automations.length > 0 && (
                <span className="text-faint"> · {automations.length}</span>
              )}
            </p>
            <ul className="mt-4 space-y-3">
              {automations.length > 0 ? (
                automations.map((a) => (
                  <li key={a.text} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{a.text}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm leading-relaxed text-muted">
                  Pick at least two related tools (try Website + CRM) to see the
                  connections light up.
                </li>
              )}
            </ul>

            <SaveResult summary={summary} filename="mstudio-integration-map" tool="workflow-map" toolLabel="Workflow map" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
