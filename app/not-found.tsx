import Link from "next/link";
import PanelHeader from "@/components/panel/PanelHeader";

/* 404, in the site's own frame (Nov 16 2026 redesign): the normal header so
   nobody is stranded, a plain message, and the two places most people want.
   The glow and the serif headline went with the rest of the decoration. */
export default function NotFound() {
  return (
    <div className="cp min-h-[100svh]">
      <PanelHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <p className="m-0 text-[13px] font-medium text-[color:var(--cp-faint)]">Page not found</p>
        <h1 className="display m-0 mt-2 text-[2rem] text-balance text-[color:var(--cp-ink)] sm:text-4xl">
          That page isn&apos;t here.
        </h1>
        <p className="m-0 mt-3 max-w-md text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
          It may have moved. Everything on the site is one click from here.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="cp-cta inline-flex min-h-11 items-center rounded-xl px-5 text-[15px] font-semibold text-white no-underline"
          >
            Go to the homepage
          </Link>
          <Link
            href="/catalog"
            className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:underline"
          >
            See everything and every price
          </Link>
        </div>
      </main>
    </div>
  );
}
