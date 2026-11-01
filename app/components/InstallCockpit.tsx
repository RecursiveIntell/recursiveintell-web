"use client";

import { useId, useState, type KeyboardEvent } from "react";

const paths = [
  {
    id: "ares",
    label: "Ares · full install",
    eyebrow: "YOUR AGENT · YOUR PROVIDER",
    title: "One command. Then make it yours.",
    body: "Install the latest Ares from RecursiveIntell, provision its dependencies, and build Desktop, voice, Rust bindings, Context Governor, local memory, ClaimLedger, Agent Graph, CEA, Pilot Bridge, and the current memory kit. Enhancements are included by default.",
    commands: [
      "curl -fsSL https://recursiveintell.com/ares/install.sh | bash",
      "ares",
      "ares desktop",
      "ares status",
    ],
    note: "Choose your provider and model in the local wizard, then enter an API key or use supported OAuth. OpenAI is optional. Builds may request sudo and take several minutes. See the setup notes below for platform options and Agent Graph’s separate daemon setup.",
  },
  {
    id: "server",
    label: "Your Mnemes server",
    eyebrow: "SELF-HOST ON YOUR HARDWARE",
    title: "Start your personal memory server.",
    body: "Install Mnemes on a Linux machine you already own, bootstrap the first operator-controlled device identity, then run the loopback server.",
    commands: [
      "cargo install mnemes --locked",
      "mnemes-admin bootstrap ~/.local/share/mnemes \"home-server\" \"linux\" \"myserver.local\"",
      "mnemes-server 1738 ~/.local/share/mnemes",
    ],
    note: "Node R1 is not required. Current source uses server-side per-device shards; continuous device-owned replication is still under development.",
  },
  {
    id: "claude",
    label: "Claude Code",
    eyebrow: "ONE DEVICE · SAME MEMORY ENGINE",
    title: "Give Claude persistent local recall.",
    body: "Install the host kit, run its guided setup, ingest the repository, and restart once so lifecycle hooks load.",
    commands: [
      "/plugin marketplace add RecursiveIntell/agent-memory-kits",
      "/plugin install semantic-memory@semantic-memory-kit",
      "/memory-setup",
      "/memory-ingest .",
    ],
    note: "This keeps the same semantic-memory engine locally. Without Mnemes, there is no server copy or routed cross-device memory layer.",
  },
  {
    id: "codex",
    label: "Codex",
    eyebrow: "ONE DEVICE · SAME MEMORY ENGINE",
    title: "Carry project state across sessions.",
    body: "Install the Codex kit from the public repository. It configures MCP, recall hooks, prompts, skills, compaction, and claim/evidence workflows.",
    commands: [
      "git clone https://github.com/RecursiveIntell/agent-memory-kits",
      "cd agent-memory-kits",
      "codex plugin marketplace add ./codex",
      "codex plugin add semantic-memory@semantic-memory-codex-kit",
    ],
    note: "Use one canonical store directory across agents. This path keeps local memory quality without adding the Mnemes server boundary.",
  },
  {
    id: "mcp",
    label: "Any MCP host",
    eyebrow: "ONE DEVICE · DIRECT MCP",
    title: "Install the memory protocol directly.",
    body: "Run the local MCP server with a bounded daily-use profile. The default embedding path can run in process without a hosted database.",
    commands: [
      "cargo install semantic-memory-mcp --locked",
      "semantic-memory-mcp --memory-dir ~/.local/share/semantic-memory --tool-profile agent",
    ],
    note: "The memory engine is not reduced. What is absent is Mnemes device identity, server-side copies, and cross-device routed search.",
  },
];

export function InstallCockpit({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const [copyError, setCopyError] = useState("");
  const item = paths[selected];

  async function copy(command: string, index: number) {
    try {
      await navigator.clipboard.writeText(command);
      setCopyError("");
      setCopied(index);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
      setCopyError("Copy was unavailable. Select the command text and copy it manually.");
    }
  }

  function select(index: number) {
    setSelected(index);
    setCopied(null);
    setCopyError("");
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % paths.length;
    else if (event.key === "ArrowLeft") next = (index + paths.length - 1) % paths.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = paths.length - 1;
    else return;
    event.preventDefault();
    select(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  }

  return (
    <section className={`install-cockpit ${compact ? "install-compact" : ""}`}>
      <div className="install-tabs" role="tablist" aria-label="Installation paths">
        {paths.map((path, index) => (
          <button
            role="tab"
            id={`${id}-${path.id}`}
            type="button"
            aria-selected={selected === index}
            aria-controls={`${id}-panel`}
            tabIndex={selected === index ? 0 : -1}
            className={selected === index ? "active" : ""}
            key={path.id}
            onClick={() => select(index)}
            onKeyDown={(event) => navigate(event, index)}
          >
            <span>0{index + 1}</span>
            {path.label}
          </button>
        ))}
      </div>
      <div className="install-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${item.id}`} tabIndex={0}>
        <div className="install-copy">
          <small>{item.eyebrow}</small>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <div className="install-note"><i />{item.note}</div>
        </div>
        <div className="terminal">
          <header><i /><i /><i /><span>operator@local · {item.id}</span></header>
          <div>
            {item.commands.map((command, index) => (
              <button type="button" key={command} onClick={() => copy(command, index)} aria-label={`Copy command ${index + 1}`}>
                <span>$</span>
                <code>{command}</code>
                <b>{copied === index ? "COPIED" : "COPY"}</b>
              </button>
            ))}
          </div>
          <p className="install-copy-feedback" role="status" aria-live="polite">{copyError || (copied !== null ? "Command copied." : "")}</p>
        </div>
      </div>
    </section>
  );
}
