import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  // Required for Keystatic compatibility with Next.js 16
  transpilePackages: ["@keystatic/core", "@keystatic/next"],
};

export default nextConfig;
