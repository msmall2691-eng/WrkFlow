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
*/
export default function BookCall({
  where,
  children,
  className,
}: {
  /* Which surface the click came from: "pricing", "contact", "hero". */
  where: string;
  children: React.ReactNode;
  className?: string;
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
      href="#contact"
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
