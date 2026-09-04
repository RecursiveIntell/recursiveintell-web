import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import {
  Footer,
  Header,
  PageIntro,
  StatusBadge,
} from "../components/SiteChrome";
import { MeshStory } from "../components/MeshStory";
import { DeploymentPaths } from "../components/DeploymentPaths";
import { coreLinks } from "../content";

export const metadata: Metadata = pageMetadata("/product", {
  alternates: { canonical: "/product" },
  title: "Product",
  description:
    "Mnemes is a personal, self-hosted agent memory server that runs on your hardware. Node R1 is the optional ready-to-go appliance.",
});

const lifecycle = [
  [
    "Enroll",
    "Register a device and actor with explicit identity. Unknown credentials fail closed.",
  ],
  [
    "Capture",
    "Write a typed operation envelope with source, actor, valid time, content digest, and idempotency key.",
  ],
  [
    "Route",
    "Filter eligible shards, rank by sparse overlap and locality, select within budget, and record the decision.",
  ],
  [
    "Retrieve",
    "Search selected semantic-memory shards, merge by score, deduplicate by item identity, and reject content conflict.",
  ],
  [
    "Witness",
    "Return source identity, temporal state, route evidence, retrieval evidence, fallback, and degradation.",
  ],
  [
    "Revoke",
    "Rotate, quarantine, or revoke device authority without pretending old reachability grants current access.",
  ],
];

