import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  portfolioDashboardState,
  portfolioSourceStatus,
} from "../app/lib/portfolio-state.ts";
import { resolveRegistryItem } from "../app/lib/registry-state.ts";
import robots from "../app/robots.ts";
import sitemap from "../app/sitemap.ts";
import { projectLibraryAtlas } from "../scripts/project-library-atlas.mjs";

const crateSnapshot = JSON.parse(
  await readFile(new URL("../app/data/published-crates.json", import.meta.url), "utf8"),
);

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const builtPagePath = new Map([
  ["/", "../.next/server/app/index.html"],
  ["/mnemes", "../.next/server/app/mnemes.html"],
  ["/services", "../.next/server/app/services.html"],
  ["/work", "../.next/server/app/work.html"],
  ["/about", "../.next/server/app/about.html"],
  ["/privacy", "../.next/server/app/privacy.html"],
  ["/pro", "../.next/server/app/pro.html"],
  ["/product", "../.next/server/app/product.html"],
  ["/node", "../.next/server/app/node.html"],
  ["/install", "../.next/server/app/install.html"],
  ["/portfolio", "../.next/server/app/portfolio.html"],
  ["/josh", "../.next/server/app/josh.html"],
]);

async function readBuiltPage(route) {
  const path = builtPagePath.get(route);
  assert.ok(path, `No built HTML path registered for ${route}`);
  return readFile(new URL(path, import.meta.url), "utf8");
}

async function getBuiltPortfolioApi() {
  const routeUrl = new URL("../.next/server/app/api/portfolio/route.js", import.meta.url);
  routeUrl.searchParams.set("portfolio-api", `${process.pid}-${Date.now()}`);
  const route = await import(routeUrl.href);
  const get = route.default?.routeModule?.userland?.GET;
  assert.equal(typeof get, "function", "Next build must expose the portfolio GET handler");
  return get;
}

test("renders development preview metadata", async () => {
  assert.match(await readBuiltPage("/"), developmentPreviewMeta);
});

