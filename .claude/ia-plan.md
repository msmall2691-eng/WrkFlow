# IA reorganization plan

Read-and-report, Nov 27 2026. No files changed by this pass.

Meg's ask, verbatim: *"i want this site to be useful and give a pleathera of
things that can use love the free tools etc.. but id like them to see them
sooner and then the full website demos and crms etc.. and more of the turnover
schdele tool and the web apps and integrations we can use with their current
systems or their own build... we also do customer portals and booking sites,
and sites and workflows for different industries - i dont wanna take off any
thing really but it all needs to pull in the potational user"*

Plus, earlier in the same conversation: the site reads like *"a vibe coder"*,
and as a normal person she wouldn't know *"if im even in the right place"*.

---

## 0. The one-paragraph diagnosis

Nothing is missing from the site. Almost everything Meg named already exists,
with a real capture behind it. **The problem is that the approved homepage
links to five destinations and the site has seventeen.** The homepage's six
sections contain exactly nine outbound links, and not one of them goes to a
free tool, a demo, the turnover planner, the welcome book, BrightBase or a
portal. The repo already knows this: `e2e/smoke.spec.ts:1218` has a test
called *"every finished thing is reachable from the homepage"* whose comment
block says, in writing, that `/turnover`, `/welcome-book` and the three demos
*"are one hop further away than they were, and that is worth saying out loud
rather than discovering later."* This is that later.

---

## 1. Route inventory

Seventeen public routes (plus `/lab`, noindex via `app/lab/layout.tsx:10`).

