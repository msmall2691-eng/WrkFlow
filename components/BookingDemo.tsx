"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";

/*
  BookingDemo — a working appointment-booking flow (Playground tool).

  Pick a service, day, and open slot, then confirm to get a real downloadable
  calendar invite (.ics). Mirrors the booking apps we build—availability,
  confirmation, and calendar handoff, end to end.
*/

const SERVICES = [
  { id: "discovery", label: "Discovery call", mins: 30 },
  { id: "strategy", label: "Strategy session", mins: 60 },
  { id: "review", label: "Build review", mins: 45 },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

// Deterministic 0..1 from a string — keeps "booked" slots stable across renders.
function seeded(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

// Next business days (skip weekends), starting tomorrow.
function businessDays(count: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (out.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const fmtDay = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

function fmtTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${pad(m)} ${ampm}`;
}

export default function BookingDemo() {
  const days = useMemo(() => businessDays(6), []);
  const [serviceId, setServiceId] = useState<(typeof SERVICES)[number]["id"]>("discovery");
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const service = SERVICES.find((s) => s.id === serviceId)!;
  const day = days[dayIdx];
  const dayKey = day.toISOString().slice(0, 10);

  // Build the slot grid for the selected day/service.
  const slots = useMemo(() => {
    const open = 9 * 60;
    const close = 16 * 60;
    const list: { start: number; booked: boolean }[] = [];
    for (let t = open; t + service.mins <= close; t += service.mins) {
      list.push({ start: t, booked: seeded(`${dayKey}@${service.id}@${t}`) < 0.3 });
    }
    return list;
  }, [dayKey, service]);

  function reset() {
    setConfirmed(false);
    setSlot(null);
    setName("");
    setEmail("");
  }

  function downloadICS() {
    if (slot == null) return;
    const start = new Date(day);
    start.setHours(Math.floor(slot / 60), slot % 60, 0, 0);
    const end = new Date(start.getTime() + service.mins * 60_000);
    const toICS = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//M Studio//Booking Demo//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@mlinx.studio`,
      `DTSTAMP:${toICS(new Date())}`,
      `DTSTART:${toICS(start)}`,
      `DTEND:${toICS(end)}`,
      `SUMMARY:${service.label} with M Studio`,
      `DESCRIPTION:Booked via the M Studio booking demo at mlinx.studio${name ? ` for ${name}` : ""}.`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mstudio-booking.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (confirmed && slot != null) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
        <div className="mx-auto max-w-md rounded-2xl border border-signal/30 bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-elevated)_0%,var(--color-base)_75%)] p-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal/15 text-2xl text-signal">
            ✓
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-signal">
            Booking confirmed
          </p>
          <h3 className="mt-2 font-display text-2xl text-ink">{service.label}</h3>
          <p className="mt-1 text-muted">
            {fmtDay(day)} · {fmtTime(slot)} ({service.mins} min)
          </p>
          {name && <p className="mt-1 text-sm text-faint">for {name}</p>}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={downloadICS}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Add to calendar (.ics)
            </button>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Book this for real →
            </a>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-medium text-faint transition-colors hover:text-ink"
            >
              ← Start over
            </button>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-faint">
            This is a live demo of the booking flow we build—availability,
            confirmation, and calendar handoff included.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
      {/* Service */}
      <Reveal>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">1 · Service</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setServiceId(s.id);
                setSlot(null);
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                serviceId === s.id
                  ? "border-signal/50 bg-signal/15 text-ink"
                  : "border-line bg-base text-muted hover:text-ink"
              }`}
            >
              {s.label} <span className="text-faint">· {s.mins}m</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Day */}
      <Reveal delay={60}>
        <p className="mb-3 mt-7 font-mono text-[11px] uppercase tracking-widest text-faint">2 · Day</p>
        <div className="flex flex-wrap gap-2">
          {days.map((d, i) => (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => {
                setDayIdx(i);
                setSlot(null);
              }}
              className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
                dayIdx === i
                  ? "border-signal/50 bg-signal/15 text-ink"
                  : "border-line bg-base text-muted hover:text-ink"
              }`}
            >
              {fmtDay(d)}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Slots */}
      <Reveal delay={120}>
        <p className="mb-3 mt-7 font-mono text-[11px] uppercase tracking-widest text-faint">3 · Time</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {slots.map((s) => (
            <button
              key={s.start}
              type="button"
              disabled={s.booked}
              onClick={() => setSlot(s.start)}
              className={`rounded-lg border px-2 py-2.5 text-sm transition-colors ${
                s.booked
                  ? "cursor-not-allowed border-line/60 bg-base/40 text-faint/50 line-through"
                  : slot === s.start
                    ? "border-signal bg-signal text-white"
                    : "border-line bg-base text-ink hover:border-signal/60"
              }`}
            >
              {fmtTime(s.start)}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Details + confirm */}
      {slot != null && (
        <Reveal>
          <div className="mt-7 border-t border-line pt-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">4 · Your details</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
              />
            </div>
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-8"
            >
              Confirm {fmtDay(day)} · {fmtTime(slot)} →
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
