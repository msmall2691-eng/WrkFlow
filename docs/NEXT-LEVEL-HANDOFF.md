# mlinx.studio: next-level plan (Claude Code handoff)

Audit date: Oct 13, 2026 · Repo: `msmall2691-eng/WrkFlow` · Deploys to mlinx.studio via Vercel on merge to `main`

## How to use this file (for Claude Code)

- Work one task (or a small group of related tasks) per branch and PR. Squash-merge is the repo convention. Nothing ships until Meg merges.
- Before opening a PR: `npx tsc --noEmit` and `npx next build` must pass. For any visual change, run `npm run build && npm run start` and screenshot the affected pages at 1440px and 390px wide; look at them before calling it done.
- Follow the rules in `CLAUDE.md` (never invent proof, Meg's voice, motion rules).
- Items marked **Needs Meg** can't be finished by code alone. Build the slot, leave a `TODO(Meg)` that renders nothing, and list it in the PR description.
- Do the phases in order. Phase 1 protects leads; Phases 2–3 are the redesign; Phase 4 adds new features.

## Goal

Meg wants mlinx.studio to win website, web-app and full-stack projects from small businesses. A visitor should know within five seconds what she builds, see real proof that she has built it, and have one obvious way to start. The site today is technically strong but leads with decoration (live weather, ambient animation, theme switcher) instead of her work.

## Already done (Oct 13, 2026)

- PR #106: retired the $749 Starter tier (pricing is now Custom build from $1,500 + Care Plan $49/mo); per-page canonical, Open Graph and share image via `lib/seo.ts` `pageMeta()`; fixed dead `#contact` links on `/tools`; quote calculator carries its quote to the homepage form.
- PR #107: replaced the Autopilot demo (fabricated stats/testimonials) with linx in the Work section; deleted `public/shots/autopilot.png`.

## Phase 1: Don't lose leads (do first, small PRs)

| # | Finding | Where | Fix | Accept when |
|---|---|---|---|---|
| 1.1 | Leads only exist as an email. If Gmail SMTP fails or the env vars are missing, the visitor sees an error and the lead is gone. | `app/api/contact/route.ts` (sendMail ~L129, 502 on failure ~L140), same pattern in `app/api/questionnaire/route.ts`, `app/api/tool-lead/route.ts`; `lib/mailer.ts` | Write every lead to a database first, then email. `@supabase/supabase-js` is already a dependency but unused anywhere; add a `leads` table (name, email, company, phone, message, offer, source, created_at) and insert before sending. If email fails, still return success to the visitor. **Needs Meg:** Supabase project + env vars. | Submitting with SMTP disabled still stores the lead and shows success. |
| 1.2 | Contact form sends no confirmation to the visitor (questionnaire and tool-lead do). | `app/api/contact/route.ts` | First add the same abuse protection `app/api/tool-lead/route.ts` uses for mail to caller-supplied addresses: origin allowlist (`isAllowedOrigin`), a global rate limit alongside the per-IP one, and hard length caps on every field. Without these, an auto-reply turns the endpoint into a mail relay that can burn the Gmail quota and hurt sender reputation. Prefer a durable limiter (see 1.5). Then send a short auto-reply: "Got it. I'll reply within 24 hours. Meg" with a link to book a call. | A request with a foreign `Origin` or oversized fields is rejected before any mail is sent; a normal submission gets the auto-reply. |
| 1.3 | No conversion tracking on the forms that matter. `@vercel/analytics` is installed and `lib/track.ts` tracks free-tool events, but contact and questionnaire submissions are never tracked. | `components/Contact.tsx`, `components/Questionnaire.tsx`, `lib/track.ts` | Add `track("lead_submitted", { source, offer })` on success for contact, questionnaire start/complete, tool-lead, and booking-link clicks. | Events appear in Vercel Analytics. |
| 1.4 | "Book a free 15-min call" doesn't book anything; it scrolls to the form. | `lib/offer.ts` (`call`), `components/Pricing.tsx` strip, Contact | Link to a real scheduler (Cal.com or Google appointment page), opened in a new tab or embedded. **Needs Meg:** the booking URL. | Clicking it shows open time slots. |
| 1.5 | Rate limiting is in-memory per serverless instance, so it barely limits spam. | `lib/rateLimit.ts` | Fine for now. If spam appears, move to Vercel KV/Upstash or Supabase. Add Cloudflare Turnstile only if needed. |, |
| 1.6 | Remaining copy/consistency items from the first audit: mixed "I"/"we" voice; em dashes throughout; "colouring" (UK); location shown as Portland, "Maine coast" and "Southern Maine / New England"; deploy hash `main@…` and a stray "Harbor" label at the bottom of every page; M Linx Site "from $299" undercuts Custom build; hero still leads with integrations; meta description targets cleaning/STR. | `lib/content.ts`, `components/*`, `app/layout.tsx` (`DESCRIPTION`), `components/Footer.tsx`, `components/LiveReadout.tsx` | One voice pass: "I" throughout. Replace em dashes in user-facing copy with commas or periods. One location line: "Southern Maine · clients anywhere." Hide the deploy hash from the public footer. Rewrite `DESCRIPTION` around websites and web apps for small businesses. **Needs Meg:** final M Linx prices. | `grep -c "-"` in user-facing strings is ~0; no "we/our" in Meg's voice. |
| 1.7 | `/lab` (WebGL shader experiment) is public and indexed (canonical falls back to `/`). | `app/lab/page.tsx` | Add `robots: { index: false }` via a `layout.tsx` in `app/lab/`, or delete the route. | `/lab` returns noindex. |
| 1.8 | No lint config and no tests. | repo root | Add the ESLint flat config (`eslint-config-next` is already a devDependency) and a minimal Playwright smoke test: home, about, tools, marketplace, intake return 200 and the contact form submits to a mocked route. | `npm run lint` and `npx playwright test` pass in CI. |
| 1.9 | `autopilot.mlinx.studio` still serves the page with invented stats on Meg's domain. | Vercel project for Autopilot | **Needs Meg:** remove the domain or add a "Demo · sample data" banner. |, |

## Phase 2: Make the work the hero (layout + pages)

> **Update, Nov 1 2026.** Meg replaced the "keep the current look" decision below for the homepage. The homepage is now "V2", a one-screen control panel (black + violet/teal/pink aurora) in `components/ControlPanel.tsx`, styled under `.cp` in `app/globals.css`. It keeps the principles of this phase (real work first, real numbers only, one way to start) but not the old layout or palette. Next up: inner pages (`/tools`, `/work/[slug]`, `/marketplace`, `/about`, `/services`) in the same V2 palette.

**Keep the current look.** Meg prefers the existing visual identity: its colors, type, the live Maine daylight/weather theming and overall feel stay. Every change in Phases 2 and 3 is structural (what's shown, in what order, how it moves), built in the site's existing tokens and components. Do not restyle the site. (An alternate direction was explored on the "mlinx.studio Redesign" canvas and set aside; don't build from it.)

**The core problem.** The most prominent thing on the homepage is a Portland weather widget (`components/LiveReadout.tsx`, `DaylightSky`, `WeatherLayer`, `ReactiveAurora` in `components/Hero.tsx`). It is clever, but it proves you can read a weather API, not that you can build a business's website or app. On a phone it fills an entire screen before Services, and the Work section doesn't appear until roughly the third screen. A prospect deciding in 5 seconds sees fog and wind speed, not your work.

**The principle for every page:** show, don't tell. Every section should either show a real thing Meg built, let the visitor *use* a real thing she built, or ask them to start a project. Anything else gets cut or moved.

### 2.1 Homepage, new order

```
┌ Nav: Work · Services · Pricing · About ·  [Start a project]
├ HERO  left: headline + 1 line + 2 CTAs + price line
│       right: the live Maine weather/daylight panel (kept, Meg's signature)
│              + one caption tying it to client work
├ PROOF REEL  cycling real shipped screens directly under the hero
│              (maineclean.co → linx → Remote Admin → BrightBase dashboard)
├ PROOF STRIP  "10 yrs running a service company · 1,000+ customers · 7,000+ visits"
│              + client logos (The Maine Cleaning Co., The Remote Admin, linx)
├ WORK  2–3 large case-study cards → each opens /work/[slug]
├ TRY IT  one embedded interactive (the instant-quote calculator, re-skinned
│         as "this is the kind of tool I build into client sites")
├ SERVICES  Websites · Web apps · Integrations (in that order, short)
├ PROCESS  4 steps, with what the client sees at each step (screens, not icons)
├ PRICING  Custom build + Care Plan (already simplified in PR #106)
├ FAQ (collapsed)
└ CONTACT  form + "Book a 15-min call" (real calendar link)
```

Tasks:
- **2.1a Keep the live weather hero, and make it sell.** Decided by Meg: the `LiveReadout` panel and the live daylight/weather theming stay in the hero. They are proof she can wire a site to live data. Add one caption under the panel in Meg's voice, e.g. "This page is reading live Maine weather and daylight right now. I connect client sites to their own live data the same way: bookings, inventory, schedules." Link it to the "How this site works" section (2.1f).
  - **Phone:** on screens under 640px, show the panel as a compact one-line strip (sky, temperature, sunset) that expands on tap, so the hero plus the first real screenshot fit within about two screens instead of three.
  - Accept: at 1440px the panel and caption sit beside the headline as today; at 390px the strip is one line, tapping it opens the full panel, and the proof reel starts on the second screen.
- **2.1a-2 Proof reel directly under the hero.** A full-width band with a framed browser and phone mockup that crossfades between 3–4 real screenshots from `public/shots/` (add new captures as needed), each with a one-line caption ("Booking site + back office for a 1,000-customer cleaning company"). Pause on hover/focus and off-screen; reduced motion shows one static frame. Match the LiveReadout card styling so it looks native.
- **2.1b Proof strip** directly under the proof reel: the operating numbers (already in `lib/content.ts` as `provingGround`, attributed to The Maine Cleaning Co.) plus client name marks. Real only; never invent.
- **2.1c Move Work above Services.** In `app/page.tsx`, order: Hero, Proof, Work, Try it, Services, Process, Pricing, Contact.
- **2.1d Services section** (`components/Services.tsx`) currently leaves most of the desktop width empty (narrow accordion on the left). Rebuild as three wide rows, each with a real example screenshot on one side and 3 bullets + "See an example" link on the other. Order: Websites, Web apps, Integrations.
- **2.1e Floating chrome:** the "DAYLIGHT" pill (`AccentSwitcher`) sits on top of cards on phones. Keep it, but move it so it never covers content (e.g. into the footer or nav on small screens). Ask Meg before removing `WorkflowSpine` or the ⌘K button.
- **2.1f "How this site works" (new, short).** A small section (or a panel opened from the hero caption) that explains the live sky as a case study: a 4-box diagram of weather and sun data → `app/api/maine` → page theme (tide drives only the TideLevel graphic on /about, so leave it out of the hero claims), plus two sentences on why it matters for a business ("the same pattern puts your bookings, stock levels or job statuses on your site in real time"). Uses existing components; no new styling.

### 2.2 Case study pages (new): the biggest proof-of-work upgrade

Create `app/work/[slug]/page.tsx` driven by a new `caseStudies` array in `lib/content.ts`. Start with three: **The Maine Cleaning Co.** (site + back office), **linx** (marketplace with Stripe Connect), **The Remote Admin** (client site). Each page:

```
Title + one-line outcome            [Visit live site]
Hero screenshot (full width, device frame)
The problem (2–3 sentences, in the owner's words)
What I built (3–5 bullets, each with a screenshot or short screen recording)
How it works (one diagram: what connects to what)
Stack chips
Result (ONLY real numbers Meg confirms; leave the block out until she does)
Quote from the owner (only if real; Karen/The Remote Admin is the obvious first ask)
Next: "Want something like this?" → contact
```
- Each Work card on the homepage links to its case study (keep the external "visit site" link inside the page).
- Add each case study to `app/sitemap.ts` and give it `pageMeta()` (from `lib/seo.ts`, added in PR #106).
- **Content rule:** Claude Code must not write outcome numbers or quotes. Leave clearly marked `TODO(Meg)` placeholders that render nothing until filled.

### 2.3 About page (`app/about/page.tsx`, `components/FounderNote.tsx`)
- Three different type treatments compete (mono caps labels, sans caps headings, centered serif paragraphs). Use one heading style and left-aligned body text at a readable measure (max ~70 characters).
- "BUILT FROM REAL BUSINESS." appears twice (label and heading). Keep one.
- Put a photo of Meg *working* or of The Maine Cleaning Co. team/vans next to the story; the headshot alone reads as a profile, not a studio.
- Reframe the degree line as "currently completing" and lead with the 10 years of operating.

### 2.4 M Linx page (`app/marketplace/page.tsx`)
- The giant "M LINX" background wordmark (`HeroWordmark`) overlaps and obscures the intro paragraph on desktop. Move it behind empty space or drop it.
- Digital Welcome Book card shows an empty "LIVE PREVIEW" area; M Linx Tools card shows a plain "Tool" placeholder. Give every card a real screenshot or a designed illustration.
- Replace the em dash in the heading ("M Linx—premade tools…") and fix the pricing conflicts noted in Phase 1.

### 2.5 Typography (light touch, same look)
Keep the current typefaces and feel. Two small cleanups only:
- Fraunces (serif) is used for some body paragraphs on About; check with Meg before changing it.
- The tracked-out ALL-CAPS label above every section ("SERVICES", "WORK", "PRICING") repeats the heading below it. Keep it where it adds information; drop it where it only repeats the heading.

## Phase 3: Motion that shows the work (actions + movement)

**Current state.** 18 CSS keyframe animations in `app/globals.css`, a `Reveal` fade-up wrapper on almost every section (imported in 18+ files), magnetic buttons, aurora backgrounds, scroll progress bar, Konami easter egg, console greeting. Lots of motion, but it's ambient decoration; none of it shows what Meg builds or responds to what the visitor does. Fade-up on every section is the generic default and reads as a template.

**Principle:** motion should either (a) demonstrate a system working, or (b) respond to the visitor's action. One orchestrated moment per page, not effects everywhere.

Build these, in this order:

1. **Proof reel** (2.1a-2): screens crossfade with a subtle device-frame scroll inside each screenshot (the page "scrolls" inside the frame), 4–5s per screen. Pauses on hover/focus and off-screen. Together with the live sky in the hero, this is the homepage's ambient motion; nothing else loops.
2. **"Watch it connect" sequence** (replaces the static Integrations copy): a scroll-scrubbed diagram where a booking is made on a website → appears in the CRM → lands on a calendar → triggers a text, each step lighting up as the visitor scrolls. Reuse the existing `components/WorkflowDemo.tsx` / `WorkflowMap.tsx` logic (currently only on `/marketplace`) and the real Maine Cleaning flow as the example. Scrubbed by scroll position, not on a timer.
3. **Case study scrollytelling** (2.2): the hero screenshot stays pinned while the "What I built" bullets scroll past; each bullet swaps the pinned screen to the matching view. CSS `position: sticky` + IntersectionObserver; no heavy library needed.
4. **Interactive "Try it" block** on the homepage: the instant-quote calculator from `/tools` (`components/QuoteCalc.tsx`) in a compact form. Moving a slider updates the price live with a number tween. This is motion caused by the visitor and is direct proof.
5. **Responsive micro-interactions only where they confirm an action:** form send (button → checkmark → "Sent. I'll reply within 24 hours."), copy-to-clipboard, FAQ open/close height animation, nav menu open.

Remove or reduce:
- `Reveal` on every section → keep it on at most the Work cards and case study blocks; remove elsewhere.
- `ScrollProgress`, `KonamiEgg`, `ConsoleGreeting` (fun, but not for prospects; keep ConsoleGreeting if desired, it's invisible to them).
- `CountUp` on prices (numbers that animate make prices feel like a gimmick).

Motion system rules (put these in a comment at the top of `globals.css` and follow them):
- Durations: 150ms for hovers/toggles, 250–350ms for panels and reveals, 600ms max for the hero sequence. One easing curve, e.g. `cubic-bezier(.2,.7,.2,1)`.
- Animate only `transform` and `opacity`.
- Every animation has a `prefers-reduced-motion: reduce` fallback that shows the end state.
- Only two things loop: the proof reel and the existing live sky in the hero (`DaylightSky` drift, `WeatherLayer`, `AuroraSwell`). Both pause when off-screen (IntersectionObserver) and when the tab is hidden; the proof reel also pauses on hover/focus. Under `prefers-reduced-motion: reduce` the sky shows a static frame of the current conditions. Nothing else loops.
- Accept: on a mid-range phone, scrolling the homepage stays smooth (no long tasks over 50ms from animation code in the Performance panel).

## Phase 4: New things to build (level up)

Ranked by lead impact:

1. **Real booking.** "Book a free 15-min call" opens a real scheduler (Cal.com embed or Google Calendar appointment page). Meg needs to create the booking page; Claude Code wires it in everywhere the call CTA appears (`lib/offer.ts` `call` offer, Pricing strip, Contact).
2. **Free website teardown (lead magnet).** `components/SiteCheck.tsx` already runs a Lighthouse check. Turn it into: enter your URL + email → get a scored report on screen + "Want me to fix these? Book a call." Store the lead the same way contact leads are stored.
3. **Show off the concept preview.** The questionnaire already generates AI site concepts before the final step (`components/Questionnaire.tsx`, gated on `ANTHROPIC_API_KEY`). It's the most impressive thing on the site and it's hidden behind a "Begin" button. Put a short recording or screenshot of it on the homepage ("Answer 10 questions, see 3 concepts of your site"). Confirm `ANTHROPIC_API_KEY` is set in Vercel production; if it isn't, the promise on the intake page is false.
4. **Before/after slider** on case studies where an old site existed (drag to compare). Strong proof for website work.
5. **Short screen recordings** (8–15s, muted, looped, with poster image) of linx and the BrightBase dashboard in use. Real product in motion beats any CSS effect. Meg records; Claude Code adds a `<VideoShot>` component with lazy-loading, poster and reduced-motion fallback to the poster.
6. **Testimonials block** wired to `lib/content.ts` `testimonial` (already renders nothing when empty). Meg collects 2–3 real quotes.

7. **"Try it with your town."** A small input on the live hero panel: a visitor types their town or ZIP and the sky, temperature and daylight switch to their location, with a "Back to Maine" reset. Reuse the existing weather/daylight code behind `app/api/maine`; add a geocoding lookup and cache responses. Rate-limit the endpoint. Reduced motion: switch instantly. Track `hero_town_tried`.
8. **"Live local" add-on for clients.** Package the live panel as a product: weather, daylight, business hours or wait times on a client's homepage (The Remote Admin already has a live Amherst panel). Add it to the M Linx catalog in `lib/content.ts` with The Remote Admin as the real example. **Needs Meg:** price.

## Phase 5: Polish and measure

- **Accessibility pass:** visible focus ring on every interactive element; color contrast on the small mono labels (several are light grey on cream); `alt` text on every work screenshot describing what the screen shows; form errors announced (`aria-live`). Run axe on each page; fix all serious/critical issues.
- **Performance pass:** 46 files are `"use client"`. After Phase 2/3 removals, re-check which still need to be client components; lazy-load the tools and any canvas/animation below the fold; serve screenshots through `next/image` with `sizes`. Run Lighthouse on mobile for `/` and a case study; target LCP < 2.5s, CLS < 0.1.
- **SEO pages:** one page per service (`/websites`, `/web-apps`, `/integrations`) built from the same components as the homepage sections, each linking to the relevant case studies. Add them and the case studies to `app/sitemap.ts`. The JSON-LD in `app/layout.tsx` is already a `ProfessionalService`; add `sameAs` (LinkedIn, Facebook) and the case study URLs.
- **Measure:** after launch, compare weekly `lead_submitted` events and booking clicks against the four weeks before.

## Needs Meg (collect before or during the work)

- Price for the "Live local" add-on (Phase 4, item 8).

- Booking page URL (Cal.com or Google appointment schedule).
- Supabase project (or approval to use an existing one) for lead storage.
- 2–3 real testimonials with name and business (Karen / The Remote Admin first).
- Real outcome numbers for each case study, if any (e.g. "quotes now take 2 minutes instead of 20").
- 8–15s screen recordings of linx and the BrightBase dashboard in use.
- A photo of her working or of The Maine Cleaning Co. in action for the About page.
- Final M Linx product prices; decision on `autopilot.mlinx.studio`; custom domain for linx.

## Suggested PR order

1. Phase 1.1–1.4 (lead storage, auto-reply, tracking, booking), one PR.
2. Phase 1.6–1.8 (copy pass, `/lab`, lint + smoke tests), one PR.
3. Phase 2.5 + Phase 3 removals (fonts, labels, floating chrome, `Reveal` cleanup), clears the ground.
4. Phase 2.1 (homepage reorder, proof reel, proof strip, services rows).
5. Phase 2.2 + Phase 3.3 (case study pages with scrollytelling).
6. Phase 3.2 + 3.4 (watch-it-connect sequence, Try it block).
7. Phase 2.3–2.4 (About, M Linx).
8. Phase 4 items as Meg supplies the inputs.
9. Phase 5.
