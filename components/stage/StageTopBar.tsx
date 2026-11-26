"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BookCall from "../BookCall";
import PaletteButton from "../panel/PaletteButton";
import { homeHero, homeNav, siteMenu } from "@/lib/content";

type NavItem = { readonly href: string; readonly label: string };

/*
  The site's header.

  ───────────────────────────────────────────────────────────────────────
  **Nov 26 2026. It shipped as the homepage's own bar and it is now
  every page's, and three separate things were wrong with it.**

  *One, there were two of them.* `PanelHeader` dressed the inner pages and
  this dressed the homepage, so the first thing that happened when a
  visitor left the front page was that the header changed. Nobody reads
  two headers as two designs for two kinds of page; they read them as two
  websites. Same component now, same markup, same CSS, on the homepage
  and on the six routes it leads to.

  *Two, it did not say where you were.* Meg, in her own words: "I really
  want a better header saying title whatever." It held a wordmark and
  four links and nothing in it changed between /services and /catalog.
  Both answers are here rather than one:

    · **the page's name sits beside the wordmark** (`here`), in the mono
      the design gives data, so the bar reads `M·Studio / Services`. On a
      phone, where the links are behind a button, this is the only
      where-you-are signal there is, which is why it survives at 390 and
      the links do not;
    · **the nav marks the page you are on**, both to a screen reader
      (`aria-current="page"`) and on screen (full-strength ink and the
      accent rule under it, which is the same underline the services rows
      on the homepage draw on hover).

  *On the homepage the slot is not empty, it is the section you are in.*
  There is no page title there — the hero's headline is the title — so an
  "M Studio / Home" would be a label that says nothing. Instead the bar
  follows the one-page scroll: `M·Studio` alone over the hero, then
  `/ Work`, `/ Pricing` as each band crosses the middle of the screen,
  with the matching link marked. One mechanism, two readings, and it is
  the long scrolling page that most needed a position indicator.

  *Three, the phone had no navigation at all.* Below 860 the design drops
  the links, which is right for the design and left a visitor on a phone
  with a wordmark, a search button and a CTA: /services and /tools were
  not reachable from the header on the width most of Meg's buyers use.
  There is a real menu now, and what it lists is `siteMenu`, the site
  rather than the bar — see its note in `lib/content.ts`.

  Two things still differ between the two mounts, and both are content
  rather than clothes, which is the line this pass was asked not to
  cross. The homepage's four links are in-page anchors that only resolve
  there; the inner pages' six are routes, and the sixth is a decision of
  Meg's recorded above `siteNav`. And the homepage's call to action is
  the design's "Start a project", straight to its own form, where an
  inner page has no form and carries `BookCall`, which opens the real
  scheduler when one is configured — the thing `lib/booking.ts` and the
  dead-end test in `e2e/smoke.spec.ts` are about. Folding either pair into
  one is a question about what the site's navigation is, and belongs to
  Meg.

  `PanelHeader` is not deleted: it is still the header on /brightbase,
  /demo/*, /turnover, /welcome-book, /intake and the two legal pages,
  which this pass did not convert.
  ───────────────────────────────────────────────────────────────────────

  Everything that moves here is transform and opacity on the one curve,
  and the menu's entrance is the site's own `animate-menu-in`, which has
  carried a reduced-motion fallback since the nav it was written for.
*/
export default function StageTopBar({
  nav = homeNav,
  here,
  inFlow = false,
  spy = false,
  palette = true,
  cta,
  bookHref,
}: {
  /** The bar's links. Defaults to the approved homepage's four anchors. */
  nav?: readonly NavItem[];
  /** The page's own name, shown beside the wordmark. */
  here?: string;
  /** In the flow and already grounded, for a page that is not the hero. */
  inFlow?: boolean;
  /** Follow the in-page sections and name the one being read. */
  spy?: boolean;
  /** Show the ⌘K button. The palette answers the shortcut either way. */
  palette?: boolean;
  /** Replace the design's "Start a project" with `BookCall`. */
  cta?: "book";
  /** Where `BookCall` lands with no scheduler configured. Pass
      "/?offer=call#contact" on a page that renders no form. */
  bookHref?: string;
}) {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  /* The in-page anchor currently being read, on a page that asked. */
  const [section, setSection] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (inFlow) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setStuck(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [inFlow]);

  /*
    Which band is being read.

    `rootMargin: -50% 0 -50% 0` collapses the viewport to the single line
    across its middle, so exactly the section under that line is
    intersecting and there is no "which of these three is most visible"
    arithmetic to get wrong. Nothing re-renders while scrolling through
    one band, because the name only changes when the line crosses an
    edge. It observes the anchors the bar already offers and nothing
    else, so the thing it can say is always a thing the bar can mark.

    Two bands are therefore unnamed, and both on purpose: the hero,
    whose headline is the title and is on the screen, and the closing
    contact band, which opens with its own "Start a project" eyebrow.
    A label is worth having where the page does not already say it.
  */
  useEffect(() => {
    if (!spy) return;
    const ids = nav
      .map((n) => (n.href.startsWith("#") ? n.href : n.href.startsWith("/#") ? n.href.slice(1) : null))
      .filter((h): h is string => Boolean(h));
    const nodes = ids
      .map((h) => document.querySelector(h))
      .filter((el): el is Element => Boolean(el));
    if (!nodes.length) return;

    /*
      **The set is a ref and the first version of this read the state
      instead, which is why the bar said "Services" over the hero.** An
      effect that runs once closes over the first render's `section`
      for ever, so the branch that clears the name compared against
      `null` and never fired: scroll down to a band, scroll back to the
      top, and the name of the band you had left was still in the bar.
      Keeping the intersecting ids in a ref and deriving the answer from
      them has no state to go stale, and gives the empty case for free.
    */
    const live = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = "#" + e.target.id;
          if (e.isIntersecting) live.add(id);
          else live.delete(id);
        }
        setSection(ids.find((h) => live.has(h)) ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [spy, nav]);

  /* A route change closes the menu. An in-page anchor does not change the
     path, so those close themselves on click, below. */
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const isHere = (href: string) => {
    if (href.startsWith("#")) return section === href;
    if (href.startsWith("/#")) return spy && section === href.slice(1);
    return pathname === href || pathname.startsWith(href + "/");
  };

  /* The page's own name, or on a one-page scroll the band being read. */
  const label =
    here ?? (spy ? nav.find((n) => isHere(n.href))?.label : undefined);

  const book = (className: string) => (
    <BookCall where="nav" fallbackHref={bookHref} className={className}>
      Book a free call
    </BookCall>
  );

  const bar = (
    <header
      ref={root}
      className={`topbar${inFlow ? " inflow" : ""}${
        inFlow || stuck || open ? " stuck" : ""
      }`}
    >
      <div className="wrap">
        <Link href="/" className="mark">
          M<b>·</b>Studio
        </Link>
        {/* The page's name. `aria-hidden` because the heading under it
            already says this to a screen reader, and the nav says it
            again with `aria-current`; a third announcement on every page
            load is noise. It is here to be looked at. */}
        {label && (
          <span className="here" aria-hidden="true">
            <span className="slash">/</span>
            <span className="name">{label}</span>
          </span>
        )}

        <nav className="topnav" aria-label="Main">
          {nav.map((n) =>
            n.href.startsWith("#") ? (
              <a
                key={n.href}
                href={n.href}
                aria-current={isHere(n.href) ? "true" : undefined}
                className={isHere(n.href) ? "on" : undefined}
              >
                {n.label}
              </a>
            ) : (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isHere(n.href) ? "page" : undefined}
                className={isHere(n.href) ? "on" : undefined}
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>

        {palette && (
          <PaletteButton label="Search the site or run a tool" className="topkey">
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <kbd className="cp-kbd">⌘K</kbd>
          </PaletteButton>
        )}

        {cta === "book" ? (
          book("btn btn-solid")
        ) : (
          /* The same words as the hero's primary action, from the same
             place: the design offers one thing to do, twice. */
          <a href="#contact" className="btn btn-solid">
            {homeHero.primary}
          </a>
        )}

        {/*
          The phone's way in. 44px square, which is the floor the site
          survey set for a coarse pointer, and an icon rather than the
          word "Menu" because the three items beside it already want
          every pixel at 390.
        */}
        <button
          ref={menuButton}
          type="button"
          className="menubtn"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className={`bars${open ? " x" : ""}`}>
            <i />
            <i />
          </span>
        </button>

      </div>

      {/* Outside `.wrap` so it hangs off the bottom of the bar rather
          than off the bottom of the bar's content row. */}
      {open && (
        <div className="menu animate-menu-in" id="site-menu">
          <nav aria-label="Site">
            {siteMenu.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isHere(n.href) ? "page" : undefined}
                className={isHere(n.href) ? "on" : undefined}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="menu-foot">
            <PaletteButton
              label="Search the site or run a tool"
              className="menu-key"
            >
              Search the site
            </PaletteButton>
            {book("btn btn-solid")}
          </div>
        </div>
      )}
    </header>
  );

  /*
    **The in-flow bar is wrapped in `.stage` and the fixed one is not**,
    because the fixed one is already inside the homepage's `.stage` and
    an inner page is not. The bar's rules are `.stage .topbar …`, so this
    is how the same CSS reaches both mounts without a second copy of it
    scoped to `.cp`. The wrapper paints the design's ground and sets its
    face; it has no height beyond the bar's, and none of `.stage`'s
    element resets reach the page, which matters — `.stage p { margin: 0 }`
    is unlayered and would beat every `mt-*` on the page inside it.

    **`bar-host` is not decoration.** `.stage` sets `overflow-x: hidden`
    to guard the homepage's full-bleed media, and a box with one axis
    hidden has the other computed as `auto` rather than visible — so a
    wrapper exactly as tall as the bar clipped the open menu away
    entirely. The button toggled, the icon became a cross, and nothing
    appeared: the kind of failure that renders perfectly and is only
    visible by looking.
  */
  return inFlow ? <div className="stage bar-host">{bar}</div> : bar;
}
