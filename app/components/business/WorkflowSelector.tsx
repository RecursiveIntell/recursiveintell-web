"use client";

import { useState } from "react";
import { workflows } from "../../data/business";

export function WorkflowSelector() {
  const [selectedId, setSelectedId] = useState(workflows[0].id);
  const selected = workflows.find((item) => item.id === selectedId) ?? workflows[0];

  const steps = [
    ["SOURCE", selected.source],
    ["BOUNDED AGENT", selected.agent],
    ["HUMAN GATE", selected.approval],
    ["EXISTING TOOL", selected.action],
    ["RECORD", selected.record],
  ];

  return (
    <div className="workflow-selector">
      <div className="workflow-tabs" aria-label="Example workflows">
        {workflows.map((workflow) => (
          <button
            key={workflow.id}
            type="button"
            aria-pressed={workflow.id === selected.id}
            aria-controls="workflow-example-panel"
            onClick={() => setSelectedId(workflow.id)}
          >
            {workflow.label}
          </button>
        ))}
      </div>
      <div id="workflow-example-panel" className="workflow-path" aria-live="polite">
        {steps.map(([label, body], index) => (
          <article key={label}>
            <span>0{index + 1}</span>
            <small>{label}</small>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <div className="workflow-boundary">
        <strong>Example workflow, not a customer deployment claim.</strong>
        <span>{selected.boundary}</span>
      </div>
    </div>
  );
}
