import Logo from "./Logo";
import FooterWordmark from "./FooterWordmark";
import CopyLink from "./CopyLink";
import LinxMark from "./LinxMark";
import SelfScore from "./SelfScore";
import MoonPhase from "./MoonPhase";

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
      <FooterWordmark />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Whatever you dream up, we&apos;ll build it — custom websites, tools,
              automations, and the systems that connect everything you already
              use. Less busywork, more yours. Working with clients anywhere.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-faint">
              Custom software &amp; web design &middot; Southern Maine / New England &middot; clients anywhere
            </p>
            <SelfScore />
            <p className="mt-4 flex items-center gap-2 text-[11px] leading-relaxed text-faint">
              <MoonPhase size={14} className="inline-block shrink-0 align-[-2px]" />
              <span>This site runs on live Maine data — daylight, weather &amp; tide.</span>
            </p>
          </div>

          <div className="flex gap-10 sm:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
                Studio
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="/#services" className="text-muted transition-colors hover:text-ink">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/marketplace" className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink">
                    <LinxMark className="h-2.5 w-auto" />
                    M Linx marketplace
                  </a>
                </li>
                <li>
                  <a href="/#approach" className="text-muted transition-colors hover:text-ink">
                    Approach
                  </a>
                </li>
                <li>
                  <a href="/#work" className="text-muted transition-colors hover:text-ink">
                    Work
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
                Connect
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <CopyLink href="mailto:contact@mlinx.studio" value="contact@mlinx.studio" label="email" />
                </li>
                <li>
                  <CopyLink href="tel:+12074329492" value="(207) 432-9492" label="phone number" />
                </li>
                <li>
                  <a href="/#contact" className="text-signal transition-opacity hover:opacity-80">
                    Start a conversation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-widest text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} M Studio</span>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-ink">
              Terms
            </a>
          </div>
          <span className="tracking-normal text-faint/80 [text-transform:none]">
            {sha ? `deployed ${built} · ${ref}@${sha}` : `built ${built} · live on Vercel`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MoonPhase size={12} className="align-[-2px]" />
            <span>Made in Portland, ME</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
