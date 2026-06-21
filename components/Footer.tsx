import Logo from "./Logo";
import FooterWordmark from "./FooterWordmark";
import CopyLink from "./CopyLink";
import LinxMark from "./LinxMark";
import SelfScore from "./SelfScore";

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
            <Logo tag />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We design and build custom websites, tools, and the systems behind
              them—and help connect the ones you already use—so less of your week is
              busywork. Built on the coast of Maine, working with clients anywhere.
            </p>
            <SelfScore />
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
                    MLinx marketplace
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

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-widest text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} M Studio</span>
          <span className="tracking-normal text-faint/80 [text-transform:none]">
            {sha ? `deployed ${built} · ${ref}@${sha}` : `built ${built} · live on Vercel`}
          </span>
          <span>Built true.</span>
        </div>
      </div>
    </footer>
  );
}
