import { test, expect, type Page } from "@playwright/test";

/* The router test asserts its counts against the same source the component
   reads, so a literal here cannot drift from the real work list. Static
   rather than a dynamic import(): Playwright transpiles these, and a
   runtime import of a .ts module is not. */
import { marketItems, smallProjects, work } from "../lib/content";
import { catalog, categories, categoryCount } from "../lib/catalog";
import { integrations, resolveProof } from "../lib/integrations";

/*
  Does every page still render, and does the one form that matters still
  submit? That is the whole brief. Anything more detailed would need
  rewriting every time the copy changes, which is the fastest way to end up
  with a suite nobody trusts.
*/

const PAGES = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/tools", name: "tools" },
  // Nov 15 2026: /services, /marketplace and /demo redirect to /catalog;
  // the redirect test below covers them. /work is the new projects page.
  { path: "/work", name: "work" },
  { path: "/catalog", name: "catalog" },
  { path: "/intake", name: "intake" },
  // Added with the case studies: a dynamic route is the easiest thing here
  // to break without noticing, since nothing links to it at build time.
  { path: "/work/maine-cleaning-co", name: "case study" },
  { path: "/brightbase", name: "brightbase" },
];

for (const { path, name } of PAGES) {
  test(`${name} (${path}) renders without erroring`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const res = await page.goto(path);
    expect(res?.status(), `${path} should return 200`).toBe(200);

    /* `toBeAttached`, not `toBeVisible`: /intake's h1 is sr-only. */
    await expect(page.locator("h1").first()).toBeAttached();
    expect(errors, `${path} threw in the browser`).toEqual([]);
  });
}

test("the contact form submits and confirms", async ({ page }) => {
  /*
    The route is mocked, so this never sends mail or writes a lead — it
    checks the wiring between the form and /api/contact, which is the part
    that can silently rot. The route handler itself is server-side and not
    what a browser test should be exercising.
  */
  let posted: Record<string, string> | null = null;
  await page.route("**/api/contact", async (route) => {
    posted = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");
  await page.locator("#name").fill("Smoke Test");
  await page.locator("#email").fill("smoke@example.com");
  await page.locator("#message").fill("Automated smoke test, please ignore.");
  await page.getByRole("button", { name: /send it over/i }).click();

  await expect(page.getByRole("heading", { name: "Got it." })).toBeVisible();
  expect(posted).not.toBeNull();
  expect(posted!.name).toBe("Smoke Test");
  expect(posted!.email).toBe("smoke@example.com");
});

test("a failed submit tells the visitor instead of silently dropping it", async ({ page }) => {
  /*
    The lead path is the reason Phase 1 exists, so the failure branch is
    worth a test of its own: a form that swallows an error looks identical
    to one that worked.
  */
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "Couldn't send right now." }),
    }),
  );

  await page.goto("/");
  await page.locator("#name").fill("Smoke Test");
  await page.locator("#email").fill("smoke@example.com");
  await page.locator("#message").fill("Automated smoke test, please ignore.");
  await page.getByRole("button", { name: /send it over/i }).click();

  /* Scoped to the contact section: Next renders its own route announcer
     with role="alert", so an unscoped lookup matches two elements. */
  await expect(page.locator('#contact [role="alert"]')).toContainText(
    "Couldn't send right now.",
  );
});

/*
  Structured data.

  This is the one thing on the site that a human reviewing a page will never
  notice is broken: it is invisible, and the failure mode is silent. A node
  renaming its `@id` leaves every reference to it pointing at nothing, and
  the page still looks perfect. So the test is not "is there markup" but
  "does every reference resolve" — which is the invariant lib/schema.ts
  exists to hold.

  Scoped to in-document resolution on purpose: a bare {"@id": …} is a promise
  that this page's own markup describes that node. Anything a consumer would
  have to fetch over HTTP to make sense of should carry its `@type` inline
  instead, which also takes it out of this check. The first run of this test
  caught exactly that — `mainEntityOfPage` on a work node pointed at a page
  node defined only in that one page's HTML.
*/
test("the structured data graph has no dangling @id references", async ({ page }) => {
  const dangling: string[] = [];
  const defined = new Set<string>();
  const referenced: { id: string; from: string }[] = [];

  for (const path of ["/", "/work/linx"]) {
    await page.goto(path);
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length, `${path} should carry structured data`).toBeGreaterThan(0);

    for (const raw of blocks) {
      /* Throws, and fails the test, if we ever emit invalid JSON. */
      const parsed = JSON.parse(raw);
      for (const node of parsed["@graph"] ?? [parsed]) {
        if (node["@id"]) defined.add(node["@id"]);
        /* A bare {"@id": …} is a reference; anything else is a definition. */
        const walk = (v: unknown) => {
          if (!v || typeof v !== "object") return;
          if (Array.isArray(v)) return v.forEach(walk);
          const o = v as Record<string, unknown>;
          if (typeof o["@id"] === "string" && Object.keys(o).length === 1) {
            referenced.push({ id: o["@id"] as string, from: String(node["@type"]) });
            return;
          }
          Object.values(o).forEach(walk);
        };
        for (const [k, v] of Object.entries(node)) if (k !== "@id") walk(v);
      }
    }
  }

  for (const r of referenced)
    if (!defined.has(r.id)) dangling.push(`${r.from} → ${r.id}`);
  expect(dangling, "every @id reference should resolve to a defined node").toEqual([]);
});

