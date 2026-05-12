import { mkdir, readFile, writeFile } from "fs/promises";
import { execFileSync } from "child_process";
import path from "path";

type BuildLogEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  source: string;
  href?: string;
  sha?: string;
};

const outputPath = path.join(process.cwd(), "public", "data", "buildlog.json");

function git(args: string[]) {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

async function readExisting() {
  try {
    const raw = await readFile(outputPath, "utf8");
    return JSON.parse(raw) as BuildLogEntry[];
  } catch {
    return [];
  }
}

async function main() {
  const sha = process.env.GITHUB_SHA || git(["rev-parse", "HEAD"]);
  const shortSha = sha.slice(0, 7);
  const eventName = process.env.GITHUB_EVENT_NAME || "manual";
  const releaseName = process.env.GITHUB_REF_NAME || "";
  const commitSubject = git(["log", "-1", "--pretty=%s"]) || "Site maintenance";

  const entry: BuildLogEntry = {
    id: `${new Date().toISOString().slice(0, 10)}-${shortSha || "manual"}`,
    date: new Date().toISOString(),
    title: eventName === "release" && releaseName ? `Release ${releaseName}` : commitSubject,
    summary:
      eventName === "schedule"
        ? "Nightly buildlog refresh from GitHub Actions."
        : "Buildlog refresh from repository automation.",
    source: eventName,
    href: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && sha
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/commit/${sha}`
      : undefined,
    sha: sha || undefined,
  };

  const existing = await readExisting();
  const next = [entry, ...existing.filter((item) => item.id !== entry.id)].slice(0, 100);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error("Failed to update buildlog", error);
  process.exit(1);
});
