"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dayWindow, isDaylight, maineTime, phaseAt, type DayWindow } from "@/lib/daylight";

/*
  DayScrubber — the handle that makes the hero's claim checkable.

  The panel above this has always said "this page reads the Maine coast in
  real time — the daylight sets the theme and the accent". True, and
  unfalsifiable from where the visitor is standing: they see one moment of one
  day and have to take the rest on faith. Drag this and the clock moves across
  the Portland day — the accent walks dawn → midday → dusk → night and the
  theme flips at sunrise and sunset, live, on the page they are already
  looking at. It is the product demo and the proof in the same gesture.

  It previews; it never persists. Nothing here writes to localStorage, and
  releasing the handle leaves the page exactly where the scrub put it until
  "Now" snaps it back to real time — parking at 6pm to look around is the
  point, so the release is not the reset. AccentSwitcher owns the actual
  colour state and restores the visitor's real preference when we hand back.

  Accessibility: the visible tape is decoration over a real <input
  type="range">, so dragging, clicking, arrow keys, Home/End, touch and screen
  readers all work without reimplementing any of them.
*/

const STEP = 5 * 60 * 1000; // five-minute granularity

/* Colour stops for the tape, as fractions of the day between the sun marks. */
function tapeGradient(w: DayWindow): string {
  const span = w.end - w.start;
  const pct = (t: number) => `${(((t - w.start) / span) * 100).toFixed(2)}%`;
  const HOUR = 3600000;
  return [
    `${NIGHT} 0%`,
    `${NIGHT} ${pct(w.sunrise - HOUR)}`,
    `${DAWN} ${pct(w.sunrise + 0.5 * HOUR)}`,
    `${DAY} ${pct(w.solarNoon)}`,
    `${DUSK} ${pct(w.sunset - 0.5 * HOUR)}`,
    `${NIGHT} ${pct(w.sunset + HOUR)}`,
    `${NIGHT} 100%`,
  ].join(", ");
}

const DAWN = "#e0a85a";
const DAY = "#5eb2f0";
const DUSK = "#6f7fd6";
const NIGHT = "#2a3358";

export default function DayScrubber() {
  /*
    Null until mounted. The sun marks depend on the real clock, so rendering
    them on the server would hand every visitor a cached snapshot of whenever
    the page was built — and hydrate into a mismatch.
  */
  const [win, setWin] = useState<DayWindow | null>(null);
  const [at, setAt] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  /*
    The real <input> is transparent, so its own focus ring is invisible and a
    keyboard user would be driving a control with no indication they had it.
    :focus-visible is read off the element rather than using focus-within, so
    clicking the tape with a mouse doesn't leave a ring behind.
  */
  const [focused, setFocused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const d = new Date();
      setWin(dayWindow(d));
      setNow(d.getTime());
    };
    tick();
    // Keep the "now" mark honest for anyone who leaves the tab open.
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  /* Broadcast a preview. `null` hands the page back to real time. */
  const broadcast = useCallback((value: number | null) => {
    window.dispatchEvent(
      new CustomEvent("daylight:scrub", {
        detail: value == null ? null : { at: value },
      }),
    );
  }, []);

  // Release the preview if this ever unmounts mid-scrub, so the page can't be
  // left stranded in a colour the visitor can no longer undo.
  useEffect(() => () => broadcast(null), [broadcast]);

  const gradient = useMemo(() => (win ? tapeGradient(win) : null), [win]);

  if (!win || now == null) {
    // Reserve the exact height so the hero panel doesn't jump on hydration.
    return <div aria-hidden="true" className="h-[52px]" />;
  }

  const span = win.end - win.start;
  const posOf = (t: number) => `${Math.min(100, Math.max(0, ((t - win.start) / span) * 100))}%`;
  const value = at ?? now;
  const scrubbed = at != null;
  const label = maineTime(value);
  const phase = phaseAt(new Date(value));
  const marks: Array<[string, number]> = [
    ["Sunrise", win.sunrise],
    ["Noon", win.solarNoon],
    ["Sunset", win.sunset],
  ];

  return (
    <div className="border-t border-[var(--panel-line)] px-4 py-3">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">
          Scrub the day
        </span>
        {scrubbed ? (
          <button
            type="button"
            onClick={() => {
              setAt(null);
              broadcast(null);
            }}
            className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-signal transition-opacity hover:opacity-70"
          >
            {label} · back to now
          </button>
        ) : (
          <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-[color:var(--panel-faint)]">
            Drag<span className="hidden sm:inline"> — the page follows</span>
          </span>
        )}
      </div>

      <div className="relative">
        {/* The tape. Pointer-events off so every gesture lands on the input. */}
        <div
          aria-hidden="true"
          className="pointer-events-none h-2.5 overflow-hidden rounded-full ring-1 ring-inset ring-[var(--panel-line)]"
          style={{ background: `linear-gradient(to right, ${gradient})` }}
        >
          {/* Sun marks, sitting on the band itself. */}
          {marks.map(([name, t]) => (
            <span
              key={name}
              className="absolute top-0 h-2.5 w-px bg-black/35 mix-blend-overlay"
              style={{ left: posOf(t) }}
            />
          ))}
        </div>

        {/* Where the real clock is, so a scrubbed page still shows the truth. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-1 w-px bg-[color:var(--panel-ink)]/50"
          style={{ left: posOf(now), height: "1.125rem" }}
        />

        {/* The handle. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-signal shadow-md ${
            reduced.current ? "" : "transition-[left] duration-75"
          } ${focused ? "ring-2 ring-signal ring-offset-2 ring-offset-[var(--panel-bg)]" : ""}`}
          style={{ left: posOf(value) }}
        />

        <input
          type="range"
          data-day-scrubber=""
          min={win.start}
          max={win.end}
          step={STEP}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            setAt(v);
            broadcast(v);
          }}
          onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
          onBlur={() => setFocused(false)}
          aria-label="Scrub the Portland day — preview how the page looks at another time"
          aria-valuetext={`${label} in Portland — ${phase.name}, ${
            isDaylight(new Date(value)) ? "sun up" : "sun down"
          }`}
          className="absolute inset-x-0 top-1/2 h-8 w-full -translate-y-1/2 cursor-grab appearance-none bg-transparent opacity-0 active:cursor-grabbing"
        />
      </div>

      {/* Tick labels, positioned under their marks. */}
      <div className="relative mt-1.5 h-3">
        {marks.map(([name, t]) => (
          <span
            key={name}
            className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-widest text-[color:var(--panel-faint)]"
            style={{ left: posOf(t) }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
