import type { Metadata } from "next";
import buildlog from "@/public/data/buildlog.json";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/format";

type BuildLogEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  source: string;
  href?: string;
  sha?: string;
};

export const metadata: Metadata = {
  title: "Build Log",
  description: "Release and maintenance notes for RecursiveIntell.",
};

export default function BuildLogPage() {
  const entries = buildlog as BuildLogEntry[];

  return (
    <div>
      <PageHeader
        eyebrow="Changelog"
        title="Build Log"
        description="A static JSON-backed record of releases, nightly maintenance, and notable site changes."
      />
      <Container className="py-12">
        <div className="grid gap-4">
          {entries.map((entry) => (
            <article
              className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5"
              key={entry.id}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                <span>{formatDate(entry.date)}</span>
                <span>{entry.source}</span>
                {entry.sha ? <span>{entry.sha.slice(0, 7)}</span> : null}
              </div>
              <h2 className="mt-2 text-2xl">{entry.title}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">{entry.summary}</p>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
