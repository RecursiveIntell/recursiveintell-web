import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  portfolioDashboardState,
  portfolioSourceStatus,
} from "../app/lib/portfolio-state.ts";
import { resolveRegistryItem } from "../app/lib/registry-state.ts";
import { projectLibraryAtlas } from "../scripts/project-library-atlas.mjs";

const crateSnapshot = JSON.parse(
  await readFile(new URL("../app/data/published-crates.json", import.meta.url), "utf8"),
);

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("preserves the software-first deployment hierarchy across public routes", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("hierarchy", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };
  const ctx = {
    waitUntil() {},
    passThroughOnException() {},
  };

  const routes = await Promise.all(
    ["/", "/product", "/node", "/install", "/portfolio"].map(async (path) => {
      const response = await worker.fetch(
        new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
        env,
        ctx,
      );
      assert.equal(response.status, 200, path);
      return [path, await response.text()];
    }),
  );
  const html = Object.fromEntries(routes);

  assert.match(html["/"], /personal,\s*self-hosted agent memory server/i);
  assert.match(html["/product"], /Node R1 is optional/i);
  assert.match(html["/node"], /You do not need/i);
  assert.match(html["/install"], /Memory quality stays/i);
  assert.match(html["/portfolio"], /The whole laboratory/i);
  assert.match(html["/portfolio"], /PUBLIC ENGINEERING PULSE/i);
  assert.match(html["/portfolio"], /reviewed public projection/i);
  assert.match(html["/node"], /founder-reported prototype/i);
  assert.doesNotMatch(html["/node"], /working personal prototype/i);
  assert.doesNotMatch(html["/product"], /Hardware runs today/i);
});

test("portfolio API rejects unsupported query widening", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("portfolio-api", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/api/portfolio?scope=private"),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Query parameters are not supported" });
});

test("public Library Atlas is an allowlisted projection without private audit metadata", async () => {
  const atlasPath = new URL("../app/data/library-catalog-public.json", import.meta.url);
  const atlasText = await readFile(atlasPath, "utf8");
  const atlas = JSON.parse(atlasText);

  assert.equal(atlas.schema_version, "recursiveintell-public-library-atlas/v1");
  assert.equal(atlas.projection.policy, "strict-field-allowlist");
  assert.equal(atlas.projection.generator, "scripts/project-library-atlas.mjs");
  assert.equal(atlas.counts.total_catalog_entries, 97);
  assert.equal(atlas.catalog.length, 97);
  assert.equal(new Set(atlas.catalog.map((item) => `${item.ecosystem}:${item.package_name}`)).size, 97);

  const allowedRecordKeys = [
    "architectural_domain",
    "description",
    "ecosystem",
    "maturity_evidence",
    "package_name",
    "publication",
    "sibling_dependency_count",
    "version",
  ];
  for (const item of atlas.catalog) {
    assert.deepEqual(Object.keys(item).sort(), allowedRecordKeys);
    assert.equal(typeof item.sibling_dependency_count, "number");
  }

  for (const forbiddenKey of [
    "access_note",
    "audit_gaps",
    "last_update_evidence",
    "source_manifest",
    "workspace_metadata",
    "\"sha\"",
    "\"path\"",
    "\"branch\"",
  ]) {
    assert.doesNotMatch(atlasText, new RegExp(forbiddenKey, "i"));
  }

  const retiredPublicAsset = new URL("../public/data/library-catalog.json", import.meta.url);
  const retiredBuiltAsset = new URL("../dist/client/data/library-catalog.json", import.meta.url);
  await assert.rejects(access(fileURLToPath(retiredPublicAsset)));
  await assert.rejects(access(fileURLToPath(retiredBuiltAsset)));
});

test("Library Atlas projection generator drops private audit fields by construction", () => {
  const projection = projectLibraryAtlas({
    generated_at: "2026-07-27T00:00:00Z",
    repository: { name: "private/repository", branch: "private-branch" },
    audit_gaps: ["private gap"],
    catalog: [{
      package_name: "safe-package",
      ecosystem: "Rust",
      version: "1.0.0",
      description: "Public description",
      architectural_domain: "Memory",
      sibling_dependencies: ["private-sibling-name"],
      publication: {
        state_key: "published",
        state_label: "Published",
        registry: {
          downloads_total: 42,
          registry_url: "https://crates.io/crates/safe-package",
        },
      },
      maturity_evidence: {
        status: "active-development",
        limitations: ["private limitation"],
      },
      workspace: { path: "/private/path" },
      links: { source_manifest: "https://private.example/source" },
      access_note: "private access note",
      last_update_evidence: { sha: "deadbeef", branch: "private-branch" },
    }],
  });
  const serialized = JSON.stringify(projection);
  assert.equal(projection.counts.total_catalog_entries, 1);
  assert.equal(projection.catalog[0].sibling_dependency_count, 1);
  assert.deepEqual(
    Object.keys(projection.catalog[0]).sort(),
    [
      "architectural_domain",
      "description",
      "ecosystem",
      "maturity_evidence",
      "package_name",
      "publication",
      "sibling_dependency_count",
      "version",
    ],
  );
  for (const privateValue of [
    "private/repository",
    "private-branch",
    "private gap",
    "private-sibling-name",
    "/private/path",
    "private.example",
    "deadbeef",
  ]) {
    assert.doesNotMatch(serialized, new RegExp(privateValue.replace(/[./]/g, "\\$&")));
  }
});

