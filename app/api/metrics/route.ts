import crateSnapshot from "../../data/published-crates.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

const GITHUB_USER = "RecursiveIntell";
const CRATES_OWNER_ID = 393528;
const CACHE_SECONDS = 900;
const FETCH_TIMEOUT_MS = 8_500;
const COLLECTION_BUDGET_MS = 15_000;
const MAX_PAGES = 10;

type SourceError = { source: string; code: string };

type GitHubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  public_repos: number;
  created_at: string;
  updated_at: string;
};

type GitHubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string | null;
  updated_at: string | null;
  archived: boolean;
  private: boolean;
  topics?: string[];
};

type CrateItem = {
  id?: string;
  name?: string;
  max_stable_version?: string | null;
  max_version?: string | null;
  newest_version?: string | null;
  downloads?: number;
  recent_downloads?: number;
  updated_at?: string | null;
  created_at?: string | null;
  description?: string | null;
  repository?: string | null;
  documentation?: string | null;
  keywords?: string[];
};

type CratesPage = {
  meta?: { total?: number; next_page?: string | null };
  crates?: CrateItem[];
};

function upstreamHeaders(url: string): HeadersInit {
  if (url.includes("api.github.com")) {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "recursiveintell.com-live-metrics",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    return headers;
  }
  return {
    Accept: "application/json",
    "User-Agent": "recursiveintell-web-metrics/2.0 (+https://recursiveintell.com)",
  };
}

async function fetchJson<T>(url: string, deadline: number): Promise<T> {
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw new Error("request_budget_exhausted");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.min(FETCH_TIMEOUT_MS, remaining));
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: upstreamHeaders(url),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

function withinDays(value: string | null | undefined, days: number, now: number): boolean {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) && now - timestamp <= days * 86_400_000;
}

function normalizeRepo(repo: GitHubRepo) {
  return {
    name: repo.name,
    url: repo.html_url,
    description: repo.description || "No repository description published.",
    language: repo.language || "Unclassified",
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    issues: repo.open_issues_count || 0,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    archived: Boolean(repo.archived),
    topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 8) : [],
  };
}

function buildGitHub(profile: GitHubProfile, repos: GitHubRepo[], now: number, repositoriesComplete: boolean) {
  const publicRepos = repos.filter((repo) => !repo.private);
  const languages = new Map<string, number>();
  for (const repo of publicRepos) {
    const language = repo.language || "Unclassified";
    languages.set(language, (languages.get(language) || 0) + 1);
  }
  return {
    profile: {
      login: profile.login,
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar_url,
      url: profile.html_url,
      followers: profile.followers || 0,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    },
    totals: {
      publicRepositories: profile.public_repos || publicRepos.length,
      stars: publicRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
      forks: publicRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
      openIssues: publicRepos.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0),
      activeRepositories30d: publicRepos.filter((repo) => withinDays(repo.pushed_at, 30, now)).length,
    },
    repositoriesComplete,
    languages: [...languages.entries()]
      .map(([name, repositories]) => ({ name, repositories }))
      .sort((a, b) => b.repositories - a.repositories || a.name.localeCompare(b.name)),
    repositories: publicRepos
      .slice()
      .sort((a, b) => Date.parse(b.pushed_at || "") - Date.parse(a.pushed_at || ""))
      .map(normalizeRepo),
  };
}

