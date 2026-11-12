/*
  Does Chromium actually launch?

  `.github/workflows/ci.yml` installs Chromium without `--with-deps`, so the
  install no longer shells out to `apt-get` and no longer depends on Ubuntu's
  package mirrors resolving from a GitHub runner. What that accepts is a
  future runner image which drops a shared library Chromium needs, and this
  script is what keeps that cost legible: a second or two to turn "32 tests
  failed" into one sentence naming the cause and the remedy.

  It launches the browser the way playwright.config.ts does — the bundled
  build, no channel and no executablePath — so a pass here means the suite's
  own launch will work, rather than merely that a binary landed on disk.

  **It reads the error rather than assuming one cause, and the first draft of
  this did assume.** A launch can fail because the image dropped a library,
  but also because the install step never ran, or because the pinned
  Playwright wants a browser build that is not on the machine. Those want
  opposite remedies, and the first version of this script answered every one
  of them with "put --with-deps back" — a confident wrong diagnosis, which is
  worse than no diagnosis because somebody acts on it. The very first run
  here hit the install case and was told to go and edit apt flags.

  Run it directly to check a local machine too:
  `node scripts/chromium-launch-check.mjs`.
*/
import { chromium } from "@playwright/test";

/* Both patterns are matched against the error text Playwright surfaces. */
const MISSING_LIBRARY =
  /while loading shared libraries|cannot open shared object file|host system is missing dependencies|\blib[\w.+-]*\.so\b/i;
const MISSING_BROWSER = /executable doesn't exist|download new browsers|playwright install/i;

function remedyFor(message) {
  /*
    Order matters. Playwright's "missing dependencies" help text also tells
    you to run `playwright install`, so the library case has to be tested
    first or every missing library reads as a missing download.
  */
  if (MISSING_LIBRARY.test(message))
    return (
      "This runner image appears to have stopped shipping a shared library\n" +
      "Chromium needs. The Install Chromium step in .github/workflows/ci.yml\n" +
      "deliberately omits --with-deps; put it back on that step for as long\n" +
      "as the image needs it."
    );

  if (MISSING_BROWSER.test(message))
    return (
      "The browser itself is not on this machine, which is a different\n" +
      "problem from a missing library: nothing here needs --with-deps. Run\n" +
      "`npx playwright install chromium`. If that was already run, the\n" +
      "@playwright/test version in package-lock.json wants a browser build\n" +
      "that is not present, so run it again after installing dependencies."
    );

  return (
    "This is neither of the two failures this check was written for, so it\n" +
    "has no remedy to offer beyond the error above. Do not assume it is a\n" +
    "missing library: --with-deps is unlikely to be the answer."
  );
}

try {
  const browser = await chromium.launch();
  await browser.close();
} catch (error) {
  const message = String(error?.message ?? error);
  console.error(`Chromium will not launch:\n\n${message}\n\n${remedyFor(message)}`);
  process.exit(1);
}

console.log("Chromium launches.");
