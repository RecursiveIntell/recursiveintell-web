import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import { Footer, Header, PageIntro } from "../components/SiteChrome";
import { DeploymentPaths } from "../components/DeploymentPaths";
import { InstallCockpit } from "../components/InstallCockpit";
import { coreLinks } from "../content";

export const metadata: Metadata = pageMetadata("/install", {
  alternates: { canonical: "/install" },
  title: "Install",
  description:
    "Install Hermes Agent (full AI agent), Mnemes memory server, or an Agent Memory Kit with copyable local-first commands.",
});

export default function InstallPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="04"
        eyebrow="INSTALL COCKPIT"
        title="Use the hardware"
        accent="that already fits."
        body="Start with the full Hermes Agent (one command), install the memory engine at any boundary, or run a dedicated Mnemes server."
      />

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">01 / CHOOSE THE BOUNDARY</p>
            <h2>
              Memory quality stays.
              <br />
              <em>The deployment changes.</em>
            </h2>
          </div>
          <p>
            A single-device setup uses the same semantic-memory engine and
            retrieval stack. Mnemes adds the server copy, device identity, and
            routed cross-device layer. Node R1 adds setup convenience.
          </p>
        </div>
        <div data-reveal>
          <DeploymentPaths />
        </div>
      </section>

      <section className="content-section shell">
        <div data-reveal>
          <InstallCockpit />
        </div>
      </section>

      <section className="content-section install-journey">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">02 / WHAT HAPPENS NEXT</p>
              <h2>
                The quiet start
                <br />
                is <em>correct behavior.</em>
              </h2>
            </div>
            <p>
              A new memory system should not fabricate a useful past. It begins
              empty, then compounds as the agent records durable project state
              and ingests the repositories you choose.
            </p>
          </div>
          <div className="journey-grid" data-reveal>
            <article>
              <span>01</span>
              <small>INSTALL</small>
              <h3>Memory waits.</h3>
              <p>
                Recall fires and returns nothing. The agent continues normally.
              </p>
            </article>
            <article>
              <span>02</span>
              <small>INGEST</small>
              <h3>The codebase appears.</h3>
              <p>
                Manifests, structure, dependencies, and README facts enter a
                namespace.
              </p>
            </article>
            <article>
              <span>03</span>
              <small>WORK</small>
              <h3>Decisions accumulate.</h3>
              <p>
                Conventions, failures, corrections, tasks, and evidence become
                searchable.
              </p>
            </article>
            <article>
              <span>04</span>
              <small>COMPOUND</small>
              <h3>Continuity emerges.</h3>
              <p>
                Later sessions retrieve why the current state exists instead of
                re-debating it.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">03 / BEFORE YOU CONNECT DEVICES</p>
            <h2>
              Know which plane
              <br />
              <em>you are proving.</em>
            </h2>
          </div>
          <p>
            A reachable server is not a synchronized memory system. Mnemes
            separates network, identity, shard, replica, route, retrieval, and
            receipt health.
          </p>
        </div>
        <div className="preflight-grid" data-reveal>
          <article>
            <h3>Local memory</h3>
            <p>
              Verify binary identity, one canonical data directory, embedding
              dimensions, integrity, and tools/list.
            </p>
          </article>
          <article>
            <h3>Private reachability</h3>
            <p>
              Verify loopback binding or an explicitly private proxy, device
              credentials, rotation, and revocation.
            </p>
          </article>
          <article>
            <h3>Cross-device recall</h3>
            <p>
              Verify distinct device identities, eligible shards, source
              provenance, temporal state, and route receipts.
            </p>
          </article>
          <article>
            <h3>Replication claims</h3>
            <p>
              Require freshness, offline backlog, idempotent replay, conflicts,
              source-offline retrieval, and recovery evidence.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section node-install-band">
        <div className="shell node-install-grid" data-reveal>
          <div>
            <p className="section-mark">04 / WANT THE SYSTEM ASSEMBLED?</p>
            <h2>
              A custom node,
              <br />
              <em>configured around you.</em>
            </h2>
            <p>
              Node R1 runs the same Mnemes software you can install yourself. It
              is an early built-to-order option for people who need suitable
              hardware or want the server, agent environment, status display,
              and model boundary configured before arrival.
            </p>
          </div>
          <div>
            <a className="button button-primary" href="/node">
              See the Node R1 concept <span>→</span>
            </a>
            <a
              className="button button-secondary"
              href={coreLinks.nodeInterest}
            >
              Discuss a custom build <span>↗</span>
            </a>
            <small>
              Inquiry only. Final specification, battery, price, and
              availability are not yet committed.
            </small>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="install-resources" data-reveal>
          <div>
            <p className="section-mark">05 / GO TO SOURCE</p>
            <h2>
              The commands stay public.
              <br />
              <em>So do the limits.</em>
            </h2>
          </div>
          <div>
            <a href={coreLinks.mnemesGithub} target="_blank" rel="noreferrer">
              <span>Mnemes setup guide</span>
              <b>GitHub ↗</b>
            </a>
            <a href={coreLinks.kitsGithub} target="_blank" rel="noreferrer">
              <span>Agent Memory Kits</span>
              <b>GitHub ↗</b>
            </a>
            <a href={coreLinks.mcpCrate} target="_blank" rel="noreferrer">
              <span>MCP server crate</span>
              <b>crates.io ↗</b>
            </a>
            <a href={coreLinks.memoryDocs} target="_blank" rel="noreferrer">
              <span>Engine API documentation</span>
              <b>docs.rs ↗</b>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