async function fetchAllGitHubRepos(deadline: number) {
  const repositories: GitHubRepo[] = [];
  let complete = false;
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const batch = await fetchJson<GitHubRepo[]>(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner&page=${page}`,
      deadline,
    );
    if (!Array.isArray(batch)) throw new Error("invalid_github_repository_response");
    repositories.push(...batch);
    if (batch.length < 100) {
      complete = true;
      break;
    }
  }
  return { repositories, complete };
}

async function collectGitHub(deadline: number) {
  const [profileResult, reposResult] = await Promise.allSettled([
    fetchJson<GitHubProfile>(`https://api.github.com/users/${GITHUB_USER}`, deadline),
    fetchAllGitHubRepos(deadline),
  ]);
  const errors: SourceError[] = [];
  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
  const repoResult = reposResult.status === "fulfilled" ? reposResult.value : null;
  if (!profile) errors.push({ source: "github_profile", code: "github_unavailable" });
  if (!repoResult) errors.push({ source: "github_repositories", code: "github_unavailable" });
  else if (!repoResult.complete) errors.push({ source: "github_repositories", code: "github_inventory_incomplete" });
  return {
    data: profile && repoResult ? buildGitHub(profile, repoResult.repositories, Date.now(), repoResult.complete) : null,
    repositoriesComplete: Boolean(repoResult?.complete),
    errors,
  };
}

function normalizeCrate(item: CrateItem) {
  const name = item.id || item.name || "unknown-crate";
  return {
    name,
    version: item.max_stable_version || item.max_version || item.newest_version || "unversioned",
    downloads: item.downloads || 0,
    recentDownloads: item.recent_downloads || 0,
    updatedAt: item.updated_at,
    createdAt: item.created_at,
    description: item.description || "No crate description published.",
    repository: item.repository || null,
    documentation: item.documentation || `https://docs.rs/${name}`,
    url: `https://crates.io/crates/${name}`,
    keywords: Array.isArray(item.keywords) ? item.keywords.slice(0, 6) : [],
  };
}

function resolveCratesPagination(nextPage: string): string {
  const url = new URL(nextPage, "https://crates.io/api/v1/crates");
  if (url.origin !== "https://crates.io" || url.pathname !== "/api/v1/crates") {
    throw new Error("rejected_crates_pagination_url");
  }
  return url.href;
}

async function collectCrates(deadline: number) {
  const pages: CratesPage[] = [];
  let nextUrl: string | null = `https://crates.io/api/v1/crates?user_id=${CRATES_OWNER_ID}&per_page=100&sort=recent-updates&include_yanked=yes`;
  let code: string | null = null;
  try {
    while (nextUrl && pages.length < MAX_PAGES) {
      if (pages.length) {
        if (deadline - Date.now() <= 1_350) {
          code = "crates_budget_exhausted";
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1_100));
      }
      if (deadline - Date.now() <= 250) {
        code = "crates_budget_exhausted";
        break;
      }
      const page: CratesPage = await fetchJson<CratesPage>(nextUrl, deadline);
      pages.push(page);
      nextUrl = page.meta?.next_page ? resolveCratesPagination(page.meta.next_page) : null;
    }
    if (nextUrl && !code) code = pages.length >= MAX_PAGES ? "crates_inventory_limit" : "crates_page_incomplete";
  } catch {
    code = pages.length ? "crates_page_incomplete" : "crates_unavailable";
  }
  return { pages, complete: !nextUrl && pages.length > 0, code };
}

function buildCrates(pages: CratesPage[], now: number) {
  const byName = new Map<string, ReturnType<typeof normalizeCrate>>();
  for (const page of pages) {
    for (const item of page.crates || []) {
      const normalized = normalizeCrate(item);
      byName.set(normalized.name, normalized);
    }
  }
  const items = [...byName.values()].sort((a, b) => Date.parse(b.updatedAt || "") - Date.parse(a.updatedAt || ""));
  return {
    ownerId: CRATES_OWNER_ID,
    complete: true,
    snapshot: false,
    observedAt: undefined as string | undefined,
    totals: {
      publishedCrates: pages[0]?.meta?.total || items.length,
      downloads: items.reduce((sum, item) => sum + item.downloads, 0),
      downloads90d: items.reduce((sum, item) => sum + item.recentDownloads, 0),
      updatedCrates30d: items.filter((item) => withinDays(item.updatedAt, 30, now)).length,
    },
    items,
  };
}

