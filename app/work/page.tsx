import type { Metadata } from "next";
import Link from "next/link";
import { BusinessFooter, BusinessHeader, BusinessPageIntro } from "../components/business/BusinessChrome";
import { workCases } from "../data/work";

export const metadata: Metadata = {
  title: "Selected Engineering Work",
  description: "Artifact-grounded case studies across agent memory, Hermes integration, evidence infrastructure, orchestration, and compression.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main className="business-page">
      <BusinessHeader />
      <BusinessPageIntro
        index="02"
        eyebrow="SELECTED WORK / PUBLIC ARTIFACTS"
        title="Case studies without"
        accent="invented outcomes."
        body="Each case names the problem, what was built, the evidence available for inspection, and the boundary that evidence does not cross."
      />
      <section className="business-section">
        <div className="business-shell work-case-list">
          {workCases.map((item) => (
            <article key={item.number} className="work-case">
              <div><span>CASE / {item.number} · {item.maturity}</span><h2>{item.title}</h2></div>
              <dl>
                <div><dt>Problem</dt><dd>{item.problem}</dd></div>
                <div><dt>Built</dt><dd>{item.built}</dd></div>
                <div><dt>Evidence</dt><dd>{item.evidence}</dd></div>
                <div><dt>Boundary</dt><dd>{item.boundary}</dd></div>
              </dl>
              <a href={item.source} target="_blank" rel="noreferrer">{item.sourceLabel} <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>
      <section className="business-section work-proof-law">
        <div className="business-shell business-boundary-grid">
          <div><p className="business-index">THE PROOF LAW</p><h2>Evidence has<br /><em>a defined scope.</em></h2></div>
          <div><p>A repository can establish source exists. A package can establish publication. A test can establish its declared invariant for one revision and environment. A receipt can establish what a run observed. None inherits customer adoption, production fitness, security, factual truth, or business outcomes for free.</p><div className="business-text-links"><Link href="/portfolio">Explore the full portfolio <span>→</span></Link><Link href="/services">Apply the patterns through consulting <span>→</span></Link></div></div>
        </div>
      </section>
      <BusinessFooter />
    </main>
  );
}