test("portfolio source states stay explicit under live, stale, partial, snapshot, and failure conditions", () => {
  const now = Date.parse("2026-07-27T18:00:00Z");

  assert.equal(portfolioSourceStatus({ loading: true }, now).state, "loading");
  assert.equal(portfolioSourceStatus({ requestFailed: true }, now).state, "unavailable");
  assert.equal(
    portfolioSourceStatus({
      state: "partial",
      generatedAt: "2026-07-27T17:59:00Z",
    }, now).state,
    "partial",
  );
  assert.equal(
    portfolioSourceStatus({
      state: "snapshot",
      observedAt: "2026-07-16T10:26:03Z",
    }, now).state,
    "snapshot",
  );
  assert.equal(
    portfolioSourceStatus({
      state: "live",
      generatedAt: "2026-07-27T17:50:00Z",
      cacheSeconds: 900,
    }, now).state,
    "live",
  );
  assert.equal(
    portfolioSourceStatus({
      state: "live",
      generatedAt: "2026-07-27T16:00:00Z",
      cacheSeconds: 900,
    }, now).state,
    "stale",
  );

  const partial = portfolioDashboardState({
    generatedAt: "2026-07-27T17:59:00Z",
    cacheSeconds: 900,
    sources: {
      github: { state: "partial" },
      crates: { state: "snapshot", observedAt: "2026-07-16T10:26:03Z" },
    },
  }, false, crateSnapshot.observed_at, now);
  assert.deepEqual(
    [partial.github.state, partial.github.label, partial.crates.state, partial.crates.label],
    ["partial", "PARTIAL INVENTORY", "snapshot", "DATED SNAPSHOT"],
  );

  const failed = portfolioDashboardState(
    null,
    true,
    crateSnapshot.observed_at,
    now,
  );
  assert.deepEqual(
    [failed.github.state, failed.github.label, failed.crates.state, failed.crates.label],
    ["unavailable", "UNAVAILABLE", "snapshot", "DATED SNAPSHOT"],
  );
});

test("core registry preserves the canonical dated snapshot when public APIs fail", async () => {
  const snapshot = crateSnapshot.crates.find((item) => item.name === "semantic-memory");
  assert.ok(snapshot);
  const seed = {
    name: "semantic-memory",
    role: "memory engine",
    version: snapshot.version,
    downloads: snapshot.downloads_total,
    stars: null,
    pushedAt: null,
    registryLive: false,
    githubLive: false,
    snapshotObservedAt: crateSnapshot.observed_at,
    github: "https://github.com/RecursiveIntell/semantic-memory",
    crate: "https://crates.io/crates/semantic-memory",
  };
  const rejected = { status: "rejected", reason: new Error("unavailable") };
  const fallback = resolveRegistryItem(seed, rejected, rejected);
  assert.equal(fallback.version, snapshot.version);
  assert.equal(fallback.downloads, snapshot.downloads_total);
  assert.equal(fallback.registryLive, false);
  assert.equal(fallback.githubLive, false);

  const live = resolveRegistryItem(
    seed,
    { status: "fulfilled", value: { stargazers_count: 17, pushed_at: "2026-07-27T12:00:00Z" } },
    { status: "fulfilled", value: { crate: { max_version: "9.9.9", downloads: 999 } } },
  );
  assert.equal(live.version, "9.9.9");
  assert.equal(live.downloads, 999);
  assert.equal(live.stars, 17);
  assert.equal(live.registryLive, true);
  assert.equal(live.githubLive, true);

  const noSnapshot = resolveRegistryItem(
    { ...seed, name: "unpublished", version: null, downloads: null, snapshotObservedAt: null },
    rejected,
    rejected,
  );
  assert.equal(noSnapshot.version, null);
  assert.equal(noSnapshot.downloads, null);

  const registrySource = await readFile(
    new URL("../app/components/LiveRegistry.tsx", import.meta.url),
    "utf8",
  );
  assert.match(registrySource, /published-crates\.json/);
  assert.match(registrySource, /snapshotObservedAt/);
  assert.doesNotMatch(registrySource, /current source manifests/i);
  assert.doesNotMatch(registrySource, /version:\s*"0\.5\.10"/);
});

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function githubProfile(publicRepos) {
  return {
    login: "RecursiveIntell",
    name: "RecursiveIntell",
    bio: "Public test profile",
    avatar_url: "https://example.test/avatar.png",
    html_url: "https://github.com/RecursiveIntell",
    followers: 1,
    public_repos: publicRepos,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-07-27T00:00:00Z",
  };
}

