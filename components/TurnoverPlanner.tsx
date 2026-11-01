"use client";

import { useMemo, useState } from "react";
import type { Turnover } from "@/lib/ical";

/*
  Turnover planner — paste a rental calendar, get the cleanings it implies.

  This is the Maine Cleaning Co. workflow, which is the point: that system
  takes vacation-rental bookings and puts the turnovers on a cleaning
  schedule, and the site says so in the Work section without ever letting a
  visitor feel it. Here they bring their own calendar and watch it happen to
  their own bookings, which argues better than a screenshot can.

  Nothing is stored and nothing is emailed. The endpoint parses and replies;
  a stranger's booking calendar is theirs.
*/

type Mode = "url" | "paste";
type State = "idle" | "working" | "done" | "error";

type Result = {
  bookings: number;
  turnovers: Turnover[];
  sameDay: number;
};

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/* Nights between two YYYY-MM-DD dates. */
const nights = (a: string, b: string) =>
  Math.round(
    (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000,
  );

export default function TurnoverPlanner() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [ics, setIcs] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const upcoming = useMemo(() => {
    if (!result) return [];
    const today = new Date().toISOString().slice(0, 10);
    const future = result.turnovers.filter((t) => t.date >= today);
    /* A calendar that is entirely in the past is still worth showing: the
       visitor pasted it to see the tool work, not to be told it is empty. */
    return future.length > 0 ? future : result.turnovers;
  }, [result]);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setState("working");
    setError(null);
    try {
      const res = await fetch("/api/turnover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "url" ? { url } : { ics }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Something went wrong.");
      setResult({ bookings: data.bookings, turnovers: data.turnovers, sameDay: data.sameDay });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  /*
    The cleanings as a calendar file, built here rather than server-side:
    the data is already in the browser and a round trip would add nothing.
    All-day VEVENTs, because a turnover is a day's work, not an appointment.
  */
  function download() {
    if (!result) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//M Studio//Turnover Planner//EN",
      "CALSCALE:GREGORIAN",
    ];
    for (const t of result.turnovers) {
      const d = t.date.replace(/-/g, "");
      const next = new Date(`${t.date}T00:00:00Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      lines.push(
        "BEGIN:VEVENT",
        `UID:${t.date}-turnover@mlinx.studio`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${d}`,
        `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, "")}`,
        `SUMMARY:${t.sameDay ? "Turnover clean (same-day)" : "Turnover clean"}`,
        `DESCRIPTION:Checkout ${t.date}${t.in ? `\\nNext check-in the same day` : ""}`,
        "END:VEVENT",
      );
    }
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "turnover-cleanings.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="corner-accents rounded-2xl border border-line bg-surface/60 p-6 md:p-8">
      <form onSubmit={run}>
        <div className="flex gap-1 rounded-full border border-line bg-base p-1 text-xs" role="group">
          {(["url", "paste"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`flex-1 rounded-full px-4 py-2 font-medium transition-colors ${
                mode === m ? "bg-signal text-white" : "text-muted hover:text-ink"
              }`}
            >
              {m === "url" ? "Calendar link" : "Paste the file"}
            </button>
          ))}
        </div>

        {mode === "url" ? (
          <div className="mt-4">
            <label htmlFor="ical-url" className="text-sm text-muted">
              Your Airbnb or Vrbo iCal export link
            </label>
            <input
              id="ical-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.airbnb.com/calendar/ical/..."
              className="mt-2 w-full rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
        ) : (
          <div className="mt-4">
            <label htmlFor="ical-text" className="text-sm text-muted">
              The contents of your .ics file. Works with any calendar.
            </label>
            <textarea
              id="ical-text"
              value={ics}
              onChange={(e) => setIcs(e.target.value)}
              rows={5}
              placeholder="BEGIN:VCALENDAR&#10;..."
              className="mt-2 w-full rounded-lg border border-line bg-base px-4 py-3 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={state === "working" || (mode === "url" ? !url : !ics)}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {state === "working" ? "Reading the calendar…" : "Build the cleaning schedule →"}
        </button>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}
      </form>

      {state === "done" && result && (
        <div className="mt-8 border-t border-line pt-6">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
            <Stat n={result.bookings} label={result.bookings === 1 ? "booking" : "bookings"} />
            <Stat n={result.turnovers.length} label="cleanings" />
            <Stat n={result.sameDay} label="same-day turnarounds" accent={result.sameDay > 0} />
          </div>

          {result.turnovers.length === 0 ? (
            <p className="mt-5 text-sm text-muted">
              No completed stays in that calendar yet, so there is nothing to clean.
            </p>
          ) : (
            <>
              <ul className="mt-6 space-y-2">
                {upcoming.slice(0, 12).map((t) => (
                  <li
                    key={t.date + t.out.start}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-line bg-base px-4 py-3"
                  >
                    <span className="font-medium text-ink">{fmt(t.date)}</span>
                    <span className="text-sm text-muted">
                      after a {nights(t.out.start, t.out.end)}-night stay
                    </span>
                    {t.sameDay && (
                      <span className="ml-auto rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                        same-day turnaround
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {upcoming.length > 12 && (
                <p className="mt-3 text-xs text-faint">
                  and {upcoming.length - 12} more in the download
                </p>
              )}
              <button
                type="button"
                onClick={download}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-5 py-2.5 text-sm font-semibold text-signal transition-colors hover:bg-signal/20"
              >
                Download as a calendar file
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ n, label, accent }: { n: number; label: string; accent?: boolean }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className={`display text-2xl ${accent ? "text-gold" : "text-ink"}`}>{n}</span>
      <span className="text-sm text-muted">{label}</span>
    </p>
  );
}
