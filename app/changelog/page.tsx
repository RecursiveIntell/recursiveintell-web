import type { Metadata } from "next";
import Link from "next/link";
import crateData from "../data/published-crates.json";
import { Footer, Header } from "../components";
import { ObservatoryHero, SectionHeader } from "../proof/Observatory";
import styles from "../proof/observatory.module.css";

const ogImage = "/api/og?title=Every%20release%20leaves%20a%20signal.&kicker=CHANGELOG%20%2F%20PUBLIC%20REGISTRY%20EVIDENCE&detail=Timestamped%20snapshot%20%C2%B7%20stable%20RSS%20feed&accent=green";

export const metadata: Metadata = {
  title: "Public Release Changelog — RecursiveIntell",
  description: "A timestamped update feed derived from the audited RecursiveIntell crates.io owner snapshot.",
  alternates: { canonical: "/changelog", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { title: "RecursiveIntell Public Release Changelog", description: "Recent public crate updates with source scope and observation time kept visible.", url: "/changelog", type: "website", images: [{ url: ogImage, width: 1200, height: 630, alt: "RecursiveIntell public release signal" }] },
  twitter: { card: "summary_large_image", title: "RecursiveIntell Changelog", description: "Timestamped public crate updates from a named registry snapshot.", images: [ogImage] },
};

function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit", timeZoneName: "short" } : {}),
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function ChangelogPage() {
  const items = [...crateData.crates].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 18);
  const summary = crateData.summary;

  return (
    <div className={styles.page}>
      <Header current="changelog" />
      <main id="main">
        <ObservatoryHero
          eyebrow="Changelog / public registry evidence"
          title="Every release leaves a"
          accent="signal."
          lede="A chronological view of recent public crate records in the audited RecursiveIntell owner inventory. Every item keeps its registry link and update timestamp attached."
          actions={<><a className={styles.primary} href="/feed.xml" data-event="feed_opened" data-event-context="changelog_hero">Subscribe via RSS <span>↗</span></a><Link className={styles.secondary} href="/activity" data-event="activity_opened" data-event-context="changelog_hero">Open activity telemetry <span>→</span></Link></>}
          panelLabel="Source / crates.io snapshot"
          panelState="Point in time · not live"
          panelTitle={<>Observed at<br /><span className={styles.accent}>{formatDate(crateData.observed_at, true)}</span></>}
          panelCopy={<p>The registry snapshot is authoritative only for what the source returned at its observation time. It is not continuously refreshed by this page and is not editorial release notes.</p>}
          panelFoot="Owner inventory / RecursiveIntell"
        />

        <section className={styles.section}>
          <div className={styles.wrap}>
            <SectionHeader label="01 / Snapshot footprint" title={<>Activity with its <span className={styles.accent}>denominator.</span></>} copy="Counts summarize the full point-in-time owner inventory. They establish registry activity—not usage quality, engineering productivity, or unique code changes." />
            <div className={styles.releaseSummary}>
              <div><span className={styles.cardLabel}>Owned records</span><strong>{summary.published_crates}</strong><span>published crates in the observed owner inventory</span></div>
              <div><span className={styles.cardLabel}>24-hour window</span><strong>{summary.updated_24h}</strong><span>crate records updated before the snapshot</span></div>
              <div><span className={styles.cardLabel}>7-day window</span><strong>{summary.updated_7d}</strong><span>crate records updated before the snapshot</span></div>
              <div><span className={styles.cardLabel}>30-day window</span><strong>{summary.updated_30d}</strong><span>crate records updated before the snapshot</span></div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionInk}`}>
          <div className={styles.wrap}>
            <SectionHeader label="02 / Recent registry updates" title="Newest observed versions." copy="The timeline is generated from the same bundled snapshot used by the site's activity and catalog surfaces. Descriptions come from public crate metadata." />
            <div className={styles.timeline}>
              {items.map((item) => {
                const prerelease = item.version.includes("-");
                return (
                  <article className={styles.release} key={item.name}>
                    <time dateTime={item.updated_at}>{formatDate(item.updated_at)}</time>
                    <div className={styles.releaseMain}>
                      <h2>{item.name} <span className={styles.accent}>v{item.version}</span></h2>
                      <p>{item.description || "No public crate description was present in the observed record."}</p>
                      <div className={styles.releaseMeta}><span className={styles.pill}>{prerelease ? "PRE-RELEASE VERSION" : "STABLE VERSION STRING"}</span><span className={styles.pill}>UPDATED {formatDate(item.updated_at, true).toUpperCase()}</span>{item.yanked ? <span className={styles.pill}>OBSERVED YANKED</span> : null}</div>
                    </div>
                    <div className={styles.releaseLinks}>
                      <a className={styles.miniLink} href={item.crates_io_url} target="_blank" rel="noreferrer" data-event="crate_opened" data-event-label={item.name}>crates.io ↗</a>
                      {item.documentation_url ? <a className={styles.miniLink} href={item.documentation_url} target="_blank" rel="noreferrer" data-event="docs_opened" data-event-label={item.name}>docs ↗</a> : null}
                      {item.repository_url ? <a className={styles.miniLink} href={item.repository_url} target="_blank" rel="noreferrer" data-event="github_opened" data-event-label={item.name}>source ↗</a> : null}
                    </div>
                  </article>
                );
              })}
            </div>
            <p className={styles.boundaryNote}>Registry update timestamps can reflect publication or metadata changes. This feed does not infer commit contents, compatibility, migration requirements, CI state, security posture, or release quality. Follow the linked source and documentation for package-specific evidence.</p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionPaper}`}>
          <div className={styles.wrap}>
            <div className={styles.principles}>
              <div className={styles.principleIntro}><span className={styles.overline}>03 / Signal grammar</span><h2>Fresh when observed. Honest when cached.</h2><p>A useful update feed distinguishes an upstream event, a snapshot observation, and a narrative interpretation.</p></div>
              <div className={styles.principleList}>
                <article className={styles.principle}><span className={styles.micro}>EVENT</span><strong>Registry timestamp</strong><p>The public crate record’s own update time, retained verbatim in machine-readable output.</p></article>
                <article className={styles.principle}><span className={styles.micro}>OBSERVATION</span><strong>Snapshot time</strong><p>When the owner inventory was collected and frozen for this site build.</p></article>
                <article className={styles.principle}><span className={styles.micro}>INTERPRETATION</span><strong>Scoped language</strong><p>“Updated record” is used instead of inferring undocumented change content.</p></article>
                <article className={styles.principle}><span className={styles.micro}>SUBSCRIBE</span><strong>Stable feed</strong><p>The RSS route publishes the same scoped records for feed readers and automation.</p></article>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