export default function ProductPage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="01"
        eyebrow="THE PRODUCT"
        title="Your own memory server."
        accent="On your own hardware."
        body="Mnemes is self-hosted software: a personal Rust agent-memory server above semantic-memory and semantic-memory-mcp. Install it on hardware you already own to add device identity, routed cross-device search, server-side memory copies, and one operator-controlled boundary."
      >
        <div className="intro-badges">
          <StatusBadge>mnemes v0.1.1 source</StatusBadge>
          <StatusBadge tone="development">
            continuous replication in development
          </StatusBadge>
        </div>
      </PageIntro>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">01 / THREE DEPLOYMENT PATHS</p>
            <h2>
              Mnemes is the server.
              <br />
              <em>Node R1 is optional.</em>
            </h2>
          </div>
          <p>
            One device can use the same semantic-memory engine through Agent
            Memory Kits. Mnemes adds the server and multi-device layer. Node R1
            simply arrives assembled.
          </p>
        </div>
        <div data-reveal>
          <DeploymentPaths compact />
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">02 / THE CORE IDEA</p>
            <h2>
              Local-first does not have
              <br />
              to mean <em>device-isolated.</em>
            </h2>
          </div>
          <p>
            A laptop, server, edge node, and phone can contribute different
            kinds of memory without collapsing into one anonymous vector pile.
            Identity and authority filter the search before relevance gets a
            vote.
          </p>
        </div>
        <div data-reveal>
          <MeshStory extended />
        </div>
      </section>

      <section className="content-section node-product-band">
        <div className="shell node-product-grid" data-reveal>
          <div>
            <p className="section-mark">03 / OPTIONAL PHYSICAL EDITION</p>
            <h2>
              Mnemes Node R1.
              <br />
              <em>The convenience path.</em>
            </h2>
            <p>
              The same Mnemes server can be installed on your own hardware. Node
              R1 is an early custom-build option for people who want it
              preconfigured with Hermes, bounded onboard AI, visible status, and
              portable-power hardware.
            </p>
            <div className="source-actions">
              <a className="button button-primary" href="/node">
                Explore the Node R1 concept <span>→</span>
              </a>
            </div>
          </div>
          <div className="node-product-status">
            <article>
              <StatusBadge tone="observed">
                founder report · July 2026
              </StatusBadge>
              <h3>A working personal deployment is reported</h3>
              <p>
                The founder reports Mnemes, display behavior, and small-model
                utility work active on the personal UNO Q deployment. This is
                not an independent hardware certification.
              </p>
            </article>
            <article>
              <StatusBadge tone="proposed">custom build</StatusBadge>
              <h3>Productization is early</h3>
              <p>
                Enclosure, first-connection flow, battery selection, endurance,
                repeatability, price, and availability remain open gates.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section product-contract">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">04 / TWO DATABASE RESPONSIBILITIES</p>
              <h2>
                Add control metadata.
                <br />
                <em>Do not duplicate truth.</em>
              </h2>
            </div>
            <p>
              Mnemes owns pooling and routing metadata. Semantic-memory
              continues to own every memory payload and its retrieval semantics.
            </p>
          </div>
          <div className="database-map" data-reveal>
            <article className="database-control">
              <header>
                <StatusBadge>Mnemes owner</StatusBadge>
                <code>pooled.db</code>
              </header>
              <h3>Control plane</h3>
              <ul>
                <li>
                  <span>devices</span> identity, status, credentials
                </li>
                <li>
                  <span>actors</span> human, agent, service, process
                </li>
                <li>
                  <span>operations</span> idempotent envelopes
                </li>
                <li>
                  <span>provenance</span> typed bitemporal edges
                </li>
                <li>
                  <span>routing</span> selected, skipped, fallback
                </li>
              </ul>
            </article>
            <div className="database-link">
              <i />
              <span>routes and witnesses</span>
              <i />
            </div>
            <article className="database-shards">
              <header>
                <StatusBadge>semantic-memory owner</StatusBadge>
                <code>memory.db × N</code>
              </header>
              <h3>Device shards</h3>
              <div>
                {["laptop", "server", "edge", "phone"].map((item) => (
                  <span key={item}>
                    <i />
                    {item}.memory.db
                    <small>facts · chunks · graph · receipts</small>
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">05 / OPERATION LIFECYCLE</p>
            <h2>
              Every material step
              <br />
              <em>keeps its identity.</em>
            </h2>
          </div>
          <p>
            The lifecycle preserves who requested an operation, which device
            recorded it, what content digest was accepted, when it was valid,
            and when the server recorded it.
          </p>
        </div>
        <div className="lifecycle-grid" data-reveal>
          {lifecycle.map((item, index) => (
            <article key={item[0]}>
              <span>0{index + 1}</span>
              <i />
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section api-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">06 / OPERATOR SURFACE</p>
              <h2>
                HTTP, MCP,
                <br />
                and an <em>admin boundary.</em>
              </h2>
            </div>
            <p>
              The loopback server exposes health, integrity, device lifecycle,
              actors, operations, witnessed search, sync, receipts, audit
              events, and MCP JSON-RPC behind device credentials.
            </p>
          </div>
          <div className="api-columns" data-reveal>
            <article>
              <span>HEALTH + INTEGRITY</span>
              <code>GET /livez</code>
              <code>GET /healthz</code>
              <code>GET /v1/health</code>
              <code>GET /v1/integrity</code>
            </article>
            <article>
              <span>IDENTITY + CONTROL</span>
              <code>POST /v1/devices/register</code>
              <code>POST /v1/devices/:id/rotate</code>
              <code>POST /v1/devices/:id/revoke</code>
              <code>POST /v1/devices/:id/quarantine</code>
            </article>
            <article>
              <span>MEMORY + EVIDENCE</span>
              <code>POST /v1/search/witnessed</code>
              <code>POST /v1/sync</code>
              <code>GET /v1/receipts/:id</code>
              <code>GET /v1/audit/events</code>
            </article>
          </div>
          <div className="profile-band" data-reveal>
            <article>
              <StatusBadge>agent</StatusBadge>
              <h3>Read-only daily surface</h3>
              <p>
                Search, facts, graph paths, namespaces, authority decisions,
                receipts, and replay. No device management.
              </p>
            </article>
            <article>
              <StatusBadge tone="observed">operator</StatusBadge>
              <h3>Explicit operational surface</h3>
              <p>
                Device and actor registration, operation submission, heartbeat,
                rotation, revocation, and quarantine.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">07 / CURRENT TRUTH</p>
            <h2>
              Three states.
              <br />
              <em>No blended claim.</em>
            </h2>
          </div>
          <p>
            Architecture prose is not allowed to borrow proof from a different
            plane. The current source boundary remains visible here and
            throughout the site.
          </p>
        </div>
        <div className="truth-matrix" data-reveal>
          <article>
            <StatusBadge>source-established</StatusBadge>
            <h3>Current candidate</h3>
            <p>
              Per-device server shards, control metadata, routed witnessed
              search, route receipts, bearer-token admission, and device
              lifecycle endpoints exist in public source.
            </p>
          </article>
          <article>
            <StatusBadge tone="observed">deployment-reported</StatusBadge>
            <h3>Edge node</h3>
            <p>
              An ARM64 edge deployment is reported in the supplied context. That
              observation does not certify recovery, security, or cross-device
              convergence.
            </p>
          </article>
          <article>
            <StatusBadge tone="development">in development</StatusBadge>
            <h3>Device-owned replicas</h3>
            <p>
              Canonical databases on home devices with continuous signed
              replication, freshness proof, offline backlog, conflict law, and
              recovery still require end-to-end canaries.
            </p>
          </article>
        </div>
        <div className="source-actions" data-reveal>
          <a
            className="button button-primary"
            href={coreLinks.mnemesGithub}
            target="_blank"
            rel="noreferrer"
          >
            Inspect current source <span>↗</span>
          </a>
          <a
            className="button button-secondary"
            href={coreLinks.mnemesDocs}
            target="_blank"
            rel="noreferrer"
          >
            Read the Rust docs <span>↗</span>
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
