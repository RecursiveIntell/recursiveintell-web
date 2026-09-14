import type { NextConfig } from "next";
import { legacyRouteRedirects, securityHeaders } from "./app/config/routes";

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRouteRedirects.map((redirect) => ({ ...redirect }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders.map((header) => ({ ...header })),
      },
    ];
  },
};

export default nextConfig;
