/*
  Cloudflare Turnstile verification for the lead endpoints.

  Why this exists. /api/contact was reachable by any script: it mails Meg and
  auto-replies to the address the caller typed, so an open endpoint is both a
  spam firehose into her inbox and a relay sending mail from her domain to
  strangers. #116 added an Origin check, which stops a bot that sends no
  Origin, and that is most commodity spam. It does not stop one that sends
  `Origin: https://mlinx.studio`, because Origin is a request header and any
  HTTP client can set it to anything. Only the server can tell a real browser
  session from a forged header, which is what this does.

  UNTIL TURNSTILE_SECRET_KEY IS SET THIS IS INERT and every submission is
  allowed through. That is deliberate: a half-configured challenge that
  rejects real visitors is worse than the spam. The site works exactly as it
  does today until the keys exist, and hardens the moment they do.

  TODO(Meg): create a Turnstile widget at
  https://dash.cloudflare.com/?to=/:account/turnstile and set both:
    NEXT_PUBLIC_TURNSTILE_SITE_KEY = the site key (public, ships to browsers)
    TURNSTILE_SECRET_KEY           = the secret key (server only, never public)
  Set them on Production and Preview. The widget renders and is enforced as
  soon as both are present; neither needs a code change.
*/

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** True when both keys are configured, i.e. the challenge is live. */
export function turnstileConfigured(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

export type TurnstileResult =
  | { ok: true; skipped: boolean }
  | { ok: false; reason: string };

/**
 * Verifies a widget token with Cloudflare.
 *
 * Returns ok with skipped: true when no secret is configured, so callers can
 * tell "allowed because the challenge passed" from "allowed because there is
 * no challenge yet" and log the difference.
 */
export async function verifyTurnstile(
  token: unknown,
  ip?: string,
): Promise<TurnstileResult> {
  /*
    Both keys, not just the secret.

    Checking only TURNSTILE_SECRET_KEY meant that setting the secret first
    and the site key second — the obvious order, since the secret is the one
    that feels urgent — put the site in a state where the server demanded a
    token and TurnstileWidget rendered nothing to produce one. Every real
    submission would have failed with a 403 and no visible cause. This is
    what turnstileConfigured() was for; it was written and then not used.
  */
  if (!turnstileConfigured()) return { ok: true, skipped: true };
  const secret = process.env.TURNSTILE_SECRET_KEY!.trim();

  if (typeof token !== "string" || token.length === 0) {
    return { ok: false, reason: "missing-token" };
  }
  /* Cloudflare's tokens are bounded; anything longer is not one of theirs and
     is not worth a round trip. */
  if (token.length > 2048) return { ok: false, reason: "malformed-token" };

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    /*
      A challenge that hangs must not hang the form. Five seconds is long
      enough for a healthy round trip and short enough that a visitor is not
      left waiting on Cloudflare.
    */
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, reason: `verify-http-${res.status}` };

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (data.success === true) return { ok: true, skipped: false };
    return { ok: false, reason: (data["error-codes"] ?? ["unknown"]).join(",") };
  } catch (err) {
    /*
      Cloudflare unreachable or too slow. Fail CLOSED: this runs only once the
      secret is configured, which is a deliberate decision that submissions
      must be challenged, and an outage is not a reason to reopen the relay.
      The visitor is told to try again rather than silently dropped.
    */
    console.error("Turnstile: verification request failed", err);
    return { ok: false, reason: "verify-unreachable" };
  }
}
