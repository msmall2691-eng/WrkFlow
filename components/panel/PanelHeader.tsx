import Link from "next/link";
import BookCall from "../BookCall";
import PaletteButton from "./PaletteButton";

/*
  PanelHeader — the V2 header, shared by the homepage panel and the V2 inner
  pages (/brightbase first). Six links, ⌘K, one call to action. Anything
  else belongs in ⌘K or the footer, not here (Meg: keep it calm).

  It was five until /demo existed. Meg asked for the sixth once the three
  demos shipped, because a showcase nothing links to is a showcase nobody
  opens, and she is about to start posting. Recorded here so the count is
  not quietly trimmed back to five by somebody reading the old note: the
  calm instruction still stands, this one link was a decision.

  Demos sits next to Work because they are the same argument twice. Work is
  what she built for real clients, Demos is what somebody can click right
  now. Both come before the product and the price.

  Nov 15 2026: "Tools" became "Catalog", on Meg's ask that everything for
  sale be visible up front. The count stays at six. /catalog links all eight
  free tools directly, and /tools is still in ⌘K and the footer.
*/
/*
  Nov 15 2026, evening: four links. Demos, Services and Catalog were three
  doors onto the same things; /services and /demo now redirect into
  /catalog (next.config.ts), and Work is its own page of real projects.
*/
const NAV = [
  { href: "/catalog", label: "Catalog" },
  { href: "/work", label: "Work" },
  { href: "/brightbase", label: "BrightBase" },
  { href: "/about", label: "About" },
];

export default function PanelHeader({
  current,
  bookHref,
}: {
  current?: string;
  /*
    Where the header's "Book a free call" goes when no scheduler is set.
    Pages that render Contact leave it alone and keep the in-page scroll;
    /tools, /about and /work/[slug] have no form, so they pass
    "/?offer=call#contact" and the click reaches the homepage one.
  */
  bookHref?: string;
}) {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
      <Link href="/" className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.01em] text-[color:var(--cp-ink)] no-underline">
        <span aria-hidden="true" className="cp-mark grid h-8 w-8 place-items-center rounded-[9px] font-display text-[16px] font-bold text-white">
          M
        </span>
        Studio
      </Link>
      {/*
        Tighter links between md and lg, the designed gap-6 from 1024 up.

        The sixth link put the header's contents 47px over the line at
        exactly 768, which is the md breakpoint where the nav first appears
        and iPad portrait, so the whole header wrapped to a second row
        there and nowhere else. Measured: 81px tall at 820 and above, 129px
        at 768. A 14px gap in that one band puts it back on one row without
        crowding the desktop nav, which is where it is actually read.
      */}
      <nav aria-label="Main" className="hidden flex-wrap gap-3.5 text-[14px] md:flex lg:gap-6">
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
          className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-[10px] border border-[color:var(--cp-hairline-strong)] bg-[color:var(--cp-fill)] py-2 pl-3 pr-2.5 text-[13px] text-[color:var(--cp-muted)] transition-colors duration-150 hover:text-[color:var(--cp-ink)]"
        >
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <kbd className="cp-kbd">⌘K</kbd>
        </PaletteButton>
        <BookCall
          where="nav"
          fallbackHref={bookHref}
          className="rounded-[10px] bg-[color:var(--cp-ink)] px-4 py-2.5 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline transition-transform duration-150 hover:-translate-y-0.5"
        >
          Book a free call
        </BookCall>
      </div>
    </header>
  );
}
