import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Custom operations software for businesses that would rather own
              their systems than rent them.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
                Studio
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#services" className="text-muted transition-colors hover:text-ink">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#approach" className="text-muted transition-colors hover:text-ink">
                    Approach
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-muted transition-colors hover:text-ink">
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
                  <a
                    href="mailto:hello@workflow-studio.com"
                    className="text-muted transition-colors hover:text-ink"
                  >
                    Email
                  </a>
                </li>
                <li>
                  {/* Placeholder — Facebook page link to be added. */}
                  <a
                    href="#"
                    className="text-muted transition-colors hover:text-ink"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-signal transition-opacity hover:opacity-80">
                    Start a conversation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-widest text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Workflow Studio</span>
          <span>Own your operations.</span>
        </div>
      </div>
    </footer>
  );
}
