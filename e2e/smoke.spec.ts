import { test, expect, type Page } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";

/* The router test asserts its counts against the same source the component
   reads, so a literal here cannot drift from the real work list. Static
   rather than a dynamic import(): Playwright transpiles these, and a
   runtime import of a .ts module is not. */
import {
  caseStudies,
  homeCards,
  homeFeature,
  ladder,
  marketItems,
  services,
  smallProjects,
  studioStats,
  work,
} from "../lib/content";
import { integrations, resolveProof } from "../lib/integrations";
import { CAST } from "../lib/ocean";

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
  /* The homepage's own shell labels its submit from `founderCta`, which is
     where that sentence has always lived; /services and /brightbase still
     render the panel shell's "Send it over". Same component, same request. */
  await page.getByRole("button", { name: /talk through your project/i }).click();

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
  await page.getByRole("button", { name: /talk through your project/i }).click();

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

    `.stage section` is every band the homepage composes, and `#top` is
    the hero's own section. **It was `.cp section` until the approved
    design landed** (#156): the homepage's wrapper class changed and the
    sweep would have found nothing, which the count assertion below is
    exactly what catches. The shared header and footer stay out of scope on
    purpose: they are not this page's, and sweeping them here would make a
    homepage test fail for a footer reason. That exclusion survives the
    descendant selector because `Footer`, `PanelHeader` and
    `CommandPalette` contain no `<section>` between them, which was
    checked rather than assumed.

    **It was `.cp > section` and the direct child broke the moment the
    page grew a wrapper.** The dive gave the homepage a fixed backdrop and
    a `relative z-10` layer over it, plus a wash around everything below
    the hero, so every band moved two levels down and the sweep found
    *zero* sections. It failed loudly, which is the one good thing here:
    the count assertion above exists for exactly this, and without it the
    sweep would have passed while checking nothing at all. A selector tied
    to depth is a list that has to be maintained wearing a different hat,
    which is the thing this test's own comment says it must not depend on.
  */
  const roots = page.locator(".stage section, #top");
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
  The homepage's work section, and the two rules that outlived the page
  it was written for.

  **This test used to be about `OneJob`**, the single project told all the
  way through, and it asserted that section's own beats: a "what got
  built" heading, a "what changed" heading, a blockquote of Meg's problem
  statement, a figcaption naming her, and four captures in a 2x2 grid.
  The approved design (#156) has no such section — one project is
  featured with its real figures and the rest are cards — so those five
  assertions are gone with the thing they guarded.

  **What is kept is what was never about the layout.**

  *One: `#work` is unique and lands on the work.* The nav, the footer,
  PanelHeader, every case study's back link and /services all target one
  id. A duplicate renders two perfect-looking sections while every link
  silently resolves to the first, and a renamed id leaves five live
  links that scroll nowhere. Neither shows up in a build or a Lighthouse
  run.

  *Two: no project is argued twice.* The complaint the previous rebuild
  answered was the same four names appearing in three blocks. The new
  page shows four of the nine once each, so the rule is asserted as
  "once, or not at all" against `work` itself rather than against a count
  written here.

  *Three, new with this design: the four it shows resolve.* Which work
  appears is an editorial choice named in `lib/content.ts`
  (`homeFeature`, `homeCards`) and matched on title. A renamed project
  would render one card fewer and nothing else would fail — the quiet
  half, which is always the dangerous one.

  And the captures have to have actually loaded, which is the assertion
  no wording test can make: this section's whole claim is "every picture
  below is a running system", and a 404 renders as a dark rectangle in a
  dark card.
*/
test("the homepage's work section is unique, resolves, and shows real captures", async ({
  page,
}) => {
  /* Data first, so a rename fails with its own name rather than with
     "expected 3 cards, found 2" on a page that rendered perfectly. */
  expect(
    work.some((w) => w.title === homeFeature),
    `homeFeature "${homeFeature}" does not match any work item`,
  ).toBe(true);
  for (const title of homeCards)
    expect(
      work.some((w) => w.title === title),
      `homeCards names "${title}", which is not in work[] — its card would ` +
        "simply not render",
    ).toBe(true);

  await page.goto("/");

  const anchors = page.locator("#work");
  expect(
    await anchors.count(),
    'exactly one element may carry id="work"',
  ).toBe(1);

  const section = anchors.first();
  await expect(
    section.getByRole("heading", { level: 2 }),
    "the anchor should land on the work",
  ).toContainText(/running system/i);

  /* The featured project carries the only confirmed outcome figures in
     the repo, read from its case study rather than typed into the page. */
  const study = caseStudies.find((c) => c.slug === "maine-cleaning-co")!;
  for (const r of study.results.slice(0, 2))
    await expect(
      section,
      `the feature should show "${r.value}", from the case study`,
    ).toContainText(r.value);
  await expect(
    section.getByRole("link", { name: /read the case study/i }),
    "and the way into the long version",
  ).toHaveCount(1);

  /*
    Every capture, scrolled to and then asked whether it loaded. Same
    budget and the same reason as the case study's: a cold
    image-optimization response on a loaded two-core runner is slow, and
    an image that never arrives still fails.
  */
  const shots = section.locator("img");
  const found = await shots.count();
  expect(found, "the work section should show four captures").toBe(4);
  for (let i = 0; i < found; i++) {
    await shots.nth(i).scrollIntoViewIfNeeded();
    await expect
      .poll(
        () => shots.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth),
        { message: `capture ${i + 1} should have loaded`, timeout: 15000 },
      )
      .toBeGreaterThan(0);
  }

  /*
    Nothing argued twice. `textContent` rather than `innerText`, because a
    title inside a clipped or visually hidden element still counts as the
    page saying it; case-insensitive, because the same project is
    legitimately spelled two ways across the repo.
  */
  const text = (
    (await section.evaluate((el) => el.textContent)) ?? ""
  ).toLowerCase();
  for (const item of work) {
    const hits = text.split(item.title.toLowerCase()).length - 1;
    expect(
      hits,
      `"${item.title}" appears ${hits} times in the work section; a project ` +
        "is argued once or not at all",
    ).toBeLessThan(2);
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
  /*
    **Asserted on /services rather than on the homepage, because the
    homepage no longer renders `PanelHeader`.** The approved design
    (#156) gives the homepage its own four-link bar over the hero video;
    the site header with its six links, including this one, is on every
    other route and is untouched. The rule — a showcase nothing links to
    is a showcase nobody opens — is unchanged, and /services is the route
    the homepage's own services rows lead to, so it is the first header a
    visitor meets after leaving the front page.
  */
  await page.goto("/services");

  const link = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Demos" });
  await expect(link, "the main nav should offer Demos").toHaveCount(1);

  await link.click();
  await expect(page).toHaveURL(/\/demo$/);
  /* And it lands on the showcase, not on one of the demos. */
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/three demos/i);
});

/*
  The homepage says what things cost, and the prices are the ones their
  own source carries.

  **This replaced the shelf test, which replaced the four-door test.** The
  shelf was the storefront page's whole-catalog price list, keyed on
  `catalog`; the approved design (#156) has no shelf, so the assertions
  about which catalog rows appeared and how the shop owned up to the rest
  went with it. What did not go is the reason any of it existed, which is
  Meg's own first instruction about this page: "hard to see what is for
  sale that's tangible". Measured at the time, the first purchasable
  price was on screen 14.6 of 20.4.

  Three things, each of which can regrow without anything failing to
  build:

  1. **Depth.** The prices arrive within the first few screens at 390px.
     A page whose price list has drifted to screen 14 renders perfectly.
  2. **One source.** Every number is `smallProjects`, which is also what
     the /services ladder renders. A price retyped into a component is
     the drift this repo keeps recording.
  3. **Honesty about the rest.** Four fixed prices are not the whole
     business, so the note under them has to say what is quoted instead
     — and the four promises beside it are `studioStats`, which are M
     Studio's own promises rather than outcomes claimed for anybody.
*/
test("the homepage shows what things cost, from the one place those prices live", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const pricing = page.locator("#pricing");
  await expect(pricing, "the homepage should carry the price list").toHaveCount(1);

  const screens = await pricing.evaluate(
    (el) => (el.getBoundingClientRect().top + window.scrollY) / window.innerHeight,
  );
  expect(
    screens,
    `the prices start ${screens.toFixed(1)} screens down; this page exists ` +
      "because they were hard to find",
  ).toBeLessThan(8);

  /* textContent, not innerText: a price inside a clipped element still
     counts as the page carrying it, and innerText drops exactly those. */
  const text = (await pricing.evaluate((el) => el.textContent)) ?? "";

  for (const p of smallProjects) {
    expect(text, `"${p.title}" should be on the homepage`).toContain(p.title);
    expect(text, `"${p.title}" should show its price`).toContain(p.price);
  }

  /* The sentence that says four prices are not everything. */
  expect(
    text.toLowerCase(),
    "the price list should say what is quoted rather than listed",
  ).toContain("quoted to your scope");

  for (const s of studioStats)
    expect(text, `the promise "${s.label}" should render`).toContain(s.value);
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

  **The list is shorter than it was, and that is a decision Meg made by
  choosing this design.** The storefront page linked everything because
  it was a shop; the approved homepage (#156) is six sections and a
  footer, and it links /tools, /marketplace, /catalog, /services,
  /about, the case studies and /privacy. It does not link /turnover,
  /welcome-book or the three demo apps.

  Those five are still in the sitemap, still in ⌘K, and still linked
  from /catalog, /marketplace and /tools, so they are not orphans in the
  sense this test was written for — but they are one hop further away
  than they were, and that is worth saying out loud rather than
  discovering later. What stays asserted is that the paths this design
  *does* promise keep working, because a footer link quietly dropped in a
  tidy-up looks like nothing at all.
*/
test("every finished thing is reachable from the homepage", async ({ page }) => {
  await page.goto("/");

  /* Paths a visitor should be able to click to, without a search box. */
  const MUST_REACH = ["/tools", "/marketplace", "/catalog", "/services", "/about"];

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

  **The rendered half of this test is gone and the data half is not.**
  `WhatConnects` was the homepage's integration wall (`#connects`), and
  the approved design (#156) has no such section, so the assertions that
  every tool name and every project name reached that page went with the
  section. The rule they served — a grid of familiar logos is the
  cheapest lie on a portfolio — lives in the data, which is where it was
  always enforced: `lib/integrations.ts` is still read by the pages that
  show it, and an entry citing a project that does not back it still
  fails here, by name.

  Verified by breaking it: an integration with an invented source fails
  naming the integration and the source.
*/
test("every integration shown is running in a named project", async () => {
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

  /* And every one of them names the project it runs in, which is the
     whole point: a tool name on its own is the wall of logos this test
     exists to refuse. */
  for (const i of integrations)
    for (const p of i.proof)
      expect(
        resolveProof(p)?.title,
        `"${i.name}" should name the project it runs in`,
      ).toBeTruthy();
});

/*
  Every picture on the homepage is a real capture of something real.

  **Six heroes have now been built on this page and this is the promise
  that outlived all of them.** The CSS blueprint went, the storefront and
  engine went, the editorial masthead went, the drag wall went, the film
  strip went, the globes went, and now the reel has gone with the
  approved design (#156). What Meg has been pointing at the whole way is
  work she actually shipped, shown as itself, so the test moved to the
  evidence rather than to whichever component was drawing it.

  **It also refuses the thing a mockup would do here.** The LINX spec
  this site keeps being compared to ships four invented clients with
  invented results — Kettering Audio at +212% preorders, Brightwater
  Optics at 38,400 sign-ups. This asserts the opposite: every capture the
  page shows belongs to a real project in `work[]`, and the file is on
  disk.
*/
test("every picture on the homepage is a real capture of something real", async ({
  page,
}) => {
  const shown = [homeFeature, ...homeCards]
    .map((title) => work.find((w) => w.title === title))
    .filter((w): w is (typeof work)[number] => Boolean(w));
  expect(shown.length, "the page should show four projects").toBe(4);

  for (const item of shown) {
    const study = item.caseStudy
      ? caseStudies.find((c) => c.slug === item.caseStudy)
      : undefined;
    const shot = study?.hero.src ?? item.shot;
    expect(shot, `${item.title} is on the homepage with no capture`).toMatch(
      /^\/shots\//,
    );
    expect(
      existsSync(join(process.cwd(), "public", shot!)),
      `${shot} is on the homepage and not on disk`,
    ).toBe(true);
  }

  /* And the page is drawing those same files, rather than a placeholder
     that happens to look like a screenshot. */
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const srcs = await page
    .locator("#work img")
    .evaluateAll((els) => els.map((e) => e.getAttribute("src") ?? ""));
  for (const item of shown) {
    const study = item.caseStudy
      ? caseStudies.find((c) => c.slug === item.caseStudy)
      : undefined;
    const shot = study?.hero.src ?? item.shot;
    expect(srcs, `${item.title}'s capture should be on the page`).toContain(shot);
  }
});

/*
  Reduced motion loses the animation, never the work.

  **A review bot found this on the head that shipped the reel, and the
  lesson is why the test survived the reel.** The old version of this
  asserted that five project *titles* were in the document under
  `reduce`, and it passed the whole time the stacked fallback was
  rendering no screenshots at all: a reduced-motion visitor read five
  descriptions with no picture of any of them, on a site whose first
  design rule is "show the work".

  The shape of the failure is what carries over. Under `reduce` this page
  removes its video, holds its drift and lands every reveal on its end
  state — and the reveals are the new way the work could disappear, since
  their hidden state is `opacity: 0` and the observer that clears it
  never fires when nothing scrolls. A text assertion cannot see a missing
  picture, so this counts captures that actually loaded.
*/
test("reduced motion keeps the work's captures, not just its words", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.waitForTimeout(800);

  const section = page.locator("#work");
  await expect(section, "the work should render under reduced motion").toBeVisible();

  /* Nothing is faded: under `reduce` every reveal is on its end state
     from the first paint, without an observer having fired. */
  const faded = await page
    .locator("#work [data-reveal]")
    .evaluateAll((els) =>
      els
        .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99)
        .map((e) => e.textContent?.trim().slice(0, 40)),
    );
  expect(faded, "a reveal left hidden under reduced motion is content lost").toEqual(
    [],
  );

  const shots = section.locator("img");
  expect(await shots.count(), "all four captures should render").toBe(4);
  for (let i = 0; i < 4; i += 1) {
    await shots.nth(i).scrollIntoViewIfNeeded();
    await expect
      .poll(
        () => shots.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth),
        { message: `capture ${i + 1} should have actually loaded`, timeout: 10000 },
      )
      .toBeGreaterThan(0);
  }

  await ctx.close();
});

/*
  The work survives a browser with no WebGL.

  Nothing on this page is a canvas any more — the approved design is
  video, images and CSS — which is exactly why this is worth keeping
  rather than deleting: it is the assertion that would fail the day
  somebody adds a shader behind the hero and the headline goes with it
  when the shader cannot compile.
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
  for (const title of [homeFeature, ...homeCards])
    expect(body, `${title} should still be listed with no WebGL`).toContain(title);

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

/*
  The ocean art never carries a claim.

  **CLAUDE.md's first rule is that nothing on this site invents proof, and
  the cast is read by every page with art on it.**

  This used to guard three fields and the riskiest was `reef`, the analogy
  line, because on /services it sat directly above a service's name, its
  pain, its outcome and, a screen below, its price — a caption in that
  position reads as part of the pitch. That field is gone: Meg asked for
  the metaphor off the site on Nov 25 2026 and nothing renders a caption
  any more.

  What is left still needs guarding, and arguably needs it more now that
  the obvious offender has been removed. `creature` and `artAlt` are the
  words shipped with Meg's pictures, and `artAlt` in particular is read
  aloud to anybody using a screen reader on four different pages. Meg's
  original Firefly still had a HUD on it reading pH 8.1 and "BIODIVERSITY
  INDEX HIGH", which is ordinary scene dressing on an ocean picture and is
  precisely what must not survive onto a page selling software.

  So `lib/ocean.ts` states the rule and this asserts it: no digit anywhere
  in the cast's own words. A number is the thing a reader would take as
  evidence, and it is also the cheapest thing for a future edit to add
  without noticing.

  Asserted on the data rather than the rendered page on purpose. Every
  surface reads `lib/ocean.ts`, so guarding the source covers /services,
  the homepage service map and anything added later, including a page that
  does not exist yet.
*/
test("the ocean art claims nothing countable", () => {
  for (const member of CAST) {
    for (const [field, text] of [
      ["creature", member.creature],
      ["artAlt", member.artAlt],
    ] as const) {
      expect(
        text,
        `cast.${member.id}.${field} contains a digit: "${text}". The cast may ` +
          "name what is in the photograph; a number beside a service reads as evidence",
      ).not.toMatch(/\d/);
    }
  }

  /*
    And every service has one.

    A member naming a service that does not exist is already a build error,
    because `CastMember.id` is the `ServiceCategory` union rather than a
    string. The gap the type cannot close is the other direction: a *fifth*
    service added to `lib/content.ts` compiles perfectly, and then
    `castFor` returns undefined for it, `Services` renders no frame, and
    /services shows four rows with a picture and one without. Nothing
    errors and the page looks almost right, which is the failure mode this
    whole file exists for. CLAUDE.md records that this list went from five
    categories to four once already, so it does move.
  */
  const withArt = new Set(CAST.map((c) => c.id));
  for (const s of services) {
    expect(
      withArt.has(s.id),
      `the service "${s.id}" has no cast member, so its row renders without the ` +
        "picture every other row has — add one to lib/ocean.ts",
    ).toBe(true);
  }
});

/*
  The art on the homepage carries no claim.

  **This replaced `the dive runs the length of the page`, and is now
  replacing `the homepage shows its art in chapters`.** Each of those
  guarded a particular way of showing Meg's pictures — a scroll-scrubbed
  backdrop, then a full-width clip with a screen of black around it — and
  each was dropped by a later decision about the page. The approved
  design (#156) shows one still: the creature, floating beside the
  approach statement.

  Deleting the test with the component would have been the easy half
  three times running. The seam rule in CLAUDE.md asks what depended on
  the removed thing, and what depends on it here is a *promise*: that the
  art on this page is art rather than evidence. A picture gains a claim
  the moment it is given a caption, a number or a link, and this is the
  one section where a well-meaning edit would reach for all three.

  It also asserts the backdrop is gone rather than merely unused. A
  component that is deleted but whose class name creeps back in is how a
  2.8MB download returns without anybody deciding to bring it back.
*/
test("the homepage's art carries no claim", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(
    page.locator(".ocean-backdrop"),
    "the scroll-scrubbed backdrop was removed; its class should not come back",
  ).toHaveCount(0);

  const art = page.locator(".stage .art");
  await expect(art, "the homepage should carry its one piece of art").toHaveCount(1);

  /* The picture has to have actually loaded. Art that 404s is a tall
     empty gap, which no other assertion here would notice. Scrolled to
     first, deliberately: it is `loading="lazy"` because it sits most of a
     page down, so asking from the top measures the laziness rather than
     the picture. */
  const img = art.locator("img");
  await expect(img).toHaveCount(1);
  await img.scrollIntoViewIfNeeded();
  await expect
    .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth), {
      message: "the art should have loaded once reached",
      timeout: 20000,
    })
    .toBeGreaterThan(0);

  /* It claims nothing: no heading, no caption, no link, no number, and
     nothing for a screen reader to read out as a statement about the
     business. */
  expect(
    await art.locator("h1, h2, h3, figcaption, a, button").count(),
    "the art is a picture, not a section with copy",
  ).toBe(0);
  expect(
    (await art.evaluate((el) => el.textContent)) ?? "",
    "a number beside the work reads as evidence",
  ).not.toMatch(/\d/);
  expect(
    await art.getAttribute("aria-hidden"),
    "it is decoration, and says so to a screen reader",
  ).toBe("true");
});

