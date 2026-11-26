# M Studio — brand voice guidelines

**Generated:** Nov 26, 2026 · **Confidence: high** on the rules, **medium** on
two open questions at the foot.

**Sources.** Every rule below was derived from material already in this
repository, not from a template:

| Source | What it gave |
|---|---|
| `lib/content.ts` | 209 shipped visitor-facing strings, audited one by one |
| `CLAUDE.md` "Voice and copy" | The three hard rules (no "we", no "I", no em dashes) |
| `CLAUDE.md` "Never invent proof" | The evidence rule, which is a voice rule here |
| Meg's accept/reject record, Nov 14–26 | Which sentences she kept and which she threw out, in her own words |

The last row is the valuable one. Most voice documents guess at a preference.
This one has a record: six rounds of homepage copy, three complete designs, and
a dozen specific sentences she either kept verbatim or rejected on sight. The
rules below are reverse-engineered from that record and each one cites the
evidence.

---

## 1. Who is reading

A roofer. An office manager. The owner of a cleaning company. A short-term
rental host. They are not technical, they are busy, and they arrived with a
problem rather than a curiosity.

Three consequences that are voice decisions, not audience notes:

- **They are deciding about themselves, not about Meg.** This is the stated
  reason "I design and build websites" became "Websites, web apps and custom
  tools for small businesses." A visitor weighing a quote is thinking about
  their own week.
- **They read the top of the page and little else.** A promise made below the
  fold is a promise not made. (`linx`'s `CLAUDE.md` records this failure three
  separate ways on one landing page.)
- **They have been sold to badly before.** Every sentence that sounds like
  marketing spends trust rather than earning it.

---

## 2. The five voice attributes

Each is stated as a rule, with the shipped line that proves it works.

### 2.1 Concrete over abstract — the load-bearing one

Name something the reader can picture. A voicemail. An evening. A competitor's
URL. A picture of a screen.

> "Enquiries arrive as voicemails and half-filled forms, and quoting each one by
> hand eats an evening."

That is the strongest sentence on the site. *An evening* is why. It costs the
reader nothing to understand and it is their own Tuesday.

**The failing version of the same idea** would be "streamline your lead
intake process." Nothing to picture, nothing to recognize.

### 2.2 Say the result, never the method

**This is the rule Meg's rejections are actually about, and it was invisible
until the audit put them side by side.**

She rejected `"Built around the one thing you want a visitor to do."` She
rejected `"Four things, named for what you came here wanting."` Both describe
*how the work was made* or *how the page was organized*. Neither tells the
reader what they get.

She kept `"A site somebody can hire you from, not just read about you on."`
Same service. The difference is that the verb belongs to her reader, and the
verb is *hire*.

**The tell: if the sentence's main verb is something Meg did, rewrite it.**
`built`, `shaped`, `mapped`, `designed`, `organized`, `named for`, `structured`
are all her verbs. `hire`, `book`, `finish`, `click`, `paste`, `own`, `stop
typing` are the reader's.

### 2.3 Contrast, as the house sentence shape

The lines that survive every round share one construction: **the thing, then
the thing it is not.**

> "A site somebody can hire you from, **not just** read about you on."
> "Real interfaces you can click, **not** pictures of them."
> "Paste any URL and get a real speed, SEO and accessibility report. Yours **or
> a competitor's.**"

It works because it does the reader's objection for them. Use it, but not more
than once or twice a page: it becomes a tic faster than most shapes.

### 2.4 Flat honesty, including about limits

> "Nothing binding. Scoping is free."
> "Numbers, before you ask for them."
> "Estimates for a single, agreed piece of work. Final quotes follow review."

No hedging, no urgency, no scarcity. The site already states its prices, says
what it does not do, and leaves `testimonial` blank rather than writing one.
**That blankness is part of the voice.** A page with an empty space where a
testimonial would go reads more honest than a page with a plausible one.

### 2.5 Short. Then stop.

Average shipped sentence: 14 words. The best ones are 5 to 9. Two full stops
beat one comma splice.

> "Nothing binding. Scoping is free." (5 words)
> "Which one sounds familiar?" (4 words)
> "Every picture below is a running system." (7 words)

---

## 3. It sounds like / It never sounds like

*(The skill's template calls this "We Are / We Are Not". Renamed, because "we"
is the first thing this voice forbids.)*

| It sounds like | It never sounds like |
|---|---|
| "quoting each one by hand eats an evening" | "optimize your lead workflow" |
| "A site somebody can hire you from" | "A site built around your goals" |
| "Nothing binding. Scoping is free." | "Book your free no-obligation discovery call today!" |
| "Every picture below is a running system." | "Trusted by businesses across New England" |
| "$250–$500" on the page | "Contact us for pricing" |
| "Which one sounds familiar?" | "Our Services" |
| An empty results block | A plausible-sounding result |
| "Connect what you already use, so nothing gets typed in twice." | "Seamless integration solutions" |

---

## 4. Terminology

