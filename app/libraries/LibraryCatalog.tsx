"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogSummary, DomainSummary } from "../data/catalog";
import styles from "./atlas.module.css";

function humanize(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function LibraryCatalog({
  items,
  domains,
  initialDomain = "",
}: {
  items: CatalogSummary[];
  domains: DomainSummary[];
  initialDomain?: string;
}) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState(initialDomain);
  const [ecosystem, setEcosystem] = useState("");
  const [maturity, setMaturity] = useState("");
  const [publication, setPublication] = useState("");

  const options = useMemo(() => ({
    ecosystems: [...new Set(items.map((item) => item.ecosystem))].sort(),
    maturities: [...new Set(items.map((item) => item.maturity))].sort(),
    publications: [...new Map(items.map((item) => [item.publicationState, item.publicationLabel])).entries()]
      .sort(([, first], [, second]) => first.localeCompare(second)),
  }), [items]);

  const visible = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const searchText = [
        item.name,
        item.description,
        item.domain,
        item.ecosystem,
        item.workspace,
        item.maturity,
        item.publicationLabel,
        ...item.capabilities,
      ].join(" ").toLowerCase();
      return (!terms.length || terms.every((term) => searchText.includes(term)))
        && (!domain || item.domain === domain)
        && (!ecosystem || item.ecosystem === ecosystem)
        && (!maturity || item.maturity === maturity)
        && (!publication || item.publicationState === publication);
    });
  }, [domain, ecosystem, items, maturity, publication, query]);

  function clearFilters() {
    setQuery("");
    setDomain("");
    setEcosystem("");
    setMaturity("");
    setPublication("");
  }

  return (
    <section className={styles.catalogSection} id="catalog" aria-labelledby="catalog-heading">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.kicker}>02 · Permanent package index</span>
            <h2 id="catalog-heading">Find the exact substrate.</h2>
          </div>
          <p>Search package names, audited responsibilities, capabilities, maturity evidence, and publication state. Every result opens a permanent, shareable record.</p>
        </div>

        <form className={styles.controls} role="search" onSubmit={(event) => event.preventDefault()}>
          <label className={styles.searchControl}>
            <span>Search packages or capabilities</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try receipts, bitemporal, GPU…"
            />
          </label>
          <label>
            <span>Domain</span>
            <select value={domain} onChange={(event) => setDomain(event.target.value)}>
              <option value="">All 13 domains</option>
              {domains.map((entry) => <option key={entry.name} value={entry.name}>{entry.name} · {entry.count}</option>)}
            </select>
          </label>
          <label>
            <span>Ecosystem</span>
            <select value={ecosystem} onChange={(event) => setEcosystem(event.target.value)}>
              <option value="">All ecosystems</option>
              {options.ecosystems.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            <span>Maturity evidence</span>
            <select value={maturity} onChange={(event) => setMaturity(event.target.value)}>
              <option value="">Every state</option>
              {options.maturities.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
            </select>
          </label>
          <label>
            <span>Publication evidence</span>
            <select value={publication} onChange={(event) => setPublication(event.target.value)}>
              <option value="">Every state</option>
              {options.publications.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <button type="button" onClick={clearFilters}>Reset</button>
        </form>

        <div className={styles.resultBar}>
          <span role="status" aria-live="polite"><b>{visible.length}</b> of {items.length} package records</span>
          <span>One URL per package · public metadata only</span>
        </div>

        <div className={styles.packageGrid}>
          {visible.map((item, index) => (
            <article className={styles.packageCard} key={item.slug}>
              <div className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</div>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span>{item.ecosystem} · v{item.version}</span>
                  <Link href={`/domains/${item.domainSlug}`} prefetch={false}>{item.domain}</Link>
                </div>
                <h3><Link href={`/libraries/${item.slug}`} prefetch={false}>{item.name}</Link></h3>
                <p>{item.description}</p>
                <div className={styles.capabilityList} aria-label="Highlighted capabilities">
                  {item.capabilities.slice(0, 3).map((capability) => <span key={capability}>{capability}</span>)}
                </div>
              </div>
              <aside className={styles.cardEvidence}>
                <span className={styles.state}>{humanize(item.maturity)}</span>
                <dl>
                  <div><dt>Direct edges</dt><dd>{item.dependencyCount}</dd></div>
                  <div><dt>Related</dt><dd>{item.relatedCount}</dd></div>
                  {item.registryDownloads !== undefined && <div><dt>Registry downloads</dt><dd>{item.registryDownloads.toLocaleString("en-US")}</dd></div>}
                </dl>
                <small>{item.publicationLabel}</small>
                <Link className={styles.recordLink} href={`/libraries/${item.slug}`} prefetch={false} aria-label={`Open the complete ${item.name} package record`}>
                  Inspect record <span aria-hidden="true">↗</span>
                </Link>
              </aside>
            </article>
          ))}
        </div>

        {!visible.length && (
          <div className={styles.emptyState}>
            <span>∅</span>
            <h3>No audited record matches that combination.</h3>
            <p>Broaden the search or reset the evidence filters.</p>
            <button type="button" onClick={clearFilters}>Reset filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
