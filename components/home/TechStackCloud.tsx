"use client";

import { useMemo } from "react";

type TagData = {
  count: number;
  types: string[];
};

type TechStackCloudProps = {
  tagMap: Record<string, TagData>;
  onTagClick?: (tag: string) => void;
};

export function TechStackCloud({ tagMap, onTagClick }: TechStackCloudProps) {
  const sortedTags = useMemo(() => {
    return Object.entries(tagMap)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 20);
  }, [tagMap]);

  const maxCount = Math.max(...sortedTags.map(([, data]) => data.count));
  const minCount = Math.min(...sortedTags.map(([, data]) => data.count));

  const getSize = (count: number) => {
    if (maxCount === minCount) return "text-base";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.8) return "text-2xl font-semibold";
    if (ratio > 0.6) return "text-xl font-semibold";
    if (ratio > 0.4) return "text-lg";
    if (ratio > 0.2) return "text-base";
    return "text-sm";
  };

  const getColor = (count: number) => {
    if (maxCount === minCount) return "text-[color:var(--color-muted)]";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.6) return "text-[color:var(--color-accent)]";
    if (ratio > 0.3) return "text-[color:var(--color-ink)]";
    return "text-[color:var(--color-muted)]";
  };

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">Tech Stack</h2>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Technologies used across projects
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60 p-8 backdrop-blur">
        {sortedTags.map(([tag, data]) => (
          <button
            key={tag}
            onClick={() => onTagClick?.(tag)}
            className={`rounded-full border border-transparent px-4 py-2 transition-all hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-card)] ${getSize(data.count)} ${getColor(data.count)}`}
          >
            {tag}
            <span className="ml-1.5 text-xs font-normal text-[color:var(--color-muted)]">
              ({data.count})
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
