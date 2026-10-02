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
    "Install the latest Ares with enhancements by default, then choose your AI provider with local API-key or supported OAuth setup. Mnemes and memory kits are also available.",
});

export default function InstallPage() {
  return (
    <main className="ares-install-page">
      <Header />
      <PageIntro
        index="04"
        eyebrow="INSTALL COCKPIT"
        title="Install Ares."
        accent="Make it your own."
        body="One command handles the dependencies and enhancements. Then choose your AI provider, model, and sign-in method in Ares’s local wizard. Your keys never go through this website."
      />

      <section className="content-section shell">
        <InstallCockpit />
        <div className="ares-setup-notes">
          <article>
            <h2>What happens automatically</h2>
            <p>The installer fetches the latest Ares source, provisions managed Python and build tools, builds a managed runtime and Desktop, installs the Rust enhancements and memory kit, configures local memory and compaction, and opens the provider wizard. Required build failures stop the installation.</p>
          </article>
          <article>
            <h2>Choose how your AI connects</h2>
            <p>Use an API-key provider, a supported OAuth sign-in, or your own compatible local endpoint. Ares’s wizard owns credential storage. An OpenAI API key is needed only if you choose a feature that uses OpenAI’s API.</p>
          </article>
          <article>
            <h2>Your existing setup stays yours</h2>
            <p>Ares uses <code>~/.ares</code>. The installer preserves existing credentials, backs up configuration before changing it, and refuses to overwrite conflicting MCP mappings or unrelated launchers. On Linux with a user systemd session, its gateway starts after provider setup.</p>
          </article>
          <article>
            <h2>Full defaults, with explicit limits</h2>
            <p>Agent Graph’s daemon needs a compatible provider configuration before remote graph execution. CEA and Pilot Bridge tools are installed; their jobs still need your workspace and data. Rerun this installer to update the full distribution. Use <code>--no-desktop</code>, <code>--no-gateway</code>, <code>--minimal</code>, or <code>--skip-setup</code> when needed.</p>
          </article>
          <p><a href="/ares/install.sh">Read the installer</a> · <a href="/ares/README.md">Full setup and update guide</a> · <a href="https://github.com/RecursiveIntell/Ares" target="_blank" rel="noreferrer">Ares source and provider documentation ↗</a></p>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">01 / MEMORY FOR OTHER AGENTS</p>
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
