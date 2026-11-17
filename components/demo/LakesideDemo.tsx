"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LakeFog from "./LakeFog";

/*
  Lakeside: a cinematic website demo (Nov 16 2026).

  Meg wants to sell the kind of moving, "live" sites she found on
  AnimatedWebs, and picked fog over a lake as the first demo, for her
  rental and home-service buyers. Built from scratch: the scene is one
  shader (LakeFog.tsx), with no video, stock footage or photographs.

  The interaction is the pitch. Scrolling the opening lifts the fog and
  brings the morning up; the headline changes with it. Below that, the
  site has to still work as a rental site: three cottages and a date
  picker that does what a real one would, except book.

  Mistwood Cove is invented and the page says so before anything else, as
  every demo here does (CLAUDE.md: no invented proof). The cottages are line
  drawings rather than photos, for the same reason, and the nightly rates
  are labeled sample.
*/

const COTTAGES = [
  { name: "The Boathouse", sleeps: 2, note: "Right on the water, with its own dock.", rate: 210, roof: "flat" },
  { name: "Loon Cottage", sleeps: 4, note: "Two bedrooms and a screened porch.", rate: 265, roof: "gable" },
  { name: "The Point", sleeps: 6, note: "The big one, at the end of the cove.", rate: 340, roof: "double" },
] as const;

function Cottage({ roof }: { roof: (typeof COTTAGES)[number]["roof"] }) {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="#2b3a40" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M0 118 C 50 112, 90 122, 140 116 S 220 112, 240 118" />
        <path d="M10 130 C 60 126, 110 134, 160 128 S 220 126, 240 130" opacity=".45" />
        {roof === "flat" && (
          <>
            <rect x="70" y="70" width="90" height="44" />
            <path d="M62 70 H168" />
            <path d="M160 104 H220 M180 104 V118 M205 104 V118" />
            <rect x="90" y="84" width="16" height="16" />
            <rect x="120" y="84" width="22" height="30" />
          </>
        )}
        {roof === "gable" && (
          <>
            <path d="M68 114 V72 L115 38 L162 72 V114 Z" />
            <rect x="82" y="80" width="18" height="16" />
            <rect x="128" y="80" width="18" height="16" />
            <rect x="106" y="90" width="18" height="24" />
            <path d="M140 52 V36 H150 V60" />
          </>
        )}
        {roof === "double" && (
          <>
            <path d="M40 114 V76 L82 46 L124 76 V114 Z" />
            <path d="M124 114 V84 L166 56 L208 84 V114" />
            <rect x="56" y="84" width="16" height="16" />
            <rect x="92" y="84" width="16" height="16" />
            <rect x="140" y="90" width="16" height="16" />
            <rect x="174" y="90" width="18" height="24" />
          </>
        )}
        <path d="M14 116 L24 86 L34 116 M20 100 H28" opacity=".7" />
        <path d="M216 116 L226 80 L236 116 M221 98 H231" opacity=".7" />
      </g>
    </svg>
  );
}

// A sample month: some nights already taken, so the picker has something to avoid.
const MONTH = { label: "June", days: 30, firstDow: 1 };
const BOOKED = new Set([5, 6, 7, 12, 13, 19, 20, 21, 26, 27]);

