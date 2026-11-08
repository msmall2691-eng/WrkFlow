import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { downloadToken, paidProductForSession } from "@/lib/shopServer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your download",
  robots: { index: false, follow: false },
};

/*
  Stripe sends the buyer here after paying. Every visit checks the session
  with Stripe again and mints a fresh 24-hour link, so this page works as the
  buyer's permanent "get my file" page as long as they keep the URL.
*/
export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId = "" } = await searchParams;
  let product = null;
  let failed = false;
  try {
    product = sessionId ? await paidProductForSession(sessionId) : null;
  } catch (err) {
    console.error("[shop/thanks]", err);
    failed = true;
  }

  let href: string | null = null;
  if (product) {
    try {
      href = `/api/shop/download?t=${encodeURIComponent(downloadToken(product.id, sessionId))}`;
    } catch (err) {
      console.error("[shop/thanks] signing", err);
      failed = true;
    }
  }

  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="mx-auto max-w-2xl px-6 py-20">
          {product && href ? (
            <>
              <p className="text-xs font-medium text-signal">Payment received</p>
              <h1 className="display mt-3 text-3xl text-ink">Thank you. Here&apos;s your file.</h1>
              <p className="mt-4 text-[1rem] leading-relaxed text-muted">
                {product.name} · {product.format}
              </p>
              <a
                href={href}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white"
              >
                Download {product.file}
              </a>
              <p className="mt-6 text-sm leading-relaxed text-faint">
                Bookmark this page. Come back any time and it will give you a fresh download link.
                Stripe also emailed you a receipt. Questions or trouble opening it?{" "}
                <a className="underline" href="mailto:megan.small@maine.edu">megan.small@maine.edu</a>
              </p>
            </>
          ) : (
            <>
              <h1 className="display text-3xl text-ink">
                {failed ? "Something went wrong on our end." : "We couldn't find a finished payment."}
              </h1>
              <p className="mt-4 text-[1rem] leading-relaxed text-muted">
                {failed
                  ? "Your payment is safe with Stripe. Please refresh in a minute, or email megan.small@maine.edu with your receipt and I'll send the file."
                  : "If you just paid, refresh this page in a moment. If you got here another way, the downloads are on the M Linx page."}
              </p>
              <Link href="/marketplace#downloads" className="mt-8 inline-block text-sm font-semibold text-signal">
                Back to M Linx →
              </Link>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
