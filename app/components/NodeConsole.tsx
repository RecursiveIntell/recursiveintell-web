"use client";

import { useMemo, useState } from "react";

type InstrumentState = "memory" | "hermes" | "local" | "power" | "offline";

const states: Array<{
  id: InstrumentState;
  label: string;
  code: string;
  title: string;
  lines: [string, string, string];
  note: string;
  tone: string;
}> = [
  {
    id: "memory",
    label: "Memory",
    code: "MNE / 018",
    title: "Mnemes ready",
    lines: ["SHARDS 04 ELIGIBLE", "ROUTE RECEIPTS ON", "LAST CHECK 00:42"],
    note: "The node shows memory-plane state without pretending network reachability proves synchronization.",
    tone: "cyan",
  },
  {
    id: "hermes",
    label: "Hermes",
    code: "AGT / 001",
    title: "Agent available",
    lines: ["TUI VIA SECURE SHELL", "PROVIDER USER-SET", "SCHEDULES 03 ARMED"],
    note: "Hermes can run jobs and tools from the node once a suitable model provider or local endpoint is configured.",
    tone: "gold",
  },
  {
    id: "local",
    label: "Local AI",
    code: "SML / 0.8B",
    title: "Small model active",
    lines: ["QWEN3.5 0.8B", "TASK REWORD STATUS", "EXTERNAL CALL NONE"],
    note: "The onboard model handles bounded utility work such as simplifying, synthesizing, or rewording display information.",
    tone: "violet",
  },
  {
    id: "power",
    label: "Power",
    code: "PWR / R1",
    title: "Battery target",
    lines: ["CELL 2500–4000 mAh", "ENDURANCE UNMEASURED", "POWER GATE OPEN"],
    note: "Portable all-day operation is a design target. Final cell capacity and endurance stay unclaimed until measured.",
    tone: "green",
  },
  {
    id: "offline",
    label: "Offline",
    code: "NET / DEG",
    title: "Local services remain",
    lines: ["UPLINK UNAVAILABLE", "LOCAL MEMORY READY", "SYNC STATE PAUSED"],
    note: "Loss of internet can degrade remote models and cross-device exchange without erasing local memory or node state.",
    tone: "rose",
  },
];

function isActive(state: InstrumentState, x: number, y: number) {
  if (state === "memory") {
    return x === 3 || x === 12 || (y < 4 && (x === 4 + y || x === 11 - y));
  }
  if (state === "hermes") {
    return (
      (y === 1 && x > 3 && x < 12) ||
      (y === 6 && x > 3 && x < 12) ||
      (x === 3 && y > 1 && y < 6) ||
      (x === 12 && y > 1 && y < 6) ||
      (y === 4 && (x === 6 || x === 9))
    );
  }
  if (state === "local") {
    return (x + y * 2) % 7 === 0 || (x > 5 && x < 10 && y > 2 && y < 6);
  }
  if (state === "power") {
    return (
      (y === 2 || y === 6) && x > 2 && x < 13 ||
      (x === 3 || x === 12) && y > 2 && y < 6 ||
      (x > 4 && x < 10 && y > 3 && y < 6) ||
      (x === 13 && (y === 3 || y === 4 || y === 5))
    );
  }
  return x === y + 4 || x === 11 - y;
}

export function NodeConsole({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<InstrumentState>("memory");
  const current = states.find((state) => state.id === selected)!;
  const dots = useMemo(
    () =>
      Array.from({ length: 128 }, (_, index) => ({
        x: index % 16,
        y: Math.floor(index / 16),
      })),
    [],
  );

  return (
    <section className={`node-console node-state-${selected} ${compact ? "node-console-compact" : ""}`}>
      <div className="node-stage" aria-label="Interactive Mnemes Node R1 concept instrument">
        <div className="node-aura" />
        <div className="node-device">
          <div className="node-topline">
            <span>MNEMES NODE</span>
            <b>R1 / PROTOTYPE</b>
          </div>
          <div className="node-face">
            <div className="node-matrix" aria-hidden="true">
              {dots.map((dot, index) => (
                <i
                  key={index}
                  className={isActive(selected, dot.x, dot.y) ? "active" : ""}
                  style={{ "--dot-delay": `${(dot.x + dot.y) * 32}ms` } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="node-oled">
              <header><span>{current.code}</span><i /></header>
              <strong>{current.title}</strong>
              {current.lines.map((line) => <small key={line}>{line}</small>)}
            </div>
            <div className="node-controls">
              <i className={`node-led tone-${current.tone}`} />
              <button aria-label="Node control button"><span /></button>
            </div>
          </div>
          <div className="node-vents">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>
          <div className="node-port"><span>USB-C</span><i /></div>
          <div className="node-foot">BUILT ON ARDUINO UNO Q 4GB · INDEPENDENT RECURSIVEINTELL PROTOTYPE</div>
        </div>
      </div>

      <div className="node-instrument">
        <header>
          <span><i /> OPERATOR INSTRUMENT</span>
          <b>SELECT A NODE STATE</b>
        </header>
        <div className="node-tabs" role="tablist" aria-label="Node display states">
          {states.map((state, index) => (
            <button
              key={state.id}
              role="tab"
              aria-selected={selected === state.id}
              className={selected === state.id ? "active" : ""}
              onClick={() => setSelected(state.id)}
            >
              <span>0{index + 1}</span>{state.label}
            </button>
          ))}
        </div>
        <article>
          <small>{current.code}</small>
          <h3>{current.title}</h3>
          <p>{current.note}</p>
          <div>
            {current.lines.map((line) => <span key={line}><i />{line}</span>)}
          </div>
        </article>
        {!compact && (
          <footer>
            Concept interface based on the founder-reported personal prototype as of July 2026. Enclosure, onboarding flow, battery, and final shipped configuration remain subject to revision.
          </footer>
        )}
      </div>
    </section>
  );
}
