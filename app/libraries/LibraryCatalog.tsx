"use client";

import { useMemo, useRef, useState } from "react";

export type PublicationState = "owned-registry" | "historical-disabled" | "disabled-unpublished" | "npm-unverified" | "unverified";

export type LibraryItem = {
  id: string;
  name: string;
  path: string;
  ecosystem: string;
  version: string;
  description: string;
  scope: string;
  domain: string;
  workspace: string;
  classification: string;
  license: string;
  maturity: string;
  capabilities: string[];
  dependencies: string[];
  features: { name: string; enables: string[] }[];
  signals: string[];
  limitations: string[];
  shape: {
    libraryTarget: boolean;
    binaryTarget: boolean;
    readmePresent: boolean;
    manifestPresent: boolean;
  };
  publication: {
    manifestPublish: boolean | null;
    cargoPublishAllowed: boolean | null;
    note: string;
    state: PublicationState;
    label: string;
  };
  links: {
    repositoryDeclared?: string;
    homepageDeclared?: string;
    documentationDeclared?: string;
    sourceManifest: string;
    readme?: string;
    crateDocsSource?: string;
    accessNote: string;
  };
  update: {
    method: string;
    sha: string;
    date: string;
    title: string;
    url: string;
    caveat: string;
  };
  registry?: {
    version: string;
    downloads: number;
    downloads90d: number;
    updatedAt: string;
    url: string;
    docs: string;
    repository?: string;
    homepage?: string;
  };
};

const publicationOptions: { value: PublicationState; label: string }[] = [
  { value: "owned-registry", label: "Owned registry release" },
  { value: "historical-disabled", label: "Historical · now disabled" },
  { value: "disabled-unpublished", label: "Current publish=false" },
  { value: "npm-unverified", label: "npm status unverified" },
  { value: "unverified", label: "Registry ownership unverified" },
];

