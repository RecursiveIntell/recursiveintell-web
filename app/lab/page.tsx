import Link from "next/link";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

type IndexPageProps = {
  searchParams: Promise<{
    tag?: string;
    status?: string;
  }>;
};

export default async function LabPage({ searchParams }: IndexPageProps) {
  const params = await searchParams;
  const allEntries = await getAllContent("lab");
  const tags = Array.from(new Set(allEntries.flatMap((entry) => entry.tags))).sort();
  const statuses = Array.from(
    new Set(allEntries.flatMap((entry) => (entry.status ? [entry.status] : [])))
  ).sort();
  const entries = allEntries.filter(
    (entry) =>
      (!params.tag || entry.tags.includes(params.tag)) &&
      (!params.status || entry.status === params.status)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Experiments"
        title="Lab"
        description="Prototypes, technical explorations, and notes from the workbench."
      />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs" href="/lab">
            all
          </Link>
          {statuses.map((status) => (
            <Link
              className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs"
              href={`/lab?status=${encodeURIComponent(status)}`}
              key={status}
            >
              {status}
            </Link>
          ))}
          {tags.map((tag) => (
            <Link
              className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs"
              href={`/lab?tag=${encodeURIComponent(tag)}`}
              key={tag}
            >
              #{tag}
            </Link>
          ))}
        </div>
        {entries.length === 0 ? (
          <p className="text-[color:var(--color-muted)]">
            No lab notes yet. Add MDX files in `content/lab` to publish.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {entries.map((entry) => (
              <ContentCard
                key={entry.slug}
                title={entry.title}
                summary={entry.summary}
                date={entry.date}
                tags={entry.tags}
                status={entry.status}
                href={contentHref("lab", entry.slug)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
