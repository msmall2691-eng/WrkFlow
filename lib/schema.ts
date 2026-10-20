import { caseStudies, profiles, type CaseStudy } from "./content";

/*
  Structured data, in one place.

  Why a module instead of an object literal in app/layout.tsx: the site now
  has nodes on more than one page (the studio and the person sitewide, a
  CreativeWork per case study) and they reference each other by `@id`. Two
  literals in two files drift — one renames `#meg`, the other keeps pointing
  at it, and the graph silently stops connecting. Here the ids are constants
  and every node is built from `lib/content.ts`, so a case study cannot
  appear in the markup without appearing on the site.

  What this feeds: rich results, and the answer engines that now sit between
  a hiring manager's question and this site. Those read the graph to decide
  what entity a page is about. Before this, every page said "a business
  called M Studio exists" and no page said "a person called Megan Small made
  these specific things" — which is the only claim a portfolio is for.

  The rule from CLAUDE.md applies here exactly as it does to visible copy:
  nothing in this file asserts anything the site cannot show. `sameAs` stays
  absent until Meg supplies real profile URLs, and `schemaKind` is a per-study
  field rather than a guess, because calling a brochure site a WebApplication
  is the structured-data form of inventing a result.
*/

/** Canonical origin. Mirrors `SITE_URL` in app/layout.tsx, which imports it. */
export const SITE_URL = "https://mlinx.studio";

const ID = {
  website: `${SITE_URL}/#website`,
  studio: `${SITE_URL}/#studio`,
  person: `${SITE_URL}/#meg`,
  works: `${SITE_URL}/#works`,
} as const;

/** The CreativeWork node for a study, as opposed to the page that shows it. */
const workId = (slug: string) => `${SITE_URL}/work/${slug}#work`;
const pageId = (path: string) => `${SITE_URL}${path}`;

/** Schema.org wants absolute URLs; `lib/content.ts` stores site-relative ones. */
const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

/*
  Meg, the person.

  Named in full. The old node said `name: "Meg"`, which no search for her
  resolves to and which nothing outside this site corroborates — an entity
  with a nickname, no URL and no profile link is an assertion, not an
  identity. `image` is the real photo already on /about.
*/
function person() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: "Megan Small",
    alternateName: "Meg",
    jobTitle: "Founder, designer and developer",
    url: `${SITE_URL}/about`,
    image: abs("/meg.webp"),
    email: "contact@mlinx.studio",
    worksFor: { "@id": ID.studio },
    description:
      "Has run The Maine Cleaning Company since 2018, then learned to build the software it needed. Now designs and builds websites, business software and integrations for other business owners.",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Southern Maine",
    },
    knowsAbout: [
      "Web design and development",
      "Business Analytics",
      "Artificial Intelligence",
      "Computer Science",
      "Backend development",
      "Data modeling",
      "Systems integration",
      "Web performance",
      "Web accessibility",
    ],
    /* Omitted entirely while `profiles` is empty — see the TODO there. */
    ...(profiles.length > 0 ? { sameAs: [...profiles] } : {}),
  };
}

/* The legal entity. M Linx is the product line, not a co-equal brand. */
function studio() {
  return {
    "@type": "ProfessionalService",
    "@id": ID.studio,
    name: "M Studio",
    url: SITE_URL,
    email: "contact@mlinx.studio",
    telephone: "+1-207-432-9492",
    description:
      "Websites, custom business tools, CRM setup, data migrations, and integrations built around the way your business works.",
    slogan: "Everything, linked.",
    knowsAbout: [
      "Custom software development",
      "Web design and development",
      "Web applications",
      "Systems integration",
      "Data modeling",
      "Workflow automation",
      "Business analytics",
      "Artificial intelligence",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Websites & web apps", description: "Custom marketing sites, booking, and client portals." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom tools & dashboards", description: "Booking apps, CRMs, dashboards, and quoting tools, built around how you run." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "CRM & platform setup", description: "CRM fields, views, configuration, and workflow improvements." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Data migration & cleanup", description: "Exports, imports, field mapping, and record checks when switching platforms." } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Systems integration & automation", description: "Connecting the tools you already use, with workflow automation and practical AI." } },
      ],
    },
    areaServed: [
      { "@type": "State", name: "Maine" },
      { "@type": "Place", name: "New England" },
      { "@type": "Place", name: "Worldwide (remote)" },
    ],
    founder: { "@id": ID.person },
    address: {
      "@type": "PostalAddress",
      addressRegion: "ME",
      addressCountry: "US",
    },
  };
}

/*
  One built thing.

  `creator` and `author` both point at Meg because both are true and
  different consumers read different ones. There is deliberately NO
  `publisher`: one of these studies is a client's site, and naming the studio
  as its publisher would claim something about a business that isn't hers to
  claim. Same reason the Work grid stopped badging client cards
  "In production".
*/
export function workNode(cs: CaseStudy) {
  return {
    "@type": cs.schemaKind,
    "@id": workId(cs.slug),
    name: cs.title,
    headline: cs.title,
    description: cs.outcome,
    image: abs(cs.hero.src),
    creator: { "@id": ID.person },
    author: { "@id": ID.person },
    keywords: cs.stack.join(", "),
    /*
      Typed inline rather than written as a bare {"@id": …}. A bare reference
      would point at the WebPage node that only the case study's own HTML
      defines, so on every other page it dangles — a consumer reading the
      homepage would have to go fetch the URL to learn what the id even is.
      Naming the type here makes it a definition instead of a promise.
    */
    mainEntityOfPage: { "@type": "WebPage", "@id": pageId(`/work/${cs.slug}`) },
    ...(cs.url ? { url: cs.url } : {}),
  };
}

/*
  The body of work, as the thing this website is primarily about. An answer
  engine asked what Megan Small has built reads this list; before it, the
  case studies existed only as links in HTML.
*/
function works() {
  return {
    "@type": "ItemList",
    "@id": ID.works,
    name: "Selected work",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: caseStudies.length,
    itemListElement: caseStudies.map((cs, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cs.title,
      url: pageId(`/work/${cs.slug}`),
      item: { "@id": workId(cs.slug) },
    })),
  };
}

/**
 * The sitewide graph, rendered once by the root layout: the site, the studio,
 * the person, the list of work, and every CreativeWork the list points at.
 *
 * The work nodes live here rather than only on their own pages so the `@id`s
 * the ItemList references actually resolve, and so one page can describe the
 * whole portfolio.
 */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ID.website,
        url: SITE_URL,
        name: "M Studio",
        publisher: { "@id": ID.studio },
        creator: { "@id": ID.person },
        mainEntity: { "@id": ID.works },
      },
      studio(),
      person(),
      works(),
      ...caseStudies.map(workNode),
    ],
  };
}

/**
 * The per-page graph for one case study: the page, what it is about, and how
 * to get back up. The CreativeWork itself is referenced by `@id` rather than
 * repeated, since the sitewide graph already defines it.
 */
export function caseStudyGraph(cs: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId(`/work/${cs.slug}`),
        url: pageId(`/work/${cs.slug}`),
        name: `${cs.title} — case study`,
        description: cs.outcome,
        isPartOf: { "@id": ID.website },
        about: { "@id": workId(cs.slug) },
        mainEntity: { "@id": workId(cs.slug) },
        primaryImageOfPage: { "@type": "ImageObject", url: abs(cs.hero.src) },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageId(`/work/${cs.slug}`)}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Work", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: cs.title },
        ],
      },
    ],
  };
}
