import { caseStudies, services, type WorkItem } from "@/lib/content";

/*
  One browser frame around one real capture.

  Lifted out of `StageWork` rather than copied, because the homepage now
  draws a capture in three places — the hero, each category's lead
  project, and the cards beside it — and three copies of the chrome is
  how one of them starts showing a domain the link does not go to.

  Nothing here invents a label. The address bar reads the real host from
  `url`, or `displayDomain` when the host is not the one to show, or, for
  a private system with no host at all, what the thing is (`status`),
  with the monospace taken back off so prose does not sit where a domain
  belongs.
*/

/** What the browser chrome reads: the real host, or what the thing is. */
export function chromeLabel(item: WorkItem) {
  if (item.displayDomain) return item.displayDomain;
  if (item.url) {
    try {
      return new URL(item.url).host.replace(/^www\./, "");
    } catch {
      /* A malformed URL in the data should not take the page down. */
    }
  }
  return item.status ?? item.tag;
}

/** True when the label above is a real host, so it may keep the mono face. */
export function hasRealHost(item: WorkItem) {
  if (!item.displayDomain && !item.url) return false;
  if (item.displayDomain) return true;
  try {
    new URL(item.url as string);
    return true;
  } catch {
    return false;
  }
}

/** The capture this item shows: its case study's hero, or its own shot. */
export function shotFor(item: WorkItem) {
  const study = item.caseStudy
    ? caseStudies.find((c) => c.slug === item.caseStudy)
    : undefined;
  return study?.hero.src ?? item.shot;
}

/** The service this is proof of, which is what `category` is for. */
export function proofOf(item: WorkItem) {
  const service = services.find((s) => s.id === item.category);
  const label = service?.short ?? item.tag;
  return item.client ? `${label} · client work` : label;
}

export default function WorkFrame({
  item,
  eager = false,
}: {
  item: WorkItem;
  eager?: boolean;
}) {
  const study = item.caseStudy
    ? caseStudies.find((c) => c.slug === item.caseStudy)
    : undefined;
  const shot = shotFor(item);
  if (!shot) return null;

  return (
    <figure className="frame">
      <div className="chrome" aria-hidden="true">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className={hasRealHost(item) ? "host" : "host host-note"}>
          {chromeLabel(item)}
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot}
        alt={study?.hero.alt ?? `${item.title}, as it runs today`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </figure>
  );
}
