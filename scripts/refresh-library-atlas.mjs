#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { projectLibraryAtlas } from "./project-library-atlas.mjs";

function activeMembers(manifestPath) {
  const source = readFileSync(manifestPath, "utf8");
  const body = source.match(/members\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  return body.split(/\r?\n/).flatMap((line) => {
    const member = line.replace(/#.*$/, "").match(/"([^"]+)"/);
    return member ? [member[1]] : [];
  });
}

function packageField(source, key) {
  const packageBlock = source.match(/\[package\]([\s\S]*?)(?=\n\[|$)/)?.[1] ?? "";
  return packageBlock.match(new RegExp(`^${key}\\s*=\\s*[\"']([^\"']+)[\"']`, "m"))?.[1] ?? null;
}

function cargoPackage(manifestPath) {
  const source = readFileSync(manifestPath, "utf8");
  const name = packageField(source, "name");
  if (!name) return null;
  return {
    name,
    version: packageField(source, "version"),
    description: packageField(source, "description"),
  };
}

function gitObservedAt(repositoryRoot) {
  return execFileSync(
    "git",
    ["-C", repositoryRoot, "show", "-s", "--format=%cI", "HEAD"],
    { encoding: "utf8" },
  ).trim();
}

async function main() {
  const repositoryRoot = resolve(process.argv[2] ?? "../Libraries");
  const baselinePath = resolve(
    process.argv[3] ?? new URL("../app/data/library-catalog-public.json", import.meta.url).pathname,
  );
  const outputPath = resolve(process.argv[4] ?? baselinePath);
  const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
  const metadata = new Map();

  const workspaces = [
    ["Cargo.toml", ""],
    [join("AiDENs", "Cargo.toml"), "AiDENs"],
    [join("poly-kv", "Cargo.toml"), "poly-kv"],
  ];
  for (const [workspaceManifest, prefix] of workspaces) {
    const manifestPath = join(repositoryRoot, workspaceManifest);
    for (const member of activeMembers(manifestPath)) {
      const packagePath = join(repositoryRoot, prefix, member, "Cargo.toml");
      const currentPackage = cargoPackage(packagePath);
      if (currentPackage) metadata.set(currentPackage.name, currentPackage);
    }
  }

  const hooksPath = join(repositoryRoot, "tauri-react-hooks", "package.json");
  const hooks = JSON.parse(await readFile(hooksPath, "utf8"));
  metadata.set(hooks.name, {
    name: hooks.name,
    version: hooks.version ?? null,
    description: hooks.description ?? null,
  });

  const missing = baseline.catalog
    .map((record) => record.package_name)
    .filter((name) => !metadata.has(name));
  if (missing.length > 0) {
    throw new Error(`Current Libraries source is missing Atlas records: ${missing.join(", ")}`);
  }

  const source = {
    generated_at: baseline.generated_at,
    catalog: baseline.catalog.map((record) => {
      const current = metadata.get(record.package_name);
      return {
        ...record,
        version: current.version ?? record.version,
        description: current.description ?? record.description,
      };
    }),
  };
  const projection = projectLibraryAtlas(source);
  const observedAt = gitObservedAt(repositoryRoot);
  projection.projection = {
    ...projection.projection,
    refresh_generator: "scripts/refresh-library-atlas.mjs",
    refresh_observed_at: observedAt,
    refresh_note:
      "Package version and description fields were refreshed from the current public Libraries source. The 97-entry scope and reviewed architecture, maturity, and registry fields remain from the 2026-07-16 audit.",
  };

  await writeFile(outputPath, `${JSON.stringify(projection, null, 2)}\n`, "utf8");
}

await main();
