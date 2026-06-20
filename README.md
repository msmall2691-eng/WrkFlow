# M Studio

Marketing site for **M Studio** — a web, automation & systems studio
that designs and builds custom websites, workflow automations, and the systems
behind them (CRMs, databases, dashboards, AI agents), and optimizes the processes
a business already runs on, so the whole operation runs faster and cleaner.

Positioned as a guide, not a portfolio: the site teaches what's possible and
goes deep on each service area, with a clean, modern light identity.

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
single variable (`--color-signal`, currently Ion Blue `#2563eb`) so it can be
re-tuned in one place during iteration.

## Iteration backlog

- ~~Hero headline~~ — "Own the systems your business runs on."
- ~~Logo / wordmark treatment~~ — `M Studio / Studios` monospace wordmark
- **Accent color** — Ion Blue `#2563eb` is live; revisiting per v2 (cyan / lime / amber options)
- **Hero motion** — confirm line-field vs. grid vs. subtler
- **Domain** — `mlinx.studio` (`.com`/`.studio` were taken); canonical/OG URLs use the Vercel URL until DNS is wired up
- **Founder reveal** — currently names The Maine Cleaning Company (Option A); toggle via `provingGroundCompany` in `lib/content.ts`
- **Work repos** — confirm `autopilot`, `elite-service-suite`, `align`; decide if `BrightBase` is the flagship card
- Whether to fold **Operational Dashboards** into the CRM/data pillar (7 → 6)
- Real Facebook page link in the footer