| Route | Look | What it contains | Proof of |
|---|---|---|---|
| `/` | `.stage` | Hero, Services, Work, Approach, Pricing, Contact | the four services; 4 of 9 projects |
| `/services` | `cp cp-inner` | `Services` (4 services, full: pain/outcome/kinds/example), `ForRentals`, `Pricing` (the ladder), `Contact` | all four services, with the 3-rung ladder |
| `/catalog` | `cp cp-inner` | `CatalogBrowser` over `lib/catalog.ts`: 30 items, 7 categories, "Try it live" row | the whole offer, with a price on every row |
| `/marketplace` | `cp cp-inner` | welcome-book band, `MarketCatalog` (8 `marketItems`), `WorkflowMap`→`IntegrationMapper` | buyable products; the interactive integration picker |
| `/tools` | `cp cp-inner` | `Playground`: **8** free tools (quote, invoice, signature, vcard, QR, UTM, sitecheck, cost) | capability, usable now, no signup |
| `/turnover` | `cp cp-inner` | `TurnoverPlanner` (paste an ics, get the schedule) | the integrations service, as a working thing |
| `/about` | `cp cp-inner` | `FounderNote`, `Approach`, `Stack`, `GitHubProof` | the person, the stack, the public repo history |
| `/work/[slug]` | `cp cp-inner` | 3 case studies: maine-cleaning-co, linx, the-remote-admin | one project end to end |
| `/brightbase` | `.cp` | pipeline, 3 roles (office/crew/**customer portal**), data model, 8 integrations | custom software + portals, deeply |
| `/demo` | `.cp` | index of the three demos | — |
| `/demo/shop` | plain | Fathom & Fog storefront | catalog, options, cart arithmetic |
| `/demo/studio` | plain | Blue Hour Bodywork | **real booking availability** |
| `/demo/directory` | plain | Midcoast Growers | combining filters |
| `/welcome-book` | `.cp` | the $99 product page, live example, reserve form | the one thing with a buyable price |
| `/intake` | `.cp` | `Questionnaire` | — (lead capture) |
| `/privacy`, `/terms` | `.cp` (`LegalShell`) | legal | — |

### On the converted-route count

**CLAUDE.md's "six converted, twelve outside" is correct for `main`.** The
table above reads seven because of work that landed on this branch while this
audit was being written: `claude/turnover-polish` commit `d6609f3` converts
`/turnover` (`app/turnover/page.tsx` swaps `PanelHeader` → `StageTopBar` and
`.cp` → `cp cp-inner`, plus ~145 lines in `components/TurnoverPlanner.tsx` and
a `DAYLIGHT_ROUTES` move in `e2e/smoke.spec.ts`). On `main`, `/turnover` still
wears `.cp` and `PanelHeader`.

So: **six** converted today, **seven** once that branch lands, and the twelve
outside become eleven. Sequence this plan behind that branch, and do not count
`/turnover` as converted until it merges. Two comments will go stale when it
does, and the branch should fix them as part of itself:
`components/stage/StageTopBar.tsx:68-70` and the `.cp-inner` note at
`app/globals.css:~3700`, both of which list `/turnover` among the unconverted.

---

## 2. The five factual answers

### 2a. Customer portals — YES, named in six places

| Where | Line | How it reads |
|---|---|---|
| `lib/content.ts` | **287** | `"Client & team portals"`, a `kinds` chip under **Custom software** |
| `lib/catalog.ts` | **248-258** | `customer-portal` → *"Customer portal"*, status `built`, proof → `/brightbase`, real capture `brightbase/customer-portal.webp` |
| `lib/catalog.ts` | **295-304** | `parent-portal` → *"Family portal with QR check-in"*, proof → the **live** `lacexplorers.online/portal`, capture `catalog/live-portal.webp` |
| `lib/catalog.ts` | **77** | a whole category: `apps` → *"Apps & portals"* |
| `lib/content.ts` | **1238** | ladder `build` rung: *"Dashboard, CRM or client portal"* |
| `lib/brightbase.ts` | **98**, **117** | *"Their own portal"*; *"3 apps in one: office, crew phone and customer portal"* |

Also `lib/content.ts:525-532` — Arrowhead Explorers is filed `category:
"software"` specifically *because* the portal is the distinctive half, and
`lib/schema.ts:112` puts "client portals" in the structured data.

**Confirmed, and it is stronger than assumed.** The homepage *does* show the
words, as a chip in `StageServices`' `.kinds` list. What it does not show is
the picture, and two real portal captures exist on disk.

### 2b. Booking sites — YES, named in five places

| Where | Line | How it reads |
|---|---|---|
| `lib/content.ts` | **266** | `"Online booking"`, a `kinds` chip under **Turning visitors into booked work** |
| `lib/catalog.ts` | **187-198** | `booking` → *"Online booking"*, status `built`, demo → `/demo/studio`, proof → the **live** `maineclean.co/book`, capture `catalog/live-book.webp` |
| `lib/content.ts` | **1030-1046** | `marketItems` `booking-app` → *"M Linx Booking"* |
| `lib/content.ts` | **1091-1096** | demo `/demo/studio`, which proves real availability |
| `lib/content.ts` | **456**, **724** | *"Marketing + booking site"* on The Maine Cleaning Co. and its case study |

Confirmed. One caveat worth knowing: *"Direct booking site for rentals"*
(`lib/catalog.ts:457-465`) is `status: "workbench"` — **not built**, listed as
text only. Do not promote that one.

### 2c. Industry-specific sites and workflows — **NO. This is the real gap.**

Greps for `industry|industries|vertical|niche` across `lib`, `app`,
`components` return nothing visitor-facing except:

- `lib/content.ts:1401` — `homeHero.eyebrow`: *"For contractors, admin firms
  and service businesses"*. One line, three audiences, on the hero. That is
  the entire industry story the site tells.
- `lib/content.ts:1282-1309` — `forRentals`, an audience band, with a comment
  explicitly recording that it is *"deliberately not a fifth service"*.
  Renders on `/services` only.
- `lib/catalog.ts:78` — a `rentals` category, *"Rental hosts"*.
- `lib/catalog.ts:119-140` — two sector-named items, `trades-site`
  (*"Contractor & trades website"*) and `firm-site` (*"Professional services
  website"*), both with a real live proof link.
- `components/QuoteCalc.tsx:29` — an `INDUSTRIES` map (cleaning, lawn,
  handyman, petcare). **Not usable as proof.** Its own comment at line 17 says
  *"reasonable placeholder numbers"* and *"Meg: tune INDUSTRIES after launch."*

There is no `industries[]`, no `/for/[industry]` route, no industry taxonomy,
and `lib/questionnaire.ts` does not even ask what business somebody is in.

**What an industry page could honestly contain today.** Five sectors have real,
shipped, captured work. Each of these is a page that invents nothing:

| Sector | The real work | Real captures on disk |
|---|---|---|
| Cleaning & home services | The Maine Cleaning Co. (case study), BrightBase, Instant Estimate, linx | `maineclean.webp`, `brightbase/*`, `instant-estimate.webp`, `linx.webp` |
| Short-term rentals | The Keystone House, Digital Welcome Book, Turnover Planner, turnover sync | `keystone.webp`, `catalog/welcome-book.webp`, `catalog/turnover.webp`, `brightbase-crew-schedule.webp` |
| Construction & trades | Nash Construction | `nash.webp`, `catalog/live-nash.webp` |
| Admin & professional services | The Remote Admin (case study) | `remote-admin.webp` |
| Childcare & programs | Arrowhead Explorers + parent portal | `arrowhead.webp`, `catalog/live-portal.webp` |

**The trap, head-on.** An industry page is honest when it says *"here is the
system a business in this sector is running, and here is the workflow it
runs"* — a real screenshot, a real named build, and the stages of that
sector's job (for rentals: booking lands → turnover scheduled → crew assigned
→ guest gets the book). It becomes a lie the moment it says *"we serve the X
industry"* with a logo wall, a client count, or a sixth sector with nothing
behind it. **Build five, not twelve.** Anything else is `TODO(Meg)`.

Two sectors Meg may name that have **no** proof and must not get a page:
restaurants/hospitality, and medical/dental. Nothing in the repo backs either.

### 2d. The free tools — one click from the homepage on a desktop, two on a phone

- **Desktop header:** `homeNav` (`lib/content.ts:1495-1500`) is Services /
  Work / Pricing / **Free tools → `/tools`**, rendered by `StageTopBar`
  (default `nav = homeNav`, line 78). **1 click.**
- **Footer:** `homeFooterNav` (`lib/content.ts:1562`) carries *Free tools*.
  **1 click.**
- **Phone:** the bar drops its links below 860px. The menu renders `siteMenu`
  (`StageTopBar:319`), which does include `/tools`. **2 taps.**
- **The body of the homepage: zero links.** All six sections contain nine
  outbound links total, and none is to a tool. `StagePricing` mentions *"the
  calculators on this site are free to use today"* in `homeBands.pricing.note`
  as **unlinked prose** (`lib/content.ts:1485`).
- Deeper in: `/catalog` has an `8 free business tools` card with eight chips
  (`lib/catalog.ts:423-445`); the ladder's `try` rung on `/services` links
  three of them individually.

So she is right. A tool is one click away and **zero pixels** of the page a
visitor actually scrolls say so.

### 2e. The turnover planner — not in any nav, 2 clicks minimum

`/turnover` has **no** inbound link from the homepage, the top bar, or the
footer. Every route in:

| Path in | Clicks from `/` |
|---|---|
| `/` → `/services#integrations` → `ForRentals` extra (`lib/content.ts:1307`) | **2** |
| `/` → `/catalog` (Work section foot) → `turnover-planner` card "Use it now" (`lib/catalog.ts:349`) | **2** |
| `/` → `/services` → ladder `try` rung (`lib/content.ts:1251`) | **2** |
| ⌘K (`components/CommandPalette.tsx:142`) | 1, if you know ⌘K exists |

It is in `app/sitemap.ts:86`. `components/home/TryItNow.tsx:16` records that
this exact page was once *"not in the header, not on the homepage, not in the
footer, not in the command palette, and not even in the sitemap"* — four of
those five were fixed; the homepage one came back when the design changed.

---

## 3. Three ready-made assets nobody can see

CLAUDE.md lists nine components with no caller. Three of them were built for
precisely the complaint Meg just made again. Verified orphaned (the only
references are comment mentions in `app/page.tsx` and cross-references among
themselves):

1. **`components/home/TryItNow.tsx`** (179 lines) — the three demos, the
   welcome book and the turnover planner, in one band. Its header comment
   quotes Meg: *"those demos we made should be something people see right
   away"*, *"the airbnb digital welcome book is hidden"*.
2. **`components/home/WhatConnects.tsx`** (132 lines) — eight real
   integrations (Airbnb/Vrbo/Booking.com, Stripe, Twilio, Google Calendar,
   Gmail, Stripe Connect, Facebook & Instagram lead ads, Claude) from
   `lib/integrations.ts`, each citing the exact repo record that backs it,
   with `e2e/smoke.spec.ts:1290` resolving every one. **This is the
   "integrations with their current systems" answer, already built and already
   test-backed, rendering nowhere.**
3. **`components/home/Shelf.tsx`** (173 lines) — the catalog, shelved by
   audience.

**They cannot be dropped into the homepage as-is.** They are written in `.cp`
utilities (`var(--cp-ink)`, `var(--cp-muted)`,
`border-[color:var(--cp-line)]`). `app/globals.css:2220` declares the design's
tokens for `.stage, .cp-inner`, and only **`.cp-inner`** (line 3703) re-points
`--cp-*` at them. The homepage is bare `.stage` — no `.cp`, no `.cp-inner` — so
every `--cp-*` would be **undefined**: muted and faint text collapse to
near-white, and `border-color: var(--cp-line)` falls back to `currentColor`,
giving near-white hairlines on near-black. That renders, passes the build,
and looks wrong — the exact failure class CLAUDE.md's *"measure, then look at
it"* rule names.

**So reuse the data, not the markup.** `.stage` already provides the vocabulary
these sections need: `.band`, `.wrap`, `.band-head`, `.eyebrow`, `.cards`,
`.frame`, `.chrome`, `.card-cap`, `.card-cat`, `.stack`, `.kinds`, `.svc-row`,
`.tlink`, `.plist`, `.promises`. A new `.stage` section is a 60-100 line
component with no new CSS.

---

## 4. Proposed homepage order

**This alters a design Meg approved by looking at it, so it is her call, not
ours.** Her instruction ("see them sooner", "don't take anything off") cannot
be satisfied inside six sections, because the thing she wants seen sooner is
not on the page at all. Below: the current six in their order, three insertions,
nothing removed, nothing reordered among the approved six.

```
  1  StageHero          unchanged
  2  StageServices      unchanged (4 rows; portals + booking already chips here)
  3  StageTry       ←   NEW. free tools, 3 demos, turnover planner, welcome book
  4  StageWork          unchanged (feature + 3 cards + → /catalog)
  5  StageConnects  ←   NEW. the 8 proven integrations
  6  StageIndustries ←  NEW. 5 sectors, each → a real build  [stage 3, see §6]
  7  StageApproach      unchanged
  8  StagePricing       unchanged
  9  Contact            unchanged
 10  StageFooter        + 3 links
```

**Why `StageTry` sits at 3, above the Work section.** Meg asked to see the free
things *sooner*. Position 3 is the first scroll after the services rows, which
is as early as it can go without putting invented demo businesses above the
real work — and `TryItNow`'s own comment argues that invented storefronts above
the one confirmed outcome *"would trade the argument for the novelty."* That
argument was written when the band was proposed for position 6. At position 3
the compromise is: **the free tools and the turnover planner lead the band**
(both real, both Meg's own, no invented business anywhere), and the three demos
follow inside the same band, each carrying its existing "this is a demo" label.
If Meg wants the demos higher still, that is a one-line reorder inside one
component.

**Why `StageConnects` sits at 5, below Work.** An integration tile reads as
evidence only after a visitor has seen the systems it is running in. It names
BrightBase and the turnover work; `#work` has just argued them.

### What each new section contains, and what it may not

**`StageTry` (id="try")** — no new copy, no new numbers.
- Free tools: the count comes from `Playground`'s `TOOLS` array length (8),
  computed, never typed — CLAUDE.md's rule about `ServiceRouter`'s project
  count. Capture: `public/shots/tools.webp` (real capture of this site's own
  `/tools`). Links to `/tools`, and the three ladder `try` hrefs
  (`?tool=quote`, `?tool=sitecheck`, `?tool=cost`) already in `lib/content.ts`.
- Turnover Planner: copy from `forRentals.extra` (`lib/content.ts:1303-1308`),
  capture `catalog/turnover.webp`, link `/turnover`.
- Three demos: `demos[]` (`lib/content.ts:1078-1106`) — `kind`, `name`,
  `what`, `proves` already written. Captures `catalog/demo-shop.webp`,
  `demo-studio.webp`, `demo-directory.webp`. Each card keeps a label saying the
  business is invented; `e2e/smoke.spec.ts` already asserts that on each demo
  page and the same rule applies to a card previewing one.
- Welcome book: `marketItems` `welcome-book`, price resolved from there
  (`$99 intro · reg. $149`), capture `catalog/welcome-book.webp`, link
  `/welcome-book`.

**`StageConnects` (id="connects")** — `integrations` and `provenIn` from
`lib/integrations.ts`, eight tiles, no links on the project names (that was
`WhatConnects`' own deliberate call). Nothing new may be added to that array
without a `proof` record; the existing test fails on an unresolvable one.

**`StageIndustries` (id="industries")** — five rows, one per sector in §2c.
Each row: the sector, the real build, the real capture, and a link to that
build's existing destination (`/work/maine-cleaning-co`,
`/work/the-remote-admin`, `/welcome-book`, `/catalog?c=rentals`,
`lacexplorers.online`). **No sixth row. No client count. No outcome number.**
The copy for each row's workflow line is the only genuinely new prose in this
whole plan, and it should be drafted from each build's existing `blurb` and
`flow` nodes rather than written fresh. If a sector's line cannot be written
from existing records, leave `TODO(Meg)` and render the row without it.

### Nav changes

**`homeNav`** (desktop bar, 4 items) → 5: add `{ href: "#try", label: "Try it" }`
after Services. The bar's `spy` already names whichever band crosses the middle
of the screen, so the new anchors get a free where-you-are label.

**`siteNav`** (inner-page bar, 6 items) — add nothing. CLAUDE.md records the
sixth link as a decision of Meg's, and a seventh is hers too. But **note the
real inconsistency**: `siteNav` has `/demo` and `/brightbase` and does *not*
have `/tools`, while `homeNav` has `/tools` and not the other two. So *Free
tools* is in the homepage bar and vanishes from the bar on every inner page.
That is a one-line fix in `siteNav` and it is a content decision, so: ask.

**`siteMenu`** (phone menu) — carries `/tools` and `/marketplace` already. Add
`/turnover` and `/welcome-book`; the menu's own comment says it is *"a choice
about what the site contains"*, which is exactly what those two are.

**`homeFooterNav`** (6 items) → 9: add Demos (`/demo`), BrightBase
(`/brightbase`), Turnover planner (`/turnover`).

### Not moving, and why

- The four `services` rows, their order, and their `kinds` chips. "Client &
  team portals" and "Online booking" are already on the homepage as chips.
  Promoting either to a fifth service would break the four-category decision
  CLAUDE.md spends a page defending.
- `/catalog` stays the index. `homeBands.work.allHref` already points there
  and its comment records why it is not `/work`.
- The ladder stays on `/services`. Three rungs beside each other is the "easier
  to obtain" answer already shipped.
- Nothing is deleted. The nine orphaned components stay orphaned except the
  three whose *data* gets reused; deletion is a separate change with
  `seam-check-before-removal` per CLAUDE.md.

---

## 5. What each change costs

Ordered for sequencing. Each row is one branch and one PR.

| # | Change | Files touched | New CSS | New copy | Size |
|---|---|---|---|---|---|
| 0 | **Merge `claude/turnover-polish` (`d6609f3`) first.** Before that PR goes up, fold in the two comments it makes stale: `components/stage/StageTopBar.tsx:68-70` and `app/globals.css:~3700` both still list `/turnover` as unconverted, and CLAUDE.md's six/twelve becomes seven/eleven | `CLAUDE.md`, `StageTopBar.tsx`, `globals.css` (comments only) | none | none | XS |
| 2 | **Footer + phone menu reach** — 3 footer links, 2 menu links | `lib/content.ts` (`homeFooterNav`, `siteMenu`) | none | labels only | XS |
| 3 | **`StageTry`** | new `components/stage/StageTry.tsx`; `app/page.tsx`; `lib/content.ts` (`homeBands.try`, `homeNav`); `e2e/smoke.spec.ts` | none (reuses `.band`/`.cards`/`.frame`) | 1 eyebrow + 1 heading | **L** |
| 4 | **`StageConnects`** | new `components/stage/StageConnects.tsx`; `app/page.tsx`; `lib/content.ts` (`homeBands.connects`) | none | 1 eyebrow + 1 heading | **M** |
| 5 | **`siteNav` gets Free tools** (ask Meg first) | `lib/content.ts` | none | none | XS |
| 6 | **`StageIndustries`** | new `components/stage/StageIndustries.tsx`; new `lib/industries.ts`; `app/page.tsx`; `lib/content.ts`; `e2e/smoke.spec.ts` | none | 5 sector lines, each from existing records | **L** |
| 7 | *(optional, later)* 5 × `/for/[industry]` routes | `app/for/[slug]/page.tsx`, `lib/industries.ts`, `app/sitemap.ts` | none | per-sector workflow prose | **XL — needs Meg** |
| 8 | *(optional, later)* convert the remaining 10 routes to `cp-inner` | 10 × `page.tsx`, `components/LegalDoc.tsx` | none | none | M, mechanical |

### Tests that must change, and one that must be written

- `e2e/smoke.spec.ts:1218` *"every finished thing is reachable from the
  homepage"* — `MUST_REACH` is currently `["/tools", "/marketplace",
  "/catalog", "/services", "/about"]`. Add `/turnover`, `/welcome-book`,
  `/demo`, `/brightbase`. **This is the test that encodes Meg's complaint; make
  it enforce the answer.**
- `e2e/smoke.spec.ts:1338` *"every picture on the homepage is a real
  capture"* — the name says "the homepage" and the body is scoped to
  `#work img`. Every new band adds pictures that test will not look at. That
  is CLAUDE.md's "quiet half" trap verbatim. **Widen it to every `img` under
  `#main`, resolving each `src` against `public/`**, or the honesty rule stops
  covering the parts of the page this plan adds.
- `e2e/smoke.spec.ts:523` *"the work section is unique"* — the no-repetition
  assertion is scoped to `#work`, so naming BrightBase in `StageConnects` or a
  sector row does not break it. No change needed; worth knowing before someone
  "fixes" it.
- `e2e/smoke.spec.ts:287` *"the homepage's controls are big enough to hit on a
  phone"* — sweeps the whole page, so every new card link must clear the
  coarse-pointer floor.
- **New:** assert the free-tool count on the homepage equals `Playground`'s
  `TOOLS.length`, the way `ServiceRouter`'s project count was asserted. A hand-
  typed "8" is a claim about evidence.

### Before any PR

`npx tsc --noEmit`, `npx next build`, then `npm run build && npm run start`
and screenshot `/` at 1440px and 390px **and look at it**. The homepage has no
Daylight branch (`app/globals.css:2200-2208`), so there is only one theme to
check here — but every new section must be looked at in a reduced-motion
context too, since `data-reveal`'s hidden state is `opacity: 0` and the
observer never fires when nothing scrolls.

---

## 6. Decisions only Meg can make

1. **Does the approved homepage grow from six sections to nine?** She picked
   "Cinematic" by looking at it. Changes 3, 4 and 6 add to it. Build them, show
   her the page on her phone, let her pick — *build the thing before asking
   which thing*, which is the method CLAUDE.md records as the one that worked.
2. **Which five industries, and is five the list?** No sixth gets a row without
   real work behind it.
3. **Does *Free tools* belong in `siteNav`?** It is in the homepage bar and in
   neither inner-page bar.
4. **Do the three demos sit above or below `#work`?** The plan puts them inside
   `StageTry` at position 3, below the services rows and above the work. The
   previous component argued for below.
5. Every empty proof slot stays empty: `testimonial` (`lib/content.ts:105`),
   `WorkItem.metric` (unset on all nine), `caseStudies[].results` (empty on
   linx and The Remote Admin), `resumeUrl`. Nothing in this plan fills one.