test("preserves the software-first deployment hierarchy across public routes", async () => {
  const routes = await Promise.all(
    ["/mnemes", "/product", "/node", "/install", "/portfolio"].map(async (path) => [path, await readBuiltPage(path)]),
  );
  const html = Object.fromEntries(routes);

  assert.match(html["/mnemes"], /personal,\s*self-hosted agent memory server/i);
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

test("renders a business-first root with consulting, deterministic workflow boundaries, and bounded recognition", async () => {
  const html = await readBuiltPage("/");
  assert.match(html, /AI systems built/i);
  assert.match(html, /around/i);
  assert.match(html, /your business/i);
  assert.match(html, /Custom Agents/);
  assert.match(html, /Workflow Automation/);
  assert.match(html, /Business Knowledge/);
  assert.match(html, /Tool \+ Data Integrations/);
  assert.match(html, /Services \+ consulting/i);
  assert.match(html, /Judgment first/i);
  assert.match(html, /Agent runtime architecture/i);
  assert.match(html, /Example workflow, not a customer deployment claim/i);
  assert.match(html, /Teknium, creator of Hermes Agent/i);
  assert.match(html, /not a customer testimonial, partnership, or product endorsement/i);
  assert.match(html, /https:\/\/x\.com\/Teknium\/status\/2084892532392276364/);
  assert.match(html, /rel="canonical" href="https:\/\/recursiveintell\.com"/i);
  assert.doesNotMatch(html, /"applicationCategory":"DeveloperApplication"/);
  assert.doesNotMatch(html, /customers trust us|enterprise-ready|production-grade/i);
});

test("publishes intentional consulting, work, privacy, pro, and Mnemes routes", async () => {
  const routes = await Promise.all(
    ["/services", "/work", "/about", "/privacy", "/pro", "/mnemes"].map(async (path) => [path, await readBuiltPage(path)]),
  );
  const html = Object.fromEntries(routes);

  assert.match(html["/services"], /AI Workflow Map/);
  assert.match(html["/services"], /Custom Agent Pilot/);
  assert.match(html["/services"], /Business Knowledge Build/);
  assert.match(html["/services"], /Systems Consulting \+ Ongoing Care/);
  assert.match(html["/services"], /Fixed scope confirmed after fit review/i);
  assert.match(html["/work"], /Hermes integration path/);
  assert.match(html["/about"], /founder-led applied R&amp;D studio/i);
  assert.match(html["/privacy"], /does not implement an account system/i);
  assert.match(html["/pro"], /Not a live product claim/i);
  assert.match(html["/mnemes"], /A RecursiveIntell system/i);
  assert.match(html["/mnemes"], /rel="canonical" href="https:\/\/recursiveintell\.com\/mnemes"/i);
});

test("renders the card-linked Josh service route with explicit boundaries and complete social metadata", async () => {
  const html = await readBuiltPage("/josh");
  assert.match(html, /Josh Stevenson \| RecursiveIntell/i);
  assert.match(html, /AI infrastructure with/i);
  assert.match(html, /evidence and limits visible/i);
  assert.match(html, /Local authority/i);
  assert.match(html, /Typed execution/i);
  assert.match(html, /Receipts \+ replay/i);
  assert.match(html, /id="proof"/i);
  assert.match(html, /id="consulting"/i);
  assert.match(html, /Current core \/ R&amp;D system/i);
  assert.match(html, /Public R&amp;D components/i);
  assert.match(html, /Experimental/i);
  assert.match(html, /Mnemes and semantic-memory/i);
  assert.match(html, /ClaimLedger and agent-graph/i);
  assert.match(html, /turbo-quant and compression research/i);
  assert.match(html, /proveKV hybrid-state research/i);
  assert.match(html, /hostile_memory_integrity\.rs/i);
  assert.match(html, /hostile-memory-integrity-receipt\.json/i);
  assert.match(html, /does not establish truth, semantic quality, complete security, production fitness, or defense validation/i);
  assert.match(html, /\(256\) 677-8909/);
  assert.match(html, /j\.stevenson\.cs@gmail\.com/);
  assert.match(html, /rel="canonical" href="https:\/\/recursiveintell\.com\/josh"/i);
  assert.match(html, /property="og:image" content="https:\/\/recursiveintell\.com\/josh-social\.png"/i);
  assert.match(html, /name="twitter:image" content="https:\/\/recursiveintell\.com\/josh-social\.png"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  assert.doesNotMatch(html, /"applicationCategory":"DeveloperApplication"/);
  assert.doesNotMatch(html, /data-reveal/);
  assert.doesNotMatch(html, /\$1,250|\$3,500|\$6,000/);
  assert.doesNotMatch(html, /defense customer|defense deployment|security certified|production-ready|benchmark superiority/i);

  const socialImage = await readFile(new URL("../public/josh-social.png", import.meta.url));
  assert.equal(socialImage.toString("ascii", 1, 4), "PNG");
  assert.equal(socialImage.readUInt32BE(16), 1200);
  assert.equal(socialImage.readUInt32BE(20), 630);
});

test("publishes the card route through the canonical crawl surfaces", () => {
  assert.equal(robots().sitemap, "https://recursiveintell.com/sitemap.xml");
  const joshRoute = sitemap().find((entry) => entry.url === "https://recursiveintell.com/josh");
  assert.ok(joshRoute);
  assert.equal(joshRoute.priority, 0.9);
  for (const route of ["/services", "/work", "/about", "/privacy", "/pro", "/mnemes"]) {
    assert.ok(sitemap().some((entry) => entry.url === `https://recursiveintell.com${route}`));
  }
  assert.ok(sitemap().every((entry) => !entry.url.includes("mneme-memory.sik-mindz.chatgpt.site")));
});

test("portfolio API rejects unsupported query widening", async () => {
  const portfolioGet = await getBuiltPortfolioApi();
  const response = await portfolioGet(new Request("http://localhost/api/portfolio?scope=private"));

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

async function invokePortfolioApi(upstreamFetch) {
  const portfolioGet = await getBuiltPortfolioApi();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = upstreamFetch;
  try {
    const response = await portfolioGet(new Request("http://localhost/api/portfolio"));
    return { response, payload: await response.json() };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("portfolio API keeps live, partial, and failed public sources isolated", async () => {
  const complete = await invokePortfolioApi(async (input) => {
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

  const partial = await invokePortfolioApi(async (input) => {
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

  const unavailable = await invokePortfolioApi(async () => (
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
