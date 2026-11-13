/*
  Demo booking app: Blue Hour Bodywork, a fictional studio.

  WHY A BOOKING APP, specifically.

  /demo/shop shows a storefront. This shows the thing small businesses
  actually ask for most, and the thing a cheap booking page gets wrong: real
  availability. Two practitioners, services of different lengths, a cleanup
  gap between appointments, and appointments already on the books. A slot is
  offered only when the whole treatment plus its cleanup actually fits.

  That is why the logic in this file is pure and separate from the screen.
  Double-booking is the failure that costs a studio money and trust, so it is
  worth being able to test the rule rather than click around and hope.

  There is no photography here and none is wanted: the interface IS the
  product being demonstrated.

  RULES FOR EDITING THIS FILE

    · The brand is fictional and must stay obviously so. No address, no
      phone number, no email that resolves, no reviews, no counts of clients
      served, no "as seen in".
    · Prices and durations are product data in a demo, not a claim about
      what Meg charges.
    · Money is integer cents. Times are integer minutes from midnight. No
      floats anywhere near either.
    · If a real practitioner's name or likeness is ever added, the note above
      stops being true.
*/

export type Service = {
  id: string;
  name: string;
  /** Treatment length. The cleanup gap is added separately, see GAP_MINUTES. */
  minutes: number;
  priceCents: number;
  blurb: string;
};

export type Practitioner = {
  id: string;
  name: string;
  title: string;
  /**
   * Short label for the chip. Stored rather than sliced out of `title`,
   * because slicing gave both of these people the word "Massage" and made
   * two different practitioners look identical.
   */
  short: string;
  /** Services this person offers. A service with no practitioner is unbookable. */
  offers: string[];
  /** Working hours per weekday (0 = Sunday). A missing day is a day off. */
  hours: Partial<Record<number, { open: number; close: number }>>;
  /** Initials, drawn instead of a photograph. */
  mark: string;
};

/** An appointment already on the books, or one made in this session. */
export type Appointment = {
  practitionerId: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Minutes from midnight. */
  start: number;
  /** Treatment length, without the cleanup gap. */
  minutes: number;
};

/*
  The cleanup gap between two appointments for the same practitioner. This is
  the detail that makes the difference between a calendar and a booking
  system: a room has to be turned over, and a studio that books back-to-back
  runs late all day.
*/
export const GAP_MINUTES = 15;

/** Slots are offered on the half hour. */
export const SLOT_STEP = 30;

export const SERVICES: Service[] = [
  {
    id: "signature",
    name: "Signature massage",
    minutes: 60,
    priceCents: 11000,
    blurb: "A full hour, pressure to your preference. The one most people book first.",
  },
  {
    id: "deep",
    name: "Deep tissue",
    minutes: 90,
    priceCents: 16500,
    blurb: "Ninety minutes for the shoulders and lower back that have had enough.",
  },
  {
    id: "quick",
    name: "Neck, back and shoulders",
    minutes: 30,
    priceCents: 6500,
    blurb: "A short, focused session. Fits in a lunch break.",
  },
  {
    id: "stretch",
    name: "Assisted stretch",
    minutes: 45,
    priceCents: 9000,
    blurb: "Table-based stretching for range of motion. No oil, stay clothed.",
  },
];

export const PRACTITIONERS: Practitioner[] = [
  {
    id: "rk",
    name: "R. Keene",
    title: "Massage therapist",
    short: "Massage",
    mark: "RK",
    offers: ["signature", "deep", "quick"],
    // Monday to Thursday, 9 to 5. Long days, no weekend.
    hours: { 1: { open: 540, close: 1020 }, 2: { open: 540, close: 1020 }, 3: { open: 540, close: 1020 }, 4: { open: 540, close: 1020 } },
  },
  {
    id: "mv",
    name: "M. Vance",
    title: "Massage and stretch therapist",
    short: "Massage & stretch",
    mark: "MV",
    offers: ["signature", "quick", "stretch"],
    // Later starts, and the only one working Friday and Saturday.
    hours: { 2: { open: 660, close: 1140 }, 4: { open: 660, close: 1140 }, 5: { open: 600, close: 1080 }, 6: { open: 540, close: 900 } },
  },
];

