import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import {
  catalogAudit,
  catalogRecords,
  concise,
  domainSummaries,
  getDomainBySlug,
  getDomainRecords,
  getLibraryByName,
  humanize,
  slugify,
} from "../../data/catalog";
import styles from "./domain.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return domainSummaries.map((domain) => ({ slug: domain.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const domain = getDomainBySlug(slug);
  if (!domain) return { title: "Domain Not Found — RecursiveIntell" };
  const description = concise(`${domain.count} audited RecursiveIntell packages in ${domain.name}, with recorded capabilities, dependency boundaries, publication evidence, and maturity signals.`);
  const url = `/domains/${slug}`;
  const image = `/api/og?title=${encodeURIComponent(domain.name)}&kicker=${encodeURIComponent(`${domain.count} PACKAGE ARCHITECTURE DOMAIN`)}&detail=${encodeURIComponent(`${domain.dependencyEdges} sibling edges · ${domain.registryPackages} registry-matched`)}&accent=violet`;
  return {
    title: `${domain.name} — Architecture Domain | RecursiveIntell`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${domain.name} · RecursiveIntell Architecture Atlas`,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${domain.name} architecture domain` }],
    },
    twitter: { card: "summary_large_image", title: `${domain.name} · RecursiveIntell`, description, images: [image] },
  };
}

function distribution(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]));
}

