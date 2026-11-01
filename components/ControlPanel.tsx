import Link from "next/link";
import { caseStudies, provingGround } from "@/lib/content";
import BookCall from "./BookCall";
import WeatherLayer from "./WeatherLayer";
import PanelStage from "./panel/PanelStage";
import PanelWindow from "./panel/PanelWindow";
import LiveTile from "./panel/LiveTile";
import StormStrip from "./panel/StormStrip";
import PaletteButton from "./panel/PaletteButton";

/*
  ControlPanel — the homepage, on one screen (Meg's "V2", Nov 1 2026).

  Black ground, a violet / teal / pink aurora, and everything a visitor needs
  laid out like a live dashboard instead of a long scroll:

    header      logo · nav · ⌘K · book a call
    storm       only while NWS has an active alert for Portland
    hero        headline, one line, two CTAs, the Maine Cleaning Co. numbers
    window      real shipped screens, one tab per system
    work        the case studies, outcome first
    tools       free tools, deep-linked into /tools
    live        Portland conditions, read as advice

  Nov 1 follow-up: Meg found the first cut too busy. One call-to-action
  (header + hero), no ticker, no duplicate CTA tile, plain tile headings and
  more space. Add something here only by taking something else away.

  Everything deeper (full case studies, all tools, services, pricing, about)
  lives on its own page, reachable from the nav and ⌘K. The contact form
  stays directly below this screen so no lead depends on a second page.

  Proof rules from CLAUDE.md hold: every number and screen here comes from
  lib/content.ts or a live public data source. Nothing is sample data.
*/

const NAV = [
  { href: "#work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/marketplace", label: "M Linx" },
  { href: "/about", label: "About" },
];

const TOOLS = [
  { id: "sitecheck", label: "Website check", blurb: "Any URL → a real Lighthouse speed, SEO & accessibility report." },
  { id: "quote", label: "Instant quote", blurb: "Service + size → a live price range you can send a customer." },
  { id: "cost", label: "Cost of manual work", blurb: "Hours + people → the yearly cost, and how fast automation pays." },
] as const;

const Arrow = () => (
  <span aria-hidden="true" className="text-[color:var(--cp-faint)] transition-transform duration-150 group-hover:translate-x-1">
    →
  </span>
);

