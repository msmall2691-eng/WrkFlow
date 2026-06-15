# Workflow Studio

Marketing site for **Workflow Studio** — a systems and automation agency that
builds custom operations software (CRMs, databases, dashboards, automations,
and AI agents) so businesses own their systems instead of renting them.

Positioned as a guide, not a portfolio: the site teaches what's possible and
goes deep on each service area, with a dark, futuristic identity.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** and/or **Gmail** for the contact form backend
- Deployed on **Vercel**

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx            Fonts, metadata, Open Graph
  page.tsx              Section assembly
  globals.css           Design tokens + Tailwind
  opengraph-image.tsx   Dynamic OG image
  sitemap.ts / robots.ts
  api/contact/route.ts  Contact form handler
components/             Hero, Shift, Services, Approach, Work, Contact, …
lib/content.ts          Service copy + section content (single source)
supabase/schema.sql     contact_submissions table
```

## Contact form backend

The `/api/contact` route validates input (with a honeypot for bots) and then,
**if configured**, stores the submission in Supabase and/or emails a
notification via Gmail. If neither is configured it logs the submission, so
the form always succeeds in development.

Copy `.env.example` to `.env.local` and fill in what you want to use:

- **Supabase** — run `supabase/schema.sql`, then set `SUPABASE_URL` and
  `SUPABASE_ANON_KEY` (the publishable key — safe to expose; the table's RLS
  policy grants it INSERT-only).
- **Gmail** — enable 2-Step Verification on the account, create a Google
  [App Password](https://myaccount.google.com/apppasswords), then set
  `GMAIL_USER` and `GMAIL_APP_PASSWORD`. Notifications go to `CONTACT_NOTIFY_TO`
  (defaults to `GMAIL_USER`).

## Design tokens

All theming lives in `app/globals.css` under `@theme`. The signal accent is a
single variable (`--color-signal`, currently Ion Blue `#3b8cff`) so it can be
re-tuned in one place during iteration.

## Iteration backlog

- ~~Final accent color~~ — Ion Blue `#3b8cff`
- ~~Hero headline~~ — "Own the systems your business runs on."
- Logo / wordmark treatment
- Whether to fold **Operational Dashboards** into the CRM/data pillar (7 → 6)
- Real Facebook page link in the footer
