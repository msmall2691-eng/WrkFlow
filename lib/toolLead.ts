/*
  The limits /api/tool-lead enforces, in one place both sides can read.

  **This module exists because two of these numbers were already being
  broken from the other side.** That route is the only one on the site that
  mails a caller-supplied address, so its caps are anti-abuse rather than
  tidiness and may not be relaxed per tool. But a component that posts a
  body over the cap gets a 422 and the visitor gets nothing, and until now
  the caps lived as literals inside the route where no caller could see
  them. The Turnover Planner shipped a summary that scales with the
  visitor's own calendar and tripped the summary cap at 120 cleanings,
  which is a year of three-day stays on one property.

  So the numbers live here, the route imports them instead of declaring
  them, and anything building a payload for that route reads the same
  constant rather than a copy of it. A cap somebody has to remember is a
  cap somebody forgets.
*/

/**
 * Longest `summary` the endpoint will accept, in characters.
 *
 * Generous for a tool result that does not scale with input, and a real
 * ceiling for one that does — see `turnoverEmailSummary` in lib/ical.ts,
 * which fits itself to this and leaves the remainder in the attachment.
 */
export const MAX_SUMMARY_LEN = 4000;

/**
 * Longest base64 attachment the endpoint will accept, ~1.5MB decoded.
 * Generous for a QR PNG or a calendar file.
 */
export const MAX_ATTACHMENT_BASE64_LEN = 2_000_000;