export default function LakesideDemo() {
  const lift = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0); // 0 fog, 1 clear (drives the headline)
  const [cottage, setCottage] = useState(1);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const span = el.offsetHeight - window.innerHeight;
        const p = span > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span)) : 0;
        lift.current = p;
        setPhase(p > 0.5 ? 1 : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const nights = from && to ? to - from : 0;
  const clash = useMemo(() => {
    if (!from || !to) return false;
    for (let d = from; d < to; d++) if (BOOKED.has(d)) return true;
    return false;
  }, [from, to]);

  // A taken night can still be the morning somebody leaves (Codex, #146).
  const canCheckOut = (d: number) => !!from && !to && d > from;

  function pick(d: number) {
    setRequested(false);
    if (BOOKED.has(d) && !canCheckOut(d)) return;
    if (!from || (from && to) || d <= from) {
      setFrom(d);
      setTo(null);
    } else {
      setTo(d);
    }
  }

  const c = COTTAGES[cottage];

  return (
    <div className="lake min-h-screen bg-[#f3f1ec] text-[#1d2a30]">
      <p className="relative z-20 bg-[#1d2a30] px-5 py-2.5 text-center text-[13px] leading-snug text-[#dfe6e8]">
        Demo of a cinematic website by M Studio. Mistwood Cove is an invented business, and nothing is booked.
      </p>

      {/* The opening: a pinned scene; scrolling lifts the fog. */}
      <div ref={stage} className="relative h-[220vh]">
        <section className="sticky top-0 h-[100svh] overflow-hidden" aria-label="Mistwood Cove">
          <LakeFog lift={lift} className="lake-sky absolute inset-0 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#1d2a30]/35 via-transparent to-[#1d2a30]/45" />

          <header className="relative z-10 flex items-center justify-between px-6 py-5 text-white lg:px-10">
            <span className="lake-serif text-[24px]">Mistwood Cove</span>
            <nav aria-label="Demo" className="hidden gap-7 text-[14px] text-white/85 sm:flex">
              <a href="#cottages" className="text-white/85 no-underline hover:text-white">Cottages</a>
              <a href="#dates" className="text-white/85 no-underline hover:text-white">Dates</a>
            </nav>
            <a href="#dates" className="rounded-full bg-white/95 px-4 py-2.5 text-[14px] font-semibold text-[#1d2a30] no-underline hover:bg-white">
              Check dates
            </a>
          </header>

          <div className="relative z-10 flex h-[calc(100%-84px)] flex-col justify-end px-6 pb-14 text-white lg:px-10 lg:pb-20">
            <p className="text-[13px] uppercase tracking-[0.18em] text-white/80">Three cottages on one quiet cove</p>
            <h1 className="lake-serif mt-3 grid max-w-[13ch] items-end text-[clamp(44px,7vw,104px)] leading-[0.98]">
              <span className="lake-line" data-on={phase === 0}>Fog on the water at six.</span>
              <span className="lake-line" data-on={phase === 1}>Clear by nine. Your cottage is ready.</span>
            </h1>
            <p className="mt-6 flex items-center gap-3 text-[14px] text-white/80">
              <span className="lake-scroll" aria-hidden="true" />
              {phase === 0 ? "Scroll to lift the fog" : "Keep going to pick your dates"}
            </p>
          </div>
        </section>
      </div>

      {/* Cottages */}
      <section id="cottages" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <h2 className="lake-serif text-[clamp(36px,4.5vw,60px)] leading-tight">Pick a cottage.</h2>
        <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-[#4a585e]">
          Each one faces the water. Kayaks, firewood and the dock come with all three.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {COTTAGES.map((k, i) => (
            <button
              key={k.name}
              type="button"
              onClick={() => setCottage(i)}
              aria-pressed={cottage === i}
              className="lake-card text-left"
            >
              <span className="block aspect-[16/10] rounded-xl bg-[#e6e3db] p-3">
                <Cottage roof={k.roof} />
              </span>
              <span className="mt-4 flex items-baseline justify-between gap-3">
                <span className="lake-serif text-[24px]">{k.name}</span>
                <span className="text-[14px] text-[#4a585e]">Sleeps {k.sleeps}</span>
              </span>
              <span className="mt-1 block text-[15px] text-[#4a585e]">{k.note}</span>
              <span className="mt-3 block text-[14px]">${k.rate} a night <span className="text-[#6b777c]">(sample rate)</span></span>
            </button>
          ))}
        </div>
      </section>

      {/* Dates */}
      <section id="dates" className="relative z-10 bg-[#1d2a30] text-[#eef2f3]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2">
          <div>
            <h2 className="lake-serif text-[clamp(36px,4.5vw,60px)] leading-tight">When are you coming?</h2>
            <p className="mt-3 max-w-md text-[17px] leading-relaxed text-[#b9c5c9]">
              Tap your first night, then the morning you leave. Taken nights are crossed out.
            </p>
            <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.04] p-6">
              <p className="text-[13px] uppercase tracking-[0.14em] text-[#b9c5c9]">{c.name}</p>
              <p className="lake-serif mt-2 text-[30px]">
                {nights > 0 && !clash ? `${nights} night${nights > 1 ? "s" : ""}, $${(nights * c.rate).toLocaleString("en-US")}` : from ? "Now pick the morning you leave" : "Pick your first night"}
              </p>
              {clash && <p className="mt-2 text-[15px] text-[#ffb4a2]">Some of those nights are taken. Try other dates.</p>}
              <button
                type="button"
                disabled={!(nights > 0 && !clash)}
                onClick={() => setRequested(true)}
                className="mt-5 inline-flex min-h-12 items-center rounded-full bg-[#eef2f3] px-6 font-semibold text-[#1d2a30] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Request these dates
              </button>
              {requested && (
                <p role="status" className="mt-4 text-[15px] text-[#cfe3ea]">
                  On a real site, this would go to the owner and hold the dates. This is a demo, so nothing was booked.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="lake-serif text-[24px]">{MONTH.label} <span className="text-[16px] text-[#b9c5c9]">(sample month)</span></p>
            <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[12px] text-[#b9c5c9]">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {Array.from({ length: MONTH.firstDow - 1 }).map((_, i) => <span key={`b${i}`} />)}
              {Array.from({ length: MONTH.days }, (_, i) => i + 1).map((d) => {
                const taken = BOOKED.has(d) && !canCheckOut(d);
                const inRange = from && to ? d >= from && d <= to : d === from;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => pick(d)}
                    disabled={taken}
                    aria-label={`${MONTH.label} ${d}${taken ? ", taken" : ""}`}
                    aria-pressed={!!inRange}
                    className="lake-day"
                    data-taken={taken}
                    data-on={!!inRange}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Who built it */}
      <section className="relative z-10 border-t border-[#1d2a30]/10 bg-[#f3f1ec]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-14">
          <div>
            <p className="lake-serif text-[28px]">Want a site that moves like this?</p>
            <p className="mt-1 text-[15px] text-[#4a585e]">The lake is drawn live in code: no video to load, and it works on a phone. Built by M Studio in Southern Maine.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/?offer=project#contact" className="inline-flex min-h-12 items-center rounded-full bg-[#1d2a30] px-6 font-semibold text-white no-underline hover:bg-[#2b3a40]">
              Start a project
            </Link>
            <Link href="/catalog" className="inline-flex min-h-12 items-center rounded-full border border-[#1d2a30]/25 px-6 font-semibold text-[#1d2a30] no-underline hover:border-[#1d2a30]">
              See everything
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