/*
  Daylight stays readable under every dark island.

  **This is the fifth time the same mistake has shipped, so it finally
  gets a test.** CLAUDE.md records #115, a chip hardcoded dark that went
  white-on-white in Harbor, and #118, illustrations drawn in white that
  vanished when the site went light. Since then: the hero's near-white
  type stranded on cream when its video moved to a Harbor-only backdrop,
  a CastFrame caption inheriting the dark island's tokens on a cream page
  at 2.21:1, and now the below-hero dive wash covering the light theme,
  which left `ReefMap`'s heading at 2.79:1 over rgb(145,145,144). Every
  one of them rendered perfectly and failed no build.

  The shape is always identical: something declares `cp-night`, which
  re-points the tokens to the dark theme so its text comes out
  near-white, and then in Daylight it has nothing dark to sit on. So the
  rule is asserted directly rather than through any one symptom — in the
  light theme, anything wearing `cp-night` must have a dark thing painted
  behind it. `.night-band` is how a full section gets one and the frames
  paint their own ground; what matters here is that *something* does.

  Asserted on the rendered page in the light theme, because that is the
  only place this is visible. A unit test on the class list would pass
  for all five of the failures above.

  **It moved from /services to the routes Daylight still reaches, and
  the move is the point rather than a tidy-up.** It was asserted on
  /services because that was where `cp-night` did its work: four
  `CastFrame`s on a page the light theme genuinely painted cream. The
  Nov 26 inner-page pass made /services one near-black world in both
  themes, like the homepage, so the check there became a test that
  cannot fail — which is exactly what the note above it said about the
  homepage one commit earlier, and exactly the quiet half this file
  keeps warning about.

  So it sweeps every route this pass did **not** convert, which is
  where `.cp`'s Daylight branch still applies and where the next
  `cp-night` island would land. Nothing wears the class on those routes
  today; the rule is asserted anyway, because the failure it guards is
  somebody moving a frame onto one of them, and because the class is
  still live on three components.

  The other half of the decision — that the converted pages really are
  near-black in Daylight rather than merely untested there — is the test
  directly below this one.
*/
const DAYLIGHT_ROUTES = [
  "/brightbase",
  "/demo",
  "/turnover",
  "/welcome-book",
  "/privacy",
  "/terms",
  "/intake",
];