function githubRepo(name, index = 0) {
  return {
    name,
    html_url: `https://github.com/RecursiveIntell/${name}`,
    description: `Repository ${name}`,
    language: "Rust",
    stargazers_count: index + 1,
    forks_count: index,
    open_issues_count: 0,
    pushed_at: "2026-07-27T00:00:00Z",
    updated_at: "2026-07-27T00:00:00Z",
    archived: false,
    private: false,
    topics: ["memory"],
  };
}

function crateRecord(name, index = 0) {
  return {
    id: name,
    max_stable_version: `1.0.${index}`,
    downloads: 100 + index,
    recent_downloads: 10 + index,
    updated_at: "2026-07-27T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    description: `Crate ${name}`,
    repository: `https://github.com/RecursiveIntell/${name}`,
    documentation: `https://docs.rs/${name}`,
    keywords: ["memory"],
  };
}

async function invokePortfolioApi(label, upstreamFetch) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("upstream-case", `${label}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = upstreamFetch;
  try {
    const response = await worker.fetch(
      new Request("http://localhost/api/portfolio"),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );
    return { response, payload: await response.json() };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("portfolio API keeps live, partial, and failed public sources isolated", async () => {
  const complete = await invokePortfolioApi("complete", async (input) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    if (url.pathname === "/users/RecursiveIntell") return jsonResponse(githubProfile(2));
    if (url.pathname.endsWith("/repos")) {
      return jsonResponse([githubRepo("alpha"), githubRepo("beta", 1)]);
    }
    if (url.hostname === "crates.io") {
      return jsonResponse({
        meta: { total: 2, next_page: null },
        crates: [crateRecord("alpha"), crateRecord("beta", 1)],
      });
    }
    return jsonResponse({}, 404);
  });
  assert.equal(complete.response.status, 200);
  assert.equal(complete.payload.meta.partial, false);
  assert.deepEqual(complete.payload.meta.sources.github, {
    state: "live",
    repositoriesComplete: true,
  });
  assert.equal(complete.payload.github.repositories.length, 2);
  assert.equal(complete.payload.meta.sources.crates.state, "live");
  assert.equal(complete.payload.meta.sources.crates.inventoryComplete, true);
  assert.equal(complete.payload.crates.items.length, 2);

  const partial = await invokePortfolioApi("partial-github", async (input) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    if (url.pathname === "/users/RecursiveIntell") return jsonResponse(githubProfile(1_000));
    if (url.pathname.endsWith("/repos")) {
      const page = Number(url.searchParams.get("page") ?? "1");
      return jsonResponse(
        Array.from({ length: 100 }, (_, index) => githubRepo(`repo-${page}-${index}`, index)),
      );
    }
    if (url.hostname === "crates.io") {
      return jsonResponse({
        meta: { total: 1, next_page: null },
        crates: [crateRecord("memory-core")],
      });
    }
    return jsonResponse({}, 404);
  });
  assert.equal(partial.response.status, 200);
  assert.equal(partial.payload.meta.partial, true);
  assert.equal(partial.payload.meta.sources.github.state, "partial");
  assert.equal(partial.payload.meta.sources.github.repositoriesComplete, false);
  assert.equal(partial.payload.github.repositories.length, 1_000);
  assert.equal(partial.payload.meta.sources.crates.state, "live");

  const unavailable = await invokePortfolioApi("unavailable", async () => (
    jsonResponse({ error: "upstream unavailable" }, 503)
  ));
  assert.equal(unavailable.response.status, 200);
  assert.equal(unavailable.payload.meta.partial, true);
  assert.equal(unavailable.payload.meta.sources.github.state, "unavailable");
  assert.equal(unavailable.payload.github, undefined);
  assert.equal(unavailable.payload.meta.sources.crates.state, "snapshot");
  assert.equal(unavailable.payload.meta.sources.crates.inventoryComplete, false);
  assert.equal(unavailable.payload.crates.snapshot, true);
  assert.equal(unavailable.payload.crates.items.length, crateSnapshot.crates.length);
  assert.equal(
    unavailable.payload.crates.totals.publishedCrates,
    crateSnapshot.summary.published_crates,
  );
});
