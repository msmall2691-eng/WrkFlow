import Link from "next/link";
import { services } from "@/lib/content";

/*
  What I do, compactly.

  The full five-row Services section moved to /services along with pricing.
  This is what stays on the homepage: the same five real capabilities, read
  from the same source, with no screenshots and no prices. It tells a visitor
  what the work covers in one screen and gets out of the way, because on this
  page the work itself is the argument.
*/
export default function Capabilities() {
  return (
    <section id="capabilities" className="border-t border-line py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="display-serif text-2xl text-ink sm:text-3xl md:text-4xl">
          What I do.
        </h2>
        <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">
          Design and build, end to end: discovery, interface, front end, the
          system behind it, and the measurement afterwards.
        </p>

        <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id}>
              <p className="font-mono text-xs text-faint">{s.index}</p>
              <h3 className="display mt-2 text-lg text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.tagline}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.kinds.map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-line bg-base px-2.5 py-1 text-xs text-faint"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-muted">
          <Link
            href="/services"
            className="text-signal transition-opacity hover:opacity-80"
          >
            Scope and pricing &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
