import { Container } from "@/components/Container";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
};

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="border-b border-[color:var(--color-border)] py-10">
      <Container>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-4xl sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-lg text-[color:var(--color-muted)]">
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
