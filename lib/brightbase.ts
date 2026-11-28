/*
  BrightBase — the showcase page's content (/brightbase).

  Every feature line below was checked against the BrightBase codebase
  (msmall2691-eng/Bright-Space) on Nov 1, 2026. Rules for editing this file:

    · List a feature here only once it is built and in use. A plan, a
      branch or a stub does not count.
    · Things Meg is building go in `comingNext`, and the page labels them
      as in progress. Move a line up into a role list when it ships.
    · Screens are real captures of the app running on demo data: a
      fictional company (Harbor Light Cleaning) with made-up customers, and
      the page says so under each one. Never put a capture with a real
      customer's name, address, code or phone number in /public/shots.

      **Retake them with `backend/scripts/seed_demo.py`** in the
      Bright-Space repo, then capture at 1440x900 (office) and 390x844
      (crew, customer). That script did not exist until Nov 27 2026, and
      its absence is why this set rotted the way it did: "seed a local
      copy" described a database that lived on one laptop, so every
      refresh was done by hand, and the screens that came from real data
      were painted over with grey rectangles afterwards. Those rectangles
      are what a visitor saw, and they read as censored rather than real.

      Two things the seeder fixed that are easy to undo. The office data
      used to be named like placeholder data ("52 Demo Lane", "22
      Placeholder Way", "58 Sample Street"), which announces itself as a
      demo; the invented addresses are now plausible Southern Maine ones
      on invented streets, because a real street name with a plausible
      number is somebody's actual house. And nothing is redacted any
      more, because nothing in the frame belongs to a real person: that
      is what makes the pay, the addresses and the lockbox notes safe to
      show, not a decision to be braver about it.
*/

export type Shot = { src: string; alt: string; demo?: boolean; phone?: boolean };

export type Role = {
  id: "office" | "crew" | "customer";
  label: string;
  who: string;
  /** Where the screen in the frame comes from. */
  shot?: Shot;
  features: { title: string; body: string; shot?: Shot }[];
};

/*
  Two captures appear twice, so they are named once.

  The hero shows all three apps at the same time rather than telling a
  visitor there are three, and the two phone screens it uses are the same
  ones their roles use further down. Written out in both places they would
  be one rename away from describing different screens.
*/
const crewMyDay: Shot = {
  src: "/shots/brightbase/crew-my-day.webp",
  alt: "The crew app: My Day with today's jobs, pay and access details.",
  demo: true,
  phone: true,
};
const customerPortal: Shot = {
  src: "/shots/brightbase/customer-portal.webp",
  alt: "The customer portal: upcoming visits, quotes and invoices.",
  demo: true,
  phone: true,
};

