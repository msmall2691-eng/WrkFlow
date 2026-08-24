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
  start/page.tsx        New-client questionnaire (start.mlinx.studio)
  api/questionnaire/    Questionnaire handler
components/             Hero, Shift, Services, Approach, Work, Contact, …
lib/content.ts          Service copy + section content (single source)
lib/questionnaire.ts    Questionnaire steps + fields (single source)
supabase/schema.sql     contact_submissions table
```

## New-client questionnaire

`start.mlinx.studio` is an eight-step intake form a prospective client fills
out before the first call. It lives in this app rather than a separate deploy:
`middleware.ts` rewrites the subdomain onto `/start`, so there's one codebase
and one set of design tokens. `mlinx.studio/start` works as a fallback, and the
page is `noindex` — it's intake, not marketing, and it answers on two hostnames.

`lib/questionnaire.ts` is the single source of truth. Adding or reordering a
question means editing that file only: the form renders from it, and
`/api/questionnaire` validates against it and builds the notification email
from it. The server never takes a question label from the request body, so a
forged payload can't inject its own text into the inbox.

On submit the route sends two emails through the same Gmail SMTP account the
contact form uses — the brief to `CONTACT_TO`, and a copy back to the client.
No new environment variables. Answers are also mirrored to `localStorage` as
the client types, so a closed tab doesn't cost them ten minutes of work.

### DNS setup (one-time)

The code is live as soon as it deploys; the hostname needs pointing:

1. Vercel → the project → **Settings → Domains → Add** → `start.mlinx.studio`.
2. At the `mlinx.studio` registrar, add the `CNAME` Vercel shows you
   (`start` → `cname.vercel-dns.com`).
3. Wait for the certificate to issue, then load `https://start.mlinx.studio`.

Until step 1 is done the subdomain won't resolve — but `/start` on the main
domain is already serving the same page, so it's testable immediately.

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
