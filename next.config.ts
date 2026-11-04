import type { NextConfig } from "next";

// A static export for GitHub Pages, served under /SkyStore/.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/SkyStore",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
