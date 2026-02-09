import { auditEntries, categoryMeta, type AuditCategory } from "@/lib/audit";

export function AuditSummaryBar() {
  const counts = new Map<AuditCategory, number>();
  for (const entry of auditEntries) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }

  return (
    <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {(Object.keys(categoryMeta) as AuditCategory[]).map((cat) => {
        const meta = categoryMeta[cat];
        const count = counts.get(cat) ?? 0;
        return (
          <div
            key={cat}
            className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ backgroundColor: meta.color }}
            >
              {count}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
