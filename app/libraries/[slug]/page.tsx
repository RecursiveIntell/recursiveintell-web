import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import {
  catalogAudit,
  catalogRecords,
  concise,
  getCatalogLinks,
  getLibraryBySlug,
  getRelationshipSets,
  humanize,
  slugify,
  type CatalogRecord,
} from "../../data/catalog";
import styles from "./record.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogRecords.map((record) => ({ slug: slugify(record.package_name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = getLibraryBySlug(slug);
  if (!record) return { title: "Package Not Found — RecursiveIntell" };
  const description = concise(record.description || record.documented_scope || `Audited package record for ${record.package_name}.`);
  const url = `/libraries/${slug}`;
  const image = `/api/og?title=${encodeURIComponent(record.package_name)}&kicker=${encodeURIComponent(record.architectural_domain)}&detail=${encodeURIComponent(`${record.ecosystem} · v${record.version} · ${humanize(record.maturity_evidence.status)}`)}&accent=cyan`;
  return {
    title: `${record.package_name} — Library Record | RecursiveIntell`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${record.package_name} · RecursiveIntell Library Atlas`,
      description,
      url,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: `${record.package_name} package record` }],
    },
    twitter: { card: "summary_large_image", title: `${record.package_name} · RecursiveIntell Library Atlas`, description, images: [image] },
  };
}

const number = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isFinite(parsed.valueOf()) ? date.format(parsed) : "Date unavailable";
}

function truth(value: boolean | null) {
  if (value === null) return "Not applicable / not established";
  return value ? "Yes" : "No";
}

function EvidenceList({ values, empty }: { values: string[]; empty: string }) {
  return values.length
    ? <ul className={styles.evidenceList}>{values.map((value, index) => <li key={`${value}-${index}`}>{value}</li>)}</ul>
    : <p className={styles.emptyCopy}>{empty}</p>;
}

function RelationshipGraph({ record }: { record: CatalogRecord }) {
  const relationships = getRelationshipSets(record);
  const nodes = [
    ...relationships.dependencies.map((item) => ({ item, kind: "dependency" as const })),
    ...relationships.dependents.map((item) => ({ item, kind: "dependent" as const })),
    ...relationships.related.map((item) => ({ item, kind: "related" as const })),
  ].filter((node, index, all) => all.findIndex((candidate) => candidate.item.package_name === node.item.package_name) === index);
  const shown = nodes.slice(0, 12);
  const centerX = 500;
  const centerY = 250;
  const radiusX = 370;
  const radiusY = 175;

  return (
    <div className={styles.graphFrame} tabIndex={0} role="region" aria-label="Scrollable package relationship diagram">
      <svg className={styles.graph} viewBox="0 0 1000 500" role="img" aria-labelledby="topology-title topology-description">
        <title id="topology-title">{`Package relationships for ${record.package_name}`}</title>
        <desc id="topology-description">
          {shown.length
            ? `${shown.length} of ${nodes.length} recorded dependency, dependent, or related package connections are drawn. Complete text lists follow the diagram.`
            : "No catalog relationship is drawn because the audit recorded no direct sibling dependency, dependent, or related package connection."}
        </desc>
        <defs>
          <linearGradient id="node-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#123648" /><stop offset="1" stopColor="#071722" /></linearGradient>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g className={styles.graphGrid} aria-hidden="true">
          {[100, 200, 300, 400].map((y) => <line key={`h-${y}`} x1="0" y1={y} x2="1000" y2={y} />)}
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500" />)}
        </g>
        {shown.map((node, index) => {
          const angle = (Math.PI * 2 * index) / Math.max(shown.length, 1) - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radiusX;
          const y = centerY + Math.sin(angle) * radiusY;
          return <line className={styles[node.kind]} key={`line-${node.item.id}`} x1={centerX} y1={centerY} x2={x} y2={y} />;
        })}
        <g className={styles.centerNode} filter="url(#node-glow)">
          <rect x="365" y="205" width="270" height="90" rx="2" />
          <text x="500" y="242" textAnchor="middle">FOCUS PACKAGE</text>
          <text className={styles.nodeName} x="500" y="270" textAnchor="middle">{record.package_name}</text>
        </g>
        {shown.map((node, index) => {
          const angle = (Math.PI * 2 * index) / Math.max(shown.length, 1) - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radiusX;
          const y = centerY + Math.sin(angle) * radiusY;
          const label = node.item.package_name.length > 23 ? `${node.item.package_name.slice(0, 22)}…` : node.item.package_name;
          return (
            <g className={`${styles.satelliteNode} ${styles[`${node.kind}Node`]}`} key={node.item.id} aria-hidden="true">
              <rect x={x - 93} y={y - 27} width="186" height="54" rx="2" />
              <text x={x} y={y - 5} textAnchor="middle">{node.kind.toUpperCase()}</text>
              <text className={styles.satelliteName} x={x} y={y + 14} textAnchor="middle">{label}</text>
            </g>
          );
        })}
      </svg>
      <div className={styles.graphLegend} aria-hidden="true">
        <span><i className={styles.dependencyKey} />Depends on</span>
        <span><i className={styles.dependentKey} />Used by</span>
        <span><i className={styles.relatedKey} />Related</span>
        {nodes.length > shown.length && <b>{shown.length} of {nodes.length} connections drawn · full lists below</b>}
      </div>
    </div>
  );
}

export default async function LibraryRecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = getLibraryBySlug(slug);
  if (!record) notFound();

  const relationships = getRelationshipSets(record);
  const links = getCatalogLinks(record);
  const registry = record.publication.registry;
  const scope = record.documented_scope || record.description || "No detailed scope statement was recovered by the catalog audit.";
  const hasLimits = record.maturity_evidence.limitations.length > 0;

  return (
    <>
      <Header current="libraries" />
      <main id="main" className={styles.recordPage}>
        <section className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.wrap}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/">RecursiveIntell</Link><span aria-hidden="true">/</span>
              <Link href="/libraries">Libraries</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{record.package_name}</span>
            </nav>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <div className={styles.coordinate}><span>{record.ecosystem}</span><span>{record.workspace.primary}</span><span>v{record.version}</span></div>
                <h1>{record.package_name}</h1>
                <p>{record.description || scope}</p>
                <div className={styles.heroActions}>
                  {registry && <a className={styles.primaryAction} href={registry.registry_url} target="_blank" rel="noreferrer">View verified registry record <span>↗</span></a>}
                  <a className={styles.secondaryAction} href="#topology">Inspect dependency lens <span>↓</span></a>
                </div>
              </div>
              <aside className={styles.identityCard}>
                <div className={styles.identityHead}><span>PACKAGE / EVIDENCE CARD</span><span>{record.id}</span></div>
                <div className={styles.identityMark} aria-hidden="true"><i /><i /><b>{String(record.main_capabilities.length).padStart(2, "0")}</b></div>
                <dl>
                  <div><dt>Domain</dt><dd><Link href={`/domains/${slugify(record.architectural_domain)}`}>{record.architectural_domain}</Link></dd></div>
                  <div><dt>Maturity evidence</dt><dd>{humanize(record.maturity_evidence.status)}</dd></div>
                  <div><dt>Publication</dt><dd>{record.publication.state_label}</dd></div>
                  <div><dt>Direct sibling edges</dt><dd>{record.sibling_dependencies.length}</dd></div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.scopeSection} aria-labelledby="scope-heading">
          <div className={styles.wrap}>
            <div className={styles.scopeLayout}>
              <div>
                <span className={styles.kicker}>01 · Documented scope</span>
                <h2 id="scope-heading">What this package says it does.</h2>
              </div>
              <blockquote>{scope}</blockquote>
            </div>
            <div className={styles.factGrid}>
              <article><small>Package identity</small><strong>{record.package_name}</strong><code>{record.path}</code><p>{record.id}</p></article>
              <article><small>Contract shape</small><strong>{humanize(record.package_shape.classification)}</strong><p>{record.package_shape.library_target ? "Library target" : "No library target"} · {record.package_shape.binary_target ? "binary target" : "no binary target"}</p></article>
              <article><small>Workspace position</small><strong>{humanize(record.workspace.primary)}</strong><p>{record.workspace.memberships.join(" · ")} · {record.workspace.is_root_member ? "root member" : "not a root member"}</p></article>
              <article><small>License declaration</small><strong>{record.license.value || "Not declared"}</strong><p>Evidence source: {record.license.source}</p></article>
            </div>
          </div>
        </section>

        <section className={styles.capabilitySection} aria-labelledby="capability-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>02 · Capability surface</span><h2 id="capability-heading">Recorded responsibilities.</h2></div>
              <p>These statements are preserved from package metadata and documentation recovered by the audit. They describe intended scope, not independent performance verification.</p>
            </div>
            <ol className={styles.capabilityGrid}>
              {record.main_capabilities.map((capability, index) => (
                <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span><p>{capability}</p></li>
              ))}
            </ol>
            {!record.main_capabilities.length && <p className={styles.emptyCopy}>No main capability list was recoverable.</p>}
          </div>
        </section>

        <section className={styles.topologySection} id="topology" aria-labelledby="topology-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>03 · Dependency lens</span><h2 id="topology-heading">Position in the system.</h2></div>
              <p>The graph distinguishes outgoing sibling dependencies, derived inbound dependents, and explicitly recorded related packages. Lines describe catalog relationships—not execution order or runtime activation.</p>
            </div>
            <RelationshipGraph record={record} />
            <div className={styles.relationshipColumns}>
              <section><small>Depends on · {relationships.dependencies.length}</small>{relationships.dependencies.length ? <ul>{relationships.dependencies.map((item) => <li key={item.id}><Link href={`/libraries/${slugify(item.package_name)}`}>{item.package_name}</Link><span>{item.architectural_domain}</span></li>)}</ul> : <p>No direct sibling dependency was declared.</p>}</section>
              <section><small>Used by · {relationships.dependents.length}</small>{relationships.dependents.length ? <ul>{relationships.dependents.map((item) => <li key={item.id}><Link href={`/libraries/${slugify(item.package_name)}`}>{item.package_name}</Link><span>{item.architectural_domain}</span></li>)}</ul> : <p>No inbound sibling dependency was derived from this catalog.</p>}</section>
              <section><small>Recorded as related · {relationships.related.length}</small>{relationships.related.length ? <ul>{relationships.related.map((item) => <li key={item.id}><Link href={`/libraries/${slugify(item.package_name)}`}>{item.package_name}</Link><span>{item.architectural_domain}</span></li>)}</ul> : <p>No additional related package was recorded.</p>}</section>
            </div>
          </div>
        </section>

        <section className={styles.contractSection} aria-labelledby="contract-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>04 · Package contract</span><h2 id="contract-heading">Features, targets, and workspace state.</h2></div>
              <p>Manifest-level facts remain separate from documentation claims and registry observations, keeping each evidence source legible.</p>
            </div>
            <div className={styles.contractGrid}>
              <section>
                <header><span>A / TARGETS</span><b>{record.package_shape.manifest_present ? "MANIFEST AUDITED" : "MANIFEST NOT FOUND"}</b></header>
                <dl className={styles.rowList}>
                  <div><dt>Library target</dt><dd>{truth(record.package_shape.library_target)}</dd></div>
                  <div><dt>Binary target</dt><dd>{truth(record.package_shape.binary_target)}</dd></div>
                  <div><dt>Package README</dt><dd>{truth(record.package_shape.readme_present)}</dd></div>
                  <div><dt>Root workspace member</dt><dd>{truth(record.workspace.is_root_member)}</dd></div>
                  <div><dt>Root default member</dt><dd>{truth(record.workspace.is_root_default_member)}</dd></div>
                  <div><dt>Excluded from root</dt><dd>{truth(record.workspace.is_excluded_from_root)}</dd></div>
                </dl>
              </section>
              <section>
                <header><span>B / FEATURE GROUPS</span><b>{record.feature_groups.length} RECORDED</b></header>
                {record.feature_groups.length ? <div className={styles.featureList}>{record.feature_groups.map((feature) => <article key={feature.name}><strong>{feature.name}</strong><p>{feature.enables.length ? feature.enables.join(" · ") : "Marker feature; no enabled item recorded."}</p></article>)}</div> : <p className={styles.panelEmpty}>{record.ecosystem.startsWith("Rust") ? "No named Cargo feature groups were recorded." : "Cargo feature groups do not apply to this package."}</p>}
              </section>
            </div>
          </div>
        </section>

        <section className={styles.publicationSection} aria-labelledby="publication-heading">
          <div className={styles.wrap}>
            <div className={styles.publicationLayout}>
              <div className={styles.publicationIntro}>
                <span className={styles.kicker}>05 · Publication evidence</span>
                <h2 id="publication-heading">{record.publication.state_label}.</h2>
                <p>{record.publication.interpretation}</p>
                <div className={styles.publicationFlags}>
                  <span>Evidence state key: <b>{record.publication.state_key}</b></span>
                  <span>Manifest publish: <b>{truth(record.publication.manifest_publish)}</b></span>
                  <span>Cargo publish allowed by default: <b>{truth(record.publication.cargo_publish_allowed_by_default)}</b></span>
                  <span>Registry history present: <b>{truth(record.publication.registry_history_present)}</b></span>
                  <span>Registry ownership verified: <b>{truth(record.publication.registry_ownership_verified)}</b></span>
                  <span>Exact-name registry match: <b>{truth(registry?.exact_name_match ?? null)}</b></span>
                </div>
                <p className={styles.publicationNote}>{record.publication.note}</p>
                {record.publication.collision_note && <p className={styles.collisionNote}>{record.publication.collision_note}</p>}
              </div>
              {registry ? (
                <aside className={styles.registryCard}>
                  <header><span>CRATES.IO / OBSERVED RECORD</span><a href={registry.registry_url} target="_blank" rel="noreferrer">Open ↗</a></header>
                  <div className={styles.registryHero}><small>CURRENT VERSION</small><strong>v{registry.version}</strong><span>{registry.yanked ? "Yanked" : "Not marked yanked"}</span></div>
                  <dl>
                    <div><dt>Lifetime downloads</dt><dd>{number.format(registry.downloads_total)}</dd></div>
                    <div><dt>90-day downloads</dt><dd>{number.format(registry.downloads_90d)}</dd></div>
                    <div><dt>Published versions</dt><dd>{registry.versions}</dd></div>
                    <div><dt>Max stable version</dt><dd>{registry.max_stable_version}</dd></div>
                    <div><dt>Created</dt><dd>{formatDate(registry.created_at)}</dd></div>
                    <div><dt>Updated</dt><dd>{formatDate(registry.updated_at)}</dd></div>
                  </dl>
                  {registry.description && <p>{registry.description}</p>}
                  <footer>{registry.registry} / {registry.name} · exact-name owner inventory: {registry.owner_inventory} · observed {formatDate(registry.observed_at)}</footer>
                </aside>
              ) : (
                <aside className={styles.noRegistry}>
                  <span>NO VERIFIED RECORD ATTACHED</span><strong>∅</strong><p>The audit did not attach an exact RecursiveIntell-owned registry release to this workspace record. This does not prove that no artifact exists elsewhere.</p>
                </aside>
              )}
            </div>
          </div>
        </section>

        <section className={styles.evidenceSection} aria-labelledby="evidence-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>06 · Maturity and limits</span><h2 id="evidence-heading">Signals with their boundaries intact.</h2></div>
              <p>Maturity is a catalog status supported by observed signals. It is not a security review, service-level commitment, correctness proof, or suitability determination.</p>
            </div>
            <div className={styles.evidenceGrid}>
              <section><header><span>Status</span><strong>{humanize(record.maturity_evidence.status)}</strong></header><EvidenceList values={record.maturity_evidence.signals} empty="No positive maturity signal was recorded." /></section>
              <section className={hasLimits ? styles.limitPanel : undefined}><header><span>Known limitations</span><strong>{record.maturity_evidence.limitations.length} recorded</strong></header><EvidenceList values={record.maturity_evidence.limitations} empty="No package-specific limitation was recorded. That absence is not evidence of readiness, correctness, or zero risk." /></section>
              <section><header><span>Update evidence</span><strong>{formatDate(record.last_update_evidence.date)}</strong></header><p><b>{record.last_update_evidence.title}</b></p><dl className={styles.updateList}><div><dt>Method</dt><dd>{record.last_update_evidence.method}</dd></div><div><dt>Matched SHA</dt><dd><code>{record.last_update_evidence.sha}</code></dd></div></dl><p>{record.last_update_evidence.caveat}</p><a href={record.last_update_evidence.url} target="_blank" rel="noreferrer">Inspect matched commit ↗</a></section>
            </div>
          </div>
        </section>

        <section className={styles.sourceSection} aria-labelledby="source-heading">
          <div className={styles.wrap}>
            <div className={styles.sourceLayout}>
              <div><span className={styles.kicker}>07 · Source trail</span><h2 id="source-heading">Continue the inspection.</h2><p>{record.links.access_note}</p></div>
              <nav className={styles.sourceLinks} aria-label={`${record.package_name} source and documentation links`}>
                {links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={`${link.label}-${link.href}`}><span>{link.kind}{link.accessControlled ? " · access-controlled" : ""}</span><strong>{link.label}</strong><b aria-hidden="true">↗</b></a>)}
              </nav>
            </div>
            <div className={styles.auditBoundary}>
              <span>ATLAS EVIDENCE BOUNDARY</span>
              <p>{catalogAudit.repository.source_policy}</p>
              <code>{catalogAudit.repository.default_branch} / {catalogAudit.repository.audited_head.sha}</code>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