export default function ControlPanel() {
  return (
    <PanelStage className="relative flex flex-col overflow-hidden lg:min-h-[100svh]">
      {/* The sky: aurora, a pointer glow, a faint dot grid, and live weather on top. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="cp-aurora cp-a1" />
        <span className="cp-aurora cp-a2" />
        <span className="cp-aurora cp-a3" />
        <span className="cp-glow" />
      </div>
      <WeatherLayer ink="light" />

      {/* Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.01em] text-[color:var(--cp-ink)] no-underline">
          <span aria-hidden="true" className="cp-mark grid h-8 w-8 place-items-center rounded-[9px] font-display text-[16px] font-bold text-white">
            M
          </span>
          Studio
        </Link>
        <nav aria-label="Main" className="hidden flex-wrap gap-6 text-[14px] md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[color:var(--cp-soft)] no-underline transition-colors duration-150 hover:text-[color:var(--cp-ink)]">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2.5">
          <PaletteButton
            label="Search the site or run a tool"
            className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-[10px] border border-white/[0.12] bg-white/[0.03] py-2 pl-3 pr-2.5 text-[13px] text-[color:var(--cp-muted)] transition-colors duration-150 hover:text-[color:var(--cp-ink)]"
          >
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <kbd className="cp-kbd">⌘K</kbd>
          </PaletteButton>
          <BookCall
            where="nav"
            className="rounded-[10px] bg-[color:var(--cp-ink)] px-4 py-2.5 text-[14px] font-semibold text-[#08070c] no-underline transition-transform duration-150 hover:-translate-y-0.5"
          >
            Book a free call
          </BookCall>
        </div>
      </header>

      <div className="relative z-10">
        <StormStrip />
      </div>

      {/* The panel */}
      <main className="relative z-10 grid flex-1 grid-cols-12 content-center gap-5 px-6 pb-8 pt-4 lg:px-10" id="top">
        {/* Hero */}
        <section className="col-span-12 flex min-w-0 flex-col justify-center gap-5 py-3 lg:col-span-5 lg:gap-4 lg:py-1 lg:pr-4">
          <span className="text-[14px] text-[color:var(--cp-soft)]">Southern Maine · clients anywhere</span>
          <h1 className="m-0 font-display text-[clamp(2.6rem,4.4vw,4.1rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-balance text-[color:var(--cp-ink)]">
            Software that runs <span className="cp-grad">real businesses.</span>
          </h1>
          <p className="m-0 max-w-[30em] text-[17px] leading-relaxed text-[color:var(--cp-muted)]">
            Websites, web apps and full-stack builds for small businesses, proven inside a service company I have run for eight years.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookCall
              where="hero"
              className="cp-cta inline-flex items-center gap-2.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white no-underline transition-transform duration-150 hover:-translate-y-0.5"
            >
              Book a free 15-min call <span aria-hidden="true">→</span>
            </BookCall>
            <a
              href="#work"
              className="inline-flex items-center rounded-xl border border-white/[0.16] px-5 py-3.5 text-[15px] font-medium text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:border-white/30"
            >
              See the work
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {provingGround.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse gap-0.5">
                  <dt className="text-[12px] leading-snug text-[color:var(--cp-faint)]">{s.label}</dt>
                  <dd className="m-0 font-display text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--cp-ink)] [font-variant-numeric:tabular-nums]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="m-0 text-[12px] text-[color:var(--cp-faint)]">The Maine Cleaning Co., my own company, runs on systems I built.</p>
          </div>
        </section>

        {/* Real shipped screens */}
        <section aria-label="Shipped systems" className="col-span-12 min-w-0 lg:col-span-7">
          <PanelWindow />
        </section>

        {/* Work */}
        <section id="work" aria-labelledby="cp-work" className="cp-tile col-span-12 flex min-w-0 flex-col gap-0.5 p-4 md:col-span-6 lg:col-span-4">
          <h2 id="cp-work" className="m-0 mb-2 px-2.5 text-[13px] font-medium text-[color:var(--cp-soft)]">My work</h2>
          {caseStudies.map((c) => (
            <Link
              key={c.slug}
              href={`/work/${c.slug}`}
              className="cp-row group flex items-center justify-between gap-3 rounded-[10px] px-2.5 py-1.5 text-[color:var(--cp-ink)] no-underline"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[14.5px] font-semibold">{c.title}</span>
                <span className="line-clamp-1 text-[12.5px] text-[color:var(--cp-muted)]">{c.outcome}</span>
              </span>
              <Arrow />
            </Link>
          ))}
        </section>

        {/* Tools */}
        <section aria-labelledby="cp-tools" className="cp-tile col-span-12 flex min-w-0 flex-col gap-0.5 p-4 md:col-span-6 lg:col-span-4">
          <div className="mb-2 flex items-center justify-between px-2.5">
            <h2 id="cp-tools" className="m-0 text-[13px] font-medium text-[color:var(--cp-soft)]">Free tools to try</h2>
            <Link href="/tools" className="text-[13px] text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80">
              All 8 →
            </Link>
          </div>
          {TOOLS.map((t) => (
            <Link
              key={t.id}
              href={`/tools?tool=${t.id}`}
              className="cp-row group flex items-center justify-between gap-3 rounded-[10px] px-2.5 py-1.5 text-[color:var(--cp-ink)] no-underline"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[14.5px] font-semibold">{t.label}</span>
                <span className="line-clamp-1 text-[12.5px] text-[color:var(--cp-muted)]">{t.blurb}</span>
              </span>
              <Arrow />
            </Link>
          ))}
        </section>

        {/* Live conditions */}
        <div className="col-span-12 flex min-w-0 md:col-span-12 lg:col-span-4 [&>*]:flex-1">
          <LiveTile />
        </div>

      </main>

    </PanelStage>
  );
}
