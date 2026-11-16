import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/content";

const SITE_URL = "https://mlinx.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    /* Case studies — the deepest proof pages on the site, so they outrank
       the utility pages. Driven by lib/content.ts, so a new study ships with
       its sitemap entry. `as const` is required: a mapped string widens and
       fails MetadataRoute.Sitemap. */
    ...caseStudies.map((cs) => ({
      url: `${SITE_URL}/work/${cs.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/plugins`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/brightbase`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    /* The showcase only. Each demo it links to is `noindex`, because the
       businesses in them are invented and should not rank for anybody
       actually looking to buy a print or book a massage. */
    {
      url: `${SITE_URL}/welcome-book`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    /*
      /turnover was missing from this list entirely, which is a plain bug
      rather than a decision. It is a finished, working, free tool — paste an
      Airbnb or Vrbo calendar export, get the cleaning schedule with same-day
      turnarounds flagged — it carries no `noindex`, and it is exactly the
      page a short-term-rental host searching for this would want to land on.
      It was simply never added, so the one page most likely to be found by a
      stranger was the one page search engines were never told about.
    */
    {
      url: `${SITE_URL}/turnover`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
