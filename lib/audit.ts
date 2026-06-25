export type AuditCategory =
  | "feature"
  | "fix"
  | "content"
  | "design"
  | "infra"
  | "refactor";

export type AuditEntry = {
  id: string;
  date: string;
  title: string;
  description?: string;
  category: AuditCategory;
  scope?: string;
};

export const categoryMeta: Record<
  AuditCategory,
  { label: string; color: string; icon: string }
> = {
  feature: {
    label: "Feature",
    color: "var(--color-accent)",
    icon: "plus",
  },
  fix: {
    label: "Fix",
    color: "#ef4444",
    icon: "wrench",
  },
  content: {
    label: "Content",
    color: "var(--color-accent-2)",
    icon: "pencil",
  },
  design: {
    label: "Design",
    color: "#8b5cf6",
    icon: "palette",
  },
  infra: {
    label: "Infra",
    color: "#6366f1",
    icon: "server",
  },
  refactor: {
    label: "Refactor",
    color: "#14b8a6",
    icon: "arrows",
  },
};

/**
 * Static audit log entries, newest first.
 * Add new entries to the top of the array.
 */
export const auditEntries: AuditEntry[] = [
  {
    id: "014",
    date: "2026-06-25",
    title: "AiDENs autonomous loop demonstrated",
    description:
      "Closed-loop self-learning AI: 14 iterations, 12/12 tasks completed, 29 facts captured. 8 mission types with adaptive priority.",
    category: "feature",
    scope: "projects",
  },
  {
    id: "013",
    date: "2026-06-24",
    title: "semantic-memory published on crates.io",
    description:
      "48 MCP tools, 15 HTTP endpoints, RL routing with persistence, auto-management via HTTP endpoints, tool profile gating.",
    category: "feature",
    scope: "libraries",
  },
  {
    id: "012",
    date: "2026-06-24",
    title: "semantic-memory-claude-kit v0.5.2 released",
    description:
      "Claude Code plugin with auto-recall, auto-capture, dedup guard, receipts, primer, maintenance hooks.",
    category: "feature",
    scope: "libraries",
  },
  {
    id: "011",
    date: "2026-06-23",
    title: "semantic-memory: 11 server gaps fixed",
    description:
      "RL routing persistence, real integrity checks, full search-routed pipeline, discord HTTP endpoint, maintenance endpoints, 15 new MCP tools.",
    category: "fix",
    scope: "libraries",
  },
  {
    id: "010",
    date: "2026-05-19",
    title: "Portfolio narrowed to Rust stack",
    description:
      "Focused on Recall, Gloss, ClaimLedger, Palisade, and Rust Libraries.",
    category: "content",
    scope: "site",
  },
  {
    id: "009",
    date: "2026-02-09",
    title: "Add audit log page with timeline design",
    description:
      "New /audit route showing a transparent changelog of all site updates, grouped by month with category filtering.",
    category: "feature",
    scope: "site",
  },
  {
    id: "008",
    date: "2026-02-08",
    title: "Add GitHub links to project cards",
    description:
      "Project cards and detail pages now display direct links to source repositories.",
    category: "feature",
    scope: "projects",
  },
  {
    id: "007",
    date: "2026-02-07",
    title: "Refine command palette search UX",
    description:
      "Improved keyboard navigation and result ranking in the Cmd+K palette.",
    category: "design",
    scope: "site",
  },
  {
    id: "006",
    date: "2026-02-05",
    title: "RAG vector data synchronization",
    description:
      "Rebuilt vector embeddings for the AI chat context with updated project content.",
    category: "infra",
    scope: "chat",
  },
  {
    id: "005",
    date: "2026-02-03",
    title: "Add case study fields to project schema",
    description:
      "Projects now support problem, solution, results, role, and metrics frontmatter for richer narratives.",
    category: "feature",
    scope: "projects",
  },
  {
    id: "004",
    date: "2026-02-01",
    title: "Implement dark mode theme system",
    description:
      "Full theme toggle with CSS custom properties, smooth transitions, and persistent preference.",
    category: "design",
    scope: "site",
  },
  {
    id: "003",
    date: "2026-01-28",
    title: "Launch vault section with prompts, tools, downloads",
    description:
      "Three new content collections under /vault for reusable assets.",
    category: "feature",
    scope: "vault",
  },
  {
    id: "002",
    date: "2026-01-25",
    title: "Fix MDX compilation error on empty frontmatter",
    description:
      "Content loader now gracefully handles missing optional fields instead of throwing.",
    category: "fix",
    scope: "content",
  },
  {
    id: "001",
    date: "2026-01-20",
    title: "Initial site launch",
    description:
      "RecursiveIntell portfolio goes live with projects, lab, writing, and about pages.",
    category: "feature",
    scope: "site",
  },
];

/**
 * Group entries by month label (e.g. "February 2026").
 */
export function groupByMonth(
  entries: AuditEntry[]
): { month: string; entries: AuditEntry[] }[] {
  const map = new Map<string, AuditEntry[]>();

  for (const entry of entries) {
    const d = new Date(entry.date);
    const key = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(d);

    const group = map.get(key);
    if (group) {
      group.push(entry);
    } else {
      map.set(key, [entry]);
    }
  }

  return Array.from(map.entries()).map(([month, entries]) => ({
    month,
    entries,
  }));
}