for (const route of DAYLIGHT_ROUTES) {
test(`in Daylight, nothing wearing cp-night sits on a light ground (${route})`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route);
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "light";
  });
  await page.waitForTimeout(900);

  const offenders = await page.evaluate(() => {
    const luma = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    const out: { what: string; bg: string; luma: number }[] = [];
    for (const el of Array.from(document.querySelectorAll(".cp-night"))) {
      const r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 24) continue;
      /*
        A frame whose whole box is a photograph carries its own ground —
        the picture *is* the dark thing behind it — and has no text for
        the dark tokens to strand. `CastFrame` on /services is four of
        these: masked, no background colour, an `<img>` filling the box.
        Reported as offenders they are a false positive, and the first
        thing a reader would do about them is delete this test.
      */
      const media = el.querySelector("img, video");
      if (media && !(el.textContent ?? "").trim()) {
        const m = media.getBoundingClientRect();
        if (m.width >= r.width * 0.9 && m.height >= r.height * 0.9) continue;
      }
      /* Walk up for the first thing that actually paints. The element may
         carry its own ground, or sit inside a band that does. */
      let n: Element | null = el;
      let bg: string | null = null;
      while (n && n !== document.documentElement) {
        const s = getComputedStyle(n).backgroundColor;
        const m = s.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const v = m[1].split(",").map(Number);
          const a = v[3] === undefined ? 1 : v[3];
          if (a >= 0.6) {
            bg = s;
            break;
          }
        }
        n = n.parentElement;
      }
      const v = bg ? bg.match(/\d+/g)!.slice(0, 3).map(Number) : [247, 244, 239];
      const L = luma(v);
      if (L > 90) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? "#" + el.id : "";
        out.push({ what: tag + id, bg: bg ?? "(nothing painted: the cream page)", luma: Math.round(L) });
      }
    }
    return out;
  });

  expect(
    offenders,
    `${route}: these force dark-theme tokens, so their text is near-white, and in ` +
      "Daylight they have nothing dark behind them: " +
      offenders.map((o) => `${o.what} on ${o.bg} (luma ${o.luma})`).join("; ") +
      " — give the section `night-band`, or its own dark ground",
  ).toEqual([]);
});
}

