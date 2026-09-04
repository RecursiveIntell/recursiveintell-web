import Link from "next/link";
import { SystemGraphic } from "../Studio";
import { Footer, Header, StatusBadge } from "../SiteChrome";
import { InstallCockpit } from "../InstallCockpit";
import { LiveRegistry } from "../LiveRegistry";
import { MemoryProof } from "../MemoryProof";
import { MeshStory } from "../MeshStory";
import { NodeConsole } from "../NodeConsole";
import { DeploymentPaths } from "../DeploymentPaths";
import { coreLinks, statusLanes } from "../../content";

const mnemesStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mnemes",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cross-platform",
  description:
    "A personal, self-hosted agent memory server for local-first AI agents, with routed cross-device search, temporal state, provenance, and receipts.",
  url: "https://recursiveintell.com/mnemes",
  codeRepository: "https://github.com/RecursiveIntell/mnemes",
  author: {
    "@type": "Person",
    name: "Josh Stevenson",
    url: "https://recursiveintell.com",
  },
};

const outcomes = [
  [
    "01",
    "An agent that compounds",
    "Decisions, corrections, conventions, failed approaches, and open questions survive the session boundary.",
  ],
  [
    "02",
    "A memory that spans devices",
    "Search authorized device shards from another machine without flattening origin, actor, time, or namespace.",
  ],
  [
    "03",
    "An answer that brings evidence",
    "Witnessed retrieval can return source identity and an execution receipt alongside the result.",
  ],
  [
    "04",
    "A system the operator owns",
    "SQLite remains the durable authority; models, indexes, and compressed candidates stay replaceable.",
  ],
];

