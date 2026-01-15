import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

export default async function LabPage() {
  const entries = await getAllContent("lab");

  return (
    <div>
      <PageHeader
        eyebrow="Experiments"
        title="Lab"
        description="Prototypes, technical explorations, and notes from the workbench."
      />
      <Container className="py-12">
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
