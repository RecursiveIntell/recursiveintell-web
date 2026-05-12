"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import searchIndex from "@/public/data/search-index.json";
import { TagChip } from "@/components/TagChip";

type SearchItem = {
  id: string;
  title: string;
  type: string;
  summary: string;
  tags: string[];
  date: string;
  href: string;
  status?: string;
};

const index = searchIndex as SearchItem[];

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [tag, setTag] = useState("all");
  const [status, setStatus] = useState("all");

  const types = useMemo(() => unique(index.map((item) => item.type)), []);
  const tags = useMemo(() => unique(index.flatMap((item) => item.tags)), []);
  const statuses = useMemo(
    () => unique(index.map((item) => item.status).filter(Boolean) as string[]),
    []
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return index.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return (
        (!normalized || haystack.includes(normalized)) &&
        (type === "all" || item.type === type) &&
        (tag === "all" || item.tags.includes(tag)) &&
        (status === "all" || item.status === status)
      );
    });
  }, [query, status, tag, type]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
          Search
          <input
            className="mt-3 w-full rounded-md border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-sm normal-case tracking-normal text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-accent)]"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Project, tag, note..."
          />
        </label>

        <div className="mt-5 grid gap-4">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Type
            <select
              className="mt-2 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-3 py-2 text-sm normal-case tracking-normal text-[color:var(--color-text)]"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="all">All types</option>
              {types.map((itemType) => (
                <option key={itemType} value={itemType}>
                  {itemType}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Tag
            <select
              className="mt-2 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-3 py-2 text-sm normal-case tracking-normal text-[color:var(--color-text)]"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            >
              <option value="all">All tags</option>
              {tags.map((itemTag) => (
                <option key={itemTag} value={itemTag}>
                  {itemTag}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Status
            <select
              className="mt-2 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-3 py-2 text-sm normal-case tracking-normal text-[color:var(--color-text)]"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              {statuses.map((itemStatus) => (
                <option key={itemStatus} value={itemStatus}>
                  {itemStatus}
                </option>
              ))}
            </select>
          </label>
        </div>
      </aside>

      <section aria-live="polite">
        <div className="mb-4 text-sm text-[color:var(--color-muted)]">
          {results.length} result{results.length === 1 ? "" : "s"}
        </div>
        <div className="grid gap-4">
          {results.map((item) => (
            <Link
              className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 transition hover:border-[color:var(--color-accent)]"
              href={item.href}
              key={item.id}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                <span>{item.type}</span>
                {item.status ? <span>{item.status}</span> : null}
              </div>
              <h2 className="mt-2 text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((itemTag) => (
                  <TagChip key={itemTag} tag={itemTag} />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
