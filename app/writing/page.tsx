import Link from "next/link";
import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

type IndexPageProps = {
  searchParams: Promise<{
    tag?: string;
  }>;
};

export default async function WritingPage({ searchParams }: IndexPageProps) {
  const params = await searchParams;
  const allEntries = await getAllContent("writing");
  const tags = Array.from(new Set(allEntries.flatMap((entry) => entry.tags))).sort();
  const entries = allEntries.filter(
    (entry) => !params.tag || entry.tags.includes(params.tag)
  );

  return (
    <div>
      <PageHeader
        eyebrow="Essays"
        title="Writing"
        description="Long-form notes on systems, product, and engineering craft."
      />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs" href="/writing">
            all
          </Link>
          {tags.map((tag) => (
            <Link
              className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs"
              href={`/writing?tag=${encodeURIComponent(tag)}`}
              key={tag}
            >
              #{tag}
            </Link>
          ))}
        </div>
        {entries.length === 0 ? (
          <p className="text-[color:var(--color-muted)]">
            No writing yet. Add MDX files in `content/writing` to publish.
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
                href={contentHref("writing", entry.slug)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
