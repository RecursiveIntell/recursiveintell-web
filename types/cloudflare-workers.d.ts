// Type stub for cloudflare:workers module.
// This file allows TypeScript to resolve the import in db/index.ts
// without requiring @cloudflare/workers-types as a dependency.
// The db/ module is only used in the Cloudflare Worker runtime, not by
// the Next.js app routes served on Vercel.

declare module "cloudflare:workers" {
  export interface Env {
    DB?: unknown;
    ASSETS?: unknown;
    [key: string]: unknown;
  }
  export const env: Env;
}