test("the portfolio claims a named person who made the work", async ({ page }) => {
  await page.goto("/");
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  const graph = JSON.parse(raw ?? "{}")["@graph"] as Record<string, unknown>[];

  /*
    The point of the whole graph. An answer engine asked who built these
    things needs a full name, not "Meg", and each work needs to credit her.
  */
  const person = graph.find((n) => n["@type"] === "Person");
  expect(person?.name, "the Person node should carry her full name").toBe("Megan Small");

  const works = graph.filter(
    (n) => typeof n["@id"] === "string" && (n["@id"] as string).includes("/work/"),
  );
  expect(works.length, "every case study should have a CreativeWork node").toBe(3);
  for (const w of works)
    expect(
      (w.creator as { "@id": string } | undefined)?.["@id"],
      `${w.name} should credit her as creator`,
    ).toBe(person?.["@id"]);
});

/*
  The analytics beacons.

  This exists because the site shipped for months with `<Analytics />`
  mounted, four tracked events wired up, and zero data collected. That
  failure was at the Vercel project level, not in the code, but the code has
  a failure mode that looks exactly the same from the outside: `script-src`
  carries 'strict-dynamic', which makes the browser ignore `'self'`, so a
  same-origin src is NOT what allows these scripts. They are allowed only by
  inheriting trust from the nonce-allowed bundle that appends them. Change
  the CSP, or how Next emits its own scripts, and the beacons stop loading
  while every page still renders perfectly.

  So the assertion is "the browser was willing to fetch them". Locally and
  in CI `/_vercel/*` has no handler and returns HTML, so the scripts cannot
  execute — that is expected and is not what this guards. A CSP block is
  different in kind: it stops the request before it is made and fires a
  securitypolicyviolation naming script-src.
*/
test("the analytics beacons are not blocked by the CSP", async ({ page }) => {
  const attempted: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/_vercel/")) attempted.push(new URL(r.url()).pathname);
  });

  await page.addInitScript(() => {
    (window as unknown as { __cspv: unknown[] }).__cspv = [];
    document.addEventListener("securitypolicyviolation", (e) =>
      (window as unknown as { __cspv: unknown[] }).__cspv.push({
        blocked: e.blockedURI,
        directive: e.violatedDirective,
      }),
    );
  });

  await page.goto("/");
  /* Both components inject on mount, after hydration. */
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.querySelectorAll('script[src*="/_vercel/"]').length,
      ),
    )
    .toBe(2);

  expect(
    attempted.sort(),
    "both beacons should be fetched, not blocked before the request",
  ).toEqual(["/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"]);

  const violations = await page.evaluate(
    () => (window as unknown as { __cspv: { blocked: string; directive: string }[] }).__cspv,
  );
  const scriptBlocks = violations.filter((v) => v.directive.startsWith("script-src"));
  expect(scriptBlocks, "the CSP should not block the analytics beacons").toEqual([]);
});

/*
  Touch target size on the homepage's controls.

  **This was scoped to the hero reel, and the reel no longer exists.** Its
  dots shipped at 6x6 CSS px — a fine-looking dot and a target a quarter of
  the 24px minimum (WCAG 2.5.8). It cost the live homepage its accessibility
  score, and nobody saw it, because a too-small button looks exactly like a
  correctly-sized one: the dot is the same either way. The only signal was a
  Lighthouse run after it was already merged.

  The Nov 15 rebuild deleted the reel, which left the test selecting nothing
  and the lesson guarding nothing. Deleting it with the component would have
  been the tidy move and the wrong one: the rebuild immediately reintroduced
  the same failure in a new place. Eight standalone links on the new page —
  the worked example's three closing links, the four card links under "the
  rest of it", and the live readout's "connect yours" — rendered between 16
  and 23px tall at phone width, which is the only width where it matters.

  So it sweeps the page instead of naming one widget. Measured at 390px,
  because a target is only too small for a thumb.

  Links sitting inside a paragraph are skipped: WCAG 2.5.8 exempts a target
  in a sentence or block of text, and "try the free tools on this site" is
  exactly that. Everything standalone is fair game, and a new section gets
  checked without anybody remembering to add it here.

  The assertion is on the rendered box, not the markup. Restyling a link is
  fine; shrinking what a thumb has to hit is not.
*/
test("the homepage's controls are big enough to hit on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  /* The page's own sections. The shared header and footer are deliberately
     out of scope: they are not what this change touched, and sweeping them
     here would make a homepage test fail for a footer reason. */
  const SECTIONS = [
    "#top",
    'section[aria-labelledby="needs-heading"]',
    'section[aria-labelledby="start-heading"]',
  ];

  const tooSmall: string[] = [];
  let checked = 0;

  for (const selector of SECTIONS) {
    const root = page.locator(selector);
    await expect(root, `the homepage should render ${selector}`).toHaveCount(1);
    await root.scrollIntoViewIfNeeded();

    const controls = root.locator("a, button");
    for (let i = 0; i < (await controls.count()); i++) {
      const control = controls.nth(i);
      /* Inline in a sentence: exempt. See the header note. */
      if (await control.evaluate((el) => Boolean(el.closest("p")))) continue;

      const box = await control.boundingBox();
      if (!box) continue; // not rendered at this width
      checked += 1;
      if (box.width < 24 || box.height < 24) {
        const label = (await control.innerText()).trim().replace(/\s+/g, " ").slice(0, 48);
        tooSmall.push(
          `${selector} → "${label}": ${Math.round(box.width)}x${Math.round(box.height)}`,
        );
      }
    }
  }

  expect(checked, "the sweep should have found controls to measure").toBeGreaterThan(8);
  expect(tooSmall, "every standalone control should be at least 24x24").toEqual([]);
});

