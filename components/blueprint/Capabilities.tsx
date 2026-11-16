"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { services, work } from "@/lib/content";

/*
  Capabilities: "Four kinds of work. One builder." on warm white.

  After Ostrander Signal's capabilities band: tall dark cards in a row that
  slide sideways as you scroll down past them (desktop), and a plain swipe
  row on a phone. The four cards are `services` from lib/content.ts, the
  site's single definition of what is for sale, each with the real
  screenshot from its example (BrightBase's capture where the example has
  none). Nothing here is retyped.
*/

const bbShot = work.find((w) => w.title === "BrightBase")?.shot;

export default function Capabilities() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  useEffect(() => {
    const el = outer.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!mq.matches || reduce) return setX(0);
        const r = el.getBoundingClientRect();
        const span = el.offsetHeight - window.innerHeight;
        const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        const overflow = Math.max(0, tr.scrollWidth - tr.clientWidth);
        setX(-p * overflow);
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
  }, []);

  return (
    <section aria-labelledby="caps-heading" className="bp-light">
      <div ref={outer} className="lg:h-[220vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
          <div className="mx-auto w-full max-w-[1400px] px-6 pt-20 lg:px-10 lg:pt-0">
            <p className="bp-eyebrow bp-eyebrow-light"><span className="text-[color:var(--bp-cyan-ink)]">[ 02 ]</span> What gets built · four kinds</p>
            <h2 id="caps-heading" className="bp-h2 bp-h2-light mt-4">
              Four kinds of work. <span className="bp-serif">One builder.</span>
            </h2>
          </div>

          <div className="mt-10 overflow-x-auto pb-6 lg:overflow-hidden lg:pb-0">
            <div
              ref={track}
              className="flex w-max gap-4 px-6 lg:w-auto lg:px-10"
              style={{ transform: `translate3d(${x}px,0,0)` }}
            >
              {services.map((s) => {
                const shot = s.example.shot ?? bbShot;
                return (
                  <Link key={s.id} href="/catalog" className="bp-cap group">
                    <div className="relative h-[46%] overflow-hidden">
                      {shot && (
                        <Image src={shot} alt="" fill sizes="(min-width: 1024px) 440px, 80vw" className="bp-cap-img object-cover object-top" />
                      )}
                      <span aria-hidden="true" className="bp-cap-fade" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="font-mono text-[11px] text-[color:var(--bp-cyan)]">N° {s.index}</p>
                      <h3 className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[color:var(--bp-paper)]">{s.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--bp-mute)]">{s.tagline}</p>
                      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                        {s.kinds.slice(0, 4).map((k) => (
                          <li key={k} className="bp-chip">{k}</li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <p className="mx-auto mt-6 hidden w-full max-w-[1400px] px-10 font-mono text-[11px] uppercase tracking-[0.1em] text-[color:var(--bp-light-mute)] lg:block">
            Scroll to slide the band
          </p>
        </div>
      </div>
    </section>
  );
}