export default async function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const domain = getDomainBySlug(slug);
  if (!domain) notFound();

  const records = getDomainRecords(domain.name);
  const capabilities = [...new Set(records.flatMap((record) => record.main_capabilities))];
  const maturity = distribution(records.map((record) => record.maturity_evidence.status));
  const publication = distribution(records.map((record) => record.publication.state_label));
  const internalEdges = records.flatMap((record) => record.sibling_dependencies.map((name) => ({ from: record, to: getLibraryByName(name) })))
    .filter((edge) => edge.to?.architectural_domain === domain.name);
  const outboundEdges = records.flatMap((record) => record.sibling_dependencies.map((name) => ({ from: record, to: getLibraryByName(name) })))
    .filter((edge) => edge.to && edge.to.architectural_domain !== domain.name);
  const inboundEdges = catalogRecords
    .filter((record) => record.architectural_domain !== domain.name)
    .flatMap((record) => record.sibling_dependencies.map((name) => ({ from: record, to: getLibraryByName(name) })))
    .filter((edge) => edge.to?.architectural_domain === domain.name);
  const limitCount = records.reduce((total, record) => total + record.maturity_evidence.limitations.length, 0);

  return (
    <>
      <Header current="libraries" />
      <main id="main" className={styles.domainPage}>
        <section className={styles.hero}>
          <div className={styles.heroMesh} aria-hidden="true" />
          <div className={styles.wrap}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/">RecursiveIntell</Link><span aria-hidden="true">/</span>
              <Link href="/libraries">Architecture domains</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{domain.name}</span>
            </nav>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>Architecture domain · {String(domainSummaries.findIndex((entry) => entry.slug === slug) + 1).padStart(2, "0")} / {domainSummaries.length}</span>
                <h1>{domain.name}</h1>
                <p>The catalog assigns {domain.count} packages to this responsibility boundary. This page derives its vocabulary, topology, publication state, and maturity profile directly from those audited records.</p>
                <div className={styles.heroActions}><a href="#packages">Inspect {domain.count} packages <span>↓</span></a><Link href="/libraries">Return to complete atlas <span>↗</span></Link></div>
              </div>
              <aside className={styles.domainInstrument}>
                <header><span>DOMAIN / SIGNAL PANEL</span><span>{slug}</span></header>
                <div className={styles.instrumentCore} aria-hidden="true"><i /><i /><i /><strong>{domain.count}</strong><span>PACKAGES</span></div>
                <dl>
                  <div><dt>Capability statements</dt><dd>{capabilities.length}</dd></div>
                  <div><dt>Internal edges</dt><dd>{internalEdges.length}</dd></div>
                  <div><dt>Cross-domain out</dt><dd>{outboundEdges.length}</dd></div>
                  <div><dt>Cross-domain in</dt><dd>{inboundEdges.length}</dd></div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.profileSection} aria-labelledby="profile-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>01 · Domain profile</span><h2 id="profile-heading">The evidence distribution.</h2></div>
              <p>Counts expose what the catalog actually contains. They do not convert package metadata into production-readiness or quality claims.</p>
            </div>
            <div className={styles.profileGrid}>
              <section><header><span>Maturity evidence</span><b>{maturity.length} states</b></header><div className={styles.barList}>{maturity.map(([label, count]) => <div key={label}><span><b>{humanize(label)}</b><em>{count}</em></span><i><u style={{ width: `${(count / records.length) * 100}%` }} /></i></div>)}</div></section>
              <section><header><span>Publication evidence</span><b>{publication.length} states</b></header><div className={styles.barList}>{publication.map(([label, count]) => <div key={label}><span><b>{label}</b><em>{count}</em></span><i><u style={{ width: `${(count / records.length) * 100}%` }} /></i></div>)}</div></section>
              <section className={styles.limitSummary}><header><span>Known limitation entries</span><b>Catalog disclosure</b></header><strong>{limitCount}</strong><p>{limitCount ? `${limitCount} package-specific limitation entries remain visible across this domain.` : "No package-specific limitation was recorded here; that absence is not proof of readiness or zero risk."}</p></section>
            </div>
          </div>
        </section>

        <section className={styles.vocabularySection} aria-labelledby="vocabulary-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>02 · Capability vocabulary</span><h2 id="vocabulary-heading">What its records describe.</h2></div>
              <p>{capabilities.length} unique capability statements are attached to packages in this domain. The language below is catalog evidence, preserved without expanding the claim.</p>
            </div>
            <ol className={styles.vocabularyGrid}>{capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span><p>{capability}</p></li>)}</ol>
          </div>
        </section>

        <section className={styles.topologySection} aria-labelledby="boundary-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>03 · Boundary topology</span><h2 id="boundary-heading">How the domain connects.</h2></div>
              <p>Edges are derived from sibling dependency declarations. Cross-domain traffic describes manifest topology, not runtime call direction, frequency, or activation.</p>
            </div>
            <div className={styles.edgeGrid}>
              <section><header><span>Internal</span><strong>{internalEdges.length}</strong></header>{internalEdges.length ? <ul>{internalEdges.slice(0, 16).map((edge, index) => <li key={`${edge.from.id}-${edge.to?.id}-${index}`}><Link href={`/libraries/${slugify(edge.from.package_name)}`}>{edge.from.package_name}</Link><span>→</span><Link href={`/libraries/${slugify(edge.to!.package_name)}`}>{edge.to!.package_name}</Link></li>)}</ul> : <p>No within-domain sibling edge was recorded.</p>}{internalEdges.length > 16 && <small>{internalEdges.length - 16} additional internal edges are available in the package records.</small>}</section>
              <section><header><span>Outbound</span><strong>{outboundEdges.length}</strong></header>{outboundEdges.length ? <ul>{outboundEdges.slice(0, 16).map((edge, index) => <li key={`${edge.from.id}-${edge.to?.id}-${index}`}><Link href={`/libraries/${slugify(edge.from.package_name)}`}>{edge.from.package_name}</Link><span>→</span><Link href={`/domains/${slugify(edge.to!.architectural_domain)}`}>{edge.to!.architectural_domain}</Link></li>)}</ul> : <p>No cross-domain outgoing sibling edge was recorded.</p>}{outboundEdges.length > 16 && <small>{outboundEdges.length - 16} additional outbound edges are available in the package records.</small>}</section>
              <section><header><span>Inbound</span><strong>{inboundEdges.length}</strong></header>{inboundEdges.length ? <ul>{inboundEdges.slice(0, 16).map((edge, index) => <li key={`${edge.from.id}-${edge.to?.id}-${index}`}><Link href={`/domains/${slugify(edge.from.architectural_domain)}`}>{edge.from.architectural_domain}</Link><span>→</span><Link href={`/libraries/${slugify(edge.to!.package_name)}`}>{edge.to!.package_name}</Link></li>)}</ul> : <p>No cross-domain incoming sibling edge was derived.</p>}{inboundEdges.length > 16 && <small>{inboundEdges.length - 16} additional inbound edges are available in the package records.</small>}</section>
            </div>
          </div>
        </section>

        <section className={styles.packageSection} id="packages" aria-labelledby="packages-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div><span className={styles.kicker}>04 · Permanent records</span><h2 id="packages-heading">Every package in the domain.</h2></div>
              <p>Each record has a stable URL with its complete catalog scope, capabilities, targets, features, relationships, registry evidence, update trail, and known limits.</p>
            </div>
            <div className={styles.packageList}>{records.map((record, index) => <article key={record.id}>
              <div className={styles.packageIndex}>{String(index + 1).padStart(2, "0")}</div>
              <div className={styles.packageCopy}><div><span>{record.ecosystem} · v{record.version}</span><span>{humanize(record.maturity_evidence.status)}</span></div><h3><Link href={`/libraries/${slugify(record.package_name)}`}>{record.package_name}</Link></h3><p>{record.description || record.documented_scope || "No package description was recovered."}</p><div className={styles.chips}>{record.main_capabilities.slice(0, 3).map((capability) => <span key={capability}>{capability}</span>)}</div></div>
              <aside><span>{record.publication.state_label}</span><dl><div><dt>Direct edges</dt><dd>{record.sibling_dependencies.length}</dd></div><div><dt>Features</dt><dd>{record.feature_groups.length}</dd></div></dl><Link href={`/libraries/${slugify(record.package_name)}`}>Open record <span aria-hidden="true">↗</span></Link></aside>
            </article>)}</div>
          </div>
        </section>

        <section className={styles.methodSection}>
          <div className={styles.wrap}><div className={styles.methodStamp}><span>DOMAIN VIEW / DERIVED FROM CATALOG {catalogAudit.schemaVersion}</span><p>This route reorganizes audited package metadata. It does not add implementation claims or expose access-controlled source.</p><code>{catalogAudit.repository.default_branch} / {catalogAudit.repository.audited_head.sha}</code></div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
