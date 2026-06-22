import type { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import AccentSwitcher from "./AccentSwitcher";

/*
  Shared shell for the legal pages (Privacy, Terms). Keeps both documents
  visually consistent with the rest of the site (Deep Harbor dark theme) and
  gives them readable, narrow body type.
*/
export function LegalShell({
  kicker,
  title,
  updated,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="relative overflow-hidden border-b border-line py-14 md:py-20">
          <div
            aria-hidden="true"
            className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-72"
          />
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <p className="marker">// {kicker}</p>
            <h1 className="display-serif mt-4 text-3xl text-ink sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 font-mono text-xs uppercase tracking-widest text-faint">
              Last updated · {updated}
            </p>
            {intro && (
              <div className="mt-6 text-base leading-relaxed text-muted">{intro}</div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-6">{children}</div>
        </section>
      </main>
      <Footer />
      <AccentSwitcher />
    </>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="display mt-12 text-xl text-ink sm:text-2xl first:mt-0">{children}</h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[15px] leading-relaxed text-muted">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted marker:text-signal">
      {children}
    </ul>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 rounded-xl border border-gold/30 bg-gold/[0.06] p-5 text-sm leading-relaxed text-muted">
      {children}
    </div>
  );
}
