"use client";

import { useMemo, useState } from "react";

/*
  Turnover Sync — the demo (Nov 15 2026).

  A WEB APP for short-term-rental hosts and the people who clean for them.
  The real version runs inside BrightBase in daily production: guest
  calendars from Airbnb and Vrbo feed in, and each checkout becomes a
  cleaning on a cleaner's schedule, with the times and the door code, and
  a text goes out. This demo runs the same idea in the browser with an
  invented host, invented cleaners and sample bookings. Nothing is saved
  and no text is sent; the page says so first.

  Design: sea-glass slate, ink, one teal action colour, and amber reserved
  for the one thing a cleaner must not miss, a same-day turnaround. The
  memorable moment is a booking arriving and the schedule changing.
*/

type Source = "Airbnb" | "Vrbo";
type Booking = { id: string; property: string; source: Source; guest: string; start: number; end: number };
type Cleaner = { id: string; name: string };

const PROPERTIES = [
  { id: "cove", name: "Cove Cottage", code: "4417", window: "11:00 to 3:00" },
  { id: "loft", name: "Harbor Loft", code: "2290", window: "10:00 to 4:00" },
];
const CLEANERS: Cleaner[] = [
  { id: "rosa", name: "Rosa" },
  { id: "dev", name: "Dev" },
];

/* Days are offsets from today, so the demo never shows a stale month. */
const START: Booking[] = [
  { id: "b1", property: "Cove Cottage", source: "Airbnb", guest: "J. Patel", start: 0, end: 3 },
  { id: "b2", property: "Cove Cottage", source: "Vrbo", guest: "The Lins", start: 3, end: 7 },
  { id: "b3", property: "Harbor Loft", source: "Airbnb", guest: "M. Okafor", start: 1, end: 4 },
  { id: "b4", property: "Harbor Loft", source: "Airbnb", guest: "S. Brandt", start: 6, end: 9 },
];
const INCOMING: Booking[] = [
  { id: "n1", property: "Harbor Loft", source: "Vrbo", guest: "R. Dube", start: 4, end: 6 },
  { id: "n2", property: "Cove Cottage", source: "Airbnb", guest: "A. Kim", start: 7, end: 10 },
  { id: "n3", property: "Harbor Loft", source: "Airbnb", guest: "T. Nguyen", start: 9, end: 12 },
];

const DAYS = 13;

/* A stable default cleaner per cleaning, so the text and the schedule agree. */
function defaultCleaner(cleaningId: string): Cleaner {
  const n = [...cleaningId].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return CLEANERS[n % CLEANERS.length];
}

