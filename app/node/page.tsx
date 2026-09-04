import { pageMetadata } from "../lib/page-metadata";
import type { Metadata } from "next";
import {
  Footer,
  Header,
  PageIntro,
  StatusBadge,
} from "../components/SiteChrome";
import { NodeConsole } from "../components/NodeConsole";
import { coreLinks } from "../content";

export const metadata: Metadata = pageMetadata("/node", {
  alternates: { canonical: "/node" },
  title: "Mnemes Node R1",
  description:
    "Mnemes Node R1 is the optional ready-to-go hardware path for the self-hostable Mnemes server: an early Arduino UNO Q 4GB custom-build concept with Hermes, local utility AI, and visible status.",
});

const plannedBuild = [
  [
    "Mnemes, preinstalled",
    "The same self-hostable server software configured around one explicit data, device, and network boundary.",
  ],
  [
    "Agent shell",
    "Hermes Agent available through a secure shell and terminal UI for tools, scheduled work, and operator-directed jobs.",
  ],
  [
    "Small local model",
    "Qwen3.5 0.8B for bounded onboard utilities such as rewording, simplifying, and synthesizing display information.",
  ],
  [
    "Visible state",
    "A blue matrix display and compact status surface for memory, agent, network, fault, and power conditions.",
  ],
  [
    "Portable power",
    "Rechargeable battery in the 2500–4000 mAh design range, with final capacity selected after measured endurance and thermal testing.",
  ],
  [
    "First connection",
    "A guided Bluetooth or temporary Wi-Fi access-point flow is being evaluated for initial setup.",
  ],
];

const boundaries = [
  [
    "FOUNDER-REPORTED PROTOTYPE",
    "As reported by the founder in July 2026, Mnemes runs on the personal UNO Q deployment; onboard status display and small-model utility tasks are in active personal use. This is not an independent certification.",
  ],
  [
    "PLANNED BUILD",
    "A repeatable enclosure, guided first connection, preconfigured Hermes environment, and battery integration are still being productized.",
  ],
  [
    "NOT YET CLAIMED",
    "No fixed price, ship date, production certification, final battery capacity, measured all-day endurance, or mass-manufacturing commitment.",
  ],
];