const exact = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function label(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slug(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function formatDate(value: string) {
  const parsed = new Date(value);
  return Number.isFinite(parsed.valueOf()) ? dateFormatter.format(parsed) : "Date unavailable";
}

function uniqueLinks(item: LibraryItem) {
  const candidates = [
    item.registry && { label: "crates.io", href: item.registry.url },
    item.registry && { label: "docs.rs", href: item.registry.docs },
    item.links.readme && { label: "Package README", href: item.links.readme },
    { label: "Package manifest", href: item.links.sourceManifest },
    item.links.crateDocsSource && { label: "Crate docs source", href: item.links.crateDocsSource },
    item.links.documentationDeclared && { label: "Declared documentation", href: item.links.documentationDeclared },
    item.links.repositoryDeclared && { label: "Declared repository", href: item.links.repositoryDeclared },
    item.links.homepageDeclared && { label: "Declared homepage", href: item.links.homepageDeclared },
    item.registry?.repository && { label: "Registry repository", href: item.registry.repository },
    item.registry?.homepage && { label: "Registry homepage", href: item.registry.homepage },
  ].filter((entry): entry is { label: string; href: string } => Boolean(entry));
  const seen = new Set<string>();
  return candidates.filter((entry) => {
    if (seen.has(entry.href)) return false;
    seen.add(entry.href);
    return true;
  });
}

function EvidenceList({ values, empty }: { values: string[]; empty: string }) {
  return values.length ? <ul>{values.map((value, index) => <li key={`${value}-${index}`}>{value}</li>)}</ul> : <p>{empty}</p>;
}

export default function LibraryCatalog({ items, domains, initialDomain = "" }: { items: LibraryItem[]; domains: { name: string; count: number }[]; initialDomain?: string }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState(initialDomain);
  const [workspace, setWorkspace] = useState("");
  const [maturity, setMaturity] = useState("");
  const [publication, setPublication] = useState("");
  const [selected, setSelected] = useState<LibraryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const workspaces = useMemo(() => [...new Set(items.map((item) => item.workspace))].map((name) => ({ name, count: items.filter((item) => item.workspace === name).length })), [items]);
  const maturities = useMemo(() => [...new Set(items.map((item) => item.maturity))].sort().map((name) => ({ name, count: items.filter((item) => item.maturity === name).length })), [items]);
  const publicationStates = useMemo(() => publicationOptions.map((entry) => ({ ...entry, count: items.filter((item) => item.publication.state === entry.value).length })).filter((entry) => entry.count > 0), [items]);
  const visible = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const haystack = [
        item.name, item.description, item.scope, item.domain, item.workspace, item.ecosystem,
        item.classification, item.publication.label, item.publication.note, item.update.title,
        ...item.capabilities, ...item.dependencies, ...item.signals, ...item.limitations,
      ].join(" ").toLowerCase();
      return (!terms.length || terms.every((term) => haystack.includes(term)))
        && (!domain || item.domain === domain)
        && (!workspace || item.workspace === workspace)
        && (!maturity || item.maturity === maturity)
        && (!publication || item.publication.state === publication);
    });
  }, [domain, items, maturity, publication, query, workspace]);

  const sourceLinks = selected ? uniqueLinks(selected) : [];

  function chooseDomain(value: string) {
    setDomain((current) => current === value ? "" : value);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  function clearFilters() {
    setQuery("");
    setDomain("");
    setWorkspace("");
    setMaturity("");
    setPublication("");
  }

  function openRecord(item: LibraryItem, opener: HTMLButtonElement) {
    setSelected(item);
    openerRef.current = opener;
    requestAnimationFrame(() => {
      if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
    });
  }

  function closeRecord() {
    dialogRef.current?.close();
  }

  function handleClosed() {
    setSelected(null);
    openerRef.current?.focus({ preventScroll: true });
    openerRef.current = null;
  }

  return (
    <>
      <section className="section paper">
        <div className="wrap">
          <div className="section-head"><div><span className="kicker">01 · SYSTEM TOPOLOGY</span><h2>Thirteen domains, not a crate dump.</h2></div><p>Every package is assigned an architectural responsibility. Choose a domain to carry that exact scope into the index.</p></div>
          <div className="domain-map">{domains.map((entry, index) => <button key={entry.name} type="button" aria-pressed={domain === entry.name} onClick={() => chooseDomain(entry.name)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{entry.count}</strong><b>{entry.name}</b></button>)}</div>
        </div>
      </section>

      <section className="catalog-shell" id="catalog">
        <div className="wrap">
          <div className="section-head"><div><span className="kicker">02 · EXHAUSTIVE PACKAGE INDEX</span><h2>Search the entire substrate.</h2></div><p>Search names, responsibilities, evidence, capabilities, and sibling dependencies. Open a record for its complete audited contract.</p></div>
          <form className="catalog-controls" role="search" onSubmit={(event) => event.preventDefault()}>
            <label><span>Search packages or capabilities</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. receipts, bitemporal, GPU…" /></label>
            <label><span>Domain</span><select value={domain} onChange={(event) => setDomain(event.target.value)}><option value="">All 13 domains</option>{domains.map((entry) => <option key={entry.name} value={entry.name}>{entry.name} · {entry.count}</option>)}</select></label>
            <label><span>Workspace</span><select value={workspace} onChange={(event) => setWorkspace(event.target.value)}><option value="">All workspaces</option>{workspaces.map((entry) => <option key={entry.name} value={entry.name}>{entry.name === "excluded-non-rust" ? "TypeScript" : label(entry.name)} · {entry.count}</option>)}</select></label>
            <label><span>Maturity evidence</span><select value={maturity} onChange={(event) => setMaturity(event.target.value)}><option value="">All maturity states</option>{maturities.map((entry) => <option key={entry.name} value={entry.name}>{label(entry.name)} · {entry.count}</option>)}</select></label>
            <label><span>Publication state</span><select value={publication} onChange={(event) => setPublication(event.target.value)}><option value="">All publication states</option>{publicationStates.map((entry) => <option key={entry.value} value={entry.value}>{entry.label} · {entry.count}</option>)}</select></label>
            <button type="button" onClick={clearFilters}>Clear all</button>
          </form>
          <div className="catalog-count"><span role="status" aria-live="polite">Showing {visible.length} of {items.length} packages</span><span>Audited branch p32-schema-compat · 011027f77fc7</span></div>
          <div className="library-list">{visible.map((item) => (
            <article className="library-card" key={item.id} id={`library-${slug(item.name)}`}>
              <div className="library-main">
                <div className="library-meta"><span>{item.workspace === "root" ? "Root workspace" : item.workspace}</span><span>{item.domain}</span></div>
                <h2><button className="library-title-button" type="button" aria-haspopup="dialog" aria-controls="library-dialog" onClick={(event) => openRecord(item, event.currentTarget)}>{item.name}</button></h2>
                <p>{item.description || item.scope}</p>
                <div className="chips">{item.capabilities.slice(0, 4).map((capability) => <span key={capability}>{capability}</span>)}</div>
              </div>
              <div className="library-status">
                <span className="badge">{label(item.maturity)}</span><b>{item.ecosystem} · v{item.version}</b>
                <small className={item.publication.state === "historical-disabled" ? "publication-caution" : undefined}>{item.publication.label}</small>
                <button className="library-record-button" type="button" aria-haspopup="dialog" aria-controls="library-dialog" onClick={(event) => openRecord(item, event.currentTarget)}>Full package record <span aria-hidden="true">→</span></button>
              </div>
            </article>
          ))}</div>
          {!visible.length && <div className="catalog-empty"><h2>No package matches those filters.</h2><p>Clear a filter or search for a broader capability.</p><button type="button" onClick={clearFilters}>Clear all filters</button></div>}
        </div>
      </section>

      <dialog ref={dialogRef} id="library-dialog" className="library-dialog" aria-labelledby="library-dialog-title" onClose={handleClosed} onClick={(event) => { if (event.target === event.currentTarget) closeRecord(); }}>
        <div className="library-dialog-shell">
          <header><div><small>{selected ? `${selected.workspace} / ${selected.domain}` : "Audited package record"}</small><h2 id="library-dialog-title">{selected?.name || "Loading record"}</h2></div><button type="button" onClick={closeRecord} aria-label="Close package record">Close <span aria-hidden="true">×</span></button></header>
          {selected && <div className="library-dialog-body"><div className="detail-grid">
            <section className="detail-wide"><small>Documented scope</small><p>{selected.scope}</p></section>
            <section><small>Package contract</small><p><code>{selected.path}</code><br />{label(selected.classification)} · {selected.license}<br />Workspace v{selected.version}</p><ul className="target-list"><li>{selected.shape.libraryTarget ? "Library target present" : "No library target found"}</li><li>{selected.shape.binaryTarget ? "Binary target present" : "No binary target found"}</li><li>{selected.shape.readmePresent ? "Package README present" : "No package README found"}</li><li>{selected.shape.manifestPresent ? "Manifest audited" : "Manifest not found"}</li></ul></section>
            <section><small>Publication state</small><p><b>{selected.publication.label}</b><br />{selected.publication.manifestPublish === false ? "Current manifest explicitly sets publish=false." : selected.ecosystem.startsWith("Rust") ? "Current manifest does not set publish=false." : "This package uses npm metadata, not Cargo publication controls."}</p><p>{selected.publication.note}</p>{selected.registry ? <p><a href={selected.registry.url} target="_blank" rel="noreferrer">Owned crates.io record v{selected.registry.version} ↗</a><br />{exact.format(selected.registry.downloads)} lifetime · {exact.format(selected.registry.downloads90d)} in 90 days<br />Registry updated {formatDate(selected.registry.updatedAt)}</p> : <p>No exact RecursiveIntell-owned registry record is attached to this package.</p>}</section>
            <section><small>Capabilities</small><EvidenceList values={selected.capabilities} empty="No capability list was recoverable." /></section>
            <section><small>Sibling dependencies</small><EvidenceList values={selected.dependencies} empty="No direct catalog dependency declared." /></section>
            <section><small>Feature groups</small>{selected.features.length ? <ul>{selected.features.map((value) => <li key={value.name}><b>{value.name}</b>: {value.enables.join(", ") || "marker feature"}</li>)}</ul> : <p>{selected.ecosystem.startsWith("Rust") ? "No named Cargo feature groups." : "Cargo feature groups do not apply to this package."}</p>}</section>
            <section><small>Maturity evidence</small><p><b>{label(selected.maturity)}</b></p><EvidenceList values={selected.signals} empty="No positive maturity signal was recorded." /></section>
            <section><small>Known limits</small><EvidenceList values={selected.limitations} empty="No package-specific limitation was recorded; this is not a readiness or correctness guarantee." /></section>
            <section><small>Update evidence</small><p><b>{selected.update.title}</b><br />{formatDate(selected.update.date)} · <code>{selected.update.sha.slice(0, 12)}</code><br />{selected.update.method}</p><p>{selected.update.caveat}</p><a href={selected.update.url} target="_blank" rel="noreferrer">Inspect matched commit ↗</a></section>
            <section className="detail-wide"><small>Source + documentation</small><nav className="library-links" aria-label={`${selected.name} source and documentation`}>{sourceLinks.map((entry) => <a key={`${entry.label}-${entry.href}`} href={entry.href} target="_blank" rel="noreferrer">{entry.label} ↗</a>)}</nav><p>{selected.links.accessNote}</p></section>
          </div></div>}
        </div>
      </dialog>
    </>
  );
}
