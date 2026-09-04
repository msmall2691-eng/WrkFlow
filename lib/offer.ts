/*
  Offer routing (site survey O-02).

  Every CTA on the site pointed at a bare `#contact`, so someone who spent two
  minutes building a $189-$222 cleaning quote and someone idly clicking "Tell
  me what you need" arrived in the inbox looking identical — and the quote they
  had just built was thrown away at the anchor.

  This keeps the plain `#contact` hash (so the scroll fix from S-01 still
  works, on cold loads and shared links alike) and carries the offer alongside
  it two ways:

    · in-page  — the CTA sets `data-offer`, Contact picks it up on click
    · deep link — `mlinx.studio/?offer=starter#contact` prefills on load,
                  which is what the CTA also writes into the address bar, so a
                  copied URL keeps the context

  The prefilled sentence matters as much as the tracking: the questionnaire
  card two panels away already makes this argument — people answer a question
  more readily than they face a blank box.
*/

export const OFFERS = {
  project: "I'd like to start a project.",
  starter: "I'd like to claim a founding Starter spot.",
  care: "I'd like to get the Care Plan set up.",
  custom: "I've got something custom in mind:",
  call: "I'd like to book a free 15-minute call.",
  quote: "I built a quote on your calculator and I'd like to talk it through.",
} as const;

export type OfferKey = keyof typeof OFFERS;

export const OFFER_EVENT = "mstudio:offer";

export type OfferDetail = {
  offer: OfferKey;
  /* Optional extra body — the quote calculator sends its actual estimate. */
  text?: string;
};

export function isOfferKey(v: string | null | undefined): v is OfferKey {
  return !!v && Object.prototype.hasOwnProperty.call(OFFERS, v);
}

/* The message the contact box opens with, for a given offer. */
export function prefillFor(offer: OfferKey, text?: string): string {
  const opener = OFFERS[offer];
  return text ? `${opener}\n\n${text}` : opener;
}

/*
  Announce an offer to the contact form and record it in the URL. Called from
  CTA click handlers; the anchor's own `href="#contact"` still does the scroll.
*/
export function requestOffer(offer: OfferKey, text?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OfferDetail>(OFFER_EVENT, { detail: { offer, text } }),
  );
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("offer", offer);
    window.history.replaceState(null, "", `${url.pathname}${url.search}#contact`);
  } catch {
    /* URL rewriting is a nicety — never let it break the click. */
  }
}