/*
  The converted pages are one near-black world, in both themes.

  **This is the decision the inner-page pass actually made, asserted
  rather than left to a screenshot.** The approved homepage has no light
  branch at all, by Meg's sign-off. If /services were still cream in
  Daylight, a visitor who picked Daylight in ⌘K would get a near-black
  homepage and a cream services page, which is "a different website one
  click later" again, moved from the typeface onto the theme. So the six
  routes the homepage leads to carry `.cp-inner`, and
  `:root[data-theme="light"] .cp:not(.cp-inner)` steps aside for them.

  Asserted as *the two themes render the same ground and the same ink*,
  which is the property, rather than against a hex this test would then
  own a second copy of. It fails if the class comes off a wrapper, if a
  light branch is written for it, or if the `:not()` is dropped — three
  changes that each look completely fine in the file they are made in.

  The near-black assertion on top of the equality is what stops the pair
  passing by both being wrong.
*/
test("the converted pages are the same near-black world in both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const ground = async (path: string, theme: "dark" | "light") => {
    await page.goto(path);
    await page.evaluate((t) => {
      if (t === "light") document.documentElement.dataset.theme = "light";
      else delete document.documentElement.dataset.theme;
    }, theme);
    await page.waitForTimeout(400);
    return page.evaluate(() => {
      /*
        **`.cp` rather than `.cp-inner`**, which is the difference
        between a test and a test that cannot fail. Asked for
        `.cp-inner` it found nothing when the class was taken off the
        wrapper and fell through to the `.stage` the header is mounted
        in, which is near-black in both themes by definition — so
        removing the thing this guards made it pass. Document order
        makes the page's own wrapper the first match either way.
      */
      const el = document.querySelector(".cp, .stage") as HTMLElement;
      const cs = getComputedStyle(el);
      const luma = (c: string) => {
        const v = (c.match(/\d+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
      };
      return {
        bg: cs.backgroundColor,
        ink: cs.color,
        bgLuma: Math.round(luma(cs.backgroundColor)),
        inkLuma: Math.round(luma(cs.color)),
      };
    });
  };

  for (const path of [
    "/",
    "/services",
    "/tools",
    "/marketplace",
    "/about",
    "/catalog",
    "/work/maine-cleaning-co",
  ]) {
    const harbor = await ground(path, "dark");
    const daylight = await ground(path, "light");

    expect(
      daylight,
      `${path} renders differently in Daylight (${daylight.bg} on ${daylight.ink}) than in ` +
        `Harbor (${harbor.bg} on ${harbor.ink}) — it should be one near-black world in both, ` +
        "like the homepage it is reached from",
    ).toEqual(harbor);

    expect(
      harbor.bgLuma,
      `${path} should be near-black and its ground measures luma ${harbor.bgLuma}`,
    ).toBeLessThan(30);
    expect(
      harbor.inkLuma,
      `${path} should carry light ink on that ground and measures luma ${harbor.inkLuma}`,
    ).toBeGreaterThan(170);
  }
});

