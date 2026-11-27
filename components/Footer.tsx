import Logo from "./Logo";
import Link from "next/link";
import FooterWordmark from "./FooterWordmark";
import WhenNear from "./WhenNear";
import CopyLink from "./CopyLink";
import SelfScore from "./SelfScore";
import MoonPhase from "./MoonPhase";
import MaineReadout from "./MaineReadout";

export default function Footer() {
  const year = new Date().getFullYear();
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  const ref = process.env.VERCEL_GIT_COMMIT_REF || "main";
  const built = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <footer className="relative overflow-hidden border-t border-line py-16 md:py-20">
      {/* Giant M STUDIO the swell reveals through — fills the dead middle */}
      {/* 2D canvas glow clipped to the letterforms. Same reasoning as the
          aurora: it is the last thing on the page, so it has no business
          running during the first paint. */}
      <WhenNear>
        <FooterWordmark />
      </WhenNear>
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Websites, CRMs, platform setup, data migrations, and integrations.
              Help with the systems behind your business, from one improvement
              to a custom build. Based in Maine, working with clients anywhere.
            </p>
            <p className="mt-4 text-xs text-faint">
              Custom software and web design &middot; Southern Maine &middot; clients anywhere
            </p>
            <SelfScore />
            {/* Was a sentence asserting the site runs on live Maine data,
                which asserted it without showing it. Now that the hero no
                longer carries the readout panel, this is the signature: the
                real feed, on one line, rendering nothing when it is down. */}
            <MaineReadout className="mt-4 text-faint" />
          </div>

          <div className="flex gap-10 sm:gap-16">
            <div>
              <p className="text-sm font-semibold text-ink">Studio</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link href="/services" className="text-muted transition-colors hover:text-ink">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/catalog" className="text-muted transition-colors hover:text-ink">
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="text-muted transition-colors hover:text-ink">
                    Free tools
                  </Link>
                </li>
                <li>
                  <Link href="/about#approach" className="text-muted transition-colors hover:text-ink">
                    Approach
                  </Link>
                </li>
                <li>
                  <Link href="/#work" className="text-muted transition-colors hover:text-ink">
                    Work
                  </Link>
                </li>
                <li>
                  <Link href="/intake" className="text-muted transition-colors hover:text-ink">
                    Project questionnaire
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink">Connect</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <CopyLink href="mailto:contact@mlinx.studio" value="contact@mlinx.studio" label="email" />
                </li>
                <li>
                  <CopyLink href="tel:+12074329492" value="(207) 432-9492" label="phone number" />
                </li>
                <li>
                  <Link href="/#contact" className="text-signal transition-opacity hover:opacity-80">
                    Start a conversation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} M Studio</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
          </div>
          {/* The deploy stamp used to print `deployed <date> · main@<sha>` on
              every public page. A git ref and a commit hash are internal
              plumbing; nobody deciding whether to hire a developer needs
              them, and they date the site the moment a deploy goes quiet.
              Kept in the DOM as a comment for debugging a live deploy. */}
          <span
            className="text-faint"
            title={sha ? `${ref}@${sha}` : undefined}
          >
            Built {built}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MoonPhase size={12} className="align-[-2px]" />
            <span>Made in Portland, ME · installable app</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

