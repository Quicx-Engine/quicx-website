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
