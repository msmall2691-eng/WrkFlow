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
      the page says so under each one. Retake them by seeding a local copy
      and capturing at 1440x900 (office) and 390x844 (crew, customer).
      Never put a capture with a real customer's name, address, code or
      phone number in /public/shots.
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

export const brightbase = {
  name: "BrightBase",
  tagline: "The operations system that runs a real cleaning company, every day.",
  summary:
    "Leads, quotes, scheduling, crew, invoicing and payouts in one app, with an office side, a crew phone app and a customer portal. In daily use at The Maine Cleaning Co.",

  hero: { src: "/shots/brightbase/home-dark.webp", alt: "BrightBase home screen in dark mode: today's jobs, new leads, the crew and unread messages.", demo: true },

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
        { title: "My Day", body: "Today's jobs and the week ahead. Accept or decline, claim open jobs, mark done with notes and photos.", shot: { src: "/shots/brightbase/crew-my-day.webp", alt: "The crew app: My Day with today's jobs, pay and access details.", demo: true, phone: true } },
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
        { title: "Their own portal", body: "Passwordless sign-in to see upcoming visits, quotes and invoices.", shot: { src: "/shots/brightbase/customer-portal.webp", alt: "The customer portal: upcoming visits, quotes and invoices.", demo: true, phone: true } },
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
    { value: "3", label: "apps in one: office, crew phone and customer portal" },
  ],

  /* In progress. Shown under its own heading, never mixed into the lists above. */
  comingNext: [
    { title: "Time clock with GPS check-in", body: "Clock in and out on the job, with location at punch." },
    { title: "Your pricing, your services", body: "A settings page for each business's own services, rates and quote templates." },
  ],
};
