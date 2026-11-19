import type { MetadataRoute } from "next";

// /install and /install.sh are crawlable on purpose: they answer with
// `X-Robots-Tag: noindex` (next.config.ts), and Google only sees that header
// on a URL robots.txt lets it fetch.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://quicx.dev/sitemap.xml",
  };
}
