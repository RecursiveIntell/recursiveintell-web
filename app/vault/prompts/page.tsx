import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

export default async function VaultPromptsPage() {
  const entries = await getAllContent("vault-prompts");

  return (
    <div>
      <PageHeader
        eyebrow="Vault"
        title="Prompts"
        description="Reusable prompt templates and interview flows."
      />
      <Container className="py-12">
        {entries.length === 0 ? (
          <p className="text-[color:var(--color-muted)]">
            No prompts yet. Add MDX files in `content/vault/prompts` to publish.
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
                eyebrow="Prompt"
                href={contentHref("vault-prompts", entry.slug)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