/*
  The lead endpoints are not open relays.

  /api/contact mails Meg and sends an auto-reply to whatever address the
  caller typed. It shipped with no origin check while every other endpoint
  that mails anyone had one, so a script could POST it directly, from
  anywhere, as fast as it liked: her inbox filled with junk inquiries, and
  her domain sent auto-replies to strangers on someone else's say-so.

  The protection is a header check, so nothing on the page shows whether it
  is there, and the form keeps working either way. That is exactly the kind
  of thing that goes missing in a refactor without anyone noticing, which is
  why it is asserted here rather than left to a reviewer to remember.

  A browser always sends Origin on a cross-origin POST, so this is the
  request a bot makes, not one a visitor can make by accident.
*/
test("the lead endpoints refuse requests from outside the site", async ({ request }) => {
  const payload = {
    name: "Spam Bot",
    email: "bot@example.com",
    message: "hello",
    url: "https://example.com",
    to: "someone@example.com",
  };

  for (const path of ["/api/contact", "/api/tool-lead", "/api/questionnaire"]) {
    const noOrigin = await request.post(path, { data: payload });
    expect(noOrigin.status(), `${path} should reject a request with no Origin`).toBe(403);

    const foreign = await request.post(path, {
      data: payload,
      headers: { origin: "https://evil.example" },
    });
    expect(foreign.status(), `${path} should reject a foreign Origin`).toBe(403);
  }
});

/*
  The Turnstile challenge stays inert until it is configured.

  lib/turnstile.ts lets a submission through when TURNSTILE_SECRET_KEY is
  unset, because a half-configured challenge that rejects real visitors is
  worse than the spam it was added for. That default is the whole reason it
  was safe to merge before Meg has the keys, and it is one edit away from
  being lost: make verification required and the live contact form starts
  turning real people away with a 403, silently, on a site with no keys set.

  CI runs without the keys, so that is exactly the state under test here. A
  same-origin submission must fail at mail or storage (502) or succeed, and
  must not be refused as a failed challenge. The widget must also be absent
  from the page, since rendering an unconfigured one would show visitors a
  checkbox that can never be satisfied.
*/
test("the contact form is not gated by an unconfigured Turnstile", async ({ page, request }) => {
  /*
    The origin has to be one the gate accepts, or the 403 under test would be
    the origin check rather than the challenge. Note it cannot be Playwright's
    own baseURL: that is http://127.0.0.1, and isAllowedOrigin lists localhost
    but not the loopback IP, so a request from it is refused. Harmless in
    production, where the origin is the real domain, but worth knowing if a
    future test or a local browser session reaches the site that way.
  */
  const res = await request.post("/api/contact", {
    data: { name: "Real Person", email: "someone@example.com", message: "Hello there." },
    headers: { origin: "https://mlinx.studio" },
  });
  expect(
    res.status(),
    "an allowed-origin submission must not be refused while Turnstile is unconfigured",
  ).not.toBe(403);

  await page.goto("/");
  expect(
    await page.locator(".cf-turnstile").count(),
    "no widget should render without NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  ).toBe(0);
});

/*
  Owner blocks are not stays.

  A platform's iCal export is not a list of reservations, it is a list of
  nights the property is unavailable: a host's own blocked dates and
  preparation time sit in the same feed as real bookings, labelled only by
  their summary. Counting those as stays invents a cleaning on the day a
  block ends, and a block that starts on a checkout day fakes a same-day
  turnaround, which is the one thing the tool exists to flag.

  The feed below is the shape that breaks it: a real stay checking out on the
  14th, an "Airbnb (Not available)" block starting that same day, another
  block, and a second real stay. Two cleanings, no same-day turnaround.
  Before the filter this answered four and one.
*/
test("the turnover planner ignores blocked dates", async ({ request }) => {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Airbnb Inc//EN",
    "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20270410", "DTEND;VALUE=DATE:20270414", "SUMMARY:Reserved", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20270414", "DTEND;VALUE=DATE:20270418", "SUMMARY:Airbnb (Not available)", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20270422", "DTEND;VALUE=DATE:20270425", "SUMMARY:Blocked", "END:VEVENT",
    "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20270501", "DTEND;VALUE=DATE:20270503", "SUMMARY:Reserved - Dana", "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const res = await request.post("/api/turnover", {
    data: { ics },
    headers: { origin: "https://mlinx.studio" },
  });
  expect(res.status()).toBe(200);
  const data = await res.json();

  expect(data.bookings, "only the two real stays count").toBe(2);
  expect(data.blocked, "the two owner blocks are reported, not hidden").toBe(2);
  expect(data.turnovers.map((t: { date: string }) => t.date)).toEqual([
    "2027-04-14",
    "2027-05-03",
  ]);
  expect(
    data.sameDay,
    "a block starting on a checkout day is not a same-day turnaround",
  ).toBe(0);
});

