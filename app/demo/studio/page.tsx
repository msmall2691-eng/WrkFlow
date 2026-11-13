import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import BookingDemo from "@/components/demo/BookingDemo";
import { studio, upcomingDates } from "@/lib/demo-booking";

/*
  /demo/studio — a booking app, built rather than mocked up.

  The second demo, and deliberately a different KIND of thing from
  /demo/shop rather than the same storefront in another industry. A shop
  reasons about stock; this reasons about time, which is harder and is what
  most small businesses actually ask for.

  Four decisions worth keeping:

  1. The availability logic is real and lives in lib/demo-booking.ts: service
     durations, two practitioners with different skills and different shifts,
     appointments already on the books, and a 15 minute cleanup gap. A slot
     is offered only when the whole treatment plus its gap fits. Booking one
     removes it and its neighbours, because the same function runs again.

  2. It does NOT wear the studio's chrome, for the reason /demo/shop does
     not: the visitor is picturing their own site. Cool palette here against
     the shop's warm cream, so two demos never look like one template.

  3. No photography, and none wanted. The interface is the product being
     demonstrated, so there is nothing to invent or borrow.

  4. It takes no payment and books nothing, and says so three times: in the
     banner, on the confirm panel, and in the footer.

  `revalidate` is a safety net, not the mechanism. The day strip is
  relative to today, so a page built once and frozen would be offering last
  month's dates by the time anybody looked. In practice this app's
  middleware already makes every route render per request, which is why the
  build marks all of them dynamic, so the setting changes nothing today. It
  is here for the day the middleware narrows and static rendering comes
  back, because the failure then is silent: stale dates render perfectly.

  `robots: noindex` because it is a portfolio exhibit, not a studio taking
  appointments, and because it is what lets the fictional brand stay
  fictional without competing for its own name.
*/

export const revalidate = 1800;

export const metadata: Metadata = {
  ...pageMeta({
    title: `${studio.name} — demo booking app`,
    description:
      "A working booking demo built by M Studio: pick a treatment, a practitioner and a time, with real availability logic. A fictional studio, with no real appointments and no payment.",
    path: "/demo/studio",
  }),
  robots: { index: false, follow: false },
};

export default function StudioDemoPage() {
  /*
    "Today" in the studio's own zone, not UTC. Read as UTC, an evening
    visitor on the east coast is already on tomorrow's date, so the first day
    offered would silently skip a day.
  */
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
  return <BookingDemo dates={upcomingDates(today, 7)} />;
}
