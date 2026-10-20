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
