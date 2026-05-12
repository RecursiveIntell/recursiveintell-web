import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { loginPrivate } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    disabled?: string;
    next?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Private Login",
  description: "Private workbench access for RecursiveIntell.",
};

export default async function PrivateLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const enabled = Boolean(process.env.PRIVATE_ACCESS_PASSWORD);

  return (
    <div>
      <PageHeader
        eyebrow="Private"
        title="Workbench Login"
        description="Private mode is only available when PRIVATE_ACCESS_PASSWORD is configured in Vercel or the local shell."
      />
      <Container className="py-12">
        {!enabled ? (
          <div className="max-w-xl rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6">
            <h2 className="text-2xl">Private mode is disabled</h2>
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              Set `PRIVATE_ACCESS_PASSWORD` to enable protected routes.
            </p>
            <Link
              className="mt-6 inline-flex rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm"
              href="/"
            >
              Return home
            </Link>
          </div>
        ) : (
          <form
            action={loginPrivate}
            className="max-w-xl rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6"
          >
            <input name="next" type="hidden" value={params.next ?? "/private"} />
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Password
              <input
                autoComplete="current-password"
                className="mt-3 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-3 py-2 text-base normal-case tracking-normal text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-accent)]"
                name="password"
                required
                type="password"
              />
            </label>
            {params.error ? (
              <p className="mt-3 text-sm text-[color:var(--color-accent-2)]">
                The password did not match.
              </p>
            ) : null}
            <button
              className="mt-6 rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Enter private mode
            </button>
          </form>
        )}
      </Container>
    </div>
  );
}
