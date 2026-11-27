# M Studio — copy proposal

**Written:** Nov 27, 2026, as a proposal only. No source file was edited by the
agent that wrote it, nothing was committed, git was not touched.

**Status, as of commit `129515e`.** Tier A was applied by hand after this file
was written, and **13 of its 17 items are now live**, each matching the `NEW`
line here exactly. The four still outstanding are **A8** (`Questionnaire.tsx`
line 516, "we never sell your information" plus a prose em dash), **A10**
(`app/demo/page.tsx`, "most of what I build"), **A12** (`app/catalog/page.tsx`,
"built around how you work") and **A17** (`app/welcome-book/page.tsx`, "tell me
about your rental and I'll take it from there"). All of **Tier B** is
outstanding.

One correction this file owes that commit: **A16 had a twin.**
`app/api/contact/route.ts` carried "we'll find a time" **twice**, once in the
HTML auto-reply and once in the plain-text version beside it. The audit quoted
only the HTML one. Both are fixed now, and the lesson generalizes: the
transactional email bodies in `app/api/*/route.ts` exist in HTML and plain-text
pairs, so any copy change in one of them wants a grep for the other.

**Read against:** `.claude/brand-voice-guidelines.md` (governing),
`CLAUDE.md` "Never invent proof" and "Voice and copy" (law), and every
visitor-facing string in `lib/content.ts`, `lib/catalog.ts`, `lib/schema.ts`,
`components/*` and `app/*` except `app/privacy` and `app/terms`.

**One caveat about applying this.** `lib/content.ts` was being edited
concurrently while this was written, so the `WAS` strings in **Tier B** were
read at one moment and may have moved. Every `WAS` below is quoted character
for character from the file as it stood; check the ones in `content.ts` before
applying. No Tier A item touches `content.ts` or `brightbase.ts` at all.

**Size, and how to cut it down.** 37 changes, in two tiers that want different
kinds of attention:

- **Tier A (17) is not a matter of taste.** Every one breaks a rule that is
  already written down and shipping anyway: five `let's`, four `we`, two `I`,
  four em dashes in prose, three "around your X", and one claim of a team that
  does not exist. These can be applied without a judgment call, and **not one
  of them is in `lib/content.ts`**, so none collides with work in progress.
- **Tier B (20) is judgment.** If only ten are wanted, take **B1 to B8 and
  B13**. Those are the four service rows, the founder paragraph, the two CTAs,
  the last approach step, and the one place on the site that promises an
  outcome it cannot back. Tier B items are numbered in the order they appear in
  section 3.

Everything deliberately left alone is listed in section 4, and the places where
the guidelines and "high end" pull in different directions are in section 6.

---

## 1. What makes the current copy read as AI slop

Six patterns. All six are measured from the actual files, not asserted.

### 1.1 The same reassurance, eight times, twice on one page

The phrase "scope and price agreed before work begins" exists in eight
variants:

| Where | Text |
|---|---|
| `app/services/page.tsx:78` (metadata) | "Scope and price agreed before work begins." |
| `app/services/page.tsx:125` | "Scope and price are agreed with you before any work begins." |
| `components/Pricing.tsx:55` | "Scope and price are agreed with you before any work begins." |
| `components/FAQ.tsx:23` | "...you get a written scope and quote before anything starts." |
| `components/FAQ.tsx:47` | "...so you know what you're paying before anything starts." |
| `lib/content.ts:290` | "...is agreed before anything starts." |
| `lib/content.ts:1241` | "Features and handover agreed before work starts." |
| `lib/content.ts:1279` | "Scoped and priced with you before anything starts." |

Rows 2 and 3 are the sharpest evidence in this audit: **they render on the
same page, roughly 400px apart, and differ by one word.** `/services` opens
with "Start with one useful improvement or a **full** custom build. Scope and
price are agreed with you before any work begins", and then `<Pricing />`
opens with "Start with one useful improvement or a custom build. Scope and
price are agreed with you before any work begins."

That is the texture people mean by AI slop. Not a bad sentence, a *good*
sentence said until it stops being heard. Said once it is a commitment. Said
eight times it is wallpaper, and a visitor who notices the repetition starts
reading the rest of the page the same way.

The ownership promise has the same problem at a smaller scale: 13 rendered
instances of "yours to keep" / "you own the code" / "yours to own", four of
them on `/welcome-book` alone.

### 1.2 Three of the four service rows are the same sentence wearing a hat

The guidelines caught this once (§7) and it has half come back. Lined up:

> `pain` websites: "Your website is dated or hard to use, **and** it tells people about the business **without** giving them a way to start."
> `pain` software: "The tools you have do not quite fit, **and** the important work still lives in spreadsheets and messages."
> `pain` integrations: "You are copying the same details between systems, **or** keeping a schedule up to date by hand every time something changes."

Same shape: a vague diagnosis, a comma, a conjunction, a second clause of
roughly equal weight. Four services are supposed to read like four different
answers because they are.

The fourth is the leads row, which is the one she loves:

> "Inquiries arrive as voicemails and half-filled forms, and quoting each one by hand eats an evening."

Structurally identical. Why it works anyway is the whole lesson: it names
**voicemails**, **half-filled forms** and **an evening**. The other three name
nothing. "Dated or hard to use", "do not quite fit", "the important work",
"every time something changes" are all slots where a specific thing was
supposed to go.

### 1.3 Hedges in the exact spots confidence belongs

"The tools you have **do not quite fit**." "Squarespace and Wix **can be** a
good fit." "A visitor arrives, **finds what they need**." "Cancel anytime,
your site keeps running, you **just** take over hosting." "Your project
**might** be one integration, a booking form, a client portal, **or an
improvement to an existing workflow**."

Each of those is a sentence backing away from itself. The site's own best
lines never do: "Nothing binding. Scoping is free." "Every picture below is a
running system." The gap between those two registers, on one site, is most of
what reads as machine-written.

### 1.4 Filler clauses that survive deletion

Pull these and nothing is lost:

- "That is a good place to start." (`founderCta.body`, the homepage CTA)
- "What matters is the website, system, or workflow you need help with." (FAQ)
- "It starts with what is already working and what you need help with." (FAQ)
- "and supported **as it grows**" (`approachSteps[3]`)
- "keeping turnover dates and assignments **in one place**" (`work[]` blurb)
- "A friendly way to say hello" (a bullet in a list of **what is included**,
  that includes nothing)
- "**projects span different industries**" (FAQ)

§2.5 of the guidelines measures the shipped average at 14 words and the best
lines at 5 to 9. These clauses are what the average is carrying.

### 1.5 Words aimed at a buyer who is not hers

"The **command-center** dashboard." "A **client-facing** booking **flow**."
"The printed check-in binder, **reborn as** one link." "**Currently available
for new projects**."

Her buyers are a roofer, an office manager, a cleaning company owner, a rental
host. "Command-center" and "client-facing" are developer and agency
vocabulary; "reborn as" is a brochure flourish; "currently available for new
projects" is freelancer boilerplate that appears on ten thousand portfolio
sites. The guidelines already caught and fixed "configured to your stack" and
"tuned to your tools" for exactly this reason. These four are the same bug in
the same place.

### 1.6 Rules that are written down and shipping broken anyway

This is the part worth acting on first, because it needs no taste at all.

| Rule | Live instances |
|---|---|
| No "let's" ("we" wearing a hat) | **5**: `Pricing.tsx:98`, `Contact.tsx:401`, `AutomationCost.tsx:101`, `SiteCheck.tsx:215`, `Questionnaire.tsx:421` |
| No "we"/"our" | **4**: `SiteCheck.tsx:214` ("the kind of thing **we** handle"), `Questionnaire.tsx:516` ("**we** never sell"), `Questionnaire.tsx:1006` ("**we'll** draft"), `app/api/contact/route.ts:313` ("**we'll** find a time") |
| No "I"/"my" outside the four exceptions | **2**: `app/demo/page.tsx:134` ("most of what **I** build"), `app/welcome-book/page.tsx:225` ("tell **me** ... **I'll** take it from there") |
| No em dashes in prose | **4**: `Pricing.tsx:133`, `Pricing.tsx:136`, `Questionnaire.tsx:517`, `Questionnaire.tsx:1006` |
| At most one "around your X" site-wide | **3 rendered**: `app/catalog/page.tsx:70`, `lib/catalog.ts:75`, plus **2** in `lib/schema.ts` (96, 113) that reach search results and answer engines |
| Never imply a team | **1**: `lib/catalog.ts:79`, "Built by **a team** that cleans and hosts short-term rentals." |

Two notes on that table. The guidelines' §6 "live violations" list is now
**stale in a good way**: all five of those were fixed, and the three "our own"
tags resolved to "Meg's own" rather than the recommended "M Studio's own". Q1
is closed. And the five `let's` are the single highest-value fix here, because
"let's scope it" is the **price** on the primary pricing card: the most
consequential four words on `/services`, breaking the rule, in display type.

---

## 2. Tier A — rule breaches, shipping now

### A1. components/Pricing.tsx → line 98, the custom-build price slot
WAS: `                Let&apos;s scope it`
NEW: `                Quoted to your scope`
WHY: "Let's" is "let us", banned outright, and this is the largest text on the
pricing card; "Quoted to your scope" is the site's own existing phrase for
this exact thing, already shipping in three `marketItems` and four `ladder`
entries.

### A2. components/Pricing.tsx → line 133, Care Plan cancel note
WAS: `                Cancel anytime — your site keeps running, you just take over hosting.`
NEW: `                Cancel anytime. The site keeps running, you take over the hosting.`
WHY: Prose em dash, and "just" is a minimizer in a sentence whose whole job is
to be flat about what happens.

### A3. components/Pricing.tsx → lines 136-137, Care Plan body
WAS:
```
                Hosting, domain, security, and small edits — handled. The stuff
                that keeps a site running, off your plate.
```
NEW:
```
                Hosting, domain, security and small edits, handled. The work
                that keeps a site running, off your plate.
```
WHY: Prose em dash. "The stuff ... off your plate" is good and stays.

### A4. components/Contact.tsx → line 401, non-stage contact heading (/services, /about)
WAS: `                Let&apos;s start with what you&apos;re trying to solve.`
NEW: `                Start with what you&apos;re trying to solve.`
WHY: Drops "let's" and nothing else. The sentence is already an imperative
aimed at the reader; the "let's" was the only thing making it a company
talking.

### A5. components/AutomationCost.tsx → line 101, calculator CTA
WAS: `              Let&apos;s recover this →`
NEW: `              See what fixing it costs →`
WHY: Two problems in four words. "Let's" is banned, and "recover this" is a
promise about the reader's money made by a calculator that just invented the
number. The replacement answers the actual next question somebody staring at a
yearly cost has, and claims nothing.

### A6. components/SiteCheck.tsx → lines 213-215, Lighthouse result footnote
WAS:
```
                Scores from Google Lighthouse (0–100). Want these all green?
                That&apos;s exactly the kind of thing we handle.{" "}
                <Link href="/#contact" className="text-signal hover:opacity-80">Let&apos;s talk</Link>.
```
NEW:
```
                Scores from Google Lighthouse (0–100). Want these all green?{" "}
                <Link href="/#contact" className="text-signal hover:opacity-80">Ask what it would take</Link>.
```
WHY: One sentence carrying both a "we" and a "let's", plus "exactly the kind of
thing" which is pure filler. Cutting the middle sentence entirely makes the
question do the work and the link label specific. The en dash in `(0–100)` is
correct range typography and stays.

### A7. components/Questionnaire.tsx → line 421, intake heading
WAS: `          Let&apos;s scope your project.`
NEW: `          What you need, written down.`
WHY: "Let's" again, and this one is the first thing somebody sees on the intake
page. The replacement states the deliverable rather than inviting her own
company along, and it is the `studioStats` promise ("answers → written scope")
in plain words. Alternative if a time cue is wanted: `Your project, scoped in
ten minutes.` ("about ten minutes" is already shipping in `Contact.tsx`.)

### A8. components/Questionnaire.tsx → lines 516-517, required-field note
WAS:
```
          <span className="text-gold">*</span> required · we never sell your
          information — see the{" "}
```
NEW:
```
          <span className="text-gold">*</span> required · nothing here is sold or shared, see the{" "}
```
WHY: A "we" and a prose em dash in one line. "Nothing here is sold or shared"
is also a wider and plainer promise than "never sell".

### A9. components/Questionnaire.tsx → line 1006, AI prefill button
WAS: `          {" "}— describe it your way and we&apos;ll draft the answers for you.`
NEW: `          {" "}. Describe it your way and the form fills itself in.`
WHY: A "we'll" and a prose em dash. "The form fills itself in" is also what
actually happens, which is more interesting than somebody drafting for you.

### A10. app/demo/page.tsx → lines 134-135, the "none of these" paragraph
WAS:
```
                Want something that is none of these? Most of what I build is a mix: a site with a
                booking form, a directory with a members area, a storefront wired to the tools you
```
NEW:
```
                Want something that is none of these? Most real projects are a mix: a site with a
                booking form, a directory with a members area, a storefront wired to the tools you
```
WHY: First person on a page that is not `/about`, not a case study `problem`,
not the visitor's own words and not a one-to-one email. "Most real projects"
is also a better claim, because it is about the category rather than about her.

### A11. lib/catalog.ts → line 79, `categories[rentals].blurb`
WAS: `  { id: "rentals", label: "Rental hosts", blurb: "Built by a team that cleans and hosts short-term rentals." },`
NEW: `  { id: "rentals", label: "Rental hosts", blurb: "From a working cleaning company and a working rental." },`
WHY: **The most serious line in this audit.** "A team" asserts people who do
not exist, on a site whose first rule is never to invent proof, and it is the
"we" problem in its most literal form. The replacement says the genuinely
impressive version of the same thing and both halves are on this site: The
Maine Cleaning Co. and The Keystone House. If attribution is wanted instead,
`Built by a Maine cleaner and rental host.` works and CLAUDE.md permits naming
her or M Studio where attribution is genuinely needed.

### A12. app/catalog/page.tsx → lines 70-71, catalog lede
WAS:
```
              Try a live demo, buy something ready-made, or have it built around
              how you work. Every picture here is a real screen.
```
NEW:
```
              Try a live demo, buy something ready-made, or have one built.
              Every picture here is a real screen.
```
WHY: "Built around how you work" is the "around your X" tic, and the clause
adds nothing the rest of the site has not said. Deleting it leaves three
options and a hard fact, which is the better sentence. If the clause is wanted,
`or have one made to fit.`

### A13. lib/catalog.ts → line 75, `categories[websites].blurb`
WAS: `  { id: "websites", label: "Websites", blurb: "Sites that bring in work, built around one goal and yours to keep." },`
NEW: `  { id: "websites", label: "Websites", blurb: "Sites that bring in work, not just describe it." },`
WHY: Three problems in one line: "around" tic, the maker's verb (`built`), and
the 13th instance of the ownership promise. The replacement is the house
contrast shape (§2.3), eight words, and the verb belongs to the site rather
than to her.

### A14. lib/schema.ts → line 96, `studio().description`
WAS: `      "Websites, custom business tools, CRM setup, data migrations, and integrations built around the way your business works.",`
NEW: `      "Websites, custom business tools, CRM setup, data migrations and integrations for small businesses.",`
WHY: The "around" tic in the one string most likely to be quoted back by a
search engine or an answer engine. "For small businesses" is also the thing a
reader is actually scanning for.

### A15. lib/schema.ts → line 113, custom-tools offer description
WAS: `description: "Booking apps, CRMs, dashboards, and quoting tools, built around how you run."`
NEW: `description: "Booking apps, CRMs, dashboards and quoting tools."`
WHY: Second "around" in the same file. A structured-data offer description is a
list; the trailing clause is the thing that makes it read as marketing.

### A16. app/api/contact/route.ts → line 313, lead auto-reply
WAS (the whole line, including its backticks, which are a template literal):
~~~
    : `<p style="font-size:15px;margin:0 0 20px;">If it's easier to talk it through, just reply to this email and we'll find a time.</p>`;
~~~
NEW:
~~~
    : `<p style="font-size:15px;margin:0 0 20px;">If it's easier to talk it through, just reply to this email and I'll find a time.</p>`;
~~~
Only `we'll` becomes `I'll`. Nothing else on the line changes.
WHY: This is the one place the fix runs **toward** first person rather than away
from it. The guidelines' fourth exception covers exactly this email: it is sent
as "Meg · M Studio" and already says "I'll reply within 24 hours" two lines up.
"We'll" is the violation, because a solo founder answering her own email as a
plural is the tell. Singular is correct and already established in the same
message.

### A17. app/welcome-book/page.tsx → lines 225-227, closing CTA
WAS:
```
                  Founding price of ${wb.introPrice} for the first few. One-time,
                  no monthly app fee, and the book is yours to keep. Tell me about
                  your rental and I&apos;ll take it from there.
```
NEW:
```
                  Founding price of ${wb.introPrice} for the first few. One-time,
                  no monthly app fee, and the book is yours to keep. Send the
                  details about your rental and the book comes back in a few days.
```
WHY: First person on a product landing page, which is none of the four
exceptions. The replacement also says something, where "I'll take it from
there" said nothing: "a few days" is already a shipped claim in
`welcomeBook.steps[1]` and `welcomeBook.faqs[4]`. **This is the one Tier A item
with a real cost** and it is argued in section 6.

---

## 3. Tier B — voice

### B1. lib/content.ts → `founderNote.paragraphs[0]`
WAS: `"M Studio brings hands-on business experience to websites and systems. Every project starts with understanding the work, the tools already in place, and what could run more smoothly."`
NEW: `"M Studio came out of running a cleaning company. Every project starts with the tools you already pay for and the part of the week that keeps going wrong."`
WHY: "Brings hands-on business experience to" is résumé language and the verb
is hers; "what could run more smoothly" is the kind of abstraction §2.1 exists
to prevent. Both replacement halves are concrete and true, and "the tools you
already pay for" is a phrase this site uses well elsewhere.

### B2. lib/content.ts → `founderCta.body` (the homepage CTA, under "What do you wish worked better?")
WAS: `"Share what you use now and where you are getting stuck. That is a good place to start."`
NEW: `"Share what you use now and where you are getting stuck. A written scope comes back within a day."`
WHY: "That is a good place to start" survives deletion, which means it is
filler in the second-most-read sentence on the site. The replacement puts a
real commitment there, already promised by `studioStats` ("24 hrs · answers →
written scope") and by `HowToStart` step 02.

### B3. lib/content.ts → `services[websites].pain`
WAS: `"Your website is dated or hard to use, and it tells people about the business without giving them a way to start."`
NEW: `"Your site is a few years old, slow on a phone, and the only thing it asks a visitor to do is read."`
WHY: "Dated or hard to use" and "a way to start" are both slots where a
specific thing belonged. "Slow on a phone" is the complaint her buyers actually
have, and §8 asks whether a line survives being read in a truck between jobs.

### B4. lib/content.ts → `services[websites].outcome`
WAS: `"A visitor arrives, finds what they need, and asks for a quote without hunting for a phone number."`
NEW: `"A visitor who would have called asks for a quote instead, at ten at night."`
WHY: "Finds what they need" is filler, and three verbs in a row dilute the one
that matters. "At ten at night" is the leads row's "eats an evening" move: a
time the reader can picture, which is also the honest argument for a quote form.

### B5. lib/content.ts → `services[software].pain`
WAS: `"The tools you have do not quite fit, and the important work still lives in spreadsheets and messages."`
NEW: `"The real work lives in a spreadsheet one person maintains and a group text nobody can search."`
WHY: "Do not quite fit" is a hedge and "the important work" names nothing. Both
halves of the replacement are things only somebody who has run a small
operation writes, and "nobody can search" is the specific pain rather than the
general one.

### B6. lib/content.ts → `services[software].outcome`
WAS: `"The work comes out of spreadsheets and group texts. What it does, and what you own at the end, is agreed before anything starts."`
NEW: `"One place to look, instead of a spreadsheet, a group text and somebody's memory."`
WHY: The second sentence is instance 6 of the eight in §1.1, and it is the only
one that is pure duplication: the same promise is already on this page twice,
in `homeHero.sub`, in `studioStats`, in the ladder's own software build entry
and in the "Do I own the code?" FAQ. Dropping it loses nothing and halves the
line.

### B7. lib/content.ts → `services[integrations].pain`
WAS: `"You are copying the same details between systems, or keeping a schedule up to date by hand every time something changes."`
NEW: `"The same customer gets typed in twice, and the schedule is only right because somebody keeps fixing it."`
WHY: "Every time something changes" is filler, and "copying the same details
between systems" is the generic version of a specific thing. "Only right
because somebody keeps fixing it" is the recognition this row needs, and the
`outcome` beneath it ("You stop entering the same details twice, and the
schedule keeps itself up to date") already answers both halves exactly.

### B8. lib/content.ts → `approachSteps[3].body` (Iterate)
WAS: `"Then it's tuned against real use, handed over, and supported as it grows. No lock-in."`
NEW: `"Then it is tuned against real use and handed over. Files, database, domain and keys go with it."`
WHY: "As it grows" is filler and "No lock-in" is jargon asserting a thing the
site can show instead. The four nouns are lifted from the "Do I own the code?"
FAQ answer, which is one of the best-written strings in the repo, and naming
them is worth more than claiming the abstraction.

### B9. lib/content.ts → `marketItems[welcome-book].tagline`
WAS: `"The printed check-in binder, reborn as one link guests actually open: house guide, WiFi and local picks for your short-term rental."`
NEW: `"The check-in binder your guests actually open: house guide, WiFi and local picks, on one link."`
WHY: "Reborn as" is a brochure flourish, and the card is 21 words where 16 do
more. The replacement is `welcomeBook.hero.headline`'s own proven construction
("The welcome binder your guests actually open"). **Apply with the twin:**
`app/welcome-book/page.tsx:22` carries the same "reborn as" sentence in its
metadata description.

### B10. lib/content.ts → `marketItems[calc-kit].includes[3]`
WAS: `"A friendly way to say hello"`
NEW: `"No sign-up, nothing to install"`
WHY: It is a bullet in a list headed by what is included, and it includes
nothing. The replacement is true and is already the phrasing in
`HowToStart` ("No sign-up, nothing to install") and `lib/catalog.ts` ("Use them
right now. No signup.").

### B11. lib/content.ts → `marketItems[dashboard-starter].tagline`
WAS: `"The command-center dashboard, showing your jobs and revenue instead of a demo's."`
NEW: `"The dashboard behind BrightBase, showing your jobs and revenue instead of a demo's."`
WHY: "Command-center" is the hype word on a card aimed at somebody who is not
technical. Naming BrightBase is stronger anyway: it is a real system with its
own page on this site, and the card's own screenshot is a capture of it.
"Instead of a demo's" is the good half and stays untouched.

### B12. lib/content.ts → `marketItems[booking-app].tagline`
WAS: `"A client-facing booking flow with an owner calendar and confirmations."`
NEW: `"Customers book a time that is actually open. You get the calendar and the confirmations."`
WHY: "Client-facing" and "flow" are both agency vocabulary, and the sentence
has no verb anybody performs. The replacement gives each side its own short
sentence and its own verb, in the register `lib/catalog.ts:192` already uses
for the same product ("Customers pick a service and a time that is actually
open. You get the calendar.").

### B13. lib/content.ts → `welcomeBook.steps[2].body`
WAS: `"Drop it into your Airbnb or VRBO message and print the QR for the door. Fewer “how do I…” texts, smoother stays, better reviews."`
NEW: `"Drop it into your Airbnb or VRBO message and print the QR for the door. Fewer “how do I…” texts at nine at night."`
WHY: **The clearest evidence-rule risk in the file.** "Smoother stays, better
reviews" are two outcome claims with nothing behind them, on a paid product,
and "better reviews" is the kind of promise a host would hold against her. The
first clause is an honest description of the host's own inbox rather than a
measured result, so it stays and gets a time on it. (Curly quotes preserved
exactly.)

### B14. lib/content.ts → `smallProjects[1].scope` (CRM & platform setup)
WAS: `scope: "A focused setup or cleanup: fields, views, settings, and one workflow.",`
NEW: `scope: "Fields, views, settings and one workflow, on the platform you already pay for.",`
WHY: "A focused setup or cleanup" is a vague-positive opener in front of the
four concrete nouns that are the actual scope. Leading with the nouns and
ending on "already pay for" makes a $300 line item sound specific rather than
small.

### B15. components/FAQ.tsx → "Do you only work with cleaning companies?"
WAS: `"No. M Studio grew out of hands-on experience running a cleaning business, but projects span different industries. What matters is the website, system, or workflow you need help with."`
NEW: `"No. It grew out of running one, which is why the examples here are cleaning and rentals. A quote form and a CRM behave the same whichever trade is using them."`
WHY: "Projects span different industries" is corporate vague and, read closely,
is a claim about a client list the site does not show; "What matters is..." is
a slogan. The replacement answers the real question (why is everything on this
site cleaning?) honestly, and makes the transferability argument concrete
without naming a client who does not exist.

### B16. components/FAQ.tsx → "Can you connect the systems I already use?"
WAS: `"Yes. Share which tools you use and what you want to happen between them. Their APIs, calendar feeds, and other connection options are checked before the project is scoped."`
NEW: `"Yes. Name the tools and what should happen between them. Whether they can actually do it gets checked before you are quoted, because some platforms will not open up at all."`
WHY: The third sentence is procedural, passive and the maker's. The final
clause is the §2.4 move: a flat statement of a limit, which only somebody who
has tried to integrate a closed platform writes, and which makes the "yes"
believable rather than salesy.

### B17. components/FAQ.tsx → "Do I need a whole new website or app?"
WAS: `"Not always. Your project might be one integration, a booking form, a client portal, or an improvement to an existing workflow. It starts with what is already working and what you need help with."`
NEW: `"Often not. It might be one form, one integration, or one page. The cheapest version that solves it is the one to start with."`
WHY: 33 words to 22. "An improvement to an existing workflow" names nothing and
the third sentence survives deletion. Ending on a plain opinion about the
reader's money is the assured version, and it is a sentence a studio protecting
its invoice would not write.

### B18. components/FAQ.tsx → "How is this different from Squarespace or Wix?"
WAS: `"Squarespace and Wix can be a good fit for a simple site. A custom build gives you more control over your design, features, and connections to other systems. What your business needs gets talked through before the approach is chosen."`
NEW: `"Squarespace and Wix are a good fit for a simple site. They stop being one when you need a quote form wired into your CRM, or a booking step that knows what is actually open."`
WHY: Three fixes at once: "can be" hedges a concession that is stronger stated
flatly, the middle sentence is abstract ("more control over your design,
features, and connections"), and the third ("before the approach is chosen")
is a ninth variant of the §1.1 reassurance, close enough in sense to belong to
that family even though it does not match the greps that found the other eight.
Naming the two moments where a page builder actually runs out is the answer
somebody comparing quotes is looking for.

### B19. components/Contact.tsx → line 410, availability badge
WAS: `                Currently available for new projects`
NEW: `                Taking new projects now`
WHY: Four words instead of five, and it drops a phrase that appears verbatim on
an enormous number of freelance portfolio sites. Active rather than a state of
being.

### B20. app/services/page.tsx → lines 124-126, page lede
WAS:
```
                Start with one useful improvement or a full custom build. Scope and
                price are agreed with you before any work begins.
```
NEW:
```
                The fixed prices are on this page. Anything bigger is quoted in
                writing first.
```
WHY: This is the §1.1 duplicate. It is near word-for-word identical to the
`Pricing.tsx` paragraph rendered a few hundred pixels below it on the same
page. `Pricing.tsx` is the right home for it, because it sits directly above
the price, so **this** copy is the one to change. The replacement says
something the page does not already say twice, and "quoted in writing" is a
sharper version of the same commitment. Note `app/services/page.tsx:78` carries
a third variant in the route's metadata description, which can stay since it is
not rendered beside the others.

---

## 4. Deliberately left alone

Not oversights. Each of these was read and kept.

**Everything she has named as working.** `services[leads].pain` and
`.outcome`, `services[websites].tagline`, `homeBands.work.heading`,
`homeBands.start.note`, `homeBands.pricing.heading`,
`homeBands.services.heading`, `ladder[websites/try].body`. These are the
calibration target, not candidates.

**All three `demos[].proves` strings.** The best writing in the repo and a
register nothing else on the site reaches: "cart arithmetic that still adds up
at quantity two", "watch the neighboring times disappear", "an empty result
that names which filter to drop instead of showing a blank page". Touching
these would be a downgrade.

**`ladder[integrations/build].body`** — "Jobber, HubSpot, a booking feed, a
spreadsheet nobody wants to give up. All of them reading from the same
information." The best line in the ladder, and "a spreadsheet nobody wants to
give up" is a whole buyer psychology in seven words.

**The entire `/about` page and all of `founderBio`.** `CLAUDE.md` grants a
human voice there explicitly and the guidelines ask it not to be spread.
Paragraph 3's trailing service list is mildly redundant with the four
categories, and it is still hers. "Our dog" in paragraph 4 means the family's
dog in her own voice on the one page that permits it, and rewriting it would be
the bug the guidelines warn about.

**`caseStudies[maine-cleaning-co].problem`** — first person, open question Q2,
and the guidelines' recommendation is to keep it. Agreed, and strongly: "I was
paying for a dozen tools that didn't talk to each other" is the most
convincing paragraph on the site and the reason is that a person is talking.

**Every string in the visitor's own mouth.** `lib/offer.ts` OFFERS, all FAQ
*questions*, every `lib/questionnaire.ts` option and label, the welcome book
FAQs' questions. Exception 1. Rewriting these into third person would be a bug.

**`provingGround`, `studioStats`, `caseStudies[].results`, every empty
`testimonial`/`quote`/`metric`/`problem`.** These are evidence and gates, not
copy. The blankness is part of the voice (§2.4) and nothing here touches it.

**`Contact.tsx`'s message placeholder**, "What tools do you use? What are you
entering by hand, tracking in spreadsheets, or wishing your website could do?"
Three recognizable things in one question. Already right, and the best
placeholder on the site.

**`app/privacy` and `app/terms`.** Out of scope as instructed, and the
guidelines' own note is right that rewriting legal-entity "we" risks changing a
legal statement.

**`components/Hero.tsx`** carries a fourth "around how your business works",
and it has **no caller** anywhere in `app/` or `components/`. It is one of the
orphans the Nov 26 note describes. Changing dead copy would be noise, and
deleting the file is its own change with `seam-check-before-removal` attached.

**`homeBands.services.eyebrow`** ("Common issues") — her own phrase, Q3 says
leave it, agreed.

---

## 5. Considered and rejected

- **`approachSteps[1]` and `[2]`** (Design, Build). "Data, flow and screens get
  mapped out first" is passive and the maker's verb, but "Nothing is built
  until you sign off" and "small, working pieces you can poke at as they land"
  are both good, and "poke at" is a genuinely human word. The gain did not
  justify disturbing two of four steps that read fine.
- **`welcomeBook.includes[3]`**, "House rules + a checkout checklist guests
  can't skim past". "Can't skim past" is a claim about guest behavior that
  nothing in the product enforces. Mild enough to leave, but it is the second
  overclaim on this product after B13, so flagging rather than fixing.
- **`toolsStamp`**, "Get one tuned to your business." "Tuned to" is a cousin of
  the two jargon strings the guidelines already retired ("tuned to your
  tools"), but the verb is the reader's and the string is a footer on a
  download. Below the bar.
- **`Contact.tsx`'s "You don't need a technical plan to get started."** This is
  reassurance padding by the letter of the brief, and it removes the single
  biggest real barrier for a non-technical buyer facing a blank box. Kept. See
  section 6.
- **`Contact.tsx`'s success state**, "Every message is read personally, with a
  reply within a day." Slightly flourished, and "read personally" is the one
  thing that matters to somebody who just pressed send on a small website. Kept.
- **"The Maine Cleaning Company" vs "The Maine Cleaning Co."** `founderBio`
  uses the long form twice; the guidelines specify the period form. The long
  form reads better in her own prose on `/about` and the short form is correct
  everywhere else. Not worth a change, worth knowing.
- **`marketItems[automation-pack]`**, whose tagline says "the tools you already
  pay for" and whose fourth bullet says "Works with the tools you already
  have". Same claim twice in one card. Cutting the bullet is right but it
  shortens an includes list to three, which is a layout question rather than a
  copy one.
- **`components/CommandPalette.tsx`** search keywords contain "what we do" and
  "how we work". They are match tokens, never rendered, and changing them would
  break ⌘K matching for no reader-visible gain.
- **`app/services/page.tsx:78` metadata description** still enumerates the old
  five-service taxonomy ("Websites, CRM setup, data migration, integrations and
  custom business tools") rather than the four categories, and
  `lib/schema.ts`'s offer catalog does the same with five `Offer` entries. That
  is taxonomy drift from the Nov 14 restructure, not wording, so it is named
  here rather than rewritten: fixing it properly means deciding whether the
  structured data should mirror `services[]`, which is a decision rather than a
  copy edit.
- **`app/turnover/page.tsx:69`**, "a system built for a cleaning company with
  **1,000+ customers**". That number has no home in `lib/content.ts`, which
  holds `8 yrs`, `$1M+`, `4,900+` and `63%` and not this. It is very likely
  true, and the rule is that a number a visitor reads lives in `content.ts` and
  is verified. **Not proposing a rewrite**, because deleting a true number is a
  loss and inventing a replacement is worse. Proposing a question: confirm it
  and add it to `provingGround`, or swap it for one of the four that are already
  there.

---

## 6. Where the guidelines and "high end" pull apart

Four real tensions. None of them is resolved by the rules as written.

**6.1 The no-"I" rule makes warm one-to-one moments colder.** Tier A item 17
is the clearest case. "Tell me about your rental and I'll take it from there"
is a person offering to handle something, on a $99 product page where the next
action is a form. The replacement is more specific and more assured and it is
slightly less kind. The guidelines' fourth exception already recognizes this
shape for email ("rewriting it into the passive would make a warm message
colder for no gain") and the only thing distinguishing that email from this
page is that the email has a `From:` line. **Recommendation: apply it, and
consider widening exception 4 to cover a CTA on a single-product page where the
reader is about to hand over details about their own home.** That is her call,
not a derivable rule.

**6.2 "No reassurance padding" and "they have been sold to badly before" are
in direct conflict.** The brief asks for no reassurance padding; §1 of the
guidelines says her readers are non-technical, busy and have been sold to
badly. "You don't need a technical plan to get started" is padding by the first
rule and load-bearing by the second. I kept it, and I think the test is whether
the reassurance names a specific fear (keep) or performs empathy generically
(cut). "You don't need a technical plan" names a fear. "That is a good place to
start" performs empathy, which is why B2 cuts it.

**6.3 Confidence and the evidence rule run into each other on outcomes.**
"High end" means stating results flatly. "Never invent proof" means the site
has no client outcome number to state: `metric` is unset on all nine work
items, two of three case studies have empty `results`, and the testimonial is
blank. So every confident sentence has to be about *the work* or *the reader's
own week*, never about a result. That is why B4 lands on "at ten at night"
rather than anything resembling a conversion claim, and why B13 deletes
"better reviews" instead of qualifying it. The honest version of high-end here
is specificity about the problem, not confidence about the outcome. Worth
writing down, because the temptation to close that gap with a plausible number
will come back every time this copy is revisited.

**6.4 The contrast shape is the house move and it is also at its limit.**
§2.3 permits it once or twice a page and warns it becomes a tic by the third.
Counting what already ships on the homepage and `/services`: the websites
tagline ("not just read about you on"), the software demo ladder entry ("not
pictures of them"), the website-check entry ("Yours or a competitor's"), and
two of the three `demos[].proves`. B4 ("asks for a quote instead") and A13
("not just describe it") each add a mild one. That is close to the ceiling, and
A13's is the more defensible of the two because it sits on a category label on
`/catalog`, away from the others. If both are taken, the websites row carries a
contrast in its tagline and another in its outcome, two lines apart. **If one
has to go, drop the contrast in B4 and use simply "A visitor asks for a quote
at ten at night."** Flagging it rather than deciding it, because the four
`outcome` lines not sharing a shape is the rule that matters more, and this
proposal gives each of the four a different one: a visitor's action
(websites), a path (leads, untouched), a place to look (software), and a thing
that stops happening (integrations, untouched).

---

## 7. If this gets applied

Tier A is 17 mechanical edits across 11 files, and not one of them is in
`lib/content.ts` or `lib/brightbase.ts`, so Tier A can be applied immediately
without touching anything being edited right now.

Tier B is 20 edits: `lib/content.ts` (14), `components/FAQ.tsx` (4),
`components/Contact.tsx` (1) and `app/services/page.tsx` (1). One extra edit
rides along with B9: `app/welcome-book/page.tsx:22` carries the same "reborn
as" sentence in its route metadata and should change with the tagline.

Two checks that matter afterward, from `CLAUDE.md` and §8:

- `e2e/smoke.spec.ts` asserts `homeCards` titles resolve against `work[].title`
  and asserts the `ServiceRouter` project count against `work`. Nothing
  proposed here changes a title or a count.
- Grep the result for `we `, `our `, ` I `, `my `, `—`, `around your`, `let's`,
  `solution`, `seamless`, `streamline`, `leverage`. After Tier A the only
  remaining hits outside `app/privacy`, `app/terms` and code comments should be
  `components/Hero.tsx` (orphaned, no caller), the visitor's own strings, and
  `/about`.
