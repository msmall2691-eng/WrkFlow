import { test, expect, type Page } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";

/* The router test asserts its counts against the same source the component
   reads, so a literal here cannot drift from the real work list. Static
   rather than a dynamic import(): Playwright transpiles these, and a
   runtime import of a .ts module is not. */
import { ladder, marketItems, provingGround, services, smallProjects, work } from "../lib/content";
import { integrations, resolveProof } from "../lib/integrations";
import { catalog } from "../lib/catalog";
import { destination, planets as takes } from "../lib/planets";

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
  // Services and pricing moved off the homepage onto their own page.
  { path: "/services", name: "services" },
  { path: "/marketplace", name: "marketplace" },
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

  /*
    Every section the page owns, found rather than listed.

    This was a hardcoded list of five selectors, directly under a comment
    promising "a new section gets checked without anybody remembering to add
    it here". It did not do that, and the storefront rebuild is what proved
    it: deleting ServiceRouter left the list pointing at a section that no
    longer exists, so the sweep failed on a missing selector instead of
    checking anything, and two brand new sections full of new links went
    unswept. A list that has to be maintained is the thing this test exists
    to not depend on.

    `.cp > section` is every band the homepage composes, and `#top` is the
    hero's own main. The shared header and footer stay out of scope on
    purpose: they are not this page's, and sweeping them here would make a
    homepage test fail for a footer reason.
  */
  const roots = page.locator(".cp > section, #top");
  const found = await roots.count();
  expect(found, "the homepage should have sections to sweep").toBeGreaterThan(4);

  const tooSmall: string[] = [];
  let checked = 0;

  for (let r = 0; r < found; r++) {
    const root = roots.nth(r);
    await root.scrollIntoViewIfNeeded();
    /* Name the section from its own markup, so a failure says where to
       look rather than giving an index into a list that no longer exists. */
    const where = await root.evaluate(
      (el) => el.id || el.getAttribute("aria-labelledby") || el.tagName.toLowerCase(),
    );

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
          `${where} → "${label}": ${Math.round(box.width)}x${Math.round(box.height)}`,
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
test("the work anchor is unique and lands on one job told all the way through", async ({
  page,
}) => {
  await page.goto("/");

  const anchors = page.locator("#work");
  expect(
    await anchors.count(),
    'exactly one element may carry id="work"',
  ).toBe(1);

  const section = anchors.first();
  await expect(
    section.getByRole("heading", { level: 2 }),
    "the anchor should land on the worked example's own heading",
  ).toContainText(/one job, start to finish/i);

  /*
    The four beats. Each is a promise the section makes that an edit could
    quietly drop: the problem is the only real voice on the site, the
    captures are the only screenshots left on the page, and the three
    results are the only confirmed outcome numbers in the repo.
  */
  await expect(
    section.getByRole("heading", { name: /what got built/i }),
    "the worked example should show what was built",
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { name: /what changed/i }),
    "the worked example should show what changed",
  ).toBeVisible();
  await expect(
    section.locator("blockquote"),
    "the problem should be quoted, and attributed, rather than asserted",
  ).toHaveCount(1);
  await expect(section.locator("figcaption")).toContainText(/megan small/i);

  /*
    Scroll EACH capture into view before asking whether it loaded, and give
    the poll a budget that a cold image-optimization response can fit in.

    These <Image>s are loading="lazy", so nothing fetches them until they
    approach the viewport, and `goto` resolves on `load`. The version this
    was adapted from scrolled the *section* and then polled, which is fine
    for three cards in one row and worth not assuming for a 2x2 grid in a
    section nearly 2000px tall.

    Measured rather than assumed, because the first draft of this comment
    asserted that the section scroll left the captures below the fold and
    that was simply untrue: at Playwright's 1280x720 default,
    `scrollIntoViewIfNeeded` on the section puts its top at -583, and all
    four captures are in the viewport and fully loaded before the first
    poll. So the per-image scroll is belt and braces, not the fix.

    What actually failed on CI was the fetch itself: build step 1
    (maineclean.png, the largest source at 2208x1380) reported naturalWidth
    0 after the default 5s poll, on the same run where three separate
    navigations to /work/maine-cleaning-co — whose hero is that same file —
    each timed out at 30s. One slow optimizer, four symptoms. 15s is the
    budget a cold encode on a loaded two-core runner can actually fit in;
    it buys patience without hiding a real failure, since an image that
    never arrives still fails.
  */
  const shots = section.locator("ul img");
  const built = await shots.count();
  expect(built, "the build steps should lead with real captures").toBeGreaterThan(1);
  for (let i = 0; i < built; i++) {
    await shots.nth(i).scrollIntoViewIfNeeded();
    await expect
      .poll(
        () => shots.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth),
        {
          message: `build step ${i + 1} should lead with a screenshot that loaded`,
          timeout: 15000,
        },
      )
      .toBeGreaterThan(0);
  }

  /*
    The hero's second button used to promise this section and now promises
    the shelf, which is the storefront rebuild's one deliberate change to
    what the top of the page offers: a stranger met their first purchasable
    price on screen 12 of 18, and the only alternative to booking a call
    sent them further into the proof. So the reachability assertion moved
    with the button, to the shelf test. What stays here is that the anchor
    itself still works, since the nav, the footer, PanelHeader, every case
    study's back link and /services all target #work.
  */
  /*
    The "a button on this page reaches it" assertion lived here and has
    moved to the shelf test, because the button did. The hero's second
    action used to promise this section; in the storefront rebuild it
    promises the shelf, and a test asserting a promise nothing makes any
    more is a test that cannot fail.

    What is deliberately NOT replaced with a stand-in: there is no longer a
    same-page link to #work on the homepage at all, only the footer's
    `/#work`, which is a full navigation. Clicking that proves nothing about
    this page, and `goto("/#work")` was tried and is worse than nothing: a
    fresh load scrolls before the lazy images above have reserved their
    space, so it lands short and passes or fails on image timing rather
    than on the anchor. The anchor's job is to be a destination for the
    nav, the footer, PanelHeader, every case study's back link and
    /services, and what makes that work is the uniqueness asserted at the
    top of this test.
  */

  /*
    Invariant two: every project is argued in exactly one of the two
    sections that argue projects.

    Scoped to those two rather than swept across the whole page, because the
    page legitimately says some of these words elsewhere: the header nav
    links BrightBase, and the footer carries "mlinx.studio", which contains
    "linx". A page-wide sweep would fail on both and be deleted within the
    week, which is worse than no test.

    `textContent` rather than `innerText`, because a title inside a visually
    hidden <dt> or a clipped element still counts as the page saying it
    twice, and innerText reports nothing for exactly those.

    Case-insensitive, because the same thing is legitimately spelled two
    ways: `work` calls it "Instant Estimate" and the build step it belongs
    to is labelled "Instant estimate". A case-sensitive count would read
    that as zero and call a correctly-rendered page broken.
  */
  const read = async (selector: string) =>
    ((await page.locator(selector).evaluate((el) => el.textContent)) ?? "").toLowerCase();

  const argued = [
    await read("#work"),
    await read('section[aria-labelledby="more-work-heading"]'),
  ];

  for (const item of work) {
    const needle = item.title.toLowerCase();
    const hits = argued.reduce((n, text) => n + text.split(needle).length - 1, 0);
    expect(
      hits,
      `"${item.title}" should be argued in exactly one place on the homepage, not ${hits}`,
    ).toBe(1);
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
  "/services",
  "/tools",
  "/about",
  "/marketplace",
  "/catalog",
  "/demo",
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
  The showcase.

  One test, and it is about the links rather than the look: /demo exists so
  three demos can be presented together, and a card that does not reach its
  demo makes the page worse than not having it.
*/
test("/demo reaches all three demos and says they are invented", async ({ page }) => {
  await page.goto("/demo");

  for (const href of ["/demo/shop", "/demo/studio", "/demo/directory"])
    await expect(page.locator(`a[href="${href}"]`), `${href} should be linked from /demo`).toHaveCount(1);

  await expect(page.getByText(/businesses in them are invented/i)).toBeVisible();

  /* Follow one through, so the link is proven rather than merely present. */
  await page.locator('a[href="/demo/studio"]').click();
  await expect(page).toHaveURL(/\/demo\/studio$/);
  await expect(page.getByTestId("service-signature")).toBeVisible();
});

/*
  The demos are reachable without knowing the URL.

  /demo existed for a day with nothing linking to it, because a sixth nav
  link was Meg's call rather than mine. She made it. This test is what
  stops the link being tidied away again by somebody reading PanelHeader's
  older "five links" note, which is the likeliest way it would disappear.

  Asserted by following it rather than by matching markup: a link that is
  present and wrong is the failure worth catching, and the nav is where
  most people will meet the demos at all.
*/
test("the nav reaches the demos showcase", async ({ page }) => {
  await page.goto("/");

  const link = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Demos" });
  await expect(link, "the main nav should offer Demos").toHaveCount(1);

  await link.click();
  await expect(page).toHaveURL(/\/demo$/);
  /* And it lands on the showcase, not on one of the demos. */
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/three demos/i);
});

/*
  The shop is on the homepage, near the top, and it tells the truth about
  what it is leaving out.

  **This replaced the four-door test.** ServiceRouter asked "What are you
  trying to fix?" at screen 2 and answered with four categories and a count
  of past projects: no price, no product, 1.4 screens, and a link to another
  page. Meg's complaint was that it was "hard to see what is for sale that's
  tangible", and measured at phone width she was being generous. The page
  ran 20.4 screens, the first purchasable price was on screen 14.6, and
  three product prices existed on the whole page.

  So the assertions are the things that were actually wrong, each of which
  can regrow without anything failing to build:

  1. **Depth.** The shelf starts within the first few screens at 390px. A
     page whose shop has drifted back to screen 14 renders perfectly, so
     nothing else catches this.
  2. **One source.** Every card must come from `catalog`, the same list
     /catalog renders. The first version of this section built its own
     shelf from `ladder` and would have been a second catalog with a second
     set of prices, which is the failure this repo keeps recording.
  3. **Honesty about the rest.** Only `try` and `buy` have a price somebody
     can act on today. `built` is quoted, and the page has to say how many
     there are rather than imply the shelf is everything. `workbench` items
     are not built at all, so none of them may appear.
*/
test("the shop is on the homepage, near the top, and says what it leaves out", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const shelf = page.locator("#shelf");
  await expect(shelf, "the homepage should carry the shelf").toHaveCount(1);

  /*
    How far down it starts, and how far it is from being reachable.

    **This number moved because Meg specified a scroll-driven hero, and
    the move is recorded rather than quietly made.** The Vesper prompt
    puts a 600vh camera flight (300vh under 768px) in front of
    everything; measured at 390px the shelf went from 1.7 screens down to
    3.9, and the old `< 3` failed. That is the spec working as written,
    not a regression, and it is also the one thing in that spec that
    fights her own first instruction about this page: "hard to see what
    is for sale that's tangible".

    So the guard is rebuilt around what actually matters rather than
    relaxed. Depth alone was always a proxy; what a visitor needs is for
    the shop to be ONE ACTION away from the first screen, which the
    hero's own button gives them, and for the preamble not to grow
    without anybody noticing. Both are asserted. `SPLINE_VH` is a single
    constant in `lib/planets.ts` if the depth is judged too much.
  */
  const screens = await shelf.evaluate(
    (el) => (el.getBoundingClientRect().top + window.scrollY) / window.innerHeight,
  );

  /* The hero promises the shop; pressing that promise has to arrive
     there, from the first screen, without scrolling to find it. */
  await page.locator('a[href="#shelf"]').first().click();
  await expect(
    shelf,
    "the hero's own button should reach the shop from the first screen",
  ).toBeInViewport();

  expect(
    screens,
    `the preamble should stay about as long as the spec asks for; the shop starts ${screens.toFixed(1)} screens down`,
  ).toBeLessThan(5);


  const text = (await shelf.textContent()) ?? "";

  /*
    Everything with a decided price is on it, with that price.

    Keyed on the price rather than on `status`, which is the distinction
    this section got wrong first time round: `status` says how real a thing
    is, not whether it has been priced. The two interactive demos are `try`
    because you can genuinely use them today, and building one is quoted, so
    a status-banded shelf put "Quoted to your scope" under a FREE heading.
  */
  const decided = (p: string) => /\d/.test(p) || /^free$/i.test(p.trim());
  const actionable = catalog.filter(
    (i) => (i.status === "try" || i.status === "buy") && decided(i.price),
  );
  expect(actionable.length, "there should be something to sell").toBeGreaterThan(4);

  const missing = actionable.filter((i) => !text.includes(i.name)).map((i) => i.name);
  expect(missing, "every item priced for today should be on the shelf").toEqual([]);

  const noPrice = actionable.filter((i) => !text.includes(i.price)).map((i) => i.name);
  expect(noPrice, "every one of those should show its price").toEqual([]);

  /* Nothing unbuilt. `workbench` is the catalog's own word for "not built
     yet", and a price list is the last place it may leak into. */
  const unbuilt = catalog
    .filter((i) => i.status === "workbench")
    .filter((i) => text.includes(i.name))
    .map((i) => i.name);
  expect(unbuilt, "nothing on the workbench may appear on the shelf").toEqual([]);

  /*
    And it owns up to the larger, built half rather than implying the shelf
    is the whole shop.

    `status === "built"` rather than "everything not priced", which is the
    bug Codex caught on this PR: the leftover set pulls in `storefront` and
    `directory`, two `try` demos whose own pages open by saying the business
    is invented, and calls them proof of real businesses. Asking the field
    that already means "running for a real business" is the single author
    for it.
  */
  const quoted = catalog.filter((i) => i.status === "built").length;
  expect(text, "the shelf should say how many more are built and quoted").toContain(
    String(quoted),
  );
  /* At least one, not exactly one: a card with no page of its own falls
     back to the catalog entry, which is the right destination for it. What
     has to exist is the way into the whole thing. */
  await expect(
    shelf.getByRole("link", { name: /browse all/i }),
    "the shelf should lead into the full catalog",
  ).toHaveCount(1);
});

