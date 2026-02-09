"use client";

import { useState } from "react";
import { categoryMeta, type AuditEntry } from "@/lib/audit";
import { formatDate } from "@/lib/format";
import { AuditCategoryIcon } from "@/components/audit/AuditCategoryIcon";

type AuditEntryRowProps = {
  entry: AuditEntry;
  isLast: boolean;
};

export function AuditEntryRow({ entry, isLast }: AuditEntryRowProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = categoryMeta[entry.category];

  return (
    <div className={`relative ${isLast ? "" : "pb-6"}`}>
      {/* Timeline dot */}
      <span
        className="absolute -left-[calc(1.5rem+5px)] top-1.5 flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-[color:var(--color-paper)]"
        style={{ backgroundColor: meta.color }}
      />

      {/* Row content */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="group w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
          {/* Category icon + badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-white"
            style={{ backgroundColor: meta.color }}
          >
            <AuditCategoryIcon icon={meta.icon} />
            {meta.label}
          </span>

          {/* Scope tag */}
          {entry.scope ? (
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--color-muted)]">
              {entry.scope}
            </span>
          ) : null}

          {/* Date */}
          <span className="ml-auto text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {formatDate(entry.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base font-semibold transition-colors group-hover:text-[color:var(--color-accent)]">
          {entry.title}
        </h3>

        {/* Expand hint */}
        {entry.description ? (
          <span className="mt-1 inline-block text-xs text-[color:var(--color-muted)]">
            {expanded ? "Hide details" : "Show details"}
            <svg
              className={`ml-1 inline-block h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        ) : null}
      </button>

      {/* Expandable description */}
      {expanded && entry.description ? (
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
          {entry.description}
        </p>
      ) : null}
    </div>
  );
}