/*
  The homepage's work anchor, and the one rule the rebuild is built on.

  Two separate invariants, asserted together because they describe the same
  section.

  **One: #work is unique and lands on the worked example.** The hero's
  secondary button, the nav and footer Work links, and every /#work from an
  inner page target one id. It has moved twice: it sat on a small tile of
  project names inside the control panel, then on a grid of three case-study
  cards, and it is now on OneJob, the single project told all the way
  through. Both failure modes here are invisible — a duplicate id renders
  two perfect-looking sections while every link silently resolves to the
  first, and a renamed id leaves five live-looking links that scroll
  nowhere. Neither shows up in a build, a type check or a Lighthouse run.

  **Two: no project appears twice on the page.** This is the complaint the
  rebuild answers. The old homepage listed four projects in three separate
  blocks — a rotating window, a "Built and running" tile, and three cards —
  with sentences copied verbatim between two of them, so a visitor met the
  same four names three times before reading anything about what any of them
  did. The split between OneJob and MoreWork is the fix, and MoreWork's
  `ALREADY_SHOWN` is an editorial list, which is exactly the kind of thing
  that regrows when somebody adds a project and reaches for the obvious
  place to put it. So the rule is asserted against `work` itself rather than
  against a count written here.

  Counted on the rendered text rather than on links, because the repetition
  was prose: two of the three blocks carried the project's name and blurb as
  text, and a test that only counted anchors would have passed on all of it.
*/
/*
  /work lists every real project exactly once. The homepage's worked
  example (OneJob, id="work") was removed late on Nov 15 at Meg's ask, so
  the cleaning company's story lives on /work and its case study only.
*/
test("/work lists every project exactly once", async ({ page }) => {
  await page.goto("/work");
  const cards = await page.locator("main h2").allTextContents();
  for (const item of work) {
    const hits = cards.filter((t) => t.trim() === item.title).length;
    expect(hits, `"${item.title}" should be listed exactly once on /work, not ${hits}`).toBe(1);
  }
});

/*
  The case-study screenshot stays pinned while the build steps scroll.

  BuildScroller's whole effect is one `position: sticky` screen that holds
  still while four steps move past it. Sticky dies inside a clipped
  ancestor, because the clipped box becomes its scroll container, and this
  repo puts `overflow-hidden` on almost every section wrapper. Both
  BuildScroller's header and the comment above the case-study page say so in
  plain words.

  It happened anyway: the V2 pass wrapped the page in
  `relative overflow-hidden` for the aurora, and the pinned screen started
  scrolling away. Nothing caught it. The page renders, every colour is
  right, there is no console error and no layout shift, and a screenshot of
  the top of the page looks perfect. You only see it by scrolling.

  So the invariant gets a test rather than a third comment: scroll past the
  sticky element and assert it is still near its `top-24` offset.
*/
test("the case study's build screenshot stays pinned while the steps scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/maine-cleaning-co");

  const sticky = page.locator(".sticky.top-24").first();
  await expect(sticky, "the case study should render BuildScroller").toBeAttached();

  await sticky.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  /*
    Pinned means it does not move WITH the page, so measure the travel rather
    than the final offset. An absolute "is it near 96px" check is not enough:
    depending on where the scroll lands, a broken sticky can still happen to
    sit near the top, and the first version of this test passed that way with
    the bug present. Travel is the invariant: scroll 900px, and a pinned
    element should barely move while an unpinned one rides the full distance.
  */
  const before = await sticky.evaluate((el) => el.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(300);
  const after = await sticky.evaluate((el) => el.getBoundingClientRect().top);
  const travelled = Math.round(before - after);
  expect(
    travelled,
    `the pinned screen moved ${travelled}px against a 900px scroll; pinned should be near 0 ` +
      "— check for an overflow-hidden ancestor",
  ).toBeLessThan(200);

  /* And name the cause directly, so a failure says what to fix. */
  const clipper = await sticky.evaluate((el) => {
    let n = el.parentElement;
    while (n && n !== document.documentElement) {
      if (getComputedStyle(n).overflow !== "visible") return n.className;
      n = n.parentElement;
    }
    return null;
  });
  expect(clipper, "no ancestor of the sticky screen may clip its overflow").toBeNull();
});

