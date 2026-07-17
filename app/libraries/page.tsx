import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Footer, Header } from "../components";
import {
  catalogAudit,
  catalogRecords,
  catalogSummaries,
  domainSummaries,
} from "../data/catalog";
import LibraryCatalog from "./LibraryCatalog";
import styles from "./atlas.module.css";

export const metadata: Metadata = {
  title: "Library Atlas — 97 Audited Packages | RecursiveIntell",
  description: "Search 97 RecursiveIntell package records across 13 architectural domains, with capabilities, dependencies, maturity, publication evidence, and limitations.",
  alternates: { canonical: "/libraries" },
  openGraph: {
    title: "The RecursiveIntell Library Atlas",
    description: "97 audited package records. 13 architectural domains. One inspectable AI memory and trust substrate.",
    url: "/libraries",
    type: "website",
    images: [{ url: "/api/og?title=The%20Library%20Atlas&kicker=97%20PACKAGES%20%2F%2013%20DOMAINS&detail=Capability%20%C2%B7%20topology%20%C2%B7%20evidence%20%C2%B7%20limits&accent=violet", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "The RecursiveIntell Library Atlas", description: "97 audited package records across 13 architectural domains.", images: ["/api/og?title=The%20Library%20Atlas&kicker=97%20PACKAGES%20%2F%2013%20DOMAINS&detail=Capability%20%C2%B7%20topology%20%C2%B7%20evidence%20%C2%B7%20limits&accent=violet"] },
};

const exact = new Intl.NumberFormat("en-US");

export default function LibrariesPage() {
  const dependencyEdges = catalogRecords.reduce((total, record) => total + record.sibling_dependencies.length, 0);
  const capabilityStatements = catalogRecords.reduce((total, record) => total + record.main_capabilities.length, 0);
  const registryRecords = catalogRecords.filter((record) => record.publication.registry_ownership_verified).length;

  return (
    <>
      <Header current="libraries" />
      <main id="main" className={styles.atlasPage}>
        <section className={styles.hero} aria-labelledby="atlas-title">
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.wrap}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/">RecursiveIntell</Link><span aria-hidden="true">/</span><span aria-current="page">Library Atlas</span>
            </nav>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>Public metadata atlas · audit {catalogAudit.repository.audited_head.sha.slice(0, 10)}</span>
                <h1 id="atlas-title">Every component.<br /><em>Every boundary.</em></h1>
                <p>A permanent, searchable field guide to the package system behind RecursiveIntell—showing what each unit claims, how it connects, where evidence exists, and where the audit stops.</p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryAction} href="#catalog">Search all packages <span>↓</span></a>
                  <a className={styles.secondaryAction} href="/data/library-catalog.json" download>Download source data <span>↘</span></a>
                </div>
              </div>

              <aside className={styles.orbitPanel} aria-label={`Atlas summary: ${catalogSummaries.length} packages across ${domainSummaries.length} domains`}>
                <div className={styles.orbitHeader}><span>RI / SYSTEM ATLAS</span><span className={styles.signal}>AUDITED SNAPSHOT</span></div>
                <div className={styles.orbitVisual} aria-hidden="true">
                  <i className={styles.orbitOne} /><i className={styles.orbitTwo} /><i className={styles.orbitThree} />
                  {domainSummaries.map((domain, index) => <b key={domain.slug} style={{ "--index": index } as CSSProperties} />)}
                  <div><strong>{catalogSummaries.length}</strong><span>PACKAGES</span></div>
                </div>
                <dl className={styles.orbitStats}>
                  <div><dt>Domains</dt><dd>{domainSummaries.length}</dd></div>
                  <div><dt>Capability statements</dt><dd>{exact.format(capabilityStatements)}</dd></div>
                  <div><dt>Sibling dependency edges</dt><dd>{exact.format(dependencyEdges)}</dd></div>
                  <div><dt>Registry-matched records</dt><dd>{registryRecords}</dd></div>
                </dl>
                <p>Topology edges come from package manifests and include normal, target-specific, build, and development declarations. They do not imply runtime activation.</p>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.domainSection} aria-labelledby="domain-heading">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.kicker}>01 · Architectural domains</span>
                <h2 id="domain-heading">Explore responsibility,<br />not repository shape.</h2>
              </div>
              <p>Thirteen durable landing pages translate package inventory into architectural purpose. Each page exposes its members, dependency footprint, publication evidence, and recorded capabilities.</p>
            </div>
            <div className={styles.domainGrid}>
              {domainSummaries.map((domain, index) => (
                <Link href={`/domains/${domain.slug}`} className={styles.domainCard} key={domain.slug} prefetch={false}>
                  <span className={styles.domainNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.domainPulse} aria-hidden="true"><i /></span>
                  <strong>{domain.count}</strong>
                  <h3>{domain.name}</h3>
                  <p>{domain.dependencyEdges} declared sibling edges · {domain.registryPackages} registry-matched</p>
                  <b>Open domain <span aria-hidden="true">↗</span></b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <LibraryCatalog items={catalogSummaries} domains={domainSummaries} />

        <section className={styles.methodSection} aria-labelledby="method-heading">
          <div className={styles.wrap}>
            <div className={styles.methodLayout}>
              <div>
                <span className={styles.kicker}>03 · Evidence contract</span>
                <h2 id="method-heading">Detailed without pretending certainty.</h2>
              </div>
              <div className={styles.methodCopy}>
                <p>This atlas reports the public metadata recoverable from an audit of an access-controlled repository. A package record is an evidence map—not a certification of production readiness, security, correctness, or publication.</p>
                <ul>
                  <li><b>Coverage:</b> all {catalogAudit.counts.total_catalog_entries} unique records in the supplied catalog, including {catalogAudit.counts.unique_rust_packages} Rust packages and {catalogAudit.counts.non_rust_packages} non-Rust package.</li>
                  <li><b>Dependencies:</b> declared sibling edges, not a claim that each edge executes at runtime.</li>
                  <li><b>Publication:</b> registry claims require an exact package-name match in the observed RecursiveIntell owner inventory.</li>
                  <li><b>Freshness:</b> package update dates use repository commit search and may not equal the exact last path modification.</li>
                  <li><b>Source:</b> access-controlled source links remain protected; no implementation bodies are reproduced.</li>
                </ul>
                <div className={styles.auditStamp}>
                  <span>CATALOG GENERATED</span>
                  <time dateTime={catalogAudit.generatedAt}>{new Date(catalogAudit.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time>
                  <code>{catalogAudit.repository.default_branch} / {catalogAudit.repository.audited_head.sha.slice(0, 12)}</code>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
