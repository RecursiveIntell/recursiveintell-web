"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import styles from "./install.module.css";
import {
  getCommandBlocks,
  getInstallGuide,
  getShellOptions,
  INSTALL_GUIDES,
  type CommandBlock,
  type HostSlug,
  type OsId,
  type ShellId,
} from "./data";

const osLabels: Record<OsId, string> = {
  macos: "macOS",
  linux: "Linux",
  windows: "Windows",
};

const shellLabels: Record<ShellId, string> = {
  zsh: "zsh",
  bash: "bash",
  powershell: "PowerShell",
};

const phases = [
  { index: "01", label: "Connect", detail: "Prerequisites and installation" },
  { index: "02", label: "Prove", detail: "Runtime verification" },
  { index: "03", label: "Operate", detail: "Use, diagnose, and remove" },
] as const;

function CopyButton({ block, host, os, shell, disabled = false }: { block: CommandBlock; host: HostSlug; os: OsId; shell: ShellId; disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy(event: MouseEvent<HTMLButtonElement>) {
    const code = event.currentTarget.closest("article")?.querySelector("code");
    try {
      await navigator.clipboard.writeText(block.code);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2200);
    } catch {
      setState("failed");
      if (code) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }

  return (
    <button
      className={styles.copyButton}
      type="button"
      onClick={copy}
      disabled={disabled}
      data-event="install_command_copy"
      data-event-host={host}
      data-event-command={block.id}
      data-event-os={os}
      data-event-shell={shell}
      aria-label={`${disabled ? "Enter a project path before copying" : state === "copied" ? "Copied" : "Copy"} ${block.label}`}
    >
      <span aria-hidden="true">{disabled ? "·" : state === "copied" ? "✓" : state === "failed" ? "!" : "⧉"}</span>
      {disabled ? "Add path" : state === "copied" ? "Copied" : state === "failed" ? "Selected" : "Copy"}
      <span className={styles.srOnly} aria-live="polite">
        {state === "copied" ? `${block.label} copied to clipboard.` : state === "failed" ? "Copy failed. The commands are selected for manual copying." : ""}
      </span>
    </button>
  );
}

function CodePanel({ block, host, os, shell, copyDisabled = false }: { block: CommandBlock; host: HostSlug; os: OsId; shell: ShellId; copyDisabled?: boolean }) {
  return (
    <article className={styles.codePanel}>
      <header>
        <div>
          <span>{block.language === "text" ? "HOST" : block.language.toUpperCase()}</span>
          <h3>{block.label}</h3>
        </div>
        <CopyButton block={block} host={host} os={os} shell={shell} disabled={copyDisabled} />
      </header>
      <p>{block.context}</p>
      <pre tabIndex={0}><code>{block.code}</code></pre>
    </article>
  );
}

export function InstallCockpit({
  initialHost = "claude-code",
  canonicalHost,
}: {
  initialHost?: HostSlug;
  canonicalHost?: HostSlug;
}) {
  const router = useRouter();
  const [selectedHost, setSelectedHost] = useState<HostSlug>(initialHost);
  const [os, setOs] = useState<OsId>("macos");
  const [shell, setShell] = useState<ShellId>("zsh");
  const [activePhase, setActivePhase] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [projectPath, setProjectPath] = useState("");
  const guide = getInstallGuide(selectedHost) ?? INSTALL_GUIDES[0];
  const shellOptions = getShellOptions(os);
  const supported = guide.supportedOs.includes(os);
  const setupBlocks = getCommandBlocks(guide, "setup", os, projectPath);
  const verifyBlocks = getCommandBlocks(guide, "verify", os, projectPath);
  const dayOneBlocks = getCommandBlocks(guide, "dayOne", os, projectPath);
  const progress = Math.round((completed / phases.length) * 100);
  const validCursorPath = projectPath.trim().startsWith("/");
  const needsCursorPath = guide.slug === "cursor" && activePhase === 0 && !validCursorPath;
  const canAdvance = supported && !needsCursorPath;

  function chooseHost(slug: HostSlug) {
    if (canonicalHost && slug !== canonicalHost) {
      router.push(`/install/${slug}`);
      return;
    }
    setSelectedHost(slug);
    setActivePhase(0);
    setCompleted(0);
  }

  function chooseOs(next: OsId) {
    setOs(next);
    setShell(getShellOptions(next)[0]);
    setActivePhase(0);
    setCompleted(0);
  }

  function advance() {
    const nextCompleted = Math.max(completed, activePhase + 1);
    setCompleted(nextCompleted);
    if (activePhase < phases.length - 1) setActivePhase(activePhase + 1);
  }

  return (
    <>
      <section className={styles.hero} aria-labelledby="install-title">
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true"><i /><i /><i /></div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.breadcrumb}>
              <Link href="/">RecursiveIntell</Link><span>/</span><Link href="/install">Install</Link>
              {canonicalHost ? <><span>/</span><b>{guide.shortName}</b></> : null}
            </div>
            <span className={styles.eyebrow}>Guided install cockpit · source-bounded recipes</span>
            <h1 id="install-title">Memory you can install. <em>Proof you can inspect.</em></h1>
            <p>
              Choose the host you already use. The cockpit gives you the published path,
              the runtime checks that matter, and the boundary the integration does not cross.
            </p>
            <div className={styles.heroSignals} aria-label="Installation principles">
              <span><i /> Local-first</span>
              <span><i /> Fail-open</span>
              <span><i /> Receipt-aware</span>
              <span><i /> No hidden claims</span>
            </div>
          </div>
          <aside className={styles.heroInstrument} aria-label="Installation sequence preview">
            <header><span>INSTALL / PROOF LOOP</span><b>READY</b></header>
            <div className={styles.instrumentPath}>
              {phases.map((phase, index) => (
                <div key={phase.index}>
                  <span>{phase.index}</span>
                  <i aria-hidden="true" />
                  <strong>{phase.label}</strong>
                  <small>{phase.detail}</small>
                  {index < phases.length - 1 ? <b aria-hidden="true">→</b> : null}
                </div>
              ))}
            </div>
            <p><span>Outcome</span><strong>A source-bounded integration check—not a promise.</strong></p>
          </aside>
        </div>
      </section>

      <section className={styles.choose} aria-labelledby="choose-host">
        <div className={styles.sectionIntro}>
          <div><span>01 · CHOOSE A HOST</span><h2 id="choose-host">Use the narrowest integration that fits.</h2></div>
          <p>Hook-capable hosts can participate in lifecycle events. MCP-and-rules hosts expose explicit tools and guidance without pretending a rules file is a hidden hook.</p>
        </div>
        <div className={styles.hostGrid}>
          {INSTALL_GUIDES.map((item) => {
            const active = item.slug === guide.slug;
            return (
              <article className={active ? styles.hostCardActive : styles.hostCard} key={item.slug}>
                <button
                  type="button"
                  onClick={() => chooseHost(item.slug)}
                  aria-pressed={active}
                  data-event="install_host_select"
                  data-event-host={item.slug}
                >
                  <span className={styles.hostIndex}>{item.index}</span>
                  <span className={styles.hostTier}>{item.tier}</span>
                  <strong>{item.name}</strong>
                  <small>{item.summary}</small>
                  <i aria-hidden="true">{active ? "SELECTED" : "SELECT"} →</i>
                </button>
                <Link
                  href={`/install/${item.slug}`}
                  data-event="install_deep_link"
                  data-event-host={item.slug}
                  aria-label={`Open permanent ${item.name} installation guide`}
                >Permanent guide ↗</Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.cockpitSection} aria-labelledby="cockpit-title">
        <div className={styles.cockpitHeader}>
          <div>
            <span>02 · GUIDED EXECUTION</span>
            <h2 id="cockpit-title">{guide.name}</h2>
            <p>{guide.description}</p>
          </div>
          <div className={styles.fitBadge}><small>BEST FIT</small><strong>{guide.fit}</strong></div>
        </div>

        <div className={styles.capabilityRail} aria-label={`${guide.name} capabilities`}>
          {guide.capability.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>)}
        </div>

        <div className={styles.cockpit}>
          <aside className={styles.progressRail} aria-label="Installation progress">
            <div className={styles.progressLabel}>
              <span>YOUR PROGRESS</span><b>{progress}%</b>
            </div>
            <div className={styles.progressTrack} role="progressbar" aria-label="Guide completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <i style={{ width: `${progress}%` }} />
            </div>
            <nav>
              {phases.map((phase, index) => (
                <button
                  type="button"
                  key={phase.index}
                  onClick={() => setActivePhase(index)}
                  disabled={index > completed}
                  className={activePhase === index ? styles.phaseActive : styles.phase}
                  aria-current={activePhase === index ? "step" : undefined}
                  data-event="install_step_select"
                  data-event-host={guide.slug}
                  data-event-step={phase.label.toLowerCase()}
                >
                  <span>{completed > index ? "✓" : phase.index}</span>
                  <b>{phase.label}</b>
                  <small>{phase.detail}</small>
                </button>
              ))}
            </nav>
            <div className={styles.contractStamp}>
              <span>RECIPE CONTRACT</span>
              <b>Source version boundaries shown</b>
              <small>{guide.slug === "rust" ? "Documented example: semantic-memory 0.5.10 · registry snapshot: 0.5.11" : "Published server pin: semantic-memory-mcp 0.5.4"}</small>
            </div>
          </aside>

          <div className={styles.workArea}>
            {activePhase === 0 ? (
              <div className={styles.phaseContent}>
                <header className={styles.phaseHeading}>
                  <span>STEP 01 / CONNECT</span>
                  <h3>Prepare the environment. Then change it once.</h3>
                  <p>Choose the environment that will actually launch {guide.name}. The selector never invents an unsupported translation.</p>
                </header>

                <div className={styles.environment}>
                  <fieldset>
                    <legend>Operating system</legend>
                    <div className={styles.segmented}>
                      {(Object.keys(osLabels) as OsId[]).map((item) => (
                        <button
                          type="button"
                          key={item}
                          aria-pressed={os === item}
                          onClick={() => chooseOs(item)}
                          data-event="install_os_select"
                          data-event-host={guide.slug}
                          data-event-os={item}
                        >{osLabels[item]}</button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>Shell</legend>
                    <div className={styles.segmented}>
                      {shellOptions.map((item) => (
                        <button
                          type="button"
                          key={item}
                          aria-pressed={shell === item}
                          onClick={() => setShell(item)}
                          data-event="install_shell_select"
                          data-event-host={guide.slug}
                          data-event-shell={item}
                        >{shellLabels[item]}</button>
                      ))}
                    </div>
                  </fieldset>
                  {guide.slug === "cursor" ? (
                    <label className={styles.pathField}>
                      <span>Project path</span>
                      <input value={projectPath} onChange={(event) => setProjectPath(event.target.value)} placeholder="/absolute/path/to/project" spellCheck={false} aria-invalid={projectPath.length > 0 && !validCursorPath} />
                      <small>Use an absolute POSIX path. The write step stays locked until the path begins with /.</small>
                    </label>
                  ) : null}
                </div>

                <div className={styles.prerequisites}>
                  {guide.prerequisites.map((item, index) => (
                    <article key={item.label}><span>{String(index + 1).padStart(2, "0")}</span><h4>{item.label}</h4><p>{item.detail}</p></article>
                  ))}
                </div>

                {!supported ? (
                  <div className={styles.supportNotice} role="note">
                    <span>NO PUBLISHED NATIVE RECIPE</span>
                    <h4>{guide.name} on {osLabels[os]}</h4>
                    <p>{guide.osBoundary}</p>
                    <a href={guide.sources[0].href} target="_blank" rel="noreferrer">Check the canonical integration source ↗</a>
                  </div>
                ) : null}

                {supported && guide.osBoundary ? <p className={styles.osNote}><strong>Environment note:</strong> {guide.osBoundary}</p> : null}
                {supported ? setupBlocks.map((block) => <CodePanel key={block.id} block={block} host={guide.slug} os={os} shell={shell} copyDisabled={guide.slug === "cursor" && block.id === "cursor-write" && !validCursorPath} />) : null}
              </div>
            ) : null}

            {activePhase === 1 ? (
              <div className={styles.phaseContent}>
                <header className={styles.phaseHeading}>
                  <span>STEP 02 / PROVE</span>
                  <h3>Verify the runtime you will really use.</h3>
                  <p>A successful package install is only the beginning. Run the source-backed checks this host exposes. Connectivity and doctor checks are not a write-to-search proof; complete the deliberate retrieval check below before trusting recall.</p>
                </header>
                {!supported ? <div className={styles.supportNotice} role="note"><span>VERIFICATION BOUNDARY</span><h4>No source-backed {osLabels[os]} sequence</h4><p>{guide.osBoundary}</p></div> : null}
                {supported ? verifyBlocks.map((block) => <CodePanel key={block.id} block={block} host={guide.slug} os={os} shell={shell} />) : null}
                <div className={styles.expectedGrid}>
                  {guide.expected.map((item, index) => (
                    <article key={item.title}><span>{completed > 1 ? "✓" : String(index + 1).padStart(2, "0")}</span><h4>{item.title}</h4><p>{item.detail}</p></article>
                  ))}
                </div>
                <div className={styles.proofRule}>
                  <div aria-hidden="true"><i /><i /><i /></div>
                  <p><span>PROOF RULE</span><strong>Ask one question whose answer you already know.</strong> Then inspect what was retrieved and which boundary produced it.</p>
                </div>
              </div>
            ) : null}

            {activePhase === 2 ? (
              <div className={styles.phaseContent}>
                <header className={styles.phaseHeading}>
                  <span>STEP 03 / OPERATE</span>
                  <h3>Build useful memory without blurring the evidence.</h3>
                  <p>Day one should establish a trustworthy operating loop: deliberate capture, selective recall, visible degradation, and reversible removal.</p>
                </header>
                <ol className={styles.dayOneList}>
                  {guide.dayOne.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}
                </ol>
                {supported ? dayOneBlocks.map((block) => <CodePanel key={block.id} block={block} host={guide.slug} os={os} shell={shell} />) : null}

                <div className={styles.runbook}>
                  <section>
                    <span>TROUBLESHOOTING</span>
                    <h3>Diagnose by symptom.</h3>
                    <div className={styles.detailsList}>
                      {guide.troubleshooting.map((item, index) => (
                        <details key={item.symptom} open={index === 0} data-event="verification_help_opened" data-event-host={guide.slug} data-event-label={item.symptom}>
                          <summary><b>{item.symptom}</b><span>+</span></summary>
                          <p>{item.response}</p>
                        </details>
                      ))}
                    </div>
                  </section>
                  <section>
                    <span>REVERSIBLE EXIT</span>
                    <h3>Uninstall without losing track of data.</h3>
                    <ol>{guide.uninstall.map((item, index) => <li key={item}><b>{index + 1}</b><p>{item}</p></li>)}</ol>
                  </section>
                </div>

                <aside className={styles.boundary}>
                  <div><span>SUPPORT BOUNDARY</span><b aria-hidden="true">◎</b></div>
                  <p>{guide.boundary}</p>
                </aside>
              </div>
            ) : null}

            <footer className={styles.phaseFooter}>
              <div><span>ACTIVE ENVIRONMENT</span><b>{guide.shortName} · {osLabels[os]} · {shellLabels[shell]}</b></div>
              <button
                type="button"
                onClick={advance}
                disabled={!canAdvance}
                data-event="install_step_complete"
                data-event-host={guide.slug}
                data-event-step={phases[activePhase].label.toLowerCase()}
              >
                {!supported ? "Choose a supported OS" : needsCursorPath ? "Enter the project path" : activePhase === 2 && completed === 3 ? "Guide completed ✓" : activePhase === 2 ? "Mark guide complete" : `Complete & continue to ${phases[activePhase + 1].label}`}
              </button>
            </footer>
          </div>
        </div>

        <footer className={styles.sources}>
          <div><span>SOURCE BOUNDARY</span><p>Commands follow canonical integration documentation or explicitly label a narrower documented version. Tool counts and runtime behavior must still be verified on the installed artifact.</p></div>
          <nav aria-label={`${guide.name} sources`}>
            {guide.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" data-event="install_source_open" data-event-host={guide.slug}>{source.label} ↗</a>)}
          </nav>
        </footer>
      </section>
    </>
  );
}