### Use
small business · contractors · admin firms · service businesses · short-term
rental · host · quote · estimate · booking · lead · the work · a running system
· yours to keep · scoped · agreed · Southern Maine · clients anywhere

### Avoid
solutions · leverage · streamline · seamless · robust · best-in-class ·
cutting-edge · empower · unlock · transform · journey · ecosystem · synergy ·
bespoke · elevate · curated · delve · "in today's digital landscape"

### Never
- **"we" or "our"** — a solo founder writing as a company is the oldest
  small-business tell there is. (`CLAUDE.md`)
- **"I" or "my"** — write about the reader and the work. See the exceptions
  below; outside them there are none.
- **"let's" / "let us"** — it is "we" wearing a hat. Caught on Nov 26 in
  "Let's take a look at common issues."
- **Em dashes** in anything a visitor reads. Commas or periods.
- **British spelling.** US throughout.
- **Any number that is not in `lib/content.ts` and true.**

### Where first person is correct, and it is not a loophole

Four places, and the test for all four is *whose mouth the words are in*.

1. **The visitor's own words.** `lib/offer.ts` ("I'd like to start a
   project."), the questionnaire's answer options ("Yes, I'll provide it"),
   every FAQ *question* ("Do I own the code?"), the welcome book's FAQs. These
   are sentences the reader says or sends. First person is required, and
   rewriting them into third person would be a bug.
2. **The About page.** Meg's own voice, granted explicitly in `CLAUDE.md`.
3. **A case study's `problem` field.** Open question Q2 below.
4. **A one-to-one email whose `From:` names a person.** The contact auto-reply
   is sent as `"Meg · M Studio"` and says "I'll reply within 24 hours." That is
   a person writing to a person who just wrote in, and `CLAUDE.md` permits
   naming her where attribution is genuinely needed. Rewriting it into the
   passive ("a reply will follow") would make a warm message colder for no
   gain. **This does not extend to the website**: the same sentence in a form's
   error state was rewritten, because there nobody is named and nobody is
   writing.

The rule governs *page copy*. It was never meant to rewrite the visitor's own
sentences back at them.

### Em dashes: prose versus plumbing

The ban is on the em dash as punctuation. Three uses are not that, and stay:

- **Field separators**: `M Studio — Websites, Software & Integrations`,
  `01 — The Basics`, `${title} — ${blurb}`. A separator, not a clause break.
- **The "no value" dash**: `${result.scores.seo ?? "—"}` in a results table.
  Correct typography for an absent number.
- **A signature or divider**: `— Meg`, `— M Studio · mlinx.studio`, and the
  `\n\n—\n` rule above the tools stamp.

Twenty genuine prose em dashes were found and replaced on Nov 26. The one that
mattered most was an email subject line, `"Got it — thanks for reaching out"`,
which is the first thing a new lead reads.

### Spelled exactly this way
- `Southern Maine · clients anywhere.`
- `M Studio` (never "M. Studio", "MStudio", "mlinx studio")
- `mlinx.studio` lowercase
- `linx` lowercase, `BrightBase` camel, `The Maine Cleaning Co.` with the period

---

## 5. Tone by context

| Where | Tone | The one rule for it |
|---|---|---|
| Homepage hero | Plain statement of what is for sale | No verb that belongs to Meg |
| Service rows (`pain`) | The reader's bad Tuesday, specifically | Name an hour, a task, or a thing typed twice |
| Service rows (`outcome`) | What is different afterward | The reader's verb, not the build method |
| Prices | Flat, unapologetic, numeric | State the number; never "starting from" |
| Work / proof | Factual to the point of dryness | If it is not running somewhere, do not imply it is |
| Case studies | Narrative, first person permitted where Meg wrote it | Empty blocks stay empty |
| Free tools | Imperative, immediate | Lead with the verb: "Paste any URL and…" |
| Contact | Low pressure, specific about what happens next | Say the cost of asking: zero |
| About | A human voice, hers, with "I" | The only place. Do not spread it. |
| Error and empty states | Helpful, no apology theater | Say what to do, not how sorry the system is |

---

## 6. Live violations found in the audit

Five shipped strings break the rules above. Three break `CLAUDE.md` outright.

| # | String | Where | Problem |
|---|---|---|---|
| 1 | "The operations app **I built for my cleaning company**" | `work` → BrightBase `blurb` | First person, on the homepage and `/catalog` |
| 2 | "One line of code to install. **I set it up**, you go live" | `marketItems` → quote-widget | First person |
| 3 | "a digital welcome book for **our** Maine short-term rental" | `work` → Keystone `blurb` | "our" |
| 4 | "**Enquiries** arrive as voicemails…" | `services[leads].pain` | British spelling |
| 5 | "watch the **neighbouring** times disappear" | `demos[studio].proves` | British spelling |

Plus three `tag` values reading "our own company", "our own rental", "our own
project" — these are a judgment call rather than a clear violation, since the
tag's job is to disclose that the work is not an outside client's. Flagged in
the open questions.

