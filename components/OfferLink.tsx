"use client";

import { requestOffer, type OfferKey } from "@/lib/offer";

/*
  A CTA that still scrolls to #contact the ordinary way, but tells the contact
  form which offer sent the visitor (site survey O-02). Kept as its own client
  component so Hero and Pricing can stay server-rendered.
*/
export default function OfferLink({
  offer,
  text,
  children,
  ...rest
}: {
  offer: OfferKey;
  /* Extra body copy — the quote calculator passes its live estimate. */
  text?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a
      {...rest}
      href="#contact"
      data-offer={offer}
      onClick={() => requestOffer(offer, text)}
    >
      {children}
    </a>
  );
}
