import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import { Footer, Header, PageIntro } from "../components/SiteChrome";
import { doctrines } from "../content";

export const metadata: Metadata = pageMetadata("/doctrine", {
  alternates: { canonical: "/doctrine" },
  title: "Doctrine",
  description:
    "The RecursiveIntell software doctrine beneath Mnemes: local authority, bitemporal truth, receipts, typed failure, supersession, and bounded claims.",
});

export default function DoctrinePage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="05"
        eyebrow="DOCTRINE + ORIGIN"
        title="Software that can"
        accent="answer for itself."
        body="The mythology gives Mnemes a name. The doctrine gives it constraints: one owner per truth, history that survives correction, authority that stays separate from relevance, and claims that stop where proof stops."
      />

      <section className="content-section shell">
        <div className="doctrine-grid" data-reveal>
          {doctrines.map((law) => (
            <article key={law[0]}>
              <span>{law[0]}</span>
              <h2>{law[1]}</h2>
              <p>{law[2]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section origin-section">
        <div className="origin-art" />
        <div className="shell origin-content" data-reveal>
          <div>
            <p className="section-mark">THE NAME</p>
            <span className="greek-word">ΜΝΗΜΗ</span>
            <h2>
              Mneme became
              <br />
              <em>Mnemes.</em>
            </h2>
            <p>
              Mneme is the ancient personification of memory. Mnemes—the
              plural—is the product idea: many device memories, many agent
              histories, many temporal perspectives, held together without
              erasing where each one came from.
            </p>
          </div>
          <div className="muse-triad">
            <article>
              <span>ΜΝΗΜΗ</span>
              <h3>Mneme</h3>
              <small>memory</small>
              <p>
                Canonical state, lineage, retrieval, and continuity across time.
              </p>
            </article>
            <article>
              <span>ΜΕΛΕΤΗ</span>
              <h3>Melete</h3>
              <small>practice</small>
              <p>
                Ingestion, lifecycle, evaluation, compaction, and disciplined
                use.
              </p>
            </article>
            <article>
              <span>ΑΟΙΔΗ</span>
              <h3>Aoede</h3>
              <small>voice</small>
              <p>
                MCP transport, recalled context, witnessed answers, and
                expression.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="doctrine-manifesto" data-reveal>
          <p className="section-mark">THE OPERATING PRINCIPLE</p>
          <h2>
            If a system cannot explain
            <br />
            what changed, who authorized it,
            <br />
            and what evidence remains—
            <br />
            <em>it does not yet know enough.</em>
          </h2>
        </div>
      </section>
      <Footer />
    </main>
  );
}