/*
  Appointments already on the books.

  Derived from the date rather than randomised, for two reasons: a random
  calendar would differ between the server render and the browser's, which
  React reports as a hydration error, and a demo whose availability changes
  on every refresh looks broken rather than busy.

  The arithmetic is deliberately dull. What matters is that some of the day
  is already taken, so the slot list has to actually work something out.
*/
export function bookedOn(date: string): Appointment[] {
  const seed = [...date].reduce((n, c) => n + c.charCodeAt(0), 0);
  const day = dayOfWeek(date);
  const out: Appointment[] = [];

  for (const p of PRACTITIONERS) {
    const hours = p.hours[day];
    if (!hours) continue;

    /* Two or three appointments, placed on the half hour within the shift. */
    const count = 2 + ((seed + p.id.charCodeAt(0)) % 2);
    for (let i = 0; i < count; i++) {
      const span = hours.close - hours.open;
      const offset = ((seed * (i + 3) + p.id.charCodeAt(1) * 7) % Math.max(1, span - 90));
      const start = hours.open + Math.round(offset / SLOT_STEP) * SLOT_STEP;
      const minutes = [30, 60, 90][(seed + i) % 3];
      if (start + minutes <= hours.close) out.push({ practitionerId: p.id, date, start, minutes });
    }
  }
  return out;
}

/** 0 = Sunday. Parsed from the parts, never through a local Date string. */
export function dayOfWeek(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** "9:00 AM". Written out rather than localised, so it cannot drift by runtime. */
export function clock(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

export const money = (cents: number) =>
  `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;

/** "Tue, Nov 18". Built from parts for the same reason as clock(). */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function dateLabel(date: string): { weekday: string; day: string; month: string } {
  const [, m, d] = date.split("-").map(Number);
  return { weekday: WEEKDAYS[dayOfWeek(date)], day: String(d), month: MONTHS[m - 1] };
}

/**
 * The next `count` dates after `fromISO`, as YYYY-MM-DD.
 *
 * Starts at tomorrow on purpose. Offering slots earlier today would mean
 * reasoning about the current time, which is a real feature of a real
 * booking system and a source of flaky tests in a demo of one.
 */
export function upcomingDates(fromISO: string, count: number): string[] {
  const [y, m, d] = fromISO.split("-").map(Number);
  const out: string[] = [];
  for (let i = 1; i <= count; i++) {
    const t = new Date(Date.UTC(y, m - 1, d + i));
    out.push(
      `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`,
    );
  }
  return out;
}

/** Does [aStart, aEnd) overlap [bStart, bEnd)? Half-open, so touching is fine. */
function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Can this practitioner take this service at this time?
 *
 * **This is the whole feature, and the reason it is one function.** A slot
 * is free only when all four hold:
 *
 *   1. they work that weekday at all;
 *   2. the treatment finishes before they close;
 *   3. it does not overlap an appointment they already have;
 *   4. there is a GAP_MINUTES cleanup either side of it.
 *
 * Rule 4 is the one a hand-rolled booking page forgets. Without it a 60
 * minute massage can be booked to start the minute the last one ended, and
 * the studio runs late for the rest of the day.
 */
export function isFree(
  practitioner: Practitioner,
  service: Service,
  date: string,
  start: number,
  booked: Appointment[],
): boolean {
  const hours = practitioner.hours[dayOfWeek(date)];
  if (!hours) return false;
  if (start < hours.open) return false;
  if (start + service.minutes > hours.close) return false;

  return !booked.some((a) => {
    if (a.practitionerId !== practitioner.id || a.date !== date) return false;
    /* The existing appointment, widened by the cleanup gap on both sides. */
    return overlaps(start, start + service.minutes, a.start - GAP_MINUTES, a.start + a.minutes + GAP_MINUTES);
  });
}

export type Slot = { start: number; practitionerIds: string[] };

/**
 * Every slot on this date where somebody can take this service.
 *
 * Returns who is free rather than just that somebody is, because the screen
 * offers the choice and because "any practitioner" has to resolve to a real
 * person at the moment of booking.
 */
export function slotsFor(
  service: Service,
  date: string,
  booked: Appointment[],
  onlyPractitionerId?: string,
): Slot[] {
  const eligible = PRACTITIONERS.filter(
    (p) => p.offers.includes(service.id) && (!onlyPractitionerId || p.id === onlyPractitionerId),
  );
  if (eligible.length === 0) return [];

  const day = dayOfWeek(date);
  const opens = eligible.map((p) => p.hours[day]).filter(Boolean) as { open: number; close: number }[];
  if (opens.length === 0) return [];

  const first = Math.min(...opens.map((h) => h.open));
  const last = Math.max(...opens.map((h) => h.close));

  const out: Slot[] = [];
  for (let start = first; start + service.minutes <= last; start += SLOT_STEP) {
    const free = eligible.filter((p) => isFree(p, service, date, start, booked));
    if (free.length > 0) out.push({ start, practitionerIds: free.map((p) => p.id) });
  }
  return out;
}

export const studio = {
  name: "Blue Hour Bodywork",
  tagline: "Massage and stretch therapy, by appointment.",
  /*
    Shown in the demo banner. Blunt on purpose: nobody should be one glance
    from thinking this is a real studio taking real appointments.
  */
  demoNote:
    "A demo booking app built by M Studio. Blue Hour Bodywork is not a real business, the practitioners are invented, and nothing here books a real appointment or takes payment.",
};
