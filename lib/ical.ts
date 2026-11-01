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

export type Booking = {
  /** Check-in, as YYYY-MM-DD. */
  start: string;
  /** Check-out, as YYYY-MM-DD. In iCal this is exclusive: the guest is gone. */
  end: string;
  /** Whatever the platform called it: "Reserved", a guest name, a code. */
  summary: string;
};

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
        bookings.push({ start, end, summary: summary || "Booked" });
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
  const startsOn = new Map<string, Booking>();
  for (const b of bookings) if (!startsOn.has(b.start)) startsOn.set(b.start, b);

  return bookings
    .map((b) => {
      const next = startsOn.get(b.end);
      return { date: b.end, out: b, in: next, sameDay: Boolean(next) };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
