import { NextResponse } from "next/server";
import { parseBookings, planTurnovers } from "@/lib/ical";
import { createRateLimiter, clientIp } from "@/lib/rateLimit";

/*
  The turnover planner's endpoint.

  Takes a short-term-rental calendar — either a platform iCal URL or pasted
  .ics text — and returns the cleanings the bookings imply. It stores nothing
  and emails nobody: a visitor's booking calendar is their business, and the
  tool is worth more as something that obviously keeps its hands off.

  On fetching a URL the visitor supplies. That is a server making a request
  to an address a stranger chose, which is the shape of an SSRF, so the host
  is checked against the platforms that actually publish these feeds rather
  than allowed in general. Anything else is still usable: paste the file.
*/

export const runtime = "nodejs";

const rateLimitedByIp = createRateLimiter({ windowMs: 10 * 60 * 1000, maxHits: 20 });

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin === "https://mlinx.studio") return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

/*
  The platforms that publish rental calendars. A suffix match on the host,
  never a substring of the whole URL: "airbnb.com.evil.test" must not pass,
  and it does not, because the host has to be the domain or end with a dot
  and the domain.
*/
const FEED_HOSTS = [
  "airbnb.com", "airbnb.co.uk", "airbnb.ca",
  "vrbo.com", "homeaway.com", "expedia.com",
  "booking.com",
  "hospitable.com", "guesty.com", "lodgify.com", "ownerrez.com",
  "hostaway.com", "smoobu.com", "uplisting.io", "tokeet.com",
  "google.com", // a Google Calendar ical export
];

function hostAllowed(host: string): boolean {
  const h = host.toLowerCase().replace(/\.$/, "");
  return FEED_HOSTS.some((d) => h === d || h.endsWith(`.${d}`));
}

/** 1MB. A year of bookings is a few tens of KB; past this it is not a feed. */
const MAX_ICS_BYTES = 1_000_000;

export async function POST(req: Request) {
  if (!isAllowedOrigin(req.headers.get("origin"))) {
    return NextResponse.json({ ok: false, error: "Request not allowed." }, { status: 403 });
  }
  if (rateLimitedByIp(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many calendars just now. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: { url?: string; ics?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  let ics = (body.ics ?? "").trim();
  const url = (body.url ?? "").trim();

  if (!ics && url) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ ok: false, error: "That doesn't look like a link." }, { status: 422 });
    }
    /* webcal:// is what the platforms hand you; it is https in a trenchcoat. */
    if (parsed.protocol === "webcal:") parsed.protocol = "https:";
    if (parsed.protocol !== "https:") {
      return NextResponse.json(
        { ok: false, error: "The link has to be https." },
        { status: 422 },
      );
    }
    if (!hostAllowed(parsed.hostname)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "I only fetch calendars from the booking platforms directly. Paste the file contents instead and it'll work with any calendar.",
        },
        { status: 422 },
      );
    }

    try {
      const res = await fetch(parsed.toString(), {
        redirect: "error", // a redirect could point anywhere; the allowlist would not have seen it
        headers: { accept: "text/calendar, text/plain" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: `The calendar link returned ${res.status}. Check it's the iCal export link.` },
          { status: 422 },
        );
      }
      const buf = await res.arrayBuffer();
      if (buf.byteLength > MAX_ICS_BYTES) {
        return NextResponse.json({ ok: false, error: "That calendar is too large." }, { status: 422 });
      }
      ics = new TextDecoder().decode(buf);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Couldn't reach that calendar. Paste the file contents instead." },
        { status: 422 },
      );
    }
  }

  if (!ics) {
    return NextResponse.json(
      { ok: false, error: "Paste a calendar link or the .ics contents." },
      { status: 422 },
    );
  }
  if (ics.length > MAX_ICS_BYTES) {
    return NextResponse.json({ ok: false, error: "That calendar is too large." }, { status: 422 });
  }
  if (!/BEGIN:VCALENDAR/i.test(ics)) {
    return NextResponse.json(
      { ok: false, error: "That isn't an iCalendar file. It should start with BEGIN:VCALENDAR." },
      { status: 422 },
    );
  }

  const bookings = parseBookings(ics);
  const turnovers = planTurnovers(bookings);

  return NextResponse.json({
    ok: true,
    bookings: bookings.length,
    turnovers,
    sameDay: turnovers.filter((t) => t.sameDay).length,
  });
}
