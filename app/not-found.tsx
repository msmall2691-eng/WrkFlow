import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Soft accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/10 blur-[120px]"
      />

      <div className="relative">
        <Link href="/" aria-label="M Studio — home" className="inline-block">
          <Logo tag tone="light" />
        </Link>

        <h1 className="display-serif mt-12 text-[2rem] text-balance text-ink sm:text-4xl md:text-5xl">
          This link came loose.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted">
          The page you&apos;re after doesn&apos;t exist or has moved. Everything
          else is still linked up where it should be.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Back home →
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-muted transition-colors hover:border-signal/60 hover:text-ink"
          >
            Browse the marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