/*
  The header, which is the one thing on every page.

  Two things are asserted and both are failures Meg named out loud.

  **One: a phone can reach the site from it.** Below 860 the approved
  design drops the links, so before the menu existed a visitor at 390
  had a wordmark, a search affordance and one button — /services and
  /tools were not reachable from the header at all, on the width most of
  her buyers use. The links were in the stylesheet and unreachable on
  screen, which is a failure no build, no type check and no Lighthouse
  run says a word about, and which a test that merely counted anchors
  would have passed. So it is asserted by opening the menu and
  *following* a link, the same way the demos test is.

  **Two: it says where you are.** Her words were "I really want a better
  header saying title whatever". The bar carries the page's name beside
  the wordmark on every inner page, and on the homepage — which has no
  title above its hero — it names the band being read instead. Asserted
  on the rendered bar rather than on the prop, because the prop being
  passed and the name being visible are different claims.
*/
test("on a phone, the header reaches the rest of the site", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.getByRole("navigation", { name: "Main" }),
    "the bar's own links are off at this width, which is the design",
  ).toBeHidden();

  await page.locator("button.menubtn").click();
  const menu = page.getByRole("navigation", { name: "Site" });
  await expect(menu, "the menu button should open a menu").toBeVisible();

  /* Every link in it has to go somewhere, and one of them is followed. */
  for (const a of await menu.getByRole("link").all())
    expect(await a.getAttribute("href"), "a menu link with no href").toBeTruthy();

  await menu.getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(
    page.getByRole("navigation", { name: "Site" }),
    "arriving somewhere should close the menu behind you",
  ).toHaveCount(0);
});

