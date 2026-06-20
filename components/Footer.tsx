import Logo from "./Logo";
import FooterWordmark from "./FooterWordmark";
import CopyLink from "./CopyLink";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line py-16 md:py-20">
      {/* Giant M STUDIO the swell reveals through — fills the dead middle */}
      <FooterWordmark />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo tag />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We design and build websites, automations, and the systems behind
              them—so your business runs faster and cleaner, with less busywork.
              Maine-built, working with clients anywhere. Everything, linked.
            </p>
          </div>

          <div className="flex gap-16">
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
                  <a href="/marketplace" className="text-muted transition-colors hover:text-ink">
                    Linx marketplace
                  </a>
                </li>
                <li>
                  <a href="/#approach" className="text-muted transition-colors hover:text-ink">
                    Approach
                  </a>
                </li>
                <li>
                  <a href="/#live" className="text-muted transition-colors hover:text-ink">
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
          <span>Built true.</span>
        </div>
      </div>
    </footer>
  );
}