export const brightbase = {
  name: "BrightBase",
  tagline: "The operations system that runs an eight-year-old cleaning company.",
  summary:
    "Leads, quotes, scheduling, crew, invoicing and payouts in one app, with an office side, a crew phone app and a customer portal. In daily use at The Maine Cleaning Co.",

  hero: { src: "/shots/brightbase/home-dark.webp", alt: "BrightBase home screen in dark mode: today's jobs, new leads, the crew and unread messages.", demo: true },
  /*
    The office screen, the crew's phone and the customer's, in the first
    screen. "Three apps in one" is the page's central claim and it was
    made in a heading two screens below the fold while the hero showed a
    single dashboard. It is also the one thing a phone can show legibly:
    a 1440-wide dashboard at 342 CSS px is a texture, and a 390-wide
    phone capture at 165 is a screen somebody can read.
  */
  heroPhones: [crewMyDay, customerPortal] as Shot[],

  pipeline: [
    { step: "Request", body: "Website forms and Facebook or Instagram lead ads land as requests, deduplicated, with an estimate already attached.", shot: { src: "/shots/brightbase/requests.webp", alt: "The Requests board: new leads from the website and a Facebook ad, each with an estimate.", demo: true } },
    { step: "Quote", body: "Build a quote, or let AI draft one from the lead. The customer accepts online and picks their own date.", shot: { src: "/shots/brightbase/quote.webp", alt: "A quote with line items, a customer message, and send, preview and PDF actions.", demo: true } },
    { step: "Schedule", body: "Jobs, recurring visits and rental turnovers from Airbnb, VRBO and Booking.com calendars, synced both ways with Google Calendar.", shot: { src: "/shots/brightbase/schedule.webp", alt: "The week schedule with jobs, turnovers and crew assignments.", demo: true } },
    { step: "Crew", body: "Cleaners accept, claim and complete jobs on their phone, with access details, checklists and photos.", shot: { src: "/shots/brightbase/crew-open-jobs.webp", alt: "The crew app: open jobs a cleaner can take, with pay shown.", demo: true, phone: true } },
    { step: "Invoice", body: "Invoices go out with a pay-online link. Overdue reminders follow at 1, 7 and 14 days.", shot: { src: "/shots/brightbase/invoicing.webp", alt: "The Money page: collected, outstanding and overdue, with money owed by age.", demo: true } },
    { step: "Paid", body: "Customers pay through Stripe. Subcontractors are paid per job through Stripe Connect.", shot: { src: "/shots/brightbase/owner-dashboard.webp", alt: "The owner dashboard: close rate, monthly recurring revenue, revenue paid and past due.", demo: true } },
    { step: "Repeat", body: "Recurring series generate the next visits on their own, with skips and reschedules handled.", shot: { src: "/shots/brightbase/recurring.webp", alt: "Recurring bookings: weekly and every-other-week series with their next visits.", demo: true } },
  ],

  roles: [
    {
      id: "office",
      label: "Office",
      who: "Owners, managers and office staff",
      features: [
        { title: "One inbox", body: "Gmail, two-way texting and phone calls in one thread per client. Missed calls go to voicemail with a transcript.", shot: { src: "/shots/brightbase/inbox.webp", alt: "The inbox: a texting thread with a client, with an AI summary and a draft-a-quote button.", demo: true } },
        { title: "Leads that sort themselves", body: "Website and lead-ad requests arrive with an estimate. Automated email is filed out of the way.", shot: { src: "/shots/brightbase/requests.webp", alt: "New requests from the website and lead ads, with estimates attached.", demo: true } },
        { title: "Scheduling", body: "Week view, recurring visits, rental turnovers from booking calendars, and Google Calendar sync with conflict checks.", shot: { src: "/shots/brightbase/schedule.webp", alt: "The week schedule.", demo: true } },
        { title: "AI drafts, you approve", body: "Replies, quote follow-ups, invoice reminders and a daily brief, drafted by Claude into an approval queue. Nothing sends on its own.", shot: { src: "/shots/brightbase/home-dark.webp", alt: "The home screen in dark mode: what needs attention today, leads with draft-quote buttons, and the crew.", demo: true } },
        { title: "Make it yours", body: "Custom fields on clients, properties, jobs, quotes and invoices. Saved views, light and dark theme, your colors and logo on documents.", shot: { src: "/shots/brightbase/custom-fields.webp", alt: "Settings: custom fields added to client records.", demo: true } },
        { title: "Know your numbers", body: "Owner dashboard, money owed by age, profit per property, weekly capacity and the lead-to-quote funnel.", shot: { src: "/shots/brightbase/owner-dashboard.webp", alt: "The owner dashboard.", demo: true } },
      ],
    },
    {
      id: "crew",
      label: "Crew app",
      who: "Cleaners and subcontractors, on their phone",
      features: [
        { title: "My Day", body: "Today's jobs and the week ahead. Accept or decline, claim open jobs, mark done with notes and photos.", shot: crewMyDay },
        { title: "Everything for the job", body: "Door code, wifi, parking, checklist and reference photos, shown only once the job is theirs.", shot: { src: "/shots/brightbase/crew-job.webp", alt: "A job in the crew app: arrival notes, wifi, and the checklist.", demo: true, phone: true } },
        { title: "Works without signal", body: "Finished jobs and replies are saved on the phone and sent when it reconnects. Photos wait for WiFi." },
        { title: "Their pay and paperwork", body: "Earnings, W-9 and insurance on file, availability and time off, and chat with the office.", shot: { src: "/shots/brightbase/crew-earnings.webp", alt: "The crew app: what this cleaner is owed and has been paid, per job.", demo: true, phone: true } },
        { title: "Install it like an app", body: "Adds to the home screen, with push notifications for new and changed jobs.", shot: { src: "/shots/brightbase/crew-schedule.webp", alt: "The crew app month schedule.", demo: true, phone: true } },
      ],
    },
    {
      id: "customer",
      label: "Customer",
      who: "Your clients",
      features: [
        { title: "Quotes they can act on", body: "Accept, decline or ask for changes online, pick a date and time, and download a PDF.", shot: { src: "/shots/brightbase/customer-quote.webp", alt: "The quote a customer sees, with a PDF download.", demo: true, phone: true } },
        { title: "Pay online", body: "Every invoice has a secure Stripe payment page, with a receipt by email." },
        { title: "Their own portal", body: "Passwordless sign-in to see upcoming visits, quotes and invoices.", shot: customerPortal },
        { title: "Instant estimate", body: "A price range on your website form, before they ever call." },
      ],
    },
  ] as Role[],

  integrations: [
    { name: "Gmail", what: "Inbox sync and sending" },
    { name: "Google Calendar", what: "Two-way job sync" },
    { name: "Twilio", what: "Texting and calls" },
    { name: "Stripe", what: "Online payments" },
    { name: "Stripe Connect", what: "Payouts to subs" },
    { name: "Airbnb · VRBO · Booking.com", what: "Turnovers from calendars" },
    { name: "Facebook & Instagram", what: "Lead ads" },
    { name: "Claude", what: "AI drafts" },
  ],

  /*
    The page's own furniture: the eyebrow and heading over each band, and
    the link labels. Same rule as `homeBands` in lib/content.ts, and the
    same reason: a page that types its own copy is a second author of it.
    Nothing countable is here. Every number on /brightbase resolves to
    `proof`, `integrations` or a record in lib/content.ts.
  */
  bands: {
    hero: {
      eyebrow: "BrightBase · in daily use",
      /* Split lopsidedly on purpose: see the note in app/brightbase/page.tsx. */
      lead: "The system an eight-year-old cleaning company",
      trail: "runs on.",
      cta: "Book a 15-min demo",
      see: "See what's inside",
    },
    /*
      **What a visitor recognizes before they are shown anything.**

      This band is the page's answer to "somebody running a service
      business should land here and recognize their own problem", and
      every line in it is the case study's own recorded problem with the
      first person taken out of it (`caseStudies[maine-cleaning-co]
      .problem`, approved by Meg, Oct 2026: "one for quotes and
      invoices, another for the crew schedule and time clock, others for
      the phone, booking and automation. Every handoff between them was
      done by hand.").

      It makes no claim about the reader and carries no number. The one
      number this argument has is in `proof` and in that case study, and
      the link is how somebody gets to it.
    */
    arrived: {
      eyebrow: "Sound familiar",
      heading: "The same job, retyped into every app it touches.",
      lines: [
        "Quotes and invoices in one app.",
        "The crew schedule and the time clock in another.",
        "The phone, the booking calendar and the automations somewhere else again.",
        "Every handoff between them done by hand.",
      ],
      link: "How one company replaced all of it",
      href: "/work/maine-cleaning-co",
    },
    flow: { eyebrow: "How a job moves", heading: "From first message to paid, in one place." },
    inside: { eyebrow: "What's inside", heading: "Three apps in one: the office, the crew, and your customers." },
    integrations: {
      eyebrow: "Connects to",
      heading: "Works with the tools you already pay for.",
      /* The free planner is the booking-calendar row of the list above,
         running in public, so the link is earned where it sits rather
         than collected into the closing band with the rest. */
      link: "Paste a booking calendar and see the turnovers it implies",
      href: "/turnover",
    },
    data: {
      eyebrow: "The data model",
      heading: "Built around the client, not around screens.",
      body: "Most small-business tools keep leads in one place, jobs in another and messages in a third. In BrightBase every record points back to one client, and a client is found by any email or phone number they have ever used. Pick a record to see how it connects.",
    },
    progress: "In progress",
    /*
      **The closing band is the step, not an invitation to one.**

      The page's measured failure was the ending: four links in the whole
      body, and a convinced visitor left with a form. Meg named the fix
      in her own words, "plan how they will easily obtain products or
      sites or tools", so the band says what actually happens, in order,
      and the first line of it is the one thing a visitor does today.

      Two rules it is written against. BrightBase has one company on it
      and is not sold as a product with customers, so nothing here is
      signup-shaped. **And there is no money on this page at all** (Meg,
      Nov 28: "leave pricing off for now"), which is why the old fourth
      door, to what a build costs, is gone rather than reworded.

      Steps 2 to 4 are `approachSteps` in lib/content.ts, read by the
      page rather than retyped here: it is the same four-step process
      every build on this site follows, and a second copy of it would be
      a second author of what a client is promised.
    */
    next: {
      eyebrow: "What happens next",
      heading: "One company runs on it. Getting it starts with a call.",
      body: "There is no trial and no signup, because there is nothing to sign up to yet. It starts with fifteen minutes on a call, against your own jobs rather than the demo data above, and goes on from there the way every build here does.",
      /* The one step that is not in `approachSteps`, because it is the
         one that happens on this page. */
      first: {
        index: "00",
        title: "A 15-minute demo",
        body: "A call where this runs against how you actually work: your jobs, your crew, your customers. Nothing to install.",
      },
    },
    close: {
      heading: "Run a service business? See it with your own jobs.",
      book: "Book a 15-min demo",
      ask: "Ask a question",
      /*
        Two quiet ways to look first, for somebody not ready to talk.
        Both are routes this site serves, both are things a visitor can
        use without asking anybody, and **neither opens a page of
        prices** — which is why /catalog and /services are not here.
      */
      look: "Or look first:",
      links: [
        { href: "/demo", label: "three working demos" },
        { href: "/tools", label: "the free tools, running in public" },
      ],
    },
  },

  proof: [
    { value: "Daily", label: "in use by the office and crew at The Maine Cleaning Co." },
    { value: "3", label: "apps in one: office, crew phone and customer portal" },
  ],

  /* In progress. Shown under its own heading, never mixed into the lists above. */
  comingNext: [
    { title: "Time clock with GPS check-in", body: "Clock in and out on the job, with location at punch." },
    { title: "Your pricing, your services", body: "A settings page for each business's own services, rates and quote templates." },
  ],
};
