import type { MetadataRoute } from "next";

type DocEntry = {
  slug: string;
  lastModified: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const docEntryMeta: DocEntry[] = [
  { slug: "installation",     lastModified: "2026-05-11", priority: 0.9, changeFrequency: "monthly"  },
  { slug: "quick-start",      lastModified: "2026-05-13", priority: 0.9, changeFrequency: "monthly"  },
  { slug: "configuration",    lastModified: "2026-05-12", priority: 0.8, changeFrequency: "monthly"  },
  { slug: "architecture",     lastModified: "2026-05-06", priority: 0.7, changeFrequency: "monthly"  },
  { slug: "pmad-allocator",   lastModified: "2026-04-29", priority: 0.7, changeFrequency: "monthly"  },
  { slug: "binary-protocol",  lastModified: "2026-05-24", priority: 0.7, changeFrequency: "monthly"  },
  { slug: "cli-reference",    lastModified: "2026-05-03", priority: 0.8, changeFrequency: "monthly"  },
  { slug: "java-client",      lastModified: "2026-05-15", priority: 0.8, changeFrequency: "monthly"  },
  { slug: "changelog",        lastModified: "2026-05-22", priority: 0.6, changeFrequency: "weekly"   },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://quicx.dev";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-05-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docEntryMeta.map(({ slug, lastModified, priority, changeFrequency }) => ({
      url: `${baseUrl}/docs/${slug}`,
      lastModified: new Date(lastModified),
      changeFrequency,
      priority,
    })),
  ];
}
