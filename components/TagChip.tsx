type TagChipProps = {
  tag: string;
};

export function TagChip({ tag }: TagChipProps) {
  return (
    <span className="tag-hover inline-block cursor-default rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]">
      {tag}
    </span>
  );
}
