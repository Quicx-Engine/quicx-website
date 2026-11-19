import type { MetadataRoute } from "next";
import { sectionMeta, sectionSlugs } from "@/components/site/docs/sections-meta";
import { HOME_UPDATED, SITE_URL } from "@/lib/seo";

// lastmod is the date each page last changed in substance (sectionMeta[slug].updated,
// HOME_UPDATED), never the build time, so it is the same value as the page's
// TechArticle dateModified. Google ignores changefreq and priority, so neither is sent.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: HOME_UPDATED,
      images: [`${SITE_URL}/opengraph-image`],
    },
    ...sectionSlugs.map((slug) => ({
      url: `${SITE_URL}/docs/${slug}`,
      lastModified: sectionMeta[slug].updated,
      images: [`${SITE_URL}/docs/${slug}/opengraph-image`],
    })),
  ];
}
