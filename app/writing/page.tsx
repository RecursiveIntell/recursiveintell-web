import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

export default async function WritingPage() {
  const entries = await getAllContent("writing");

  return (
    <div>
      <PageHeader
        eyebrow="Essays"
        title="Writing"
        description="Long-form notes on systems, product, and engineering craft."
      />
      <Container className="py-12">
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
