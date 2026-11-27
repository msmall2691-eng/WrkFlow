/*
  A small iCalendar reader, for the turnover planner.

  Short-term-rental platforms all publish the same thing: a .ics feed where
  each booking is a VEVENT with a check-in date and a check-out date. That is
  all this needs, so this parses that and nothing else rather than pulling in
  a general iCalendar library for four fields.

  What it deliberately does not do: timezones, recurrence, alarms, attendees.
  Bookings are whole days (VALUE=DATE), recurrence is meaningless for them,
  and the rest never appears in these feeds.
*/

import { MAX_SUMMARY_LEN } from "@/lib/toolLead";

export type Booking = {
  /** Check-in, as YYYY-MM-DD. */
  start: string;
  /** Check-out, as YYYY-MM-DD. In iCal this is exclusive: the guest is gone. */
  end: string;
  /** Whatever the platform called it: "Reserved", a guest name, a code. */
  summary: string;
  /**
   * Whether anybody actually stayed.
   *
   * These feeds are not a list of reservations, they are a list of nights the
   * property is unavailable, and an owner's own blocked dates are in there
   * alongside real bookings: Airbnb exports "Airbnb (Not available)" for a
   * manual block, Vrbo "Blocked", Booking.com "CLOSED - Not available".
   * Treating those as stays invents a cleaning on the day a block ends, and a
   * preparation block beginning on a checkout day fakes a same-day
   * turnaround. Both are wrong in the direction that costs someone money.
   */
  kind: "stay" | "block";
};

/*
  Which summaries mean "nobody is coming".

  A guess at wording, which is all the feeds give: there is no field that says
  reservation or block, so the summary is the signal every tool in this space
  uses. It will not be perfect across every platform, so the count of what was
  skipped is surfaced rather than hidden, and anything unrecognised is treated
  as a stay: a cleaning that should not be there is easier to spot and delete
  than one that is silently missing.
*/
const BLOCK_WORDS = /\b(not available|unavailable|blocked?|closed|owner|maintenance|prep(?:aration)?)\b/i;

function classify(summary: string): "stay" | "block" {
  return BLOCK_WORDS.test(summary) ? "block" : "stay";
}

/*
  Unfold first. RFC 5545 wraps long lines by starting the continuation with a
  space or tab, so a URL or a summary can arrive split across three lines.
  Joining them back is the one piece of the spec that cannot be skipped: miss
  it and a wrapped DTSTART silently fails to match.
*/
function unfold(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.split(/\r\n|\n|\r/)) {
    if ((raw.startsWith(" ") || raw.startsWith("\t")) && out.length > 0) {
      out[out.length - 1] += raw.slice(1);
    } else {
      out.push(raw);
    }
  }
  return out;
}

/*
  A date out of a DTSTART/DTEND value.

  Two shapes appear: `20260415` for a whole-day booking, and
  `20260415T110000Z` where a platform records a time. Only the day matters for
  a turnover, so both reduce to YYYY-MM-DD.
*/
function toDate(value: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const iso = `${y}-${mo}-${d}`;
  /* Reject a date the calendar does not have, e.g. 20260230. */
  const probe = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(probe.getTime())) return null;
  if (probe.toISOString().slice(0, 10) !== iso) return null;
  return iso;
}

/** Strips the parameters off a property name: `DTEND;VALUE=DATE` → `DTEND`. */
function propName(line: string): string {
  const colon = line.indexOf(":");
  if (colon === -1) return "";
  return line.slice(0, colon).split(";")[0].toUpperCase();
}

function propValue(line: string): string {
  const colon = line.indexOf(":");
  return colon === -1 ? "" : line.slice(colon + 1);
}

/**
 * Reads the bookings out of an iCalendar feed, earliest first.
 *
 * Anything it cannot make sense of is skipped rather than thrown: a feed with
 * one malformed event should still produce a schedule from the rest.
 */
export function parseBookings(ics: string): Booking[] {
  const lines = unfold(ics);
  const bookings: Booking[] = [];

  let inEvent = false;
  let start: string | null = null;
  let end: string | null = null;
  let summary = "";

  for (const line of lines) {
    const name = propName(line);

    if (name === "BEGIN" && propValue(line).trim().toUpperCase() === "VEVENT") {
      inEvent = true;
      start = end = null;
      summary = "";
      continue;
    }
    if (!inEvent) continue;

    if (name === "END" && propValue(line).trim().toUpperCase() === "VEVENT") {
      if (start && end && end > start) {
        const text = summary || "Booked";
        bookings.push({ start, end, summary: text, kind: classify(text) });
      }
      inEvent = false;
      continue;
    }

    if (name === "DTSTART") start = toDate(propValue(line));
    else if (name === "DTEND") end = toDate(propValue(line));
    else if (name === "SUMMARY") summary = propValue(line).replace(/\\,/g, ",").trim();
  }

  return bookings.sort((a, b) => a.start.localeCompare(b.start));
}

