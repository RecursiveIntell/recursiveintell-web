import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { TagChip } from "@/components/TagChip";
import { formatDate } from "@/lib/format";
import { getAllContent } from "@/lib/content";

export default async function VaultDownloadsPage() {
  const entries = await getAllContent("vault-downloads");

  return (
    <div>
      <PageHeader
        eyebrow="Vault"
        title="Downloads"
        description="Files, checklists, and assets ready to ship."
      />
      <Container className="py-12">
        {entries.length === 0 ? (
          <p className="text-[color:var(--color-muted)]">
            No downloads yet. Add MDX files in `content/vault/downloads` to publish.
          </p>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <section
                key={entry.slug}
                id={entry.slug}
                className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                  <span>{formatDate(entry.date)}</span>
                  {entry.tags.map((tag) => (
                    <TagChip key={tag} tag={tag} />
                  ))}
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{entry.title}</h2>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                  {entry.summary}
                </p>
                {entry.links ? (
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                    {Object.entries(entry.links).map(([label, url]) => (
                      <Link key={label} href={url} className="underline">
                        {label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
