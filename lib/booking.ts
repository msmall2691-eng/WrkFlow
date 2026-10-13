/*
  The scheduler behind every "Book a free 15-min call" CTA.

  Until this is set, that button was a lie: it scrolled to the contact form
  and booked nothing. The URL lives in the environment rather than in the
  code so Meg can point it at Cal.com, a Google appointment schedule, or
  anything else without a deploy-time edit.

  NEXT_PUBLIC_ because the CTA is clicked in the browser; the value is a
  public booking page, so there is nothing here worth hiding.

  TODO(Meg): set NEXT_PUBLIC_BOOKING_URL in Vercel (Production + Preview) to
  the real booking page. Until then every call CTA quietly falls back to the
  contact form, which is what it already did — no dead ends either way.
*/

const RAW = process.env.NEXT_PUBLIC_BOOKING_URL;

/*
  Only an https URL is ever handed to an href or dropped into an email. A
  typo'd or javascript: value would otherwise ship straight to visitors.
*/
function parse(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const BOOKING_URL: string | null = parse(RAW);

/** True once a real scheduler is configured. */
export function bookingConfigured(): boolean {
  return BOOKING_URL !== null;
}
