import catalogSource from "./library-catalog.json";

export type CatalogFeature = {
  name: string;
  enables: string[];
};

export type CatalogRegistry = {
  registry: string;
  owner_inventory: string;
  ownership_verified: boolean;
  exact_name_match: boolean;
  name: string;
  version: string;
  max_stable_version: string;
  versions: number;
  yanked: boolean;
  downloads_total: number;
  downloads_90d: number;
  created_at: string;
  updated_at: string;
  description: string | null;
  repository_url: string | null;
  homepage_url: string | null;
  documentation_url: string | null;
  registry_url: string;
  observed_at: string;
};

export type CatalogRecord = {
  id: string;
  path: string;
  package_name: string;
  ecosystem: string;
  version: string;
  description: string;
  documented_scope: string | null;
  license: { value: string | null; source: string };
  workspace: {
    primary: string;
    memberships: string[];
    is_root_member: boolean;
    is_root_default_member: boolean;
    is_excluded_from_root: boolean;
  };
  package_shape: {
    classification: string;
    library_target: boolean;
    binary_target: boolean;
    readme_present: boolean;
    manifest_present: boolean;
  };
  publication: {
    manifest_publish: boolean | null;
    cargo_publish_allowed_by_default: boolean | null;
    note: string;
    state_key: string;
    state_label: string;
    registry_history_present: boolean;
    registry_ownership_verified: boolean | null;
    registry: CatalogRegistry | null;
    collision_note: string | null;
    interpretation: string;
  };
  feature_groups: CatalogFeature[];
  main_capabilities: string[];
  architectural_domain: string;
  sibling_dependencies: string[];
  links: {
    repository_declared: string | null;
    homepage_declared: string | null;
    documentation_declared: string | null;
    source_manifest: string;
    readme: string | null;
    crate_docs_source: string | null;
    access_note: string;
  };
  maturity_evidence: {
    status: string;
    signals: string[];
    limitations: string[];
  };
  last_update_evidence: {
    method: string;
    sha: string;
    date: string;
    title: string;
    url: string;
    caveat: string;
  };
  related_packages?: string[];
};

type CatalogSource = {
  schema_version: string;
  generated_at: string;
  repository: {
    full_name: string;
    visibility: string;
    default_branch: string;
    audited_head: { sha: string; committed_at: string; title: string };
    source_policy: string;
    sibling_dependency_methodology: string;
  };
  counts: {
    total_catalog_entries: number;
    unique_rust_packages: number;
    non_rust_packages: number;
    root_workspace_members: number;
    nested_aidens_members: number;
    nested_poly_kv_members: number;
  };
  catalog: CatalogRecord[];
  taxonomy: { architectural_domains: string[] };
};

const source = catalogSource as CatalogSource;

export function slugify(value: string) {
  return value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function humanize(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function concise(value: string, maximum = 158) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maximum) return normalized;
  return `${normalized.slice(0, maximum - 1).replace(/\s+\S*$/, "")}…`;
}

export const catalogRecords = source.catalog;
export const catalogAudit = {
  schemaVersion: source.schema_version,
  generatedAt: source.generated_at,
  repository: source.repository,
  counts: source.counts,
};

const recordBySlug = new Map(catalogRecords.map((record) => [slugify(record.package_name), record]));
const recordByName = new Map(catalogRecords.map((record) => [record.package_name, record]));

export function getLibraryBySlug(slug: string) {
  return recordBySlug.get(slug);
}

export function getLibraryByName(name: string) {
  return recordByName.get(name);
}

export type CatalogSummary = {
  slug: string;
  name: string;
  description: string;
  domain: string;
  domainSlug: string;
  ecosystem: string;
  version: string;
  workspace: string;
  maturity: string;
  publicationState: string;
  publicationLabel: string;
  capabilities: string[];
  dependencyCount: number;
  relatedCount: number;
  registryDownloads?: number;
};