function buildCratesFallback() {
  return {
    ownerId: CRATES_OWNER_ID,
    complete: true,
    snapshot: true,
    observedAt: crateSnapshot.observed_at,
    totals: {
      publishedCrates: crateSnapshot.summary.published_crates,
      downloads: crateSnapshot.summary.downloads_total,
      downloads90d: crateSnapshot.summary.downloads_90d,
      updatedCrates30d: crateSnapshot.summary.updated_30d,
    },
    items: crateSnapshot.crates.map((item) => ({
      name: item.name,
      version: item.version,
      downloads: item.downloads_total,
      recentDownloads: item.downloads_90d,
      updatedAt: item.updated_at,
      createdAt: item.created_at,
      description: item.description || "No crate description published.",
      repository: item.repository_url,
      documentation: item.documentation_url || `https://docs.rs/${item.name}`,
      url: item.crates_io_url,
      keywords: [] as string[],
    })),
  };
}

async function collectMetrics() {
  const startedAt = Date.now();
  const deadline = startedAt + COLLECTION_BUDGET_MS;
  const [githubResult, cratesResult] = await Promise.all([
    collectGitHub(deadline),
    collectCrates(deadline),
  ]);
  const errors: SourceError[] = [...githubResult.errors];
  if (cratesResult.code) errors.push({ source: "crates", code: cratesResult.code });
  const crates = cratesResult.complete ? buildCrates(cratesResult.pages, startedAt) : buildCratesFallback();
  const generatedAt = new Date().toISOString();
  return {
    meta: {
      generatedAt,
      cacheSeconds: CACHE_SECONDS,
      scope: "Public GitHub and crates.io telemetry only",
      partial: errors.length > 0,
      errors,
      sources: {
        github: {
          state: githubResult.data ? (githubResult.repositoriesComplete ? "live" : "partial") : "unavailable",
          repositoriesComplete: githubResult.repositoriesComplete,
        },
        crates: crates.snapshot
          ? { state: "snapshot", inventoryComplete: false, snapshotInventoryComplete: true, observedAt: crates.observedAt, requestPolicy: "sequential-1rps" }
          : { state: "live", inventoryComplete: true, snapshotInventoryComplete: false, observedAt: generatedAt, requestPolicy: "sequential-1rps" },
      },
    },
    ...(githubResult.data ? { github: githubResult.data } : {}),
    crates,
  };
}

let inFlight: ReturnType<typeof collectMetrics> | null = null;

function collectShared() {
  if (!inFlight) {
    inFlight = collectMetrics().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

function responseHeaders(cache = true): Headers {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Content-Type-Options": "nosniff",
  });
  if (cache) {
    const policy = `public, max-age=60, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400, stale-if-error=604800`;
    headers.set("Cache-Control", policy);
    headers.set("CDN-Cache-Control", policy);
    headers.set("Vercel-CDN-Cache-Control", policy);
  } else {
    headers.set("Cache-Control", "no-store");
  }
  return headers;
}

function rejectQuery(request: Request): Response | null {
  if (!new URL(request.url).search) return null;
  return Response.json({ error: "Query parameters are not supported" }, { status: 400, headers: responseHeaders(false) });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: responseHeaders(false) });
}

export function HEAD(request: Request) {
  return rejectQuery(request) || new Response(null, { status: 200, headers: responseHeaders() });
}

export async function GET(request: Request) {
  const rejected = rejectQuery(request);
  if (rejected) return rejected;
  try {
    const payload = await collectShared();
    return Response.json(payload, { status: 200, headers: responseHeaders() });
  } catch {
    return Response.json({
      meta: {
        generatedAt: new Date().toISOString(),
        partial: true,
        scope: "Public GitHub and crates.io telemetry only",
        errors: [{ source: "metrics", code: "metrics_unavailable" }],
      },
    }, { status: 503, headers: responseHeaders(false) });
  }
}
