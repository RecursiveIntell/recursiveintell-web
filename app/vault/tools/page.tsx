import { Container } from "@/components/Container";
import { ContentCard } from "@/components/ContentCard";
import { PageHeader } from "@/components/PageHeader";
import { contentHref, getAllContent } from "@/lib/content";

export default async function VaultToolsPage() {
  const entries = await getAllContent("vault-tools");

  return (
    <div>
      <PageHeader
        eyebrow="Vault"
        title="Tools"
        description="Utilities, scripts, and internal helpers that support the work."
      />
      <Container className="py-12">
        {entries.length === 0 ? (
          <p className="text-[color:var(--color-muted)]">
            No tools yet. Add MDX files in `content/vault/tools` to publish.
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
                eyebrow="Tool"
                href={contentHref("vault-tools", entry.slug)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
