#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const PUBLIC_ATLAS_RECORD_KEYS = [
  "package_name",
  "ecosystem",
  "version",
  "description",
  "architectural_domain",
  "sibling_dependency_count",
  "publication",
  "maturity_evidence",
];

export function projectLibraryAtlas(source) {
  if (!source || !Array.isArray(source.catalog)) {
    throw new TypeError("Expected a Library Atlas object with a catalog array.");
  }

  const catalog = source.catalog.map((item) => ({
    package_name: item.package_name,
    ecosystem: item.ecosystem,
    version: item.version,
    description: item.description,
    architectural_domain: item.architectural_domain,
    sibling_dependency_count: Array.isArray(item.sibling_dependencies)
      ? item.sibling_dependencies.length
      : Number(item.sibling_dependency_count ?? 0),
    publication: {
      state_key: item.publication?.state_key,
      state_label: item.publication?.state_label,
      registry: item.publication?.registry
        ? {
            downloads_total: Number(item.publication.registry.downloads_total ?? 0),
            registry_url: item.publication.registry.registry_url ?? null,
          }
        : null,
    },
    maturity_evidence: {
      status: item.maturity_evidence?.status,
    },
  }));

  return {
    schema_version: "recursiveintell-public-library-atlas/v1",
    generated_at: source.generated_at,
    projection: {
      policy: "strict-field-allowlist",
      generator: "scripts/project-library-atlas.mjs",
      excluded:
        "repository identity, branches, commits, internal paths, source links, access notes, and audit gaps",
    },
    counts: {
      total_catalog_entries: catalog.length,
    },
    catalog,
  };
}

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    throw new Error(
      "Usage: node scripts/project-library-atlas.mjs <private-audit.json> <public-projection.json>",
    );
  }
  const source = JSON.parse(await readFile(inputPath, "utf8"));
  const projection = projectLibraryAtlas(source);
  await writeFile(outputPath, `${JSON.stringify(projection, null, 2)}\n`, "utf8");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
