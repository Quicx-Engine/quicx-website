import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*.svg",
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
