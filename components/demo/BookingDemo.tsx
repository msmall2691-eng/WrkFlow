"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  SERVICES,
  PRACTITIONERS,
  GAP_MINUTES,
  bookedOn,
  clock,
  dateLabel,
  money,
  slotsFor,
  studio,
  type Appointment,
  type Service,
} from "@/lib/demo-booking";

/*
  The booking screen for /demo/studio.

  It wears its own palette and no studio chrome, for the reason /demo/shop
  does: a prospective client is trying to picture their own site, not this
  one. Cool and quiet here against the shop's warm cream, so the two demos
  cannot be mistaken for one template with the colours swapped.

  All of the availability thinking lives in lib/demo-booking.ts. This file
  renders what that returns and adds the appointment the visitor makes to the
  list the next query reads, which is what makes the slot visibly disappear.
  That disappearance is the demonstration: it is the same rule running, not a
  screen pretending.
*/

type Filter = "any" | string;

export default function BookingDemo({ dates }: { dates: string[] }) {
  const [service, setService] = useState<Service>(SERVICES[0]);
  const [filter, setFilter] = useState<Filter>("any");
  const [date, setDate] = useState<string>(dates[0]);
  const [chosen, setChosen] = useState<number | null>(null);
  /* Appointments made in this session, which join the ones already on the books. */
  const [mine, setMine] = useState<Appointment[]>([]);
  /*
    `stillOpen` is recorded when the booking is made, not re-derived later.
    With "anyone available" selected, holding a time with one practitioner
    leaves it genuinely bookable with the other, and the panel below has to
    say which of those happened. Working it out at render time would read
    the filters as they are *then*, which the visitor may have changed.
  */
  const [confirmed, setConfirmed] = useState<
    (Appointment & { serviceId: string; stillOpen: boolean; stillWith: string | null }) | null
  >(null);

  const booked = useMemo(
    () => [...bookedOn(date), ...mine.filter((a) => a.date === date)],
    [date, mine],
  );

  const slots = useMemo(
    () => slotsFor(service, date, booked, filter === "any" ? undefined : filter),
    [service, date, booked, filter],
  );

  /* Who can actually do the chosen service, for the practitioner row. */
  const able = PRACTITIONERS.filter((p) => p.offers.includes(service.id));

  function pickService(s: Service) {
    setService(s);
    setChosen(null);
    /* A practitioner who does not offer the new service cannot stay selected. */
    if (filter !== "any" && !PRACTITIONERS.find((p) => p.id === filter)?.offers.includes(s.id))
      setFilter("any");
  }

  function confirm() {
    if (chosen === null) return;
    const slot = slots.find((s) => s.start === chosen);
    if (!slot) return;
    /* "Anyone" has to resolve to a real person at the moment of booking. */
    const practitionerId = filter === "any" ? slot.practitionerIds[0] : filter;
    const appt: Appointment = { practitionerId, date, start: chosen, minutes: service.minutes };

    /* Ask the same function the grid asks, with this booking included. */
    const after = slotsFor(service, date, [...booked, appt], filter === "any" ? undefined : filter);
    const stillThere = after.find((s) => s.start === chosen);
    const stillWith = stillThere
      ? (PRACTITIONERS.find((p) => p.id === stillThere.practitionerIds[0])?.name ?? null)
      : null;

    setMine((m) => [...m, appt]);
    setConfirmed({ ...appt, serviceId: service.id, stillOpen: !!stillThere, stillWith });
    setChosen(null);
  }

  const chosenSlot = chosen === null ? null : slots.find((s) => s.start === chosen);

  return (
    <div className="min-h-screen bg-[#f3f6f5] text-[#1f2a2e]">
      {/* First in the DOM, so a screen reader meets it before the booking form. */}
      <p className="bg-[#1f2a2e] px-5 py-2.5 text-center text-[13px] leading-snug text-[#cfe0dc]">
        {studio.demoNote}
      </p>

      <header className="border-b border-[#1f2a2e]/10 px-5 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DuskMark />
            <div>
              <p className="font-serif text-[1.3rem] leading-none">{studio.name}</p>
              <p className="mt-1 text-[13px] text-[#1f2a2e]/60">{studio.tagline}</p>
            </div>
          </div>
          <p className="hidden text-[13px] text-[#1f2a2e]/50 sm:block">By appointment</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="font-serif text-[1.75rem] leading-tight">Book a session</h1>
        <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-[#1f2a2e]/70">
          Pick a treatment and a day. Only times that genuinely fit are offered, including
          the {GAP_MINUTES} minutes between appointments.
        </p>

        {/* 1. Service */}
        <Step n={1} label="Treatment" />
        <div className="grid gap-2.5 sm:grid-cols-2">
          {SERVICES.map((s) => {
            const on = s.id === service.id;
            return (
              <button
                key={s.id}
                onClick={() => pickService(s)}
                aria-pressed={on}
                data-testid={`service-${s.id}`}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  on
                    ? "border-[#2f6b63] bg-white shadow-sm"
                    : "border-[#1f2a2e]/12 bg-white/60 hover:border-[#1f2a2e]/25"
                }`}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{s.name}</span>
                  <span className="shrink-0 text-[13px] tabular-nums text-[#1f2a2e]/70">
                    {s.minutes} min · {money(s.priceCents)}
                  </span>
                </span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-[#1f2a2e]/60">
                  {s.blurb}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Practitioner. Listed because availability differs per person. */}
        <Step n={2} label="With" />
        <div className="flex flex-wrap gap-2">
          <Chip on={filter === "any"} onClick={() => { setFilter("any"); setChosen(null); }} testid="who-any">
            Anyone available
          </Chip>
          {able.map((p) => (
            <Chip
              key={p.id}
              on={filter === p.id}
              onClick={() => { setFilter(p.id); setChosen(null); }}
              testid={`who-${p.id}`}
            >
              {p.name}
              <span className="ml-1.5 text-[#1f2a2e]/45">{p.short}</span>
            </Chip>
          ))}
        </div>
        {able.length < PRACTITIONERS.length && (
          <p className="mt-2 text-[13px] text-[#1f2a2e]/55">
            {PRACTITIONERS.filter((p) => !p.offers.includes(service.id))
              .map((p) => p.name)
              .join(" and ")}{" "}
            does not offer this treatment, so it is not an option here.
          </p>
        )}

        {/* 3. Day */}
        <Step n={3} label="Day" />
        <div className="-mx-5 overflow-x-auto px-5 pb-1">
          <div className="flex gap-2" data-testid="date-strip">
            {dates.map((d) => {
              const on = d === date;
              const { weekday, day, month } = dateLabel(d);
              const anyFree = slotsFor(service, d, bookedOn(d), filter === "any" ? undefined : filter).length > 0;
              return (
                <button
                  key={d}
                  onClick={() => { setDate(d); setChosen(null); }}
                  aria-pressed={on}
                  data-testid={`date-${d}`}
                  className={`w-[4.25rem] shrink-0 rounded-xl border px-2 py-2.5 text-center transition-colors ${
                    on ? "border-[#2f6b63] bg-[#2f6b63] text-white" : "border-[#1f2a2e]/12 bg-white/60 hover:border-[#1f2a2e]/25"
                  }`}
                >
                  <span className="block text-[12px] uppercase tracking-wide opacity-70">{weekday}</span>
                  <span className="block font-serif text-[1.15rem] leading-tight tabular-nums">{day}</span>
                  <span className={`block text-[11px] ${anyFree ? "opacity-60" : "opacity-40"}`}>
                    {anyFree ? month : "closed"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Time */}
        <Step n={4} label="Time" />
        {slots.length === 0 ? (
          <p
            data-testid="no-slots"
            className="rounded-xl border border-dashed border-[#1f2a2e]/20 bg-white/50 p-5 text-[14px] text-[#1f2a2e]/65"
          >
            Nothing open for a {service.minutes} minute {service.name.toLowerCase()} that day
            {filter === "any" ? "" : ` with ${PRACTITIONERS.find((p) => p.id === filter)?.name}`}. Try
            another day, or a shorter treatment.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2" data-testid="slots">
            {slots.map((s) => {
              const on = s.start === chosen;
              return (
                <button
                  key={s.start}
                  onClick={() => setChosen(s.start)}
                  aria-pressed={on}
                  data-slot={s.start}
                  className={`min-w-[5.5rem] rounded-lg border px-3 py-2.5 text-[14px] tabular-nums transition-colors ${
                    on
                      ? "border-[#2f6b63] bg-[#2f6b63] text-white"
                      : "border-[#1f2a2e]/15 bg-white hover:border-[#2f6b63]/60"
                  }`}
                >
                  {clock(s.start)}
                </button>
              );
            })}
          </div>
        )}

        {/* 5. Confirm. No payment field anywhere, and it says so. */}
        {chosenSlot && (
          <div className="mt-6 rounded-xl border border-[#2f6b63]/30 bg-white p-5" data-testid="confirm-panel">
            <p className="text-[14px] leading-relaxed">
              <span className="font-medium">{service.name}</span> on{" "}
              {dateLabel(date).weekday} {dateLabel(date).month} {dateLabel(date).day} at{" "}
              <span className="tabular-nums">{clock(chosenSlot.start)}</span>, finishing{" "}
              <span className="tabular-nums">{clock(chosenSlot.start + service.minutes)}</span>.
            </p>
            <p className="mt-1 text-[13px] text-[#1f2a2e]/60">
              {filter === "any"
                ? `With ${PRACTITIONERS.find((p) => p.id === chosenSlot.practitionerIds[0])?.name}, who is free then.`
                : `With ${PRACTITIONERS.find((p) => p.id === filter)?.name}.`}{" "}
              {money(service.priceCents)}, paid at the studio.
            </p>
            <button
              onClick={confirm}
              data-testid="confirm-booking"
              className="mt-4 rounded-lg bg-[#1f2a2e] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#2f6b63]"
            >
              Hold this time
            </button>
            <p className="mt-2 text-[12px] text-[#1f2a2e]/50">
              A demo. Nothing is booked, nobody is emailed, and no payment is taken.
            </p>
          </div>
        )}

        {confirmed && (
          <div className="mt-6 rounded-xl bg-[#1f2a2e] p-5 text-[#dfeae7]" data-testid="booked-panel">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8fc4ba]">
              That time is now held
            </p>
            <p className="mt-2 text-[15px] leading-relaxed">
              {SERVICES.find((s) => s.id === confirmed.serviceId)?.name} with{" "}
              {PRACTITIONERS.find((p) => p.id === confirmed.practitionerId)?.name},{" "}
              {dateLabel(confirmed.date).weekday} {dateLabel(confirmed.date).month}{" "}
              {dateLabel(confirmed.date).day} at{" "}
              <span className="tabular-nums">{clock(confirmed.start)}</span>.
            </p>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#dfeae7]/70">
              {confirmed.stillOpen ? (
                <>
                  Look at the times above.{" "}
                  {PRACTITIONERS.find((p) => p.id === confirmed.practitionerId)?.name} is booked, so
                  their nearby times are gone, but that hour is still there because{" "}
                  {confirmed.stillWith} is free then too. Availability is tracked per person, not
                  per clock.
                </>
              ) : (
                <>
                  Look at the times above: that slot is gone, and so are the ones too close to it to
                  leave {GAP_MINUTES} minutes for the room. That is the same rule running, not a
                  screen pretending.
                </>
              )}
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-[#1f2a2e]/10 px-5 py-10 text-center text-[13px] text-[#1f2a2e]/55">
        <p>{studio.demoNote}</p>
        <p className="mt-2">
          Built by{" "}
          <Link href="/" className="underline decoration-[#2f6b63]/40 underline-offset-2 hover:text-[#2f6b63]">
            M Studio
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

function Step({ n, label }: { n: number; label: string }) {
  return (
    <h2 className="mb-2.5 mt-7 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-[#1f2a2e]/55">
      <span className="font-mono tabular-nums text-[#2f6b63]">{String(n).padStart(2, "0")}</span>
      {label}
    </h2>
  );
}

function Chip({
  on,
  onClick,
  children,
  testid,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  testid: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      data-testid={testid}
      className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${
        on ? "border-[#2f6b63] bg-[#2f6b63] text-white" : "border-[#1f2a2e]/15 bg-white hover:border-[#1f2a2e]/30"
      }`}
    >
      {children}
    </button>
  );
}

/*
  The wordmark. Drawn rather than photographed, like everything else here:
  dusk over water, which is what "blue hour" is.
*/
function DuskMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" role="img" aria-label="">
      <defs>
        <linearGradient id="bh-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b4a63" />
          <stop offset="100%" stopColor="#7fa6a0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#bh-dusk)" />
      <circle cx="20" cy="18" r="5.5" fill="#f2e3c8" opacity="0.9" />
      <path d="M0 26h40v14H0z" fill="#1f2a2e" opacity="0.55" />
      <path d="M6 29h28M9 32.5h22M13 36h14" stroke="#f2e3c8" strokeOpacity="0.28" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
