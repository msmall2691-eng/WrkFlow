import Link from "next/link";
import BookCall from "../BookCall";
import PaletteButton from "./PaletteButton";

/*
  PanelHeader — the V2 header, shared by the homepage panel and the V2 inner
  pages (/brightbase first). Five links, ⌘K, one call to action. Anything
  else belongs in ⌘K or the footer, not here (Meg: keep it calm).
*/
const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/brightbase", label: "BrightBase" },
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

export default function PanelHeader({ current }: { current?: string }) {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
      <Link href="/" className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.01em] text-[color:var(--cp-ink)] no-underline">
        <span aria-hidden="true" className="cp-mark grid h-8 w-8 place-items-center rounded-[9px] font-display text-[16px] font-bold text-white">
          M
        </span>
        Studio
      </Link>
      <nav aria-label="Main" className="hidden flex-wrap gap-6 text-[14px] md:flex">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={current === n.href ? "page" : undefined}
            className={`no-underline transition-colors duration-150 hover:text-[color:var(--cp-ink)] ${
              current === n.href ? "text-[color:var(--cp-ink)]" : "text-[color:var(--cp-soft)]"
            }`}
          >
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
  );
}
