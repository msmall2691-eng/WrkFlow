import Link from "next/link";
import { homeFooterNav, homeHero } from "@/lib/content";

/*
  The approved design's footer: the wordmark, six links, the location
  line. One row at 860px and up, stacked below it.

  **`components/Footer.tsx` is untouched and still renders on the other
  eleven routes**, with its longer link list, the live Maine readout, the
  moon phase and the legal links. This is the homepage's footer only,
  because the design asks the page to end quietly.

  Two things that footer carries and this one does not, recorded so the
  loss is a decision rather than an oversight: /privacy is still reachable
  from this page through the form's own note, which is where somebody
  about to send their details is actually looking for it; /terms is not
  linked from the homepage any more, and is one link from every other
  page.
*/
export default function StageFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <Link href="/" className="mark">
          M<b>·</b>Studio
        </Link>
        <nav aria-label="Footer">
          {homeFooterNav.map((n) =>
            n.href.startsWith("#") ? (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ) : (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ),
          )}
        </nav>
        <span className="loc">{homeHero.location}</span>
      </div>
    </footer>
  );
}
