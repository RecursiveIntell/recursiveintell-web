import type { Metadata } from "next";
import { Footer, Header, PageIntro } from "../components/SiteChrome";
import { LiveRegistry } from "../components/LiveRegistry";
import { coreLinks } from "../content";

export const metadata: Metadata = {
  title: "About",
  description: "Josh Stevenson, RecursiveIntell, and the evidence-first local AI systems work behind Mnemes.",
};

const services = [
  ["Mnemes deployment", "Install the personal memory server on hardware you already own, define the device and network boundary, and connect the agents that should remember together."],
  ["Custom Mnemes appliance", "Choose the optional Node R1 path when you want suitable hardware, software setup, visible status, and the model boundary assembled around your workflow."],
  ["Agent memory integration", "Connect one coding-agent host to local memory, ingest one repository, and demonstrate witnessed recall across a bounded workflow."],
  ["Local-first architecture review", "Map canonical owners, network and authority boundaries, degradation paths, and the smallest proof-bearing design."],
];

export default function AboutPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="06"
        eyebrow="THE PERSON + THE LAB"
        title="Built by one engineer."
        accent="Inspected in public."
        body="Josh Stevenson is an independent systems engineer building Rust-first local runtimes, evidence-aware memory, claim hygiene, and operator-control software through RecursiveIntell."
      />

      <section className="content-section shell">
        <div className="hierarchy" data-reveal>
          {[
            ["PRODUCT", "Mnemes", "The self-hosted personal memory server and its one-device entry path."],
            ["PROOF", "Node R1 + receipts", "Optional physical and executable artifacts that expose what currently works."],
            ["PLATFORM", "RecursiveIntell", "The broader trust substrate: memory, identity, evidence, execution, compression, and boundaries."],
            ["PERSON", "Josh Stevenson", "Founder, engineer, operator, and current maintainer."],
          ].map((item, index) => <article key={item[0]}><span>0{index + 1}</span><small>{item[0]}</small><h2>{item[1]}</h2><p>{item[2]}</p></article>)}
        </div>
      </section>

      <section className="content-section studio-section">
        <div className="shell studio-grid" data-reveal>
          <div>
            <p className="section-mark">RECURSIVEINTELL</p>
            <h2>Intelligence needs<br /><em>infrastructure.</em></h2>
          </div>
          <div>
            <p>RecursiveIntell is a founder-led applied R&amp;D studio and public engineering portfolio. The work begins where convincing demos usually end: persistence, recovery, refusal, provenance, upgrades, and the exact limits of what a system can prove.</p>
            <p>It is not presented as a funded company, a team, an enterprise deployment, or a certified production platform. Public source demonstrates scope and implementation—not customer outcomes or fitness for every system.</p>
            <a className="button button-primary" href={coreLinks.recursiveIntell} target="_blank" rel="noreferrer">Explore RecursiveIntell <span>↗</span></a>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div><p className="section-mark">WORK TOGETHER</p><h2>Bounded engagements.<br /><em>Concrete artifacts.</em></h2></div>
          <p>The useful unit is not vague transformation. It is one named boundary, one current evidence base, one reversible pass, and one receipt another engineer can inspect.</p>
        </div>
        <div className="service-grid" data-reveal>
          {services.map((service, index) => <article key={service[0]}><span>0{index + 1}</span><h3>{service[0]}</h3><p>{service[1]}</p><a href={coreLinks.email}>Discuss the boundary ↗</a></article>)}
        </div>
      </section>

      <section className="content-section public-proof">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div><p className="section-mark">PUBLIC FOOTPRINT</p><h2>Repositories, crates,<br />and <em>dated evidence.</em></h2></div>
            <p>These counts and versions describe public engineering activity. They are not adoption, quality, customer, or business metrics.</p>
          </div>
          <div data-reveal><LiveRegistry /></div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="contact-panel" data-reveal>
          <div><p className="section-mark">DIRECT CONTACT</p><h2>Bring the hard boundary.</h2><p>Memory integration, evidence architecture, local-first agent systems, or release truth.</p></div>
          <div><a href={coreLinks.email}>J.stevenson.cs@gmail.com <span>↗</span></a><a href={coreLinks.recursiveGithub} target="_blank" rel="noreferrer">github.com/RecursiveIntell <span>↗</span></a></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