/*
  No "Book a free call" button is a dead end.

  With no NEXT_PUBLIC_BOOKING_URL — which is the live configuration, and what
  the TODO in lib/booking.ts is about — BookCall falls back to an anchor
  instead of a scheduler. That anchor has to land on a form that exists.

  The V2 pass broke this. It put PanelHeader, which carries the header's
  primary call to action, on /tools, /about and /work/[slug], none of which
  render Contact, while the old <Nav> it replaced had always linked to
  `/#contact` with the leading slash. So the button went from reaching the
  homepage form to changing the hash and doing nothing. lib/booking.ts even
  promises "no dead ends either way", which stopped being true.

  Nothing about it looks wrong: the button renders, the styles are right, the
  click is tracked, and the URL changes. Only the visitor notices, by being
  stuck. So the invariant is asserted per route rather than left to whoever
  adds the next page: a call CTA pointing at a bare #contact is only allowed
  on a page that has one.
*/
/* A route joins this list the moment its V2 pass gives it PanelHeader: that
   is the shape this test exists to catch. /marketplace came in with its own
   conversion; /turnover, /welcome-book, /privacy and /terms came in with the
   batch that finished the site. The two legal pages share one shell
   (components/LegalDoc.tsx), so they are one fix and two routes.

   /intake is deliberately NOT here. Its V2 pass gave it the palette and no
   header, so it has no booking CTA to dead-end; see the note at the top of
   app/intake/page.tsx. /lab is not here either: it was left unconverted. */
for (const path of [
  "/",
  "/brightbase",
  "/tools",
  "/about",
  "/catalog",
  "/work",
  "/turnover",
  "/welcome-book",
  "/privacy",
  "/terms",
  "/work/maine-cleaning-co",
]) {
  test(`${path} has no dead-end booking CTA`, async ({ page }) => {
    await page.goto(path);

    const local = page.locator('a[data-offer="call"][href="#contact"]');
    const count = await local.count();
    if (count > 0) {
      await expect(
        page.locator("#contact"),
        `${path} has ${count} call CTA(s) pointing at an in-page #contact, so it must render one ` +
          '— give PanelHeader bookHref="/?offer=call#contact" on a page without the form',
      ).toHaveCount(1);
    }

    /* And every call CTA must point somewhere, in-page or not. */
    for (const cta of await page.locator('a[data-offer="call"]').all()) {
      const href = await cta.getAttribute("href");
      expect(href, `a call CTA on ${path} has no href`).toBeTruthy();
    }
  });
}

/*
  The demo store.

  Two things are worth a test here and the rest is not.

  The banner is the first one. /demo/shop is a fictional company with
  fictional stock, and the only thing standing between that and a visitor
  believing otherwise is a line of text at the top of the page. CLAUDE.md
  bans invented proof "anywhere, including demos and placeholders", so if a
  refactor ever drops that banner the demo stops being honest. A test is
  cheaper than remembering.

  The cart arithmetic is the second. It is the one piece of real logic in
  the store, it is the thing a prospective client is implicitly being shown
  ("she can build a working cart"), and money bugs are invisible until
  somebody adds a second item.
*/
/*
  Is `pattern` the first thing on the page, ahead of the <h1>?

  Reads rendered text order rather than hunting for the element that matches,
  for two reasons that each broke an earlier version of this. Every one of
  these demos repeats its notice in the footer, so "the element containing
  the text" is ambiguous. And `textContent` matches on ancestors, so the
  first match is the outermost wrapper — which CONTAINS the h1, making a
  compareDocumentPosition check return FOLLOWING and pass even if the banner
  had been moved to the bottom of the page.

  innerText is the order a person reads in and roughly the order a screen
  reader announces, which is the thing being asserted.
*/
async function noticeComesFirst(page: Page, pattern: RegExp) {
  return page.evaluate(
    ({ source, flags }) => {
      const text = document.body.innerText;
      const at = text.search(new RegExp(source, flags));
      const h1 = document.querySelector("h1");
      const h1At = h1 ? text.indexOf(h1.innerText.trim()) : -1;
      return { at, h1At };
    },
    { source: pattern.source, flags: pattern.flags },
  );
}

test("/demo/shop says it is a demo, before anything else", async ({ page }) => {
  await page.goto("/demo/shop");

  const banner = page.getByText(/not a real company/i);
  await expect(banner).toBeVisible();
  await expect(page.getByText(/nothing here takes payment/i)).toBeVisible();

  /* Before the storefront, so a screen reader reaches it first. */
  const { at, h1At } = await noticeComesFirst(page, /not a real company/i);
  expect(at, "the demo notice should appear on the page").toBeGreaterThanOrEqual(0);
  expect(h1At, "the storefront should have a heading to compare against").toBeGreaterThan(-1);
  expect(at, "the demo notice must precede the storefront").toBeLessThan(h1At);
});