test("the header says which page you are on", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const [path, name] of [
    ["/services", "Services"],
    ["/tools", "Free tools"],
    ["/marketplace", "Marketplace"],
    ["/about", "About"],
    ["/catalog", "Catalog"],
    ["/work/maine-cleaning-co", "Case study"],
  ]) {
    await page.goto(path);
    await expect(
      page.locator("header .here"),
      `${path} should name itself in the header`,
    ).toContainText(name);
  }

  /* The homepage has no title above the hero, so the slot is the band
     being read. Empty at the top, and the slot is deliberately empty
     rather than filled with a word like "Home" that says nothing. */
  await page.goto("/");
  await page.waitForTimeout(400);
  await expect(page.locator("header .here")).toHaveCount(0);

  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect(
    page.locator("header .here"),
    "scrolled into the work band, the homepage header should name it",
  ).toContainText("Work");
});

/*
  The hero loop, which no other test on this page can see.

  Meg asked for the site to move the way likeakinginc.com does, and the
  answer measured on their page is one looping hero video rather than a
  pile of clips. This asserts the thing she actually asked for: that it
  **plays**. Every other assertion here would pass on a hero that quietly
  froze on its poster — the markup, the copy, the buttons and the
  contrast are all identical whether the video is decoding or dead.

  Advancing `currentTime` is the only honest proof, and reading it twice
  is not enough on its own: the clip loops, so a late sample can
  legitimately be *smaller* than an early one. Comparing them naively
  reported "not advancing" on a video that was playing perfectly. The
  check is therefore that the time **moved at all**.

  The selector moved with the approved design (#156): the hero clip is
  `shot-one` inside the band's own `[data-vid]` wrapper, and the still
  underneath is that wrapper's background rather than an `<img>`.
*/
test("the hero actually plays, and stops for anyone who asks it to", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const video = page.locator(".stage .hero [data-vid] video");
  await expect(video, "the hero should carry a looping video").toHaveCount(1);

  /* autoplay needs all four of these, and iOS needs playsInline or it
     refuses to start at all and shows a play button over the art. */
  await expect(video).toHaveJSProperty("loop", true);
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("autoplay", true);
  await expect(video).toHaveJSProperty("playsInline", true);

  await expect
    .poll(
      () => video.evaluate((v: HTMLVideoElement) => v.readyState),
      { message: "the hero video should load enough data to play", timeout: 20000 },
    )
    .toBeGreaterThanOrEqual(3);

  const first = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await expect
    .poll(
      () => video.evaluate((v: HTMLVideoElement) => v.currentTime),
      { message: "the hero video should be decoding, not frozen", timeout: 10000 },
    )
    .not.toBe(first);

  await expect(video).toHaveJSProperty("paused", false);

  /* The still is the clip's own first frame, carried on the wrapper as
     well as on the element's poster, so the hero reads the same when the
     video cannot play at all. */
  const poster = await page
    .locator(".stage .hero [data-vid]")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(poster, "a still should sit under the video").toContain(
    "shot-one-poster",
  );
});

test("a visitor who asked for no motion gets the frame, not the loop", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.waitForTimeout(800);

  /* Both clips, not just the hero: the start band carries one too, and
     `display: none` plus a paused element is what stops the decode the
     visitor asked to avoid. */
  const clips = page.locator(".stage [data-vid] video");
  expect(await clips.count(), "the page should carry two clips").toBe(2);
  for (let i = 0; i < 2; i += 1) {
    await expect(
      clips.nth(i),
      "a clip should be removed from view under prefers-reduced-motion",
    ).toBeHidden();
    await expect(clips.nth(i)).toHaveJSProperty("paused", true);
  }

  /* And the frame is still there, so the hero is a picture rather than a
     hole. */
  const poster = await page
    .locator(".stage .hero [data-vid]")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(poster, "the still should carry the hero instead").toContain(
    "shot-one-poster",
  );

  await ctx.close();
});

/*
  Two ways the reveals could have hidden the page for good, both found by
  a review bot on #155 and both real.

  The hidden state is keyed on an attribute only JavaScript sets, which
  makes "what if that never happens" the whole question. `data-js`
  covered a visitor with scripting off. It did not cover printing, where
  nothing scrolls and no observer fires, and it did not cover the worse
  case: the inline script runs, the attribute is set, and the React chunk
  never arrives — so nothing can ever mark a section revealed and the
  page is permanently blank below the fold with its HTML right there.
*/
test("printing before scrolling does not print blank sections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  /* Deliberately no scroll: this is the visitor who lands and hits print. */
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);

  const faded = await page.locator("[data-reveal]").evaluateAll((els) =>
    els
      .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99)
      .map((e) => e.textContent?.trim().slice(0, 40)),
  );
  expect(
    faded,
    "every section must be solid on paper — printing does not scroll, so " +
      "anything still waiting on an observer prints as empty space",
  ).toEqual([]);
});

test("the page fails open if the app never hydrates", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  /* The exact shape of the failure: the document and its inline script
     load, and the client chunks do not. JavaScript is *enabled*, so the
     no-script path does not apply. */
  await page.route("**/_next/static/chunks/**", (r) => r.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });

  /* The watchdog fires at 4s. */
  await page.waitForTimeout(6000);

  const faded = await page.locator("[data-reveal]").evaluateAll((els) =>
    els
      .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99)
      .map((e) => e.textContent?.trim().slice(0, 40)),
  );
  expect(
    faded,
    "with the app's own scripts blocked, the hidden state must expire and " +
      "leave the page readable rather than a column of blanks",
  ).toEqual([]);

  await ctx.close();
});

