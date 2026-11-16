"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { work, type WorkItem } from "@/lib/content";

/*
  WorkStage: four real projects rolling through one browser window.

  The pattern is Ostrander Signal's "stage": the section pins to the screen
  while you scroll through it, a big take number counts 01 to 04 on the left,
  and the project in the window changes with each step. Progress bars across
  the top show where you are and can be clicked.

  Everything about each project (name, blurb, link, screenshot) is read from
  `work` in lib/content.ts, never retyped, so this cannot drift from /work.
  The one thing written here is the short italic line under each name. There
  are no outcome numbers: none are confirmed, and CLAUDE.md is clear.

  Below lg the pinned stage is replaced by a plain stacked list. Pinning a
  four-screen scroll on a phone is a trap, and the list says the same thing.
*/

const PICKS: { title: string; line: string }[] = [
  { title: "Nash Construction", line: "a contractor site people can hire from" },
  { title: "The Maine Cleaning Co.", line: "a site wired into the back office" },
  { title: "BrightBase", line: "the app that runs a whole company" },
  { title: "linx", line: "a local job marketplace, live" },
];

type Pick = WorkItem & { line: string; href: string; external: boolean; cta: string };

function picks(): Pick[] {
  return PICKS.flatMap((p) => {
    const w = work.find((x) => x.title === p.title);
    if (!w || !w.shot) return [];
    const href = w.caseStudy ? `/work/${w.caseStudy}` : w.page ?? w.url ?? "/work";
    const external = !w.caseStudy && !w.page && !!w.url;
    const cta = w.caseStudy ? "How it was built" : w.page ? "See the app" : "Visit the live site";
    return [{ ...w, line: p.line, href, external, cta }];
  });
}

function hostOf(w: Pick) {
  if (w.url) return w.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `mlinx.studio${w.page ?? "/work"}`;
}

function ProjectLink({ p, className }: { p: Pick; className: string }) {
  return p.external ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={className}>
      {p.cta}
    </a>
  ) : (
    <Link href={p.href} className={className}>
      {p.cta}
    </Link>
  );
}

export default function WorkStage() {
  const items = picks();
  const n = items.length;
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [enter, setEnter] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const span = el.offsetHeight - window.innerHeight;
        if (span <= 0) return;
        const p = Math.min(1, Math.max(0, -r.top / span));
        setIdx(Math.min(n - 1, Math.floor(p * n)));
        // The window grows into place as the stage arrives.
        const arrive = Math.min(1, Math.max(0, 1 - r.top / window.innerHeight));
        setEnter(arrive);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [n]);

  function jump(i: number) {
    const el = ref.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + span * ((i + 0.5) / n), behavior: "smooth" });
  }

  const cur = items[idx];
  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <section id="work" aria-label="Work" className="bp-band relative">
      {/* Phone and tablet: a plain list. */}
      <div className="mx-auto max-w-2xl px-6 py-20 lg:hidden">
        <p className="bp-eyebrow"><span className="text-[color:var(--bp-print)]">[ 01 ]</span> The work · real projects</p>
        <h2 className="bp-h2 mt-4">Rolling now.</h2>
        <ol className="mt-10 grid gap-12">
          {items.map((p, i) => (
            <li key={p.title}>
              <div className="bp-window">
                <div className="bp-window-bar"><span className="bp-window-dots" aria-hidden="true" /><span className="bp-window-url">{hostOf(p)}</span></div>
                <div className="relative aspect-[16/10]">
                  <Image src={p.shot!} alt={`${p.title} screenshot`} fill sizes="100vw" className="object-cover object-top" />
                </div>
              </div>
              <p className="bp-eyebrow mt-5">Take {pad(i + 1)} · {p.tag}</p>
              <h3 className="mt-2 font-display text-[26px] font-semibold text-[color:var(--bp-paper)]">{p.title}</h3>
              <p className="bp-serif text-[22px] text-[color:var(--bp-print)]">{p.line}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--bp-mute)]">{p.blurb}</p>
              <ProjectLink p={p} className="bp-link mt-4 inline-flex" />
            </li>
          ))}
        </ol>
      </div>

      {/* Desktop: the pinned stage. */}
      <div ref={ref} className="hidden lg:block" style={{ height: `${n * 90 + 20}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-4 gap-4 px-10 pt-24">
            {items.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => jump(i)}
                aria-label={`Show ${p.title}`}
                aria-current={i === idx ? "true" : undefined}
                className="bp-progress group text-left"
              >
                <span className="bp-progress-track"><span className="bp-progress-fill" style={{ transform: `scaleX(${i < idx ? 1 : i === idx ? 1 : 0})`, opacity: i === idx ? 1 : i < idx ? 0.45 : 1 }} /></span>
                <span className="mt-2 block font-mono text-[11px] text-[color:var(--bp-mute)] group-hover:text-[color:var(--bp-paper)]">{pad(i + 1)} · {p.title}</span>
              </button>
            ))}
          </div>

          <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-12 items-center gap-10 px-10 pb-10">
            <div className="relative col-span-4">
              <p aria-hidden="true" className="bp-vertical">M Studio</p>
              <div className="pl-14">
                <p className="flex items-start gap-2">
                  <span key={idx} className="bp-take">{pad(idx + 1)}</span>
                  <span className="mt-4 font-mono text-[14px] text-[color:var(--bp-print)]">/{pad(n)}</span>
                </p>
                <div key={`t${idx}`} className="bp-swap">
                  <p className="bp-eyebrow mt-7"><span className="text-[color:var(--bp-hi)]">Take {pad(idx + 1)}</span> · {cur.tag}</p>
                  <h3 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-[color:var(--bp-paper)]">{cur.title}</h3>
                  <p className="bp-serif text-[30px] leading-[1.1] text-[color:var(--bp-print)]">{cur.line}</p>
                  <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[color:var(--bp-mute)]">{cur.blurb}</p>
                  <ProjectLink p={cur} className="bp-btn bp-btn-ghost mt-6" />
                </div>
              </div>
            </div>

            <div className="col-span-8">
              <div
                className="bp-window bp-window-lg"
                style={{ transform: `scale(${1.08 - 0.08 * enter})`, opacity: 0.35 + 0.65 * enter }}
              >
                <div className="bp-window-bar">
                  <span className="bp-window-dots" aria-hidden="true" />
                  <span className="bp-window-url">{hostOf(cur)}</span>
                  <span className="bp-rec" aria-hidden="true">● {cur.url ? "LIVE" : "IN USE"}</span>
                </div>
                <div className="relative aspect-[16/10] bg-[color:var(--bp-ink)]">
                  {items.map((p, i) => (
                    <Image
                      key={p.title}
                      src={p.shot!}
                      alt={i === idx ? `${p.title} screenshot` : ""}
                      aria-hidden={i === idx ? undefined : true}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="bp-shot object-cover object-top"
                      style={{ opacity: i === idx ? 1 : 0 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
