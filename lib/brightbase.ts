/*
  BrightBase — the showcase page's content (/brightbase).

  Every feature line below was checked against the BrightBase codebase
  (msmall2691-eng/Bright-Space) on Nov 1, 2026. Rules for editing this file:

    · List a feature here only once it is built and in use. A plan, a
      branch or a stub does not count.
    · Things Meg is building go in `comingNext`, and the page labels them
      as in progress. Move a line up into a role list when it ships.
    · Screens are real captures of the app. Demo captures use a fictional
      company with made-up customers, and the page says so under each one.
      Never put a capture with a real customer's name, address, code or
      phone number in /public/shots.
*/

export type Shot = { src: string; alt: string; demo?: boolean };

export type Role = {
  id: "office" | "crew" | "customer";
  label: string;
  who: string;
  /** Where the screen in the frame comes from. */
  shot?: Shot;
  /** Phone-shaped frame instead of a laptop frame. */
  phone?: boolean;
  features: { title: string; body: string }[];
};

export const brightbase = {
  name: "BrightBase",
  tagline: "The operations system I built to run my own cleaning company.",
  summary:
    "Leads, quotes, scheduling, crew, invoicing and payouts in one app, with an office side, a crew phone app and a customer portal. In daily use at The Maine Cleaning Co.",

  pipeline: [
    { step: "Request", body: "Website forms and Facebook or Instagram lead ads land as requests, deduplicated, with an estimate already attached." },
    { step: "Quote", body: "Build a quote, or let AI draft one from the lead. The customer accepts online and picks their own date." },
    { step: "Schedule", body: "Jobs, recurring visits and rental turnovers from Airbnb, VRBO and Booking.com calendars, synced both ways with Google Calendar." },
    { step: "Crew", body: "Cleaners accept, claim and complete jobs on their phone, with access details, checklists and photos." },
    { step: "Invoice", body: "Invoices go out with a pay-online link. Overdue reminders follow at 1, 7 and 14 days." },
    { step: "Paid", body: "Customers pay through Stripe. Subcontractors are paid per job through Stripe Connect." },
    { step: "Repeat", body: "Recurring series generate the next visits on their own, with skips and reschedules handled." },
  ],

  roles: [
    {
      id: "office",
      label: "Office",
      who: "Owners, managers and office staff",
      features: [
        { title: "One inbox", body: "Gmail, two-way texting and phone calls in one thread per client. Missed calls go to voicemail with a transcript." },
        { title: "Leads that sort themselves", body: "Website and lead-ad requests arrive with an estimate. Automated email is filed out of the way." },
        { title: "Scheduling", body: "Week view, recurring visits, rental turnovers from booking calendars, and Google Calendar sync with conflict checks." },
        { title: "AI drafts, you approve", body: "Replies, quote follow-ups, invoice reminders and a daily brief, drafted by Claude into an approval queue. Nothing sends on its own." },
        { title: "Make it yours", body: "Custom fields on clients, properties, jobs, quotes and invoices. Saved views, light and dark theme, your colors and logo on documents." },
        { title: "Know your numbers", body: "Owner dashboard, money owed by age, profit per property, weekly capacity and the lead-to-quote funnel." },
      ],
    },
    {
      id: "crew",
      label: "Crew app",
      who: "Cleaners and subcontractors, on their phone",
      phone: true,
      shot: {
        src: "/shots/brightbase-crew-schedule.png",
        alt: "The crew phone app: an open turnover to request, and the month schedule. Addresses and pay are blurred.",
      },
      features: [
        { title: "My Day", body: "Today's jobs and the week ahead. Accept or decline, claim open jobs, mark done with notes and photos." },
        { title: "Everything for the job", body: "Door code, wifi, parking, checklist and reference photos, shown only once the job is theirs." },
        { title: "Works without signal", body: "Finished jobs and replies are saved on the phone and sent when it reconnects. Photos wait for WiFi." },
        { title: "Their pay and paperwork", body: "Earnings, W-9 and insurance on file, availability and time off, and chat with the office." },
        { title: "Install it like an app", body: "Adds to the home screen, with push notifications for new and changed jobs." },
      ],
    },
    {
      id: "customer",
      label: "Customer",
      who: "Your clients",
      features: [
        { title: "Quotes they can act on", body: "Accept, decline or ask for changes online, pick a date and time, and download a PDF." },
        { title: "Pay online", body: "Every invoice has a secure Stripe payment page, with a receipt by email." },
        { title: "Their own portal", body: "Passwordless sign-in to see upcoming visits, quotes and invoices." },
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

  proof: [
    { value: "Daily", label: "in use by the office and crew at The Maine Cleaning Co." },
    { value: "4,000+", label: "automated tests run on every change" },
    { value: "3", label: "apps in one: office, crew phone and customer portal" },
  ],

  /* In progress. Shown under its own heading, never mixed into the lists above. */
  comingNext: [
    { title: "Time clock with GPS check-in", body: "Clock in and out on the job, with location at punch." },
    { title: "Your pricing, your services", body: "A settings page for each business's own services, rates and quote templates." },
  ],
};
