import type { NextConfig } from "next";

// the dev badge overlaps the page; it is not wanted while reviewing layout
const nextConfig: NextConfig = {
  output: "export",
  // Keep production builds from replacing chunks used by the live dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
