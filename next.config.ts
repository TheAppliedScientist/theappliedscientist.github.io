import type { NextConfig } from "next";

// the dev badge overlaps the page; it is not wanted while reviewing layout
const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