function dayLabel(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function TurnoverSyncDemo() {
  const [bookings, setBookings] = useState<Booking[]>(START);
  const [next, setNext] = useState(0);
  const [assign, setAssign] = useState<Record<string, string>>({});
  const [fresh, setFresh] = useState<string | null>(null);
  const [texts, setTexts] = useState<string[]>([]);

  /* One cleaning per checkout; same-day when the next guest arrives that day. */
  const cleanings = useMemo(() => {
    return bookings
      .map((b) => {
        const nextIn = bookings.find((o) => o.property === b.property && o.start === b.end);
        const prop = PROPERTIES.find((p) => p.name === b.property)!;
        return { id: `c-${b.id}`, day: b.end, property: b.property, sameDay: Boolean(nextIn), prop, from: b };
      })
      .filter((c) => c.day < DAYS)
      .sort((a, b) => a.day - b.day || a.property.localeCompare(b.property));
  }, [bookings]);

  function cleanerFor(id: string) {
    return assign[id] ?? defaultCleaner(id).id;
  }

  function addBooking() {
    const b = INCOMING[next];
    if (!b) return;
    setBookings((all) => [...all, b]);
    setNext((n) => n + 1);
    setFresh(`c-${b.id}`);
    const c = defaultCleaner(`c-${b.id}`);
    setTexts((t) => [
      `To ${c.name}: New cleaning, ${b.property}, ${dayLabel(b.end)}. Door code ${PROPERTIES.find((p) => p.name === b.property)!.code}.`,
      ...t,
    ].slice(0, 4));
  }

  function cancel(id: string) {
    const b = bookings.find((x) => x.id === id);
    setBookings((all) => all.filter((x) => x.id !== id));
    if (b) setTexts((t) => [`To cleaners: ${b.property} on ${dayLabel(b.end)} is cancelled. Guest cancelled.`, ...t].slice(0, 4));
  }

  function reset() {
    setBookings(START);
    setNext(0);
    setAssign({});
    setFresh(null);
    setTexts([]);
  }

  return (
    <div className="min-h-screen bg-[#e9efee] text-[#14262b]">
      <p className="bg-[#14262b] px-5 py-2.5 text-center text-[13px] leading-snug text-[#cfe3df]">
        Demo of Turnover Sync, a web app by M Studio. The host, cleaners and bookings are invented.
        Nothing is saved and no texts are sent.
      </p>

      <header className="border-b border-[#14262b]/10 bg-white/60 px-5 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="m-0 text-[17px] font-semibold">Turnover Sync</p>
            <p className="m-0 text-[13px] text-[#14262b]/60">Shore Stays · 2 properties · 2 cleaners</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addBooking}
              disabled={next >= INCOMING.length}
              className="min-h-10 rounded-lg bg-[#1d7a74] px-4 text-[14px] font-semibold text-white disabled:opacity-40"
            >
              {next >= INCOMING.length ? "No more sample bookings" : "Simulate a new booking"}
            </button>
            <button type="button" onClick={reset} className="min-h-10 rounded-lg border border-[#14262b]/20 bg-white px-4 text-[14px]">
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Left: what the platforms say */}
        <section aria-labelledby="cal-h">
          <h1 id="cal-h" className="m-0 text-[15px] font-semibold">Bookings from Airbnb and Vrbo</h1>
          <p className="m-0 mt-1 text-[13px] text-[#14262b]/60">Read from each listing&apos;s calendar link every few minutes.</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[#14262b]/10 bg-white">
            <div className="min-w-[640px]">
              <div className="grid border-b border-[#14262b]/10 text-[11px] text-[#14262b]/55" style={{ gridTemplateColumns: `120px repeat(${DAYS}, 1fr)` }}>
                <span className="px-3 py-2">Property</span>
                {Array.from({ length: DAYS }, (_, i) => (
                  <span key={i} className="py-2 text-center">{dayLabel(i).split(",")[0].split(" ")[0]}<br />{dayLabel(i).split(" ").slice(-1)}</span>
                ))}
              </div>
              {PROPERTIES.map((p) => (
                <div key={p.id} className="relative grid h-16 items-center border-b border-[#14262b]/5 last:border-0" style={{ gridTemplateColumns: `120px repeat(${DAYS}, 1fr)` }}>
                  <span className="px-3 text-[13px] font-medium">{p.name}</span>
                  {bookings
                    .filter((b) => b.property === p.name)
                    .map((b) => (
                      <span
                        key={b.id}
                        className={`mx-0.5 flex h-9 items-center justify-between gap-1 overflow-hidden rounded-md px-2 text-[11px] font-medium transition-opacity duration-300 ${
                          b.source === "Airbnb" ? "bg-[#ffe3e0] text-[#8a2b22]" : "bg-[#dde7ff] text-[#23408e]"
                        }`}
                        style={{ gridColumn: `${b.start + 2} / ${Math.min(b.end, DAYS) + 2}`, gridRow: 1 }}
                      >
                        <span className="truncate">{b.guest} · {b.source}</span>
                        <button
                          type="button"
                          onClick={() => cancel(b.id)}
                          aria-label={`Cancel ${b.guest}'s booking`}
                          className="shrink-0 rounded px-1 opacity-60 hover:opacity-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                </div>
              ))}
            </div>
          </div>
          <p className="m-0 mt-2 text-[12px] text-[#14262b]/55">
            Press × to cancel a booking and watch the cleaning come off the schedule.
          </p>

          <h2 className="m-0 mt-6 text-[15px] font-semibold">Texts sent</h2>
          <ul className="m-0 mt-2 list-none space-y-2 p-0" aria-live="polite">
            {texts.length === 0 && (
              <li className="rounded-lg border border-dashed border-[#14262b]/20 px-3 py-3 text-[13px] text-[#14262b]/55">
                Simulate a booking to see the text a cleaner gets.
              </li>
            )}
            {texts.map((t, i) => (
              <li key={t + i} className="rounded-lg bg-[#14262b] px-3 py-2.5 text-[13px] leading-snug text-[#e9efee]">{t}</li>
            ))}
          </ul>
        </section>

        {/* Right: what the cleaners see */}
        <section aria-labelledby="sched-h">
          <h2 id="sched-h" className="m-0 text-[15px] font-semibold">Cleaning schedule</h2>
          <p className="m-0 mt-1 text-[13px] text-[#14262b]/60">Built from the checkouts. Same-day turns are flagged.</p>
          <ol className="m-0 mt-4 list-none space-y-2.5 p-0">
            {cleanings.map((c) => (
              <li
                key={c.id}
                className={`rounded-xl border bg-white p-3.5 transition-colors duration-500 ${
                  fresh === c.id ? "border-[#1d7a74] shadow-[0_0_0_3px_rgba(29,122,116,0.18)]" : "border-[#14262b]/10"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="m-0 text-[14px] font-semibold">{dayLabel(c.day)}</p>
                  {c.sameDay ? (
                    <span className="rounded-md bg-[#fbe8c2] px-2 py-0.5 text-[11.5px] font-semibold text-[#7a4f00]">Same-day turn</span>
                  ) : (
                    <span className="text-[11.5px] text-[#14262b]/50">Next guest later</span>
                  )}
                </div>
                <p className="m-0 mt-1 text-[13.5px]">{c.property}</p>
                <p className="m-0 mt-0.5 text-[12.5px] text-[#14262b]/60">
                  Window {c.prop.window} · Door code {c.prop.code} · after {c.from.guest}
                </p>
                <label className="mt-2.5 flex items-center gap-2 text-[12.5px] text-[#14262b]/70">
                  Cleaner
                  <select
                    value={cleanerFor(c.id)}
                    onChange={(e) => setAssign((a) => ({ ...a, [c.id]: e.target.value }))}
                    className="min-h-8 rounded-md border border-[#14262b]/20 bg-white px-2 text-[13px]"
                  >
                    {CLEANERS.map((cl) => (
                      <option key={cl.id} value={cl.id}>{cl.name}</option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-[#14262b]/10 px-5 py-6 text-center text-[13px] text-[#14262b]/60">
        Turnover Sync is a web app. It connects to your Airbnb and Vrbo calendars and texts your cleaners.{" "}
        <a href="/catalog?c=rentals" className="font-semibold text-[#1d7a74]">Back to the catalog</a>
      </footer>
    </div>
  );
}