/*
  Turning reduced motion on **while the page is open** stops the motion.

  **This guarded `Drift`, which the approved design (#156) does not carry,
  and the bug it was written for is a shape rather than a component.**
  That controller read `matchMedia(...).matches` once at mount, so a
  visitor who switched the preference mid-visit kept the animation
  running; `MovingChapter` had the mirror-image fault, able to stop and
  never start again. The preference is a request a person can change, not
  a setting read at a moment in time, and `StageMotion` is now the one
  controller that answers it for this whole page.

  So it is re-pointed at the biggest thing on the page rather than
  deleted: the hero loop, which is also the most expensive thing to leave
  decoding for somebody who asked for no motion.
*/
test("turning reduced motion on mid-visit stops the hero", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hero = page.locator(".stage .hero [data-vid] video");
  await expect
    .poll(() => hero.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 10_000,
      message: "the hero never started, so this cannot test it stopping",
    })
    .toBe(false);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => hero.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 5_000,
      message:
        "the hero is still decoding after the visitor asked for no motion, " +
        "which is the cost they asked to avoid",
    })
    .toBe(true);

  /* And back, because a preference changed in either direction is still a
     request: a controller that can only stop is half a controller. */
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() => hero.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 5_000,
      message: "turning motion back on left the hero stopped for good",
    })
    .toBe(false);
});

/*
  The second clip costs nothing until somebody reaches it.

  **This guarded the moving chapters, which the approved design (#156)
  does not carry; what it was really guarding is the start band's clip.**
  Both halves still need asserting and the second is the one a casual
  check would miss. The moorings clip is 1MB, which is fine as something
  a visitor descends into and indefensible as something every visitor
  downloads to look at the hero. `preload="none"` plus an observer is
  what makes that true, and nothing else on the page would notice if it
  stopped being true.

  Playback itself is deliberately NOT asserted for this one. It ships as
  H.264 only — there is no WebM of it in the repo — and the browser this
  suite drives is a Chromium build without that decoder, which is why
  every other clip here carries a WebM first. A test demanding it play
  would fail on the test runner and pass nowhere a visitor can see, so
  what is asserted is the thing that is true everywhere: it is not
  fetched early, it is fetched when reached, and it has a real first
  frame to stand in if the decode never happens.
*/
test("the start band's clip costs nothing before it is reached", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  const videoRequests: string[] = [];
  page.on("request", (r) => {
    if (/\/ocean\/.*\.(mp4|webm)/.test(r.url()))
      videoRequests.push(r.url().split("/").pop()!);
  });

  await page.goto("/");
  await page.waitForTimeout(2000);

  const clip = page.locator("#contact [data-vid] video");
  await expect(clip, "the start band should carry its clip").toHaveCount(1);

  /* Nothing but the hero may be on the wire from the top of the page. */
  expect(
    videoRequests.filter((u) => !u.startsWith("shot-one")),
    "a visitor who has not scrolled must not pay for the start band's clip",
  ).toEqual([]);

  /* Every clip carries a poster, which is the whole fallback when
     autoplay is refused, the codec is missing, or the file never
     arrives. */
  const posterless = await page
    .locator(".stage [data-vid] video")
    .evaluateAll((els) => els.filter((v) => !(v as HTMLVideoElement).poster).length);
  expect(posterless, "every clip needs its own first frame as a poster").toBe(0);

  /* Now reach it, and it should be fetched. */
  await clip.scrollIntoViewIfNeeded();
  await expect
    .poll(() => videoRequests.filter((u) => u.startsWith("moorings")).length, {
      message: "the clip should be fetched once it is reached",
      timeout: 15000,
    })
    .toBeGreaterThan(0);
});

/*
  The one place the homepage says what is for sale.

  **It was the reef map, which had no test and was broken in both the
  ways a navigation can be**: on desktop its four pins read "01 THE LIGHT
  ABOVE" and "03 THE REEF ITSELF", with the service name only in
  `sr-only` text behind a click, and on a phone the labels were
  `lg:block`, so there were no words at all. Meg's word for the page was
  "scrambled". The approved design (#156) answers it with four rows that
  simply say the four things, and the rule survives the change of
  component: a section that renders perfectly while naming none of the
  things it sells is exactly the failure a wording test catches and a
  screenshot does not.

  Asserted on `services[]` rather than on a list of strings, so a fifth
  service fails this until the page carries it — and at 390px, because
  phone width is where the previous version was actually broken, and
  because a row that collapses badly there is the likeliest way this
  breaks next.
*/
test("the homepage names all four services, and a phone can reach each one", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const band = page.locator("#services");
  await band.scrollIntoViewIfNeeded();

  for (const service of services) {
    const row = band.locator(`a[href="/services#${service.id}"]`);
    await expect(
      row,
      `no way to reach "${service.title}" from the homepage at phone width`,
    ).toHaveCount(1);
    await expect(
      row,
      `the row for "${service.id}" should name the service and say what it is`,
    ).toContainText(service.title);
    await expect(row).toContainText(service.tagline);
    /* The chips are the detail that makes a category concrete — the three
       services that were merged into "Getting your tools to talk" live in
       them, so dropping them would quietly un-sell two of them. */
    for (const kind of service.kinds) await expect(row).toContainText(kind);
  }

  /*
    And no creature names where a service name belongs. The metaphor was
    removed from the copy on Nov 25 2026 and the cast it came from is
    still in `lib/ocean.ts`, still captioning the art on /services — so
    the cheapest possible regression is somebody wiring `creature` back
    into this band, which would read perfectly and sell nothing.
  */
  const words = (await band.innerText()).toLowerCase();
  for (const member of CAST) {
    expect(
      words,
      `the services band is showing "${member.creature}". The art may carry ` +
        "a creature; the four rows name the service",
    ).not.toContain(member.creature.toLowerCase());
  }
});

