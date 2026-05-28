import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/install", "/install.sh"]
    },
    sitemap: "https://quicx.dev/sitemap.xml",
  };
}