/*
  The ladder on /services resolves, and nothing on sale is orphaned.

  Three separate things this guards, all of which fail silently.

  **One: every id resolves.** `ladder` carries ids rather than retyped
  prices, because /services and /marketplace had already drifted into
  quoting the same business two different ways. The component drops an item
  whose id matches nothing — the alternative is a card with a blank price,
  which reads as a styling bug and sits there for weeks. That means a typo
  or a retired product thins this page in a way nobody would notice, so it
  is asserted here instead.

  **Two: every fixed-price job is placed.** All four `smallProjects` used to
  have a block of their own on /services, which was the only place a visitor
  could learn that a $300 job was on offer at all. That block is gone and
  the ladder carries them beside the problem each one solves. If a future
  edit drops one from `ladder`, it would vanish from the site entirely
  rather than merely move, and the page would still look perfectly fine.

  **Three: the rendered page agrees.** Resolving in Node proves the data is
  sound and says nothing about whether any of it reached the DOM. The prices
  are read off the live page for that reason.
*/
test("every price on the services ladder resolves to its one source", async ({
  page,
}) => {
  /* Data first: fail with the offending id rather than with "0 prices found". */
  const orphans: string[] = [];
  for (const item of ladder) {
    if (item.market) {
      if (!marketItems.some((m) => m.id === item.market))
        orphans.push(`market "${item.market}"`);
    } else if (item.project) {
      if (!smallProjects.some((p) => p.offer === item.project))
        orphans.push(`project "${item.project}"`);
    } else if (!item.title || !item.price || !item.body) {
      orphans.push(`inline item on "${item.service}" is missing title/price/body`);
    }
  }
  expect(orphans, "every ladder id should resolve to a real product or project").toEqual([]);

  /* Every service the page shows has at least a way in and a way to commission. */
  for (const s of services) {
    const rungs = new Set(ladder.filter((i) => i.service === s.id).map((i) => i.rung));
    expect(rungs.has("build"), `"${s.id}" should offer a full build`).toBe(true);
  }

  /* Every fixed-price job is somewhere on it. */
  for (const p of smallProjects) {
    expect(
      ladder.some((i) => i.project === p.offer),
      `"${p.title}" (${p.price}) should be on the ladder, or it is on sale nowhere`,
    ).toBe(true);
  }

  /* And it actually renders. */
  await page.goto("/services");
  /* textContent, not innerText: a price inside a clipped or visually hidden
     element still counts as the page carrying it, and innerText drops
     exactly those. */
  const text = await page
    .locator("#websites, #leads, #software, #integrations")
    .evaluateAll((els) => els.map((e) => e.textContent ?? "").join(" "));

  for (const p of smallProjects)
    expect(text, `${p.title} should appear on the rendered ladder`).toContain(p.price);

  /* A free rung is the cheapest way in and the easiest thing to lose in a
     tidy-up, so assert it survived to the page rather than only to the data. */
  expect(text, "the ladder should offer something free").toContain("Free");
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
    "/demo/shop",
    "/demo/studio",
    "/demo/directory",
    "/tools",
    "/marketplace",
    "/catalog",
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

  for (const path of ["/turnover", "/welcome-book", "/services", "/tools", "/marketplace", "/demo", "/catalog"])
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
test("every integration shown is running in a named project", async ({ page }) => {
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

  /* And it reaches the page. textContent rather than innerText, matching
     the ladder test: a name inside a clipped element still counts as the
     page carrying it. */
  await page.goto("/");
  const section = page.locator("#connects");
  await expect(section).toBeVisible();

  const text = (await section.textContent()) ?? "";
  const missing = integrations.filter((i) => !text.includes(i.name)).map((i) => i.name);
  expect(missing, "every integration should render on the homepage").toEqual([]);

  /* The attribution is the whole point: a tool name on its own is the wall
     of logos this test exists to refuse. Assert the projects reach the page
     too, not just the tool names. */
  const projects = new Set(
    integrations.flatMap((i) => i.proof.map((p) => resolveProof(p)?.title).filter(Boolean)),
  );
  for (const title of projects)
    expect(text, `"${title}" should be named as where an integration runs`).toContain(title as string);
});

/*
  Every take on the reel is a real capture of something real.

  **Five heroes have now been built on this page and this is the promise
  that outlived all of them.** The CSS blueprint went, the storefront and
  engine went, the editorial masthead went, the drag wall went, the film
  strip went, the globes went. What Meg has been pointing at the whole
  way is work she actually shipped, shown as itself, so the test is on
  the evidence rather than on the technique.

  **It also refuses the thing the LINX prompt would have done here.**
  That spec ships four invented clients with invented results: Kettering
  Audio at +212% preorders, Brightwater Optics at 38,400 sign-ups. This
  asserts the opposite: every take names a real project from the work
  list and shows a capture that is on disk.
*/
test("every take on the reel is a real capture of something real", async ({ page }) => {
  expect(takes.length, "the reel needs takes").toBeGreaterThanOrEqual(3);

  for (const t of takes) {
    expect(t.shot, `${t.title} should show a capture from public/shots`).toMatch(/^\/shots\//);
    expect(
      existsSync(join(process.cwd(), "public", t.shot)),
      `${t.shot} is on the reel and not on disk`,
    ).toBe(true);
  }

  /*
    `lib/planets.ts` drops a take that has nowhere to go OR no capture,
    and the second half of that is quiet: the reel simply shows four
    cards instead of five and nothing says why. So this asserts the
    thing the filter would otherwise hide, which is also the thing that
    actually happened: The Keystone House was live, linked, and had no
    screenshot, so it rendered as a browser window with a URL in the
    chrome and an empty well behind it.

    Scoped to the front of the list, because that is the slice the reel
    takes. A tenth work item with no capture is not this test's business.
  */
  const reach = work.filter((w) => destination(w) !== null).slice(0, takes.length + 1);
  for (const w of reach) {
    expect(
      w.shot,
      `${w.title} can be opened but has no capture, so it is silently off the reel`,
    ).toBeTruthy();
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  /* The reel is DOM, so every take's title is in the document whatever
     the scroll position: it is the accessible copy, not a canvas. */
  const body = (await page.locator("body").textContent()) ?? "";
  for (const t of takes) {
    expect(body, `the reel should name ${t.title}`).toContain(t.title);
  }
});

/*
  The work survives a browser with no WebGL.

  The hero's particle wordmark is a canvas and falls back to a gradient;
  the reel never was one. This is what that buys: on a machine that
  cannot draw a single triangle, the headline and all five takes still
  render, because the only thing WebGL was ever doing on this page was
  decorating the top of it.
*/
test("the work still shows without WebGL", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = function () {
      return null;
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(1200);

  await expect(
    page.locator("h1"),
    "the headline should survive a browser with no WebGL",
  ).toBeVisible();

  const body = (await page.locator("body").textContent()) ?? "";
  for (const t of takes) {
    expect(body, `${t.title} should still be listed with no WebGL`).toContain(t.title);
  }

  await ctx.close();
});

/*
  Every page title is set by one component.

  **This guards the failure it was written after, which no other test here
  could see.** Measured on Nov 24 2026, the eight page titles rendered in
  three typefaces, three weights and five sizes: 74px Inter on the homepage,
  48px weight-500 Fraunces on /services, 36px weight-600 Space Grotesk on
  /catalog, 64px on /brightbase. Every page built, every test passed, no
  console error anywhere. The cause was that `StackedHeading` lived in
  `components/home/`, so five homepage sections used it and every other page
  hand-wrote its own ramp inline.

  CLAUDE.md forbids exactly this everywhere else: a derived value has one
  author and is never re-derived inline. The type scale is a derived value,
  and it had eight authors, so this asserts the property rather than the
  component. A page that goes back to a hand-rolled `h1` fails here even if
  it imports nothing and looks fine in a screenshot, which is the point:
  **the previous state of this was invisible to a build, a test and a
  Lighthouse run, and only visible by measuring.**

  The size is read rather than hardcoded, from whichever page runs first, so
  retuning the clamp in `StackedHeading` does not fail this. What may not
  drift is that they all agree.

  The homepage is deliberately absent. Its hero is the one bespoke heading
  on the site, set over video in a fixed near-white with a two-face
  composition, and `OceanHero` says so in a comment. The face is absent too:
  Fraunces or Space Grotesk per page is Meg's open brand decision, recorded
  in `StackedHeading` and on /services, and this test must not quietly
  settle it.
*/
test("every page title is the same size and weight, from one component", async ({ page }) => {
  const paths = [
    "/services",
    "/tools",
    "/catalog",
    "/marketplace",
    "/about",
    "/brightbase",
    "/turnover",
    "/demo",
    "/welcome-book",
    "/privacy",
    "/terms",
    "/work/maine-cleaning-co",
  ];

  await page.setViewportSize({ width: 1440, height: 900 });
  const seen: { path: string; size: number; weight: string }[] = [];

  for (const path of paths) {
    await page.goto(path);
    const h1 = page.locator("h1").first();
    await expect(h1, `${path} should have a visible h1`).toBeVisible();

    const got = await h1.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { size: Math.round(parseFloat(cs.fontSize)), weight: cs.fontWeight };
    });
    seen.push({ path, ...got });
  }

  /* Weight is absolute: the treatment is large-and-light, and `.display`
     (unlayered, font-weight 600) silently beating `font-normal` is the way
     this breaks without anyone writing a number down. */
  for (const s of seen) {
    expect(
      s.weight,
      `${s.path} renders its page title at weight ${s.weight}, not 400 — a hand-rolled h1, ` +
        "or the unlayered `.display` class winning over `font-normal`",
    ).toBe("400");
  }

  /* Size is relative: whatever the clamp resolves to, every page agrees. */
  const base = seen[0];
  for (const s of seen) {
    expect(
      s.size,
      `${s.path} renders its page title at ${s.size}px but ${base.path} renders ${base.size}px — ` +
        "page titles come from StackedHeading so that there is one answer",
    ).toBe(base.size);
  }
});
