import type { MetadataRoute } from "next";
import { sectionMeta, sectionSlugs } from "@/components/site/docs/sections-meta";
import { SITE_URL } from "@/lib/seo";

type DocEntry = {
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

// lastmod comes from sectionMeta[slug].updated so the sitemap and the
// TechArticle dateModified can never disagree. Any slug missing here still
// gets listed with the defaults below.
const docEntryMeta: Record<string, DocEntry> = {
  "installation":    { priority: 0.9, changeFrequency: "monthly" },
  "quick-start":     { priority: 0.9, changeFrequency: "monthly" },
  "configuration":   { priority: 0.8, changeFrequency: "monthly" },
  "architecture":    { priority: 0.7, changeFrequency: "monthly" },
  "pmad-allocator":  { priority: 0.7, changeFrequency: "monthly" },
  "binary-protocol": { priority: 0.7, changeFrequency: "monthly" },
  "benchmarks":      { priority: 0.9, changeFrequency: "monthly" },
  "limitations":     { priority: 0.8, changeFrequency: "monthly" },
  "cli-reference":   { priority: 0.8, changeFrequency: "monthly" },
  "java-client":     { priority: 0.8, changeFrequency: "monthly" },
  "changelog":       { priority: 0.6, changeFrequency: "weekly"  },
};

const defaultDocEntry: DocEntry = { priority: 0.7, changeFrequency: "monthly" };

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-08-15"),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/opengraph-image`],
    },
    ...sectionSlugs.map((slug) => {
      const { priority, changeFrequency } = docEntryMeta[slug] ?? defaultDocEntry;
      return {
        url: `${SITE_URL}/docs/${slug}`,
        lastModified: new Date(sectionMeta[slug].updated),
        changeFrequency,
        priority,
        images: [`${SITE_URL}/docs/${slug}/opengraph-image`],
      };
    }),
  ];
}
