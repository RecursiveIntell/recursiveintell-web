import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TagChip } from "@/components/TagChip";
import { formatDate } from "@/lib/format";
import { getContentPage, getContentSlugs } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("vault-prompts");
  return slugs.map((slug) => ({ slug }));
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getContentPage("vault-prompts", slug);

  if (!entry) {
    notFound();
  }

  const { frontmatter, content } = entry;

  return (
    <article className="py-12">
      <Container>
        <Link
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]"
          href="/vault/prompts"
        >
          Back to prompts
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {formatDate(frontmatter.date)}
          </span>
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl">{frontmatter.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-[color:var(--color-muted)]">
          {frontmatter.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
        <div className="prose mt-10">{content}</div>
      </Container>
    </article>
  );
}