export default function NodePage() {
  return (
    <main>
      <Header />
      <PageIntro
        index="01B"
        eyebrow="THE OPTIONAL READY-TO-GO EDITION"
        title="Mnemes, assembled."
        accent="You still own it."
        body="Mnemes Node R1 is a proposed built-to-order appliance for people who lack suitable hardware or prefer a configured system. It runs the same Mnemes server you can install yourself, plus Hermes, bounded onboard AI, visible operating state, and a portable-power target."
      >
        <div className="intro-badges">
          <StatusBadge tone="observed">
            founder-reported prototype · July 2026
          </StatusBadge>
          <StatusBadge tone="proposed">custom builds in discovery</StatusBadge>
        </div>
      </PageIntro>

      <section className="content-section shell">
        <div className="node-software-law" data-reveal>
          <div>
            <p className="section-mark">SOFTWARE FIRST</p>
            <h2>
              You do not need
              <br />
              <em>this box.</em>
            </h2>
            <p>
              Mnemes is the personal agent memory server. Install it on your own
              Linux hardware and you keep the same software, memory engine,
              device model, and routed-search surface.
            </p>
            <a className="button button-primary" href="/install">
              Install Mnemes on your hardware <span>→</span>
            </a>
          </div>
          <div>
            <StatusBadge tone="proposed">optional convenience</StatusBadge>
            <h3>What Node R1 adds</h3>
            <ul>
              <li>
                <i />
                Suitable compact hardware selected for you
              </li>
              <li>
                <i />
                Mnemes and Hermes configured before arrival
              </li>
              <li>
                <i />
                Visible status, onboard utilities, and battery integration
              </li>
            </ul>
            <p>
              It does not create a higher-quality memory tier. It removes
              assembly and setup work.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">01 / THE OPERATOR INSTRUMENT</p>
            <h2>
              Not another invisible
              <br />
              <em>background service.</em>
            </h2>
          </div>
          <p>
            The matrix and status surface turn memory, agent, network, model,
            and battery conditions into something the operator can see. Explore
            representative states below.
          </p>
        </div>
        <div data-reveal>
          <NodeConsole />
        </div>
      </section>

      <section className="content-section node-build-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">02 / INTENDED CUSTOM BUILD</p>
              <h2>
                Configured before
                <br />
                <em>it reaches you.</em>
              </h2>
            </div>
            <p>
              The offer is not a requirement for Mnemes. It is the same server
              software assembled around the operator’s model provider, network
              boundary, devices, and intended agent work.
            </p>
          </div>
          <div className="node-build-grid" data-reveal>
            {plannedBuild.map((item, index) => (
              <article key={item[0]}>
                <span>0{index + 1}</span>
                <h3>{item[0]}</h3>
                <p>{item[1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">03 / TWO COMPUTE BOUNDARIES</p>
            <h2>
              Small local intelligence.
              <br />
              <em>Full agent capability.</em>
            </h2>
          </div>
          <p>
            The onboard model and the full agent have different jobs. Keeping
            that separation visible prevents an edge utility model from being
            marketed as something it is not.
          </p>
        </div>
        <div className="node-compute-grid" data-reveal>
          <article>
            <StatusBadge tone="observed">
              founder-reported local utility
            </StatusBadge>
            <small>QWEN3.5 0.8B</small>
            <h3>Fast, bounded local work</h3>
            <p>
              Summarize a status event. Reword a display message. Compress a
              health explanation. Produce a useful label without making a cloud
              request.
            </p>
            <ul>
              <li>display synthesis</li>
              <li>status simplification</li>
              <li>small local transforms</li>
            </ul>
            <a href={coreLinks.qwenModel} target="_blank" rel="noreferrer">
              Official Qwen model card ↗
            </a>
          </article>
          <i>≠</i>
          <article>
            <StatusBadge tone="proposed">
              operator-configured provider
            </StatusBadge>
            <small>HERMES AGENT</small>
            <h3>The full terminal agent</h3>
            <p>
              Hermes handles tools, projects, schedules, and longer workflows
              through a user-supplied cloud API, supported OAuth path, or a
              separate local endpoint with sufficient context.
            </p>
            <ul>
              <li>secure-shell TUI</li>
              <li>cron and scheduled jobs</li>
              <li>tools, skills, and memory</li>
            </ul>
            <a href={coreLinks.hermesGithub} target="_blank" rel="noreferrer">
              Hermes Agent source ↗
            </a>
          </article>
        </div>
        <p className="node-context-law" data-reveal>
          Hermes currently requires at least a 64K context window. The onboard
          0.8B utility model is not presented as the default full Hermes
          reasoning model.
        </p>
      </section>

      <section className="content-section node-spec-section">
        <div className="shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="section-mark">04 / BASE PLATFORM</p>
              <h2>
                A Linux computer.
                <br />A real-time controller.
                <br />
                <em>One compact board.</em>
              </h2>
            </div>
            <p>
              The 4 GB UNO Q combines a Debian-capable Qualcomm application
              processor, an STM32 real-time microcontroller, dual-band Wi-Fi,
              Bluetooth, and the bridge between both compute domains.
            </p>
          </div>
          <div className="node-spec-grid" data-reveal>
            <article>
              <span>MPU</span>
              <strong>Qualcomm Dragonwing QRB2210</strong>
              <small>quad-core Arm Cortex-A53 · up to 2.0 GHz</small>
            </article>
            <article>
              <span>MEMORY</span>
              <strong>4 GB LPDDR4</strong>
              <small>selected base-board configuration</small>
            </article>
            <article>
              <span>RUNTIME</span>
              <strong>Debian Linux + STM32U585</strong>
              <small>agent/server plane + real-time control plane</small>
            </article>
            <article>
              <span>RADIO</span>
              <strong>Wi-Fi 5 + Bluetooth 5.1</strong>
              <small>onboard wireless connectivity</small>
            </article>
          </div>
          <div className="source-actions" data-reveal>
            <a
              className="button button-secondary"
              href={coreLinks.arduinoUnoQ}
              target="_blank"
              rel="noreferrer"
            >
              Read the official UNO Q specification <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="content-section shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-mark">05 / CLAIMS WITH EDGES</p>
            <h2>
              Prototype energy.
              <br />
              <em>No vaporware grammar.</em>
            </h2>
          </div>
          <p>
            The founder reports a working personal deployment as of July 2026.
            The repeatable product configuration is still early, and the report
            is not presented as an independent certification. Those boundaries
            are intentionally shown side by side.
          </p>
        </div>
        <div className="node-boundaries" data-reveal>
          {boundaries.map((item, index) => (
            <article key={item[0]}>
              <span>0{index + 1}</span>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="node-interest">
        <div className="shell node-interest-inner" data-reveal>
          <div>
            <p className="section-mark">EARLY CUSTOM-BUILD INTEREST</p>
            <h2>
              Tell me what your
              <br />
              memory node should <em>do.</em>
            </h2>
            <p>
              I am exploring a small number of custom builds before treating
              this like a formal product. The useful conversation is about your
              devices, agent, model provider, local-network boundary, scheduled
              work, and display needs.
            </p>
          </div>
          <div>
            <a className="button button-primary" href={coreLinks.nodeInterest}>
              Discuss a custom build <span>→</span>
            </a>
            <a
              className="button button-secondary"
              href={coreLinks.mnemesGithub}
              target="_blank"
              rel="noreferrer"
            >
              Inspect the server source <span>↗</span>
            </a>
            <small>
              No deposit, preorder, price, or delivery commitment is implied by
              an inquiry.
            </small>
          </div>
        </div>
      </section>

      <section className="node-disclaimer shell">
        <p>
          Mnemes Node R1 is an independent RecursiveIntell prototype built on
          Arduino UNO Q hardware. It is not an official Arduino product and is
          not affiliated with or endorsed by Arduino.
        </p>
      </section>
      <Footer />
    </main>
  );
}