---

## 7. The "around" tic

**Eleven shipped strings build the same construction: `<verb>ed around <your
noun>`.**

built around the one thing you want a visitor to do · built around your process
· built around what your platforms actually support · shaped around the people
using them · set up around your numbers · built around one goal · Connected
around the workflow you actually have · mapped around that · built one system
around it · configured to your stack · Tuned to your tools

It reads as reassuring the first time and as a template by the third. Meg hit
the fourth one in a hero and said so.

Worse, three of the four `services[].outcome` lines are the *same sentence*:

> "A site **built around** the one thing you want a visitor to do, **and** the
> pages that get them there."
> "A focused tool **built around** your process, **with** the features and the
> handover **agreed** before work starts."
> "One connection **built around** what your platforms actually support,
> **checked against** the workflow you need."

The fourth is the one that escaped, and it is the best of the four:

> "A path from first click to a booked job, with the quoting mostly done before
> it reaches you."

**Rule: at most one "around your X" on the whole site, and the four `outcome`
lines may not share a sentence shape.** Four services should read like four
different answers, because they are.

---

## 8. Before shipping any copy

1. Read it aloud. If you run out of breath, split it.
2. Find the main verb. Whose is it? If Meg's, rewrite.
3. Can the reader picture one specific thing in it? If not, name one.
4. Count claims. Is each one true and in `lib/content.ts`?
5. Grep for: `we `, `our `, ` I `, `my `, `—`, `around your`, `let's`,
   `solution`, `seamless`, `streamline`, `leverage`.
6. US spelling.
7. Would it survive being read on a phone, in a truck, between jobs?

---

## 9. Open questions for Meg

Each carries a recommendation, so none of them blocks work.

**Q1. The three "our own" tags.** `work[]` labels three projects "our own
company", "our own rental", "our own project". The word is doing honest
disclosure, which matters more than the pronoun rule. But it is still "our" on
a page that forbids it.
*Recommendation: change to "M Studio's own" on all three.* It discloses the
same thing, names her studio rather than an implied team, and keeps the rule
clean. **Confidence: medium.** Meg may prefer "our" as warmer.

**Q2. First person in `caseStudies[maine-cleaning-co].problem`.** It is a
paragraph in her voice, drafted from her own cover letter and approved by her
in Oct 2026, and it is first person throughout. The About page carries a stated
exception; a case study does not.
*Recommendation: keep it.* It is the single most convincing paragraph on the
site, and the reason is that a person is talking. Extend the About exception to
a case study's `problem` field, and write that exception down rather than
leaving it to be rediscovered.
**Confidence: medium.** This is her call, not a derivable rule.

**Q3. "Common issues" as the services eyebrow.** Her own phrase, shipped Nov
26. It frames the section as problems rather than as a menu, which is right.
But "issues" is slightly clinical for the rest of this voice.
*Recommendation: leave it.* She chose it, it reads fine, and the heading under
it ("Which one sounds familiar?") carries the warmth. Revisit only if she
raises it. **Confidence: high.**

---

## 10. What was rewritten when this was written

These guidelines were applied in the same change, so the site and the document
agree from day one. Twenty-one files, all copy, no behavior:

- **The hero line Meg rejected**, rewritten per §2.2.
- **Three of four `services[].outcome` lines**, which were one sentence wearing
  three hats (§7). The fourth was already the good one and is untouched.
- **Five rule violations**: two first-person strings on pages that are not
  /about, one "our", two British spellings.
- **Six more "around" constructions**, in `founderNote`, `approachSteps`, two
  `ladder` build rungs, a marketplace tagline and the Pricing card.
- **Seven "we/us" strings** outside the privacy policy: two FAQ answers (one of
  which was also factually backwards, crediting the control a custom build buys
  to the studio rather than the client), the intake lede, two questionnaire
  labels, a tooltip and a prefill error.
- **Twenty prose em dashes**, mostly in error messages and transactional email,
  including the lead auto-reply's subject line.
- **Two jargon strings** aimed at non-technical buyers: "configured to your
  stack" and "tuned to your tools".

Deliberately **not** touched: the privacy policy's "we" (legal-entity voice in
a document nobody reads for tone, and rewriting it risks changing a legal
statement), every first-person string in the visitor's own mouth, and all
separator and "no value" dashes.

`npx tsc --noEmit`, `npx next build` and all 72 browser tests pass; the
homepage and `/services` were looked at in Harbor at 1440px and 390px.

---

## 11. What this document does not cover

- **Visual design.** `CLAUDE.md`'s "Design and motion" section owns that.
- **The evidence rule.** `CLAUDE.md`'s "Never invent proof" is the authority
  and overrides anything here.
- **Structure and information architecture.** Which sections exist and in what
  order is a design decision, recorded in `CLAUDE.md`'s Nov 26 entry.

Where this document and `CLAUDE.md` disagree, `CLAUDE.md` wins. It is the
checked-in law; this is a working guide to writing sentences that obey it.
