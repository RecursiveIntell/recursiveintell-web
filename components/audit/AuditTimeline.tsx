"use client";

import { useState } from "react";
import {
  auditEntries,
  categoryMeta,
  groupByMonth,
  type AuditCategory,
} from "@/lib/audit";
import { AuditEntryRow } from "@/components/audit/AuditEntryRow";

export function AuditTimeline() {
  const [activeFilter, setActiveFilter] = useState<AuditCategory | null>(null);

  const filtered = activeFilter
    ? auditEntries.filter((e) => e.category === activeFilter)
    : auditEntries;

  const groups = groupByMonth(filtered);

  return (
    <div>
      {/* Category filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
            activeFilter === null
              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]"
              : "border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 text-[color:var(--color-muted)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
          }`}
        >
          All
        </button>
        {(Object.keys(categoryMeta) as AuditCategory[]).map((cat) => {
          const meta = categoryMeta[cat];
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(isActive ? null : cat)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                isActive
                  ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]"
                  : "border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 text-[color:var(--color-muted)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
              }`}
            >
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {groups.length === 0 ? (
        <p className="text-[color:var(--color-muted)]">
          No entries match the selected filter.
        </p>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.month}>
              {/* Month heading */}
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                {group.month}
              </h2>

              {/* Entries with timeline rail */}
              <div className="relative border-l-2 border-[color:var(--color-border)] pl-6">
                {group.entries.map((entry, idx) => (
                  <AuditEntryRow
                    key={entry.id}
                    entry={entry}
                    isLast={idx === group.entries.length - 1}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
