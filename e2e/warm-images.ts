import type { FullConfig } from "@playwright/test";

/*
  Warm every optimized image before the browser suite touches a page.

  **This exists because of an upstream Next.js bug, and it is worth writing
  the mechanism down, because three confident guesses about this failure
  were already wrong and recorded as wrong in `playwright.config.ts`.**

  `/_next/image` under a self-hosted `next start` builds its internal
  response on the *requesting client's socket*. If that client goes away
  while a COLD transform is still running, the stream is torn down without
  the mocked response ever ending, so the coalesced generator for that
  cache key never settles. From then on every later request for that exact
  URL waits on a promise that will never resolve, for the life of the
  server process. Upstream: vercel/next.js#96538 (and its duplicates
  #97489, #98402), fixed by #98168 on 2026-09-10. The backport to 15.5.x
  was still open and still reproducing when this was written, and we are
  on 15.5.19, so we have it.

  Reproduced locally in three commands, which is how this stopped being a
  guess:

      abort a cold /_next/image?...maineclean.png&w=640   -> aborted
      request that same URL again                         -> hung, no response
      request w=1200 of the same image (control)          -> 200 in 283ms

  That one fact explains every observation the old note called
  unexplained:

  * It is a hang rather than slowness, so raising the test timeout to 90s
    changed nothing except how long each failure cost. That was tried and
    reverted.
  * The same four URLs fail in all four failing tests of a run, because a
    poisoned key stays poisoned until the server restarts. The first test
    to touch the page poisons them; the rest inherit it.
  * It is roughly half of runs, because it needs an abort to land inside a
    cold transform.
  * **Only PNG pages ever failed.** A PNG transform takes longer than a
    WebP one, so its abort window is wider. That was recorded as "a
    correlation, not a cause"; it is the cause, one step removed.
  * `w=1200` of the very same file was always fine while `w=640` hung,
    because poisoning is per cache key, not per image.

  The trigger on the case-study page is `BuildScroller`, which renders
  each step screenshot twice: once in the pinned desktop column and once
  per step, the second `display:none` at md+. Both resolve to the same
  `w=640` URL, so one element's request can be cancelled while the other
  still wants it.

  **A warm key is immune, and that is what this relies on.** Measured:
  after warming, four aborts in a row against the same URL left it
  answering in 7-9ms. Once the bytes are in `.next/cache/images` there is
  no transform to abandon. So the fix is not to stop things being
  aborted, which a browser does whenever it closes a page; it is to make
  sure nothing is ever cold when they are.

  This is a workaround for somebody else's bug and should be deleted when
  Next ships the fix. It is deliberately NOT a change to the app: no test
  is skipped, no timeout is raised, and every page still renders exactly
  what it rendered before.

  It drives `curl`-shaped plain fetches rather than a browser on purpose.
  A browser is the one client that cancels requests on its own, which is
  the very thing that causes the bug, so warming with one could poison the
  cache it was sent to fill.
*/

/** Pull every /_next/image URL out of a page's HTML, from src and srcset. */
function imageUrls(html: string): string[] {
  const found = html.match(/\/_next\/image\?[^"'\s]+/g) ?? [];
  // srcset attributes arrive HTML-escaped.
  return found.map((u) => u.replace(/&amp;/g, "&"));
}

export default async function warmImages(config: FullConfig) {
  const base =
    config.projects[0]?.use?.baseURL ??
    `http://127.0.0.1:${process.env.PORT ?? 3100}`;

  const started = Date.now();

  const sitemap = await fetch(`${base}/sitemap.xml`);
  if (!sitemap.ok) throw new Error(`warm-images: sitemap ${sitemap.status}`);
  const xml = await sitemap.text();

  /* The sitemap carries absolute production URLs; only the path is ours. */
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    try {
      return new URL(m[1]).pathname;
    } catch {
      return m[1];
    }
  });

  if (paths.length === 0) throw new Error("warm-images: sitemap listed no pages");

  const urls = new Set<string>();
  for (const path of paths) {
    const res = await fetch(`${base}${path}`);
    if (!res.ok) continue;
    for (const u of imageUrls(await res.text())) urls.add(u);
  }

  /*
    Loud rather than quiet if this stops finding anything. A warm step that
    silently warms nothing is worse than no warm step, because the flake it
    was added for comes back looking like a new problem.
  */
  if (urls.size === 0) {
    throw new Error(
      "warm-images: found no /_next/image URLs. If images stopped being " +
        "optimized this can be deleted; if the markup changed, fix the match.",
    );
  }

  /*
    Every body is read to completion and nothing is ever cancelled, which
    is the only property that matters here: an abandoned request is what
    poisons a key, and these requests are never abandoned.

    A few at a time rather than one at a time, because overlapping is
    measurably safe and the difference is 33s against 10s on every run.
    That was checked rather than assumed: eight concurrent cold transforms
    of these same files all returned 200, and the single-key repro needs
    an *abort*, not contention. Kept small anyway, since the server it is
    warming is the one the suite is about to use.
  */
  const POOL = 4;
  const queue = [...urls];
  let warmed = 0;
  const failed: string[] = [];

  const worker = async () => {
    for (;;) {
      const u = queue.pop();
      if (!u) return;
      try {
        const res = await fetch(`${base}${u}`);
        await res.arrayBuffer();
        if (res.ok) warmed += 1;
        else failed.push(`${res.status} ${u}`);
      } catch (e) {
        failed.push(`${(e as Error).message} ${u}`);
      }
    }
  };
  await Promise.all(Array.from({ length: POOL }, worker));

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `warm-images: ${warmed}/${urls.size} optimized images warmed across ` +
      `${paths.length} pages in ${secs}s`,
  );
  if (failed.length > 0) {
    console.log(`warm-images: ${failed.length} did not warm:`);
    for (const f of failed.slice(0, 10)) console.log(`  ${f}`);
  }
}
