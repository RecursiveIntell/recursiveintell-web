import Link from "next/link";
import { formatDate } from "@/lib/format";
import { StatusBadge, type ContentStatus } from "@/components/StatusBadge";
import { TagChip } from "@/components/TagChip";

type ContentCardProps = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
  status?: ContentStatus;
  eyebrow?: string;
  featured?: boolean;
};

export function ContentCard({
  title,
  summary,
  date,
  href,
  tags,
  status,
  eyebrow,
  featured,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-accent)]"
    >
      <div className="flex flex-wrap items-center gap-3">
        {featured ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-2)]">
            ✦ featured
          </span>
        ) : null}
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {eyebrow}
          </span>
        ) : null}
        {status ? <StatusBadge status={status} /> : null}
      </div>
      <div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm text-[color:var(--color-muted)]">
          {summary}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
          {formatDate(date)}
        </span>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </Link>
  );
}
