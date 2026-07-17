import type { Metadata } from "next";
import catalog from "../data/library-catalog.json";
import crateData from "../data/published-crates.json";
import { Footer, Header } from "../components";
import LibraryCatalog, { type LibraryItem, type PublicationState } from "./LibraryCatalog";

export const metadata: Metadata = {
  title: "Library Atlas — RecursiveIntell",
  description: "Every package in the RecursiveIntell Libraries system, audited and made legible.",
};

const registry = new Map(crateData.crates.map((item) => [item.name, item]));

function collisionNote(name: string) {
  if (name === "agent-graph") return "The exact crates.io name is owned by another publisher; it is not counted as a RecursiveIntell release.";
  if (name === "job-queue") return "The crates.io job-queue/job_queue name is unrelated. RecursiveIntell’s agent-queue is a distinct package and is not treated as this package’s release.";
  return "";
}

function publicationState(ecosystem: string, publishDisabled: boolean, hasRegistry: boolean): PublicationState {
  if (publishDisabled && hasRegistry) return "historical-disabled";
  if (publishDisabled) return "disabled-unpublished";
  if (hasRegistry) return "owned-registry";
  if (!ecosystem.startsWith("Rust")) return "npm-unverified";
  return "unverified";
}

const items: LibraryItem[] = catalog.catalog.map((item) => {
  const published = registry.get(item.package_name);
  const publishDisabled = item.publication.manifest_publish === false;
  const state = publicationState(item.ecosystem, publishDisabled, Boolean(published));
  const collision = collisionNote(item.package_name);
  const publicationLabel = state === "historical-disabled"
    ? `Current publish=false · historical crates.io v${published?.version}`
    : state === "disabled-unpublished"
      ? "Current publish=false · no owned registry record"
      : state === "owned-registry"
        ? `RecursiveIntell-owned crates.io v${published?.version}`
        : state === "npm-unverified"
          ? "npm publication not verified"
          : collision || "RecursiveIntell registry ownership unverified";

  return {
    id: item.id,
    name: item.package_name,
    path: item.path,
    ecosystem: item.ecosystem,
    version: item.version,
    description: item.description,
    scope: item.documented_scope || item.description || "Scope derived from audited package metadata.",
    domain: item.architectural_domain,
    workspace: item.workspace.primary,
    classification: item.package_shape.classification,
    license: item.license.value ?? "Not declared",
    maturity: item.maturity_evidence.status,
    capabilities: item.main_capabilities,
    dependencies: item.sibling_dependencies,
    features: item.feature_groups,
    signals: item.maturity_evidence.signals,
    limitations: item.maturity_evidence.limitations,
    shape: {
      libraryTarget: item.package_shape.library_target,
      binaryTarget: item.package_shape.binary_target,
      readmePresent: item.package_shape.readme_present,
      manifestPresent: item.package_shape.manifest_present,
    },
    publication: {
      manifestPublish: item.publication.manifest_publish,
      cargoPublishAllowed: item.publication.cargo_publish_allowed_by_default,
      note: [item.publication.note, collision].filter(Boolean).join(" "),
      state,
      label: publicationLabel,
    },
    links: {
      repositoryDeclared: item.links.repository_declared || undefined,
      homepageDeclared: item.links.homepage_declared || undefined,
      documentationDeclared: item.links.documentation_declared || undefined,
      sourceManifest: item.links.source_manifest,
      readme: item.links.readme || undefined,
      crateDocsSource: item.links.crate_docs_source || undefined,
      accessNote: item.links.access_note,
    },
    update: {
      method: item.last_update_evidence.method,
      sha: item.last_update_evidence.sha,
      date: item.last_update_evidence.date,
      title: item.last_update_evidence.title,
      url: item.last_update_evidence.url,
      caveat: item.last_update_evidence.caveat,
    },
    registry: published ? {
      version: published.version,
      downloads: published.downloads_total,
      downloads90d: published.downloads_90d,
      updatedAt: published.updated_at,
      url: published.crates_io_url,
      docs: published.documentation_url || `https://docs.rs/${published.name}`,
      repository: published.repository_url || undefined,
      homepage: published.homepage_url || undefined,
    } : undefined,
  };
});

const domains = catalog.taxonomy.architectural_domains.map((name) => ({ name, count: items.filter((item) => item.domain === name).length }));

export default async function LibrariesPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  const params = await searchParams;
  const initialDomain = domains.some((entry) => entry.name === params.domain) ? params.domain : "";
  return (
    <>
      <Header current="libraries" />
      <main id="main">
        <section className="route-hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap route-hero-grid">
            <div><span className="eyebrow">Audited system atlas · July 16, 2026</span><h1>Every library. <em>One legible system.</em></h1><p className="lede">A complete map of the private Libraries monorepo: 97 unique packages across 13 domains, each with scope, capabilities, dependency edges, maturity evidence, publication state, and known limits.</p></div>
            <aside className="route-card"><small>CATALOG / COMPLETE</small><strong>97 package records</strong><p>59 root · 34 AiDENs · 3 poly-kv · 1 TypeScript. Nested duplicate declarations are counted once.</p><a href="/data/library-catalog.json" download>Download complete JSON ↓</a></aside>
          </div>
        </section>
        <LibraryCatalog items={items} domains={domains} initialDomain={initialDomain} />
        <section className="section paper"><div className="wrap method-grid"><div><span className="kicker">03 · COMPLETENESS CONTRACT</span><h2>Detailed does not mean overclaimed.</h2><p>This is a point-in-time public metadata catalog audited from a private repository. Missing READMEs, version divergence, registry uncertainty, and incomplete targets stay visible.</p></div><ul><li>All 59 root members are represented.</li><li>All 34 nested AiDENs packages and three poly-kv packages are represented.</li><li>Nested Primitives declarations duplicate root entries and are not double-counted.</li><li>Exact crates.io matches use only the RecursiveIntell owner inventory; two unrelated name collisions are explicitly excluded.</li><li>Eleven current publish=false packages retain their separate historical registry evidence.</li><li>Private source links remain access-controlled; no private source is republished here.</li></ul></div></section>
      </main>
      <Footer />
    </>
  );
}