export type Turnover = {
  /** The day the cleaning has to happen: the guest checks out that morning. */
  date: string;
  /** The booking that just ended. */
  out: Booking;
  /** The booking that starts the same day, when there is one. */
  in?: Booking;
  /**
   * True when someone checks in the same day someone checks out. These are
   * the ones that go wrong: the window is hours, not days, and missing one
   * means a guest walks into an unclean property.
   */
  sameDay: boolean;
};

/**
 * Turns bookings into the cleanings they imply.
 *
 * One per check-out. A check-in on the same date makes it a same-day
 * turnaround, which is the thing worth flagging.
 */
export function planTurnovers(bookings: Booking[]): Turnover[] {
  /* Blocks are not stays: they imply no cleaning, and they must not make a
     checkout look like a same-day turnaround either. */
  const stays = bookings.filter((b) => b.kind === "stay");

  const startsOn = new Map<string, Booking>();
  for (const b of stays) if (!startsOn.has(b.start)) startsOn.set(b.start, b);

  return stays
    .map((b) => {
      const next = startsOn.get(b.end);
      return { date: b.end, out: b, in: next, sameDay: Boolean(next) };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * One cleaning date, as a person reads it. "Thu, Jan 1".
 *
 * Here rather than in the component because the on-screen list and the
 * emailed one are the same dates, and two spellings of a date is the kind
 * of difference a visitor notices and cannot explain.
 *
 * Formatted in UTC from a midday instant: these are calendar days out of
 * an .ics, not moments, so a visitor west of UTC must not read Jan 1 as
 * Dec 31.
 */
export const formatTurnoverDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/**
 * The cleaning schedule as the body of an email, fitted to what
 * /api/tool-lead accepts.
 *
 * **It has to fit, because the endpoint refuses rather than truncates.**
 * A summary over `MAX_SUMMARY_LEN` is a 422 before the lead is stored or
 * anything is sent, so an over-long body is not a long email, it is no
 * email. The first cut listed every cleaning: at 120 of them that is 4,251
 * characters against a 4,000 cap, and 120 is a year of three-day stays on
 * one property, well inside what /api/turnover will happily parse. The
 * busiest calendars, which is to say the visitors with the most reason to
 * want this, were the only ones it failed for.
 *
 * So the list is taken while it fits and the rest is named rather than
 * dropped, which is the same thing the panel on screen already does with
 * its own first eight ("and 14 more in the download"). Nothing is lost:
 * the attached .ics carries every cleaning either way, and the last line
 * says so.
 *
 * The budget defaults to the endpoint's own constant so there is one
 * author of the number. It is a parameter at all only so a test can prove
 * the fitting works without a 4,000-character fixture.
 */
export function turnoverEmailSummary(
  turnovers: readonly Turnover[],
  bookings: number,
  budget: number = MAX_SUMMARY_LEN,
): string {
  const head = `${turnovers.length} cleaning${turnovers.length === 1 ? "" : "s"} from ${bookings} booking${bookings === 1 ? "" : "s"}.`;
  const tail = "The attached .ics opens in Google or Apple Calendar.";
  const line = (t: Turnover) =>
    `${formatTurnoverDate(t.date)}${t.sameDay ? "  (same-day turnaround)" : ""}`;

  const assemble = (shown: readonly Turnover[], hidden: number) =>
    [
      head,
      "",
      ...shown.map(line),
      ...(hidden > 0 ? [`and ${hidden} more, all in the attached .ics.`] : []),
      "",
      tail,
    ].join("\n");

  const whole = assemble(turnovers, 0);
  if (whole.length <= budget) return whole;

  /*
     Drop from the end until it fits, measuring the assembled text rather
     than guessing a per-line cost: the "and N more" line changes length as
     N grows, and a date is 10 to 12 characters before the same-day suffix,
     so an arithmetic estimate is wrong in both directions. At most one
     pass per cleaning, over a list bounded by the .ics size the API
     accepts.
  */
  let shown = turnovers.length;
  while (shown > 0 && assemble(turnovers.slice(0, shown), turnovers.length - shown).length > budget) {
    shown -= 1;
  }
  return assemble(turnovers.slice(0, shown), turnovers.length - shown);
}
