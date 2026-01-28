import Link from "next/link";
import { formatDate } from "@/lib/format";
import { StatusBadge, type ContentStatus } from "@/components/StatusBadge";
import { TagChip } from "@/components/TagChip";

type LargeProjectCardProps = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
  status?: ContentStatus;
  featured?: boolean;
  links?: Record<string, string>;
};

export function LargeProjectCard({
  title,
  summary,
  date,
  href,
  tags,
  status,
  featured,
  links,
}: LargeProjectCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col gap-5 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[color:var(--color-accent)] hover:shadow-xl hover:shadow-[color:var(--color-accent)]/10"
    >
      {featured && (
        <span className="absolute -top-3 right-6 rounded-full bg-[color:var(--color-accent-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
          Featured
        </span>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {status && <StatusBadge status={status} />}
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
          {formatDate(date)}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-3xl font-semibold transition-colors group-hover:text-[color:var(--color-accent)]">
          {title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-[color:var(--color-muted)]">
          {summary}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 5).map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
        {tags.length > 5 && (
          <span className="rounded-full border border-[color:var(--color-border)] bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--color-muted)]">
            +{tags.length - 5}
          </span>
        )}
      </div>

      {links && Object.keys(links).length > 0 && (
        <div className="flex flex-wrap gap-3 border-t border-[color:var(--color-border)] pt-4">
          {Object.entries(links).slice(0, 3).map(([label]) => (
            <span
              key={label}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-accent)]"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)] transition-all group-hover:gap-3">
        View Project
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </span>
    </Link>
  );
}