export function MnemesHome() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mnemesStructuredData),
        }}
      />
      <Header />

      <section className="mnemes-studio-hero shell">
        <div>
          <p className="eyebrow">MNEMES / LOCAL-FIRST MEMORY</p>
          <h1>
            Memory,
            <br />
            with a <em>history.</em>
          </h1>
          <p className="hero-lede">
            A personal, self-hosted agent memory server. Connect persistent
            context, source identity, and temporal state across the devices you
            authorize.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/install">
              Choose your setup <span>→</span>
            </Link>
            <Link className="button button-secondary" href="/product">
              Explore the software <span>↗</span>
            </Link>
          </div>
          <p className="mnemes-hero-note">
            Explore the current server-shard architecture and the separately
            identified device-owned replication target below.
          </p>
        </div>
        <SystemGraphic compact />
      </section>

      <div className="shell home-registry" data-reveal>
        <LiveRegistry compactMode />
        <div className="portfolio-home-link">
          <div>
            <span>COMPLETE RECURSIVEINTELL PORTFOLIO</span>
            <p>
              Every public repository and crate, plus the 97-package reviewed
              Library Atlas projection.
            </p>
          </div>
          <Link href="/portfolio">
            Open live portfolio <span>→</span>
          </Link>
        </div>
      </div>

      <section className="home-thesis shell" data-reveal>
        <p className="section-mark">00 / THE PRODUCT</p>
        <div>
          <h2>
            The product is software.
            <br />
            The hardware is <em>your choice.</em>
          </h2>
          <p>
            Mnemes runs as a personal server on hardware you already own. Node
            R1 is the ready-to-go option, not a requirement. If you only need
            one device, Agent Memory Kits and semantic-memory-mcp provide the
            same underlying memory engine without the Mnemes server layer.
          </p>
        </div>
      </section>

      <section className="deployment-home-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">00B / CHOOSE THE BOUNDARY</p>
              <h2>
                One device. Your server.
                <br />
                Or <em>ready-to-go.</em>
              </h2>
            </div>
            <p>
              Memory quality comes from the semantic-memory engine. Mnemes adds
              the personal server, device identity, server-side memory copies,
              and cross-device routing. Node R1 adds convenience.
            </p>
          </div>
          <div data-reveal>
            <DeploymentPaths />
          </div>
        </div>
      </section>

      <section className="outcome-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">01 / THE COMPOUNDING CURVE</p>
              <h2>
                The first session is empty.
                <br />
                <em>That is not the product.</em>
              </h2>
            </div>
            <p>
              The intended workflow is to capture source material, preserve
              changes over time, and retrieve relevant context. These stages
              describe the design, not a measured adoption curve.
            </p>
          </div>
          <div className="curve" data-reveal>
            <div className="curve-line">
              <i />
              <i />
              <i />
              <i />
            </div>
            {[
              [
                "CAPTURE",
                "keep the source",
                "Retain the original material and its identity.",
              ],
              [
                "ORGANIZE",
                "preserve context",
                "Keep time, namespace, and provenance explicit.",
              ],
              [
                "RETRIEVE",
                "find relevant state",
                "Return to evidence when context is needed.",
              ],
              [
                "REVIEW",
                "inspect the result",
                "Examine the source and known limits.",
              ],
            ].map((item, index) => (
              <article key={item[0]}>
                <span>0{index + 1}</span>
                <small>{item[0]}</small>
                <h3>{item[1]}</h3>
                <p>{item[2]}</p>
              </article>
            ))}
          </div>
          <div className="outcome-grid" data-reveal>
            {outcomes.map((item) => (
              <article key={item[0]}>
                <span>{item[0]}</span>
                <h3>{item[1]}</h3>
                <p>{item[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mesh-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">02 / THE PRIVATE MEMORY FABRIC</p>
              <h2>
                Ask one device
                <br />
                what <em>another learned.</em>
              </h2>
            </div>
            <p>
              Explore the current server-shard architecture, then switch to the
              device-owned replication target. The status boundary changes with
              the diagram instead of hiding in a footnote.
            </p>
          </div>
          <div data-reveal>
            <MeshStory />
          </div>
          <div className="section-link">
            <Link href="/product">
              Explore the full Mnemes product boundary <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="node-home-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">03 / OPTIONAL READY-TO-GO HARDWARE</p>
              <h2>
                A private memory server
                <br />
                you can <em>pick up.</em>
              </h2>
            </div>
            <p>
              Mnemes Node R1 packages the same self-hostable server into an
              early built-to-order appliance for people who lack suitable
              hardware or prefer a configured system.
            </p>
          </div>
          <div data-reveal>
            <NodeConsole compact />
          </div>
          <div className="node-home-cta" data-reveal>
            <div>
              <StatusBadge tone="observed">
                founder-reported prototype · July 2026
              </StatusBadge>
              <p>
                You do not need Node R1 to use Mnemes. Configuration, enclosure,
                onboarding, and measured endurance are still being productized.
              </p>
            </div>
            <Link className="button button-primary" href="/node">
              Explore Mnemes Node R1 <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="proof-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">04 / DENSE MEMORY IN MOTION</p>
              <h2>
                Find one current answer
                <br />
                inside <em>64,000 records.</em>
              </h2>
            </div>
            <p>
              Run the model. Watch lexical and semantic candidates activate,
              graph context expand, temporal conflicts resolve, and the final
              answer arrive with source and receipt identity.
            </p>
          </div>
          <div data-reveal>
            <MemoryProof />
          </div>
          <div className="section-link">
            <Link href="/proof">
              Open the full proof room <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="stack-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">05 / ONE SYSTEM, THREE OWNERS</p>
              <h2>
                Server.
                <br />
                Protocol.
                <br />
                <em>Engine.</em>
              </h2>
            </div>
            <p>
              Mnemes does not swallow the stack. Each crate owns one layer, and
              each layer has explicit refusal boundaries.
            </p>
          </div>
          <div className="stack-cards" data-reveal>
            <article>
              <span>03 / PRODUCT</span>
              <StatusBadge>Mnemes</StatusBadge>
              <h3>Personal memory server</h3>
              <p>
                Self-hosted device and actor identity, control metadata, routed
                shard search, operation envelopes, provenance edges, and routing
                receipts.
              </p>
              <div>
                <a
                  href={coreLinks.mnemesGithub}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  href={coreLinks.mnemesCrate}
                  target="_blank"
                  rel="noreferrer"
                >
                  crates.io ↗
                </a>
              </div>
            </article>
            <article>
              <span>02 / PROTOCOL</span>
              <StatusBadge>semantic-memory-mcp</StatusBadge>
              <h3>Agent-facing MCP server</h3>
              <p>
                Profiles bound the exposed tools. Agents can retrieve through
                stdio or loopback HTTP without automatically receiving mutation
                or administration.
              </p>
              <div>
                <a href={coreLinks.mcpGithub} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a href={coreLinks.mcpCrate} target="_blank" rel="noreferrer">
                  crates.io ↗
                </a>
              </div>
            </article>
            <article>
              <span>01 / ENGINE</span>
              <StatusBadge>semantic-memory</StatusBadge>
              <h3>Authoritative local memory</h3>
              <p>
                SQLite, FTS5, dense vectors, weighted RRF, temporal views, graph
                relationships, provenance, receipts, replay, integrity, and
                recovery.
              </p>
              <div>
                <a
                  href={coreLinks.memoryGithub}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  href={coreLinks.memoryCrate}
                  target="_blank"
                  rel="noreferrer"
                >
                  crates.io ↗
                </a>
              </div>
            </article>
          </div>
          <div className="section-link">
            <Link href="/platform">
              Map the entire platform <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="status-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">06 / CLAIMS WITH EDGES</p>
              <h2>
                See the ambition.
                <br />
                <em>Keep the boundary.</em>
              </h2>
            </div>
            <p>
              The site distinguishes what current source establishes, what has
              been observed on hardware, and what still needs end-to-end
              synchronization proof.
            </p>
          </div>
          <div className="status-lanes" data-reveal>
            {statusLanes.map((lane, index) => (
              <article key={lane.title}>
                <span>0{index + 1}</span>
                <StatusBadge
                  tone={lane.status === "released" ? "released" : "development"}
                >
                  {lane.status}
                </StatusBadge>
                <h3>{lane.title}</h3>
                <p>{lane.body}</p>
              </article>
            ))}
          </div>
          <blockquote className="receipt-law" data-reveal>
            <span>THE RECEIPT LAW</span>
            <p>
              A receipt records observed execution evidence. It does not prove
              factual truth, correctness, security, authorization, or task
              success.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="install-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">07 / FROM INTEREST TO FIRST RECALL</p>
              <h2>
                Start where you are.
                <br />
                <em>Keep what compounds.</em>
              </h2>
            </div>
            <p>
              Use one device with an Agent Memory Kit, install Mnemes on your
              own server, or choose Node R1 when you want the system assembled.
            </p>
          </div>
          <div data-reveal>
            <InstallCockpit compact />
          </div>
          <div className="section-link">
            <Link href="/install">
              Open the full installation cockpit <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <div className="shell portal-grid" data-reveal>
          <Link href="/product">
            <span>PRODUCT</span>
            <h3>Mnemes, without the mythology haze.</h3>
            <p>
              Current architecture, target replication, trust boundaries, API
              surface, and device lifecycle.
            </p>
            <b>ENTER PRODUCT →</b>
          </Link>
          <Link href="/proof">
            <span>PROOF</span>
            <h3>Interrogate how memory knows.</h3>
            <p>
              Dense retrieval, temporal resolution, receipts, evidence scopes,
              and public source status.
            </p>
            <b>ENTER PROOF →</b>
          </Link>
          <Link href="/platform">
            <span>PLATFORM</span>
            <h3>See every layer and owner.</h3>
            <p>
              Engine, MCP protocol, Mnemes control plane, host kits,
              compression, and adjacent trust primitives.
            </p>
            <b>ENTER PLATFORM →</b>
          </Link>
          <Link href="/about">
            <span>PERSON</span>
            <h3>Meet the engineer behind it.</h3>
            <p>
              Josh Stevenson, RecursiveIntell, the public portfolio, and bounded
              ways to work together.
            </p>
            <b>ENTER PERSON →</b>
          </Link>
        </div>
      </section>

      <section className="closing">
        <div className="closing-art" />
        <div className="shell closing-inner" data-reveal>
          <p className="section-mark">MNEMES / THE LIVING ARCHIVE</p>
          <h2>
            Memory should remember
            <br />
            <em>how it knows.</em>
          </h2>
          <p>
            Start with one agent on one device. Add your own Mnemes server when
            those memories should travel. Choose Node R1 only if you want the
            hardware handled too.
          </p>
          <div>
            <Link className="button button-primary" href="/install">
              Create the first memory <span>→</span>
            </Link>
            <a
              className="button button-secondary"
              href={coreLinks.mnemesGithub}
              target="_blank"
              rel="noreferrer"
            >
              Inspect Mnemes source <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
