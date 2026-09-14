export const legacyRouteRedirects = [
  { source: "/architecture", destination: "/platform", permanent: true },
  { source: "/archive", destination: "/proof", permanent: true },
  { source: "/capabilities", destination: "/platform", permanent: true },
  { source: "/ecosystem", destination: "/platform", permanent: true },
  { source: "/network", destination: "/product", permanent: true },
  { source: "/origin", destination: "/doctrine", permanent: true },
  { source: "/technology", destination: "/platform", permanent: true },
] as const;

export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
] as const;
