import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://quicx.dev";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-05-11"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date("2026-05-11"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
