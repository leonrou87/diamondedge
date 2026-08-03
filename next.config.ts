import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // The dev-only Next badge sits exactly on top of the bottom dock's first tab, which makes
  // the News tab unclickable in local QA (and poisons every mobile screenshot). Off.
  devIndicators: false,
};

export default nextConfig;
