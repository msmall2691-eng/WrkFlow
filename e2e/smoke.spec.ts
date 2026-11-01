import { test, expect } from "@playwright/test";

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
  { path: "/intake", name: "intake" },
  // Added with the case studies: a dynamic route is the easiest thing here
  // to break without noticing, since nothing links to it at build time.
  { path: "/work/maine-cleaning-co", name: "case study" },
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
  Touch target size on the hero reel controls.

  These shipped at 6x6 CSS px — a fine-looking dot and a target a quarter
  the 24px minimum (WCAG 2.5.8). It cost the live homepage its accessibility
  score, and nobody saw it, because a too-small button looks exactly like a
  correctly-sized one: the dot is the same either way. The only signal was
  a Lighthouse run after it was already merged.

  So the assertion is on the rendered box, not the markup. Restyling the
  dot is fine; shrinking what a thumb has to hit is not.
*/
test("the reel controls are big enough to hit", async ({ page }) => {
  await page.goto("/");
  const dots = page.locator('[aria-label^="Show "]');
  const n = await dots.count();
  expect(n, "the hero reel should render its controls").toBeGreaterThan(1);

  const tooSmall: string[] = [];
  for (let i = 0; i < n; i++) {
    const box = await dots.nth(i).boundingBox();
    const label = await dots.nth(i).getAttribute("aria-label");
    if (!box || box.width < 24 || box.height < 24)
      tooSmall.push(`${label}: ${Math.round(box?.width ?? 0)}x${Math.round(box?.height ?? 0)}`);
  }
  expect(tooSmall, "every reel control should be at least 24x24").toEqual([]);
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