test("/demo/shop cart totals a size change and a second copy", async ({ page }) => {
  await page.goto("/demo/shop");

  await page.getByRole("button", { name: /First Light/ }).first().click();
  const sheet = page.getByRole("dialog");

  /* Base size, then the one that adds $42. */
  await expect(sheet.getByText("$28", { exact: true })).toBeVisible();
  await sheet.getByRole("button", { name: '24 × 36"' }).click();
  await expect(sheet.getByText("$70", { exact: true })).toBeVisible();

  await sheet.getByRole("button", { name: "Add to cart" }).click();

  /*
    Read the grand total by its own label rather than by matching a dollar
    string anywhere in the cart. With one line at quantity two the line
    total and the grand total are the same number, so a loose match passes
    while proving nothing about which one it read, and Playwright's strict
    mode rejects it outright for resolving to two elements.
  */
  const cart = page.getByRole("dialog", { name: "Cart" });
  const grandTotal = cart.getByTestId("cart-total");

  await expect(grandTotal).toContainText("$70");

  await cart.getByRole("button", { name: /Add one First Light/ }).click();
  await expect(grandTotal).toContainText("$140");
  /* And the line itself, which is the other half of the arithmetic. */
  await expect(cart.locator("li").filter({ hasText: "First Light" })).toContainText("$140");

  /* And it must say no money changes hands before the button is pressed. */
  await expect(cart.getByText(/nothing is charged/i)).toBeVisible();
});

/*
  The booking demo.

  Same two-things rule as the store above: the honesty banner, and the one
  piece of real logic.

  Here that logic is availability, and it is worth a test for a reason the
  cart is not. A cart that adds up wrong is embarrassing; a booking page
  that double-books puts two people in one room at the same time, and the
  studio finds out from whoever turns up second. The rule is in
  lib/demo-booking.ts and the screen renders what it returns, so a test
  that books a slot and watches its neighbours vanish is testing the rule
  through the glass the visitor is actually looking at.
*/
test("/demo/studio says it is a demo, before anything else", async ({ page }) => {
  await page.goto("/demo/studio");

  await expect(page.getByText(/not a real business/i).first()).toBeVisible();
  await expect(page.getByText(/nothing here books a real appointment/i).first()).toBeVisible();

  const { at, h1At } = await noticeComesFirst(page, /not a real business/i);
  expect(at).toBeGreaterThanOrEqual(0);
  expect(at, "the demo notice must precede the booking form").toBeLessThan(h1At);

  /* Nothing on this page may ask for money. */
  await expect(
    page.locator('input[type="password"], input[autocomplete*="cc-"], input[name*="card" i]'),
  ).toHaveCount(0);
});

test("/demo/studio will not offer a time it has just given away", async ({ page }) => {
  await page.goto("/demo/studio");
  await page.getByTestId("service-signature").click();

  /*
    Pin a practitioner first, and that is not tidiness.

    Left on "anyone available", holding a time books ONE of them and the
    hour stays bookable with the other, which is correct behaviour and makes
    the assertion below false. Replaying this test against the booking
    helpers for every start date in a year, it fails on five of them — the
    first being a studio date of 2027-07-26, where July 27 at 3:00 PM is
    free for both. A calendar-dependent flake that only shows up on 1.4% of
    days is the worst kind: it lands months later, on somebody else's PR.
  */
  await page.getByTestId("who-rk").click();

  /*
    Find a day with enough slots to have neighbours either side. Which day
    that is depends on when the suite runs, so it is searched for rather
    than hardcoded — the demo offers the next seven days from today.
  */
  const days = await page.getByTestId("date-strip").locator("button").all();
  let found = false;
  for (const d of days) {
    await d.click();
    if ((await page.locator("[data-slot]").count()) >= 4) {
      found = true;
      break;
    }
  }
  expect(found, "no day in the next week offered four slots to test with").toBe(true);

  const before = await page
    .locator("[data-slot]")
    .evaluateAll((els) => els.map((e) => Number((e as HTMLElement).dataset.slot)));

  /* The middle one, so there is something to block on both sides. */
  const target = before[Math.floor(before.length / 2)];
  await page.locator(`[data-slot="${target}"]`).click();
  await page.getByTestId("confirm-booking").click();
  await expect(page.getByTestId("booked-panel")).toBeVisible();

  const after = await page
    .locator("[data-slot]")
    .evaluateAll((els) => els.map((e) => Number((e as HTMLElement).dataset.slot)));

  expect(after, "the time just booked is still on offer").not.toContain(target);
  /* The cleanup gap has to take the touching times with it, or the studio
     runs late all day. A 60 minute treatment blocks more than its own hour. */
  expect(
    before.length - after.length,
    "booking should remove the slot AND the ones too close to leave a cleanup gap",
  ).toBeGreaterThan(1);
  /* And nothing may appear out of nowhere. */
  expect(after.filter((s) => !before.includes(s)), "slots appeared after a booking").toEqual([]);
});

/*
  The directory demo.

  The banner again, for the sharpest version of the reason: these entries
  read like real small farms in real Maine towns, so the page saying they
  are invented is the only thing between a visitor and a wrong belief.

  Then the one piece of real logic, which here is that the filters COMBINE.
  A filter set that replaces the previous one instead of narrowing with it
  looks completely normal until somebody ticks two boxes, and the count is
  the only thing that would have told them.
*/
test("/demo/directory says the growers are invented, before anything else", async ({ page }) => {
  await page.goto("/demo/directory");

  await expect(page.getByText(/every grower listed here is invented/i).first()).toBeVisible();

  const { at, h1At } = await noticeComesFirst(page, /every grower listed here is invented/i);
  expect(at).toBeGreaterThanOrEqual(0);
  expect(at, "the demo notice must precede the listings").toBeLessThan(h1At);
});

