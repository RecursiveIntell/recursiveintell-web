import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { TagChip } from "@/components/TagChip";
import { AskAboutButton } from "@/components/chat/AskAboutButton";
import { formatDate, calculateReadingTime } from "@/lib/format";
import { getContentPage, getContentSlugs, getContentBySlug, getAllContent, contentHref } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getContentSlugs("writing");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getContentBySlug("writing", slug);

  if (!entry) {
    return {
      title: "Article Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recursiveintell.com";

  return {
    title: entry.title,
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      type: "article",
      publishedTime: entry.date,
      url: `${siteUrl}/writing/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.summary,
    },
    alternates: {
      canonical: `${siteUrl}/writing/${slug}`,
    },
  };
}

// Get related articles based on shared tags
async function getRelatedArticles(currentSlug: string, currentTags: string[], limit = 3) {
  const allWriting = await getAllContent("writing");

  const scoredArticles = allWriting
    .filter((a) => a.slug !== currentSlug)
    .map((article) => {
      const sharedTags = article.tags.filter((tag) => currentTags.includes(tag));
      return { article, score: sharedTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredArticles.map((item) => item.article);
}

export default async function WritingDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Get both the raw content (for reading time) and compiled content
  const rawEntry = await getContentBySlug("writing", slug);
  const entry = await getContentPage("writing", slug);

  if (!entry || !rawEntry) {
    notFound();
  }

  const { frontmatter, content } = entry;
  const readingTime = calculateReadingTime(rawEntry.content);

  // Get related articles
  const relatedArticles = await getRelatedArticles(slug, frontmatter.tags);

  return (
    <article className="py-12">
      <Container>
        <Link
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-accent)]"
          href="/writing"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to writing
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {formatDate(frontmatter.date)}
          </span>
          <span className="text-[color:var(--color-muted)]">•</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime}
          </span>
        </div>

        <h1 className="mt-4 text-4xl text-[color:var(--color-text)] sm:text-5xl">
          {frontmatter.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[color:var(--color-muted)]">
          {frontmatter.summary}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
          <AskAboutButton
            title={frontmatter.title}
            type="writing"
            slug={slug}
          />
        </div>

        {/* Reading progress indicator */}
        <div className="prose mt-10">{content}</div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 border-t border-[color:var(--color-border)] pt-8">
            <h3 className="text-xl font-semibold text-[color:var(--color-text)]">Related Articles</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={contentHref("writing", article.slug)}
                  className="group rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 transition-all hover:border-[color:var(--color-accent)] hover:shadow-md"
                >
                  <h4 className="font-semibold text-[color:var(--color-text)] group-hover:text-[color:var(--color-accent)]">
                    {article.title}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-sm text-[color:var(--color-muted)]">
                    {article.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[color:var(--color-paper)] px-2 py-0.5 text-xs text-[color:var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
