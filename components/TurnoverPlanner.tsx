"use client";

import { useMemo, useState } from "react";
import ToolEmailCapture from "@/components/ToolEmailCapture";
import { trackTool } from "@/lib/track";
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
    /*
      The brand plan asks for a `planner_used` event. This fires the
      site's own `tool_generated` with tool "turnover" instead, because
      `lib/track.ts` already owns that vocabulary and a third spelling of
      "somebody used a tool" is a number nobody can compare against the
      other eight. Same for the download and the email below.
    */
    trackTool("turnover", "generated");
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
      trackTool("turnover", "generated");
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
  /* The calendar text, built once and used by both the download and the
     email attachment. It was inline in `download`; a second caller is
     exactly when that stops being fine. */
  function icsText(): string {
    if (!result) return "";
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
    return lines.join("\r\n");
  }

  function icsBase64(): string {
    /* btoa needs latin1; the calendar is ASCII by construction (dates and
       two fixed summaries), so this is safe and avoids pulling in a
       polyfill for text that cannot contain a non-ASCII character. */
    return typeof window === "undefined" ? "" : window.btoa(icsText());
  }

  /* What the visitor reads in the email, above the attachment. */
  function emailSummary(): string {
    if (!result) return "";
    const lines = result.turnovers.map(
      (t) => `${fmt(t.date)}${t.sameDay ? "  (same-day turnaround)" : ""}`,
    );
    return [
      `${result.turnovers.length} cleaning${result.turnovers.length === 1 ? "" : "s"} from ${result.bookings} booking${result.bookings === 1 ? "" : "s"}.`,
      "",
      ...lines,
      "",
      "The attached .ics opens in Google or Apple Calendar.",
    ].join("\n");
  }

  function download() {
    if (!result) return;
    const blob = new Blob([icsText()], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "turnover-cleanings.ics";
    a.click();
    URL.revokeObjectURL(a.href);
    trackTool("turnover", "downloaded");
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

              {/*
                **Email capture, and it gives before it asks.** The brand
                plan's job 1 wants an email on this page. `ToolEmailCapture`
                already does that everywhere else on the site and does it
                the right way round: the field is optional and inline
                rather than a wall, the visitor gets their own schedule in
                their inbox, and Meg gets the lead notice. Reusing it means
                one author for how this site asks for an email.

                The schedule is the body and the .ics is attached, so the
                email is the thing they came for rather than a receipt for
                having handed over an address.
              */}
              <ToolEmailCapture
                className="mt-5"
                tool="turnover"
                toolLabel="Turnover schedule"
                summary={emailSummary()}
                attachment={{
                  filename: "turnover-cleanings.ics",
                  contentBase64: icsBase64(),
                  contentType: "text/calendar",
                }}
              />
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
/** "December 2026", or "Nov – Dec 2026" when the four weeks straddle two. */
function spanLabel(days: string[]): string {
  const d = (s: string) => new Date(`${s}T12:00:00Z`);
  const a = d(days[0]);
  const b = d(days[days.length - 1]);
  const long = (x: Date) =>
    x.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  const short = (x: Date) =>
    x.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  if (a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear())
    return `${long(a)} ${a.getUTCFullYear()}`;
  if (a.getUTCFullYear() === b.getUTCFullYear())
    return `${short(a)} – ${short(b)} ${b.getUTCFullYear()}`;
  return `${short(a)} ${a.getUTCFullYear()} – ${short(b)} ${b.getUTCFullYear()}`;
}

/*
  The four weeks from the first cleaning.

  **It says which four weeks, and it did not.** The grid opened on "29,
  30, 1, 2" with no month anywhere on it, so two different months' days
  were the same number in the same picture and a visitor had to work out
  the year from nothing. The span is now the heading, which also makes
  the next thing honest: this is a *window*, not the whole schedule, and
  a feed with three months of bookings has cleanings past its edge. The
  count of those is on the grid rather than left for somebody to discover
  when the download has more dates in it than the picture showed.

  **Guest nights stopped being the loudest thing on it.** They were a
  solid `--cp-hairline-strong` fill, which on a 28-cell grid is a wall of
  grey blocks with the actual answer, the cleaning days, scattered inside
  it. A stay is context; the cleaning is the point. The nights are a
  quiet tint with an edge now, and the cleanings keep the full ink fill.
*/
function MonthGrid({ turnovers, stays }: { turnovers: Turnover[]; stays: Booking[] }) {
  const first = turnovers[0]?.date;
  if (!first) return null;
  const f = new Date(`${first}T12:00:00Z`);
  const start = addDays(first, -f.getUTCDay());
  const days = Array.from({ length: 28 }, (_, i) => addDays(start, i));
  const last = days[days.length - 1];
  const byDate = new Map(turnovers.map((t) => [t.date, t]));
  const booked = new Set<string>();
  for (const b of stays) for (let d = b.start; d < b.end; d = addDays(d, 1)) booked.add(d);
  const today = iso(new Date());

  const shown = turnovers.filter((t) => t.date >= days[0] && t.date <= last).length;
  const beyond = turnovers.length - shown;
  /* The four weeks can straddle two months, and a bare "29, 30, 1, 2" is
     the same numbers twice in one picture. A month view dims the days
     either side of itself rather than labelling them, so this does too,
     with the month of the first cleaning as the one being shown. */
  const primaryMonth = new Date(`${first}T12:00:00Z`).getUTCMonth();

  return (
    <div className="sheet mt-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3
          className="m-0 text-[17px] font-semibold tracking-[-0.01em]"
          style={{ color: "var(--sheet-ink)" }}
        >
          {spanLabel(days)}
        </h3>
        <p className="m-0 text-[13px]" style={{ color: "var(--sheet-muted)" }}>
          {shown} {shown === 1 ? "cleaning" : "cleanings"} in these four weeks
          {beyond > 0 && `, ${beyond} more after them`}
        </p>
      </div>

      <div
        className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-[0.04em]"
        style={{ color: "var(--sheet-faint)" }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d} className="py-1.5">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((d) => {
          const t = byDate.get(d);
          const isBooked = booked.has(d);
          const dayNum = Number(d.slice(8));
          const otherMonth = new Date(`${d}T12:00:00Z`).getUTCMonth() !== primaryMonth;

          /* The disc behind the number is the whole signal, the way a
             calendar on a phone marks a day. Nothing is filled, bordered
             or tinted at cell level. */
          const disc = t
            ? t.sameDay
              ? "var(--sheet-same)"
              : "var(--sheet-clean)"
            : isBooked
              ? "var(--sheet-fill)"
              : "transparent";

          return (
            <div key={d} className="flex flex-col items-center gap-1 py-1.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-[15px] tabular-nums"
                style={{
                  background: disc,
                  color: t
                    ? "var(--sheet-on-clean)"
                    : otherMonth
                      ? "var(--sheet-faint)"
                      : "var(--sheet-ink)",
                  fontWeight: t || d === today ? 600 : 400,
                  boxShadow: d === today && !t ? "inset 0 0 0 2px var(--sheet-ink)" : undefined,
                }}
              >
                {dayNum}
              </span>
              {/* A second mark so a same-day is not carried by hue alone. */}
              <span className="flex h-1.5 items-center gap-[3px]">
                {t && (
                  <span
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: t.sameDay ? "var(--sheet-same)" : "var(--sheet-clean)" }}
                  />
                )}
                {t?.sameDay && (
                  <span
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--sheet-same)" }}
                  />
                )}
              </span>
              {t && <span className="sr-only">{t.sameDay ? "Same day turnaround" : "Cleaning"}</span>}
            </div>
          );
        })}
      </div>

      <div
        className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-3 text-[13px]"
        style={{ borderColor: "var(--sheet-line)", color: "var(--sheet-muted)" }}
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full" style={{ background: "var(--sheet-clean)" }} />
          Cleaning day
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full" style={{ background: "var(--sheet-same)" }} />
          One guest out, the next in the same day
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full" style={{ background: "var(--sheet-fill)" }} />
          Guest staying
        </span>
      </div>
    </div>
  );
}

function Stat({ n, label, accent }: { n: number; label: string; accent?: boolean }) {
  return (
    <p className={`m-0 rounded-lg border bg-base px-4 py-3 ${accent ? "border-[color:var(--cp-amber-line)]" : "border-line"}`}>
      <span className="display block text-2xl text-ink">{n}</span>
      <span className="whitespace-nowrap text-xs text-muted">{label}</span>
    </p>
  );
}
