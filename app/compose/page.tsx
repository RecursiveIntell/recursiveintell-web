import type { Metadata } from "next";
import catalog from "../data/library-catalog.json";
import crateData from "../data/published-crates.json";
import { Footer, Header } from "../components";
import StackComposer from "./StackComposer";

export const metadata: Metadata = {
  title: "Goal-to-Stack Composer — RecursiveIntell",
  description: "Explore a scoped RecursiveIntell package composition by engineering outcome, evidence posture, and boundary.",
  alternates: { canonical: "/compose" },
  openGraph: {
    title: "Goal-to-Stack Composer — RecursiveIntell",
    description: "Turn an engineering outcome into an inspectable package composition.",
    url: "/compose",
    images: [{ url: "/api/og?title=Goal-to-Stack%20Composer&kicker=INTERACTIVE%20SYSTEM%20DESIGN&detail=Outcome%20%E2%86%92%20boundary%20%E2%86%92%20package%20graph&accent=violet", width: 1200, height: 630 }],
  },
};

const selectedNames = new Set([
  "semantic-memory", "bitemporal-runtime", "knowledge-runtime", "continuity-runtime",
  "agent-graph", "llm-tool-runtime", "effect-runtime", "sandbox-workspace",
  "claim-ledger", "attestation-exchange", "verification-policy", "receipt-bench",
  "authority-delegation", "assurance-runtime", "verification-adjudication", "agent-guard",
  "quant-codec-core", "quant-eval", "quant-governor", "turbo-quant",
  "boundary-compiler", "contract-schema-gen", "stack-ids", "effect-signature",
]);
const published = new Set(crateData.crates.map((item) => item.name));

const packages = catalog.catalog
  .filter((item) => selectedNames.has(item.package_name))
  .map((item) => ({
    name: item.package_name,
    description: item.description || item.documented_scope || "Audited package record.",
    domain: item.architectural_domain,
    version: item.version,
    published: published.has(item.package_name) && item.publication.manifest_publish !== false,
  }));

export default function ComposePage() {
  return (
    <>
      <Header current="compose" />
      <main id="main">
        <section className="route-hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="wrap route-hero-grid">
            <div><span className="eyebrow">Interactive architecture instrument</span><h1>Start with the outcome. <em>See the boundary.</em></h1><p className="lede">Compose a small, inspectable slice of the 97-package system by goal and evidence posture. This is a navigation aid—not an automated architecture guarantee.</p></div>
            <aside className="route-card"><small>COMPOSER / AUDITED INPUTS</small><strong>Five goals.<br />Three evidence postures.</strong><p>Every displayed package resolves to its permanent catalog record. Registry state remains explicit.</p></aside>
          </div>
        </section>
        <StackComposer packages={packages} />
      </main>
      <Footer />
    </>
  );
}
