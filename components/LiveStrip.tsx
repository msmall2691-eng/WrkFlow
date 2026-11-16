import Link from "next/link";
import Image from "next/image";
import { catalog, liveDemoIds } from "@/lib/catalog";

/*
  The "Try it live" row: six things that open and work right now, each with
  a real capture. One component, used on the homepage and on /catalog, so
  the two can never list different demos (the homepage used to have its own
  "Click something." block that drifted from /demo and /marketplace).
*/

const items = liveDemoIds
  .map((id) => catalog.find((i) => i.id === id))
  .filter((i): i is NonNullable<typeof i> => Boolean(i));

export default function LiveStrip({ id }: { id?: string }) {
  return (
    <div id={id}>
    <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3 lg:grid-cols-6">
      {items.map((d) => {
        const link = d.primary ?? d.proof ?? { label: "Open", href: "/catalog" };
        const inner = (
          <>
            <span className="relative block aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
              {d.image && (
                <Image
                  unoptimized
                  src={d.image}
                  alt={`${d.name}, a real screen`}
                  fill
                  sizes="(min-width: 1024px) 180px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover object-top"
                />
              )}
            </span>
            <span className="block px-3 py-2.5">
              <span className="block text-[13px] font-semibold leading-snug text-[color:var(--cp-ink)]">
                {d.name}
              </span>
              <span className="mt-0.5 block text-[12px] font-medium text-[color:var(--cp-violet-ink)]">
                Open it {link.external ? "↗" : "→"}
              </span>
            </span>
          </>
        );
        const cls = "cp-tile !rounded-xl block h-full overflow-hidden no-underline";
        return (
          <li key={d.id}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link href={link.href} className={cls}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
    {/* CLAUDE.md: the demo businesses are invented, and the site says so
        wherever they appear, not only on the demo pages themselves. */}
    <p className="m-0 mt-2.5 text-[12px] text-[color:var(--cp-faint)]">
      The store, booking and directory demos are invented businesses. What they do is real.
    </p>
    </div>
  );
}