test("/demo/directory filters narrow together, and an empty result says what to drop", async ({
  page,
}) => {
  await page.goto("/demo/directory");

  const count = page.getByTestId("dir-count");
  const cards = page.getByTestId("dir-results").locator("> li");
  const all = await cards.count();
  expect(all, "the directory should list something to begin with").toBeGreaterThan(5);

  /* One filter narrows, and every surviving card actually carries it. */
  await page.getByTestId("cat-Seafood").click();
  const seafood = await cards.count();
  expect(seafood).toBeLessThan(all);
  await expect(count).toContainText(`${seafood} of ${all}`);
  for (const c of await cards.all())
    await expect(c.locator('[data-cat="Seafood"]')).toHaveCount(1);

  /*
    A second filter narrows FURTHER rather than replacing the first. This is
    the assertion the whole test exists for: a facet UI that swaps filters
    instead of combining them passes every other check on this page.
  */
  await page.getByTestId("town-Friendship").click();
  const both = await cards.count();
  expect(both, "adding a town should narrow the seafood list, not reset it").toBeLessThan(seafood);
  expect(both).toBeGreaterThan(0);

  /* Now ask for something that cannot exist, and expect a way out of it. */
  await page.getByTestId("town-Friendship").click();
  await page.getByTestId("cat-Seafood").click();
  await page.getByTestId("cat-Dairy").click();
  await page.getByTestId("town-Friendship").click();
  await expect(page.getByTestId("dir-empty")).toBeVisible();

  /*
    Dairy in Friendship fails on two counts at once, so the page must offer
    BOTH ways out rather than picking one and sounding certain. That
    ambiguity is why lib/demo-directory.ts returns a list.
  */
  await expect(page.getByTestId("loosen-categories")).toBeVisible();
  await expect(page.getByTestId("loosen-towns")).toBeVisible();

  /* And the way out has to work. */
  await page.getByTestId("loosen-towns").click();
  await expect(page.getByTestId("dir-empty")).toHaveCount(0);
  expect(await cards.count()).toBeGreaterThan(0);
});

/*
  The restructure (Nov 15 2026): /services, /marketplace and /demo each
  listed what is for sale, three different ways. They now redirect into
  /catalog. A redirect that quietly breaks strands every old link and every
  Facebook post that used one, so it is asserted, hash included.
*/
test("the retired pages redirect into the catalog", async ({ page }) => {
  for (const path of ["/services", "/marketplace", "/demo"]) {
    await page.goto(path);
    await expect(page, `${path} should land on /catalog`).toHaveURL(/\/catalog$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/services#pricing");
  await expect(page).toHaveURL(/\/catalog#pricing$/);
  await expect(page.locator("#pricing")).toHaveCount(1);
});

/*
  The demos are still one click from the catalog and the homepage, and the
  catalog says the businesses in them are invented. Followed through, so the
  link is proven rather than merely present.
*/
test("the catalog reaches all three demos and says they are invented", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByRole("navigation", { name: "Categories" })).toBeVisible();
  for (const href of ["/demo/shop", "/demo/studio", "/demo/directory"])
    await expect(page.locator(`main a[href="${href}"]`).first(), `${href} should be linked`).toBeVisible();
  await expect(page.getByText(/demos use invented businesses/i)).toBeVisible();

  await page.locator('main a[href="/demo/studio"]').first().click();
  await expect(page).toHaveURL(/\/demo\/studio$/);
  await expect(page.getByTestId("service-signature")).toBeVisible();
});

/* Four links, and the two that carry the site actually land. */
test("the nav is Catalog, Work, BrightBase and About", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link")).toHaveText(["Catalog", "Work", "BrightBase", "About"]);

  await nav.getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page.goto("/");
  await nav.getByRole("link", { name: "Catalog" }).click();
  await expect(page).toHaveURL(/\/catalog$/);
});

/*
  The homepage doors route to catalog shelves, and the number under each is
  real. The count is a claim about evidence (CLAUDE.md, first rule), so it
  is asserted against the same function the component calls, never against
  a literal here, and one door is followed to prove the shelf opens.
*/
test("the homepage category doors route, and their counts are real", async ({ page }) => {
  await page.goto("/");
  const doors = page.locator('section[aria-labelledby="needs-heading"]');
  await expect(doors).toHaveCount(1);

  const shown = categories.filter((c) => ["websites", "booking", "rentals", "connect"].includes(c.id));
  await expect(doors.locator("ul > li a")).toHaveCount(shown.length);
  for (const c of shown) {
    const door = doors.locator(`a[href="/catalog?c=${c.id}"]`);
    await expect(door, `a door for ${c.id}`).toHaveCount(1);
    const n = categoryCount(c.id);
    await expect(door).toContainText(`${n} ${n === 1 ? "option" : "options"}`);
  }

  await doors.locator('a[href="/catalog?c=rentals"]').click();
  await expect(page).toHaveURL(/\/catalog\?c=rentals$/);
  await expect(page.getByRole("heading", { level: 2, name: "Rental hosts" })).toBeVisible();
});

