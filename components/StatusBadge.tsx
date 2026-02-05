export type ContentStatus = "active" | "shipping" | "paused" | "archived" | "prototype";

type StatusBadgeProps = {
  status: ContentStatus;
};

const statusStyles: Record<ContentStatus, string> = {
  active: "bg-[color:var(--color-accent)] text-white",
  shipping: "bg-[color:var(--color-accent-2)] text-white",
  paused: "bg-neutral-200 text-neutral-700",
  archived: "bg-neutral-100 text-neutral-500",
  prototype: "bg-amber-500 text-white",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
