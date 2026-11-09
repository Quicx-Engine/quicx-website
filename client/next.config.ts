import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Every public SVG except the favicon — Google needs to crawl
        // /icon.svg to show it next to search results.
        source: "/:file((?!icon\\.svg$).*\\.svg)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/install:ext(.sh)?",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  async redirects() {
    return [
      // 2.0 replaced PMAD with apool; the allocator page moved with it.
      {
        source: "/docs/pmad-allocator",
        destination: "/docs/allocator",
        permanent: true,
      },
      {
        source: "/docs/pmad-allocator/opengraph-image",
        destination: "/docs/allocator/opengraph-image",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/install",
        destination: "/install.sh",
      },
    ];
  },
};

export default nextConfig;
