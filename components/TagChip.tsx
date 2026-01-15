type TagChipProps = {
  tag: string;
};

export function TagChip({ tag }: TagChipProps) {
  return (
    <span className="rounded-full border border-[color:var(--color-border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
      {tag}
    </span>
  );
}
