"use client";

import { BOOKING_URL } from "@/lib/booking";
import { requestOffer } from "@/lib/offer";
import { trackBooking } from "@/lib/track";

/*
  "Book a free 15-min call" — which, until now, booked nothing: it scrolled to
  the contact form like every other CTA.

  With NEXT_PUBLIC_BOOKING_URL set, this opens the real scheduler in a new tab
  so the visitor doesn't lose the page they were reading. Without it, the old
  behaviour stands (scroll to the form, tagged as the "call" offer) — a CTA
  that still works is better than one that disappears, and `trackBooking`
  records which of the two the visitor actually got.

  `fallbackHref` is that unconfigured path, and it defaults to the in-page
  `#contact` because four of the five call sites sit on a page that renders
  Contact. The fifth is PanelHeader, which is the site-wide header and lands
  on pages that do not, so it passes the cross-page form instead. That is
  what the old <Nav> always did: its booking link was `/#contact`, with the
  leading slash, from every page.

  Getting this wrong is silent. The anchor renders, the hash changes, and
  nothing moves, so e2e asserts that no unconfigured call CTA points at an
  in-page #contact the page does not have.
*/
export default function BookCall({
  where,
  children,
  className,
  fallbackHref = "#contact",
}: {
  /* Which surface the click came from: "pricing", "contact", "hero". */
  where: string;
  children: React.ReactNode;
  className?: string;
  /* Where to send the visitor when no scheduler is configured. Leave it for
     a page that renders Contact; pass "/?offer=call#contact" when it does
     not, so the click reaches the homepage form instead of nothing. */
  fallbackHref?: string;
}) {
  if (BOOKING_URL) {
    return (
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => trackBooking(where, true)}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={fallbackHref}
      data-offer="call"
      className={className}
      onClick={() => {
        trackBooking(where, false);
        requestOffer("call");
      }}
    >
      {children}
    </a>
  );
}