/*
  Every finished catalog item reaches the page. Prices already resolve or
  fail the build (marketPrice/projectPrice throw on a missing id), so this
  guards the other silent failure: an item that exists and never renders.
*/
test("every catalog item renders on /catalog", async ({ page }) => {
  await page.goto("/catalog");
  /* Wait for the grid itself: until the client component mounts, the page
     shows the plain-text Suspense fallback, which lists finished items
     only. Reading before that raced under a loaded runner. */
  await expect(page.getByRole("navigation", { name: "Categories" })).toBeVisible();
  const text = (await page.locator("main").textContent()) ?? "";
  const missing = catalog
    .filter((i) => i.status !== "workbench" && !text.includes(i.name))
    .map((i) => i.name);
  expect(missing, "every finished item should be on the page").toEqual([]);
  /* And the prices from the single sources reach it too. */
  for (const p of smallProjects) expect(text).toContain(p.price);
  expect(marketItems.length).toBeGreaterThan(0);
});

/*
  Nothing finished is reachable from nowhere.

  An audit of what a visitor can actually get to found three finished,
  indexable things effectively invisible:

    · /turnover — a working free tool (paste an Airbnb or Vrbo calendar
      export, get the cleaning schedule). Not in the header, not on the
      homepage, not in the footer, not in the command palette, and not in
      the sitemap. Reachable only by typing the URL.
    · /welcome-book — the only page on the site with a price on it — with
      two inbound links in the entire repo.
    · the three demo apps — one hop behind /demo, and never mentioned on
      the homepage at all.

  Every one of those renders perfectly. That is the point: an orphaned page
  looks exactly like a linked one from the inside, so nothing in a build, a
  type check or a Lighthouse run can tell you a visitor will never find it.
  The only way it surfaces is somebody going looking, which is how it was
  found and why it is asserted here.

  Scoped to the homepage rather than "somewhere on the site" deliberately.
  A link buried on a page that is itself unreachable is not reachability,
  and the homepage is the one page every visitor sees.
*/
test("every finished thing is reachable from the homepage", async ({ page }) => {
  await page.goto("/");

  /* Paths a visitor should be able to click to, without a search box. */
  const MUST_REACH = [
    "/turnover",
    "/welcome-book",
    "/tools",
    "/catalog",
    "/work",
  ];

  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));

  const unreachable = MUST_REACH.filter(
    (path) => !hrefs.some((h) => h === path || h.startsWith(`${path}?`)),
  );

  expect(
    unreachable,
    "these are finished and priced, and a visitor cannot click to them from the homepage",
  ).toEqual([]);
});

/*
  And search engines are told about the indexable ones.

  /turnover was missing from app/sitemap.ts entirely while carrying no
  `noindex` — so the page most likely to be found by a stranger searching
  for exactly what it does was the one page never submitted. The three demos
  are deliberately excluded, because the businesses in them are invented and
  should not rank for somebody trying to buy a print or book a massage;
  asserting their ABSENCE is what stops a well-meaning edit adding them.
*/
test("the sitemap lists the public pages, and not the invented ones", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();

  for (const path of ["/turnover", "/welcome-book", "/tools", "/catalog", "/work"])
    expect(xml, `${path} should be in the sitemap`).toContain(`${path}</loc>`);

  for (const path of ["/demo/shop", "/demo/studio", "/demo/directory"])
    expect(xml, `${path} is noindex and should stay out of the sitemap`).not.toContain(
      `${path}</loc>`,
    );
});

/*
  Every integration shown is one somebody is already running.

  This section is the easiest thing on the site to fake. A grid of familiar
  logos reads as proof and costs nothing to type, and the first rule in
  CLAUDE.md is that proof is never invented. So the list is not trusted:
  each entry cites the exact record elsewhere in the repo that backs it,
  either a chip in a project's own `stack` or an entry in
  `brightbase.integrations`, and this resolves every one of them.

  It asks `resolveProof` rather than re-deriving what counts as backed.
  A second copy of that rule here would agree with the first until the day
  it did not, which is the failure the single-author convention in this
  repo exists to prevent.

  Verified both ways: adding an integration with an invented source fails
  naming it, and the rendered half fails if the section is unwired.
*/
test("every integration traces to a named project", async () => {
  /* Data first, so a bad entry fails with its own name rather than with
     "0 tiles found" on a page that rendered perfectly. */
  const unbacked: string[] = [];
  for (const i of integrations) {
    if (i.proof.length === 0) {
      unbacked.push(`"${i.name}" cites nothing`);
      continue;
    }
    for (const p of i.proof) {
      if (!resolveProof(p))
        unbacked.push(`"${i.name}" cites "${p.source}" in "${p.project}", which does not back it`);
    }
  }
  expect(
    unbacked,
    "every integration should trace to a real record on a real project",
  ).toEqual([]);

  /* The page half of this test went with the section: the integrations
     wall was cut from the site after the Nov 15 buyer review (too long,
     and BrightBase already has its own "works with" section). The data
     half above still guards that every integration traces to a project. */
});