export const catalogSummaries: CatalogSummary[] = catalogRecords.map((record) => ({
  slug: slugify(record.package_name),
  name: record.package_name,
  description: record.description || record.documented_scope || "No package description was recovered by the audit.",
  domain: record.architectural_domain,
  domainSlug: slugify(record.architectural_domain),
  ecosystem: record.ecosystem,
  version: record.version,
  workspace: record.workspace.primary,
  maturity: record.maturity_evidence.status,
  publicationState: record.publication.state_key,
  publicationLabel: record.publication.state_label,
  capabilities: record.main_capabilities.slice(0, 4),
  dependencyCount: record.sibling_dependencies.length,
  relatedCount: record.related_packages?.length ?? 0,
  registryDownloads: record.publication.registry?.downloads_total,
}));

export type DomainSummary = {
  slug: string;
  name: string;
  count: number;
  dependencyEdges: number;
  registryPackages: number;
  ecosystems: string[];
};

export const domainSummaries: DomainSummary[] = source.taxonomy.architectural_domains.map((name) => {
  const records = catalogRecords.filter((record) => record.architectural_domain === name);
  return {
    slug: slugify(name),
    name,
    count: records.length,
    dependencyEdges: records.reduce((total, record) => total + record.sibling_dependencies.length, 0),
    registryPackages: records.filter((record) => record.publication.registry_ownership_verified).length,
    ecosystems: [...new Set(records.map((record) => record.ecosystem))].sort(),
  };
});

const domainBySlug = new Map(domainSummaries.map((domain) => [domain.slug, domain]));

export function getDomainBySlug(slug: string) {
  return domainBySlug.get(slug);
}

export function getDomainRecords(domainName: string) {
  return catalogRecords.filter((record) => record.architectural_domain === domainName);
}

export function getRelationshipSets(record: CatalogRecord) {
  const dependencies = record.sibling_dependencies
    .map(getLibraryByName)
    .filter((value): value is CatalogRecord => Boolean(value));
  const related = (record.related_packages ?? [])
    .map(getLibraryByName)
    .filter((value): value is CatalogRecord => Boolean(value));
  const dependents = catalogRecords.filter((candidate) =>
    candidate.sibling_dependencies.includes(record.package_name),
  );
  return { dependencies, related, dependents };
}

export type CatalogLink = {
  label: string;
  href: string;
  kind: "registry" | "documentation" | "source" | "project";
  accessControlled?: boolean;
};

export function getCatalogLinks(record: CatalogRecord) {
  const registry = record.publication.registry;
  const candidates: Array<CatalogLink | null> = [
    registry
      ? { label: "crates.io release", href: registry.registry_url, kind: "registry" }
      : null,
    registry?.documentation_url
      ? { label: "Published documentation", href: registry.documentation_url, kind: "documentation" }
      : registry && record.ecosystem.startsWith("Rust")
        ? { label: "docs.rs package page", href: `https://docs.rs/${encodeURIComponent(registry.name)}`, kind: "documentation" }
        : null,
    record.links.documentation_declared
      ? { label: "Declared documentation", href: record.links.documentation_declared, kind: "documentation" }
      : null,
    record.links.repository_declared
      ? { label: "Declared repository", href: record.links.repository_declared, kind: "project" }
      : null,
    registry?.repository_url
      ? { label: "Registry repository", href: registry.repository_url, kind: "project" }
      : null,
    record.links.homepage_declared
      ? { label: "Declared homepage", href: record.links.homepage_declared, kind: "project" }
      : null,
    registry?.homepage_url
      ? { label: "Registry homepage", href: registry.homepage_url, kind: "project" }
      : null,
    record.links.readme
      ? { label: "Package README", href: record.links.readme, kind: "source", accessControlled: true }
      : null,
    { label: "Package manifest", href: record.links.source_manifest, kind: "source", accessControlled: true },
    record.links.crate_docs_source
      ? { label: "Crate documentation source", href: record.links.crate_docs_source, kind: "source", accessControlled: true }
      : null,
  ];

  const seen = new Set<string>();
  return candidates.filter((candidate): candidate is CatalogLink => {
    if (!candidate || seen.has(candidate.href)) return false;
    seen.add(candidate.href);
    return true;
  });
}
