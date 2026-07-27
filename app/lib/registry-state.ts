export type RegistryItem = {
  name: string;
  role: string;
  version: string | null;
  downloads: number | null;
  stars: number | null;
  pushedAt: string | null;
  registryLive: boolean;
  githubLive: boolean;
  snapshotObservedAt: string | null;
  github: string;
  crate: string;
};

type RepositoryPayload = {
  stargazers_count?: number | null;
  pushed_at?: string | null;
};

type CratePayload = {
  crate?: {
    max_version?: string | null;
    downloads?: number | null;
  } | null;
};

export function resolveRegistryItem(
  item: RegistryItem,
  repo: PromiseSettledResult<RepositoryPayload>,
  crate: PromiseSettledResult<CratePayload>,
): RegistryItem {
  return {
    ...item,
    version: crate.status === "fulfilled"
      ? crate.value.crate?.max_version ?? item.version
      : item.version,
    downloads: crate.status === "fulfilled"
      ? crate.value.crate?.downloads ?? item.downloads
      : item.downloads,
    stars: repo.status === "fulfilled"
      ? repo.value.stargazers_count ?? null
      : null,
    pushedAt: repo.status === "fulfilled"
      ? repo.value.pushed_at ?? null
      : null,
    registryLive: crate.status === "fulfilled",
    githubLive: repo.status === "fulfilled",
  };
}
