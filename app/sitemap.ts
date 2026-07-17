import type { MetadataRoute } from "next";
import { catalogAudit, catalogRecords, domainSummaries, slugify } from "./data/catalog";

const base = "https://recursiveintell.com";
const auditDate = new Date(catalogAudit.generatedAt);

const staticRoutes: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/install", changeFrequency: "weekly", priority: .95 },
  { path: "/libraries", changeFrequency: "weekly", priority: .95 },
  { path: "/proof", changeFrequency: "weekly", priority: .9 },
  { path: "/activity", changeFrequency: "daily", priority: .9 },
  { path: "/services", changeFrequency: "monthly", priority: .9 },
  { path: "/pro", changeFrequency: "monthly", priority: .85 },
  { path: "/compose", changeFrequency: "monthly", priority: .85 },
  { path: "/concepts", changeFrequency: "monthly", priority: .82 },
  { path: "/benchmarks", changeFrequency: "monthly", priority: .8 },
  { path: "/changelog", changeFrequency: "weekly", priority: .8 },
  { path: "/about", changeFrequency: "monthly", priority: .78 },
  { path: "/work", changeFrequency: "monthly", priority: .78 },
  { path: "/privacy", changeFrequency: "yearly", priority: .3 },
];

const installHosts = ["claude-code", "codex", "hermes", "cursor", "mcp", "rust"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: auditDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const installEntries = installHosts.map((host) => ({
    url: `${base}/install/${host}`,
    lastModified: auditDate,
    changeFrequency: "weekly" as const,
    priority: .84,
  }));
  const domainEntries = domainSummaries.map((domain) => ({
    url: `${base}/domains/${domain.slug}`,
    lastModified: auditDate,
    changeFrequency: "weekly" as const,
    priority: .76,
  }));
  const packageEntries = catalogRecords.map((record) => ({
    url: `${base}/libraries/${slugify(record.package_name)}`,
    lastModified: Number.isFinite(Date.parse(record.last_update_evidence.date)) ? new Date(record.last_update_evidence.date) : auditDate,
    changeFrequency: "weekly" as const,
    priority: record.publication.registry_ownership_verified ? .74 : .66,
  }));
  return [...staticEntries, ...installEntries, ...domainEntries, ...packageEntries];
}