/*
  Coming back to the tab starts the loop again.

  **A review bot found this on `MovingChapter` and it was real.**
  `visibilitychange` paused the clip and nothing resumed it: the only
  `play()` was inside the IntersectionObserver callback, and returning to
  a tab does not change what a clip intersects. So a visitor who switched
  away with it on screen came back to a looping video that had stopped
  looping, on screen, for the rest of the visit.

  The chapter is gone with the approved design (#156) and the shape is
  not: `StageMotion` reconciles the same three inputs for this page's
  two clips, so this is re-pointed at the hero. Worth keeping rather than
  deleting, because every other check here asserts the *stopping* — that
  the clip costs nothing before it is reached, that reduced motion stops
  it, that scrolling past it stops it. Not one of them asks whether it
  ever comes back, which is how a motion controller ends up able to stop
  and not start.
*/
test("a loop paused by a tab switch plays again on the way back", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const clip = page.locator(".stage .hero [data-vid] video");
  await expect
    .poll(() => clip.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 10_000,
      message: "the hero never started, so this cannot test it resuming",
    })
    .toBe(false);

  /* Playwright cannot background a tab, so the page is told it is hidden
     the way the browser would tell it. The component reads
     `document.hidden` and listens for the event, which is exactly what
     this drives. */
  const setHidden = (hidden: boolean) =>
    page.evaluate((h) => {
      Object.defineProperty(document, "hidden", { value: h, configurable: true });
      Object.defineProperty(document, "visibilityState", {
        value: h ? "hidden" : "visible",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    }, hidden);

  await setHidden(true);
  await expect
    .poll(() => clip.evaluate((v: HTMLVideoElement) => v.paused), { timeout: 5_000 })
    .toBe(true);

  await setHidden(false);
  await expect
    .poll(() => clip.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 5_000,
      message:
        "the hero is still paused after the visitor came back to the tab, " +
        "while sitting on screen claiming to be a looping video",
    })
    .toBe(false);
});

/*
  The hero stops once you have scrolled past it.

  **The page's own rule, broken by the biggest thing on the page.**
  CLAUDE.md: anything that loops stops when it cannot be seen. `Drift`
  pauses on a hidden tab and `MovingChapter` gates on intersection, and
  the hero — a full-bleed video, the most expensive motion here — was
  plain markup with no controller at all. On a 15-screen page that is a
  video decoding through roughly fourteen screens nobody is looking at,
  left to whatever throttling the browser decides to apply.

  A review bot found it. What makes it worth a test rather than only a
  fix is that the rule is written down and nothing anywhere asserted it:
  the two other hero tests ask whether it plays and whether reduced
  motion stops it, which are both about the top of the page.
*/
test("the hero loop stops once it is scrolled past, and runs again on the way back", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hero = page.locator(".stage .hero [data-vid] video");
  await expect
    .poll(() => hero.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 10_000,
      message: "the hero never started, so this cannot test it stopping",
    })
    .toBe(false);

  /* Well past the hero: the price list is most of the way down the page,
     so nothing of the hero is on screen here. */
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await expect
    .poll(() => hero.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 5_000,
      message:
        "the hero video is still playing with none of it on screen, which is " +
        "the one thing CLAUDE.md says looping motion may not do",
    })
    .toBe(true);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect
    .poll(() => hero.evaluate((v: HTMLVideoElement) => v.paused), {
      timeout: 5_000,
      message: "the hero did not start again when it came back on screen",
    })
    .toBe(false);
});

/*
  The confirmation is on screen, not merely in the DOM.

  **This shipped broken and every check passed.** The homepage's reveal
  gate was on the two elements the contact section swaps between rather
  than on a wrapper around them, and `StageMotion` observes only what
  exists when its effect runs. So a successful submit mounted a fresh
  `data-reveal` element nobody was watching, it never got
  `data-revealed`, and it sat at `opacity: 0` with "Got it." inside it.
  The visitor filled in the form, pressed send, and watched the form
  vanish with nothing in its place, on the one interaction the page is
  built around.

  **The suite had a test for this and it passed**, because
  `toBeVisible()` does not consider opacity: an element faded to zero is
  "visible" to Playwright. That is CLAUDE.md's rule restated by a bug —
  prefer a test that asks whether the screen changed over one that asks
  whether the code ran — so this one reads the computed opacity and will
  not be fooled by the same thing twice.

  The API is stubbed rather than really posted: what is under test is
  whether the success state can be seen, not the endpoint, which has its
  own tests above.
*/
test("the contact confirmation is actually visible, not just mounted", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route("**/api/contact", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );
  await page.goto("/");

  const section = page.locator("#contact");
  await section.scrollIntoViewIfNeeded();
  await section.locator('input[name="name"]').fill("Test Person");
  await section.locator('input[name="email"]').fill("test@example.com");
  await section.locator("textarea").first().fill("Checking the confirmation.");
  await section.locator('button[type="submit"]').first().click();

  const sent = section.locator(".sent");
  await sent.waitFor({ state: "attached", timeout: 15_000 });

  /* Past the 600ms transition and its 100ms delay with room to spare. */
  await expect
    .poll(
      () => sent.evaluate((el) => Number(getComputedStyle(el).opacity)),
      {
        timeout: 5_000,
        message:
          "the submit confirmation is in the DOM at zero opacity: the visitor " +
          "sent the form and saw it disappear with nothing in its place",
      },
    )
    .toBeGreaterThan(0.95);

  await expect(sent).toContainText("Got it.");
});
