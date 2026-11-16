"use client";

import { useMemo, useState } from "react";
import { parseBookings, planTurnovers, type Booking, type Turnover } from "@/lib/ical";

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
  /** True when the visitor pressed "Try a sample", so the UI can say so. */
  sample?: boolean;
  /** The stays themselves, for shading booked nights on the calendar. */
  stays?: Booking[];
  bookings: number;
  /** Owner blocks and prep time in the feed, which imply no cleaning. */
  blocked: number;
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

/*
  A sample calendar, built relative to today so it never shows a stale
  month. Clearly labelled as a sample everywhere it appears: it is input
  for trying the tool, not anybody's real bookings. Includes one same-day
  turnaround and one owner block, the two cases the planner exists for.
*/
function sampleIcs(): string {
  const day = (offset: number) => {
    const d = new Date();
    d.setUTCHours(12, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() + offset);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  };
  const ev = (a: number, b: number, summary: string, i: number) =>
    [
      "BEGIN:VEVENT",
      `UID:sample-${i}@mlinx.studio`,
      `DTSTART;VALUE=DATE:${day(a)}`,
      `DTEND;VALUE=DATE:${day(b)}`,
      `SUMMARY:${summary}`,
      "END:VEVENT",
    ].join("\r\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    ev(1, 4, "Reserved", 1),
    ev(4, 7, "Reserved", 2),
    ev(9, 11, "Airbnb (Not available)", 3),
    ev(12, 15, "Reserved", 4),
    ev(17, 21, "Reserved", 5),
    ev(21, 23, "Reserved", 6),
    "END:VCALENDAR",
  ].join("\r\n");
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
function addDays(isoDate: string, n: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
}

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

  function trySample() {
    const bookings = parseBookings(sampleIcs());
    const turnovers = planTurnovers(bookings);
    setError(null);
    setResult({
      sample: true,
      stays: bookings.filter((b) => b.kind === "stay"),
      bookings: bookings.filter((b) => b.kind === "stay").length,
      blocked: bookings.filter((b) => b.kind === "block").length,
      turnovers,
      sameDay: turnovers.filter((t) => t.sameDay).length,
    });
    setState("done");
  }

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
      const turnovers: Turnover[] = data.turnovers;
      setResult({
        stays: turnovers.map((t) => t.out),
        bookings: data.bookings,
        blocked: data.blocked ?? 0,
        turnovers: data.turnovers,
        sameDay: data.sameDay,
      });
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
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(11,23,34,0.04)] md:p-8">
      <form onSubmit={run}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex gap-1 rounded-lg border border-line bg-base p-1 text-[13px]" role="group">
            {(["url", "paste"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`rounded-md px-3.5 py-1.5 font-medium transition-colors duration-150 ${
                  mode === m ? "bg-[color:var(--cp-ink)] text-[color:var(--cp-on-ink)]" : "text-muted hover:text-ink"
                }`}
              >
                {m === "url" ? "Calendar link" : "Paste the file"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={trySample}
            className="text-[13px] font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            No calendar handy? Try a sample
          </button>
        </div>

        {mode === "url" ? (
          <div className="mt-5">
            <label htmlFor="ical-url" className="text-sm font-medium text-ink">
              Your Airbnb or Vrbo calendar link
            </label>
            <p className="mt-1 text-xs text-faint">
              In Airbnb: Calendar → Availability → Connect calendars → Export.
            </p>
            <input
              id="ical-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.airbnb.com/calendar/ical/..."
              className="mt-2 w-full rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-[color:var(--cp-hairline-strong)]"
            />
          </div>
        ) : (
          <div className="mt-5">
            <label htmlFor="ical-text" className="text-sm font-medium text-ink">
              The contents of your .ics file
            </label>
            <textarea
              id="ical-text"
              value={ics}
              onChange={(e) => setIcs(e.target.value)}
              rows={5}
              placeholder="BEGIN:VCALENDAR&#10;..."
              className="mt-2 w-full rounded-lg border border-line bg-base px-4 py-3 font-mono text-xs text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-[color:var(--cp-hairline-strong)]"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={state === "working" || (mode === "url" ? !url : !ics)}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[color:var(--cp-ink)] px-5 text-sm font-semibold text-[color:var(--cp-on-ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {state === "working" ? "Reading the calendar…" : "Build the cleaning schedule"}
        </button>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}
      </form>

      {state === "done" && result && (
        <div className="mt-8 border-t border-line pt-6">
          {result.sample && (
            <p className="mb-4 inline-block rounded-md border border-line bg-base px-2.5 py-1 text-xs text-muted">
              Sample calendar. Paste your own link above to see your bookings.
            </p>
          )}
          <div className="grid grid-cols-3 gap-3">
            <Stat n={result.bookings} label={result.bookings === 1 ? "booking" : "bookings"} />
            <Stat n={result.turnovers.length} label="cleanings" />
            <Stat n={result.sameDay} label="same-day" accent={result.sameDay > 0} />
          </div>

          {result.turnovers.length === 0 ? (
            <p className="mt-5 text-sm text-muted">
              No completed stays in that calendar yet, so there is nothing to clean.
            </p>
          ) : (
            <>
              <MonthGrid turnovers={upcoming} stays={result.stays ?? []} />

              {result.blocked > 0 && (
                <p className="mt-4 text-xs text-faint">
                  {result.blocked} owner {result.blocked === 1 ? "block" : "blocks"} in
                  the feed, skipped. Blocked dates need no cleaning.
                </p>
              )}

              <ul className="mt-5 divide-y divide-[color:var(--cp-hairline)] rounded-lg border border-line">
                {upcoming.slice(0, 8).map((t) => (
                  <li key={t.date + t.out.start} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
                    <span className="w-28 font-medium text-ink">{fmt(t.date)}</span>
                    <span className="text-muted">
                      after a {nights(t.out.start, t.out.end)}-night stay
                    </span>
                    {t.sameDay && (
                      <span className="ml-auto rounded-md border border-[color:var(--cp-amber-line)] px-2 py-0.5 text-xs font-medium text-ink">
                        Same-day
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {upcoming.length > 8 && (
                <p className="mt-2 text-xs text-faint">and {upcoming.length - 8} more in the download</p>
              )}
              <button
                type="button"
                onClick={download}
                className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-line bg-base px-4 text-sm font-semibold text-ink transition-colors hover:border-[color:var(--cp-hairline-strong)]"
              >
                Download for Google or Apple Calendar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/*
  Four weeks from the Sunday on or before the first upcoming cleaning:
  booked nights shaded, cleaning days marked, same-day turnarounds called
  out. The picture a host or a cleaner actually checks.
*/
function MonthGrid({ turnovers, stays }: { turnovers: Turnover[]; stays: Booking[] }) {
  const first = turnovers[0]?.date;
  if (!first) return null;
  const f = new Date(`${first}T12:00:00Z`);
  const start = addDays(first, -f.getUTCDay());
  const days = Array.from({ length: 28 }, (_, i) => addDays(start, i));
  const byDate = new Map(turnovers.map((t) => [t.date, t]));
  const booked = new Set<string>();
  for (const b of stays) for (let d = b.start; d < b.end; d = addDays(d, 1)) booked.add(d);
  const today = iso(new Date());

  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-faint">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1">
        {days.map((d) => {
          const t = byDate.get(d);
          const isBooked = booked.has(d);
          return (
            <div
              key={d}
              style={
                t
                  ? { background: "var(--cp-ink)", color: "var(--cp-on-ink)", borderColor: "var(--cp-ink)" }
                  : isBooked
                    ? { background: "var(--cp-hairline-strong)", borderColor: "transparent" }
                    : undefined
              }
              className={`relative flex min-h-14 flex-col rounded-md border p-1.5 text-left text-xs ${
                t || isBooked ? "" : "border-line"
              }`}
            >
              <span className={t ? "font-semibold" : d === today ? "font-bold text-ink" : "text-muted"}>
                {Number(d.slice(8))}
              </span>
              {t && (
                <span className="mt-auto text-[10.5px] font-semibold leading-tight">
                  Clean
                  {t.sameDay && <span className="block font-normal opacity-80">same-day</span>}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: "var(--cp-hairline-strong)" }} /> Guest staying
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ background: "var(--cp-ink)" }} /> Cleaning day
        </span>
      </div>
    </div>
  );
}

function Stat({ n, label, accent }: { n: number; label: string; accent?: boolean }) {
  return (
    <p className={`m-0 rounded-lg border bg-base px-4 py-3 ${accent ? "border-[color:var(--cp-amber-line)]" : "border-line"}`}>
      <span className="display block text-2xl text-ink">{n}</span>
      <span className="text-xs text-muted">{label}</span>
    </p>
  );
}
