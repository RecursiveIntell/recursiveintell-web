import fs from "fs";
import path from "path";
import { getAllDocuments } from "../lib/rag/indexer";
import { addDocuments, clearCollection, getCollectionStats } from "../lib/rag/vectorstore";

// Try to load API key from settings if not in environment
function loadApiKeyFromSettings(): string | undefined {
  try {
    const settingsPath = path.join(process.cwd(), "data", "settings.json");
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      return settings.openaiApiKey;
    }
  } catch {
    // Ignore errors
  }

  // Also try localStorage export format (from browser)
  try {
    const localSettingsPath = path.join(process.cwd(), ".settings.json");
    if (fs.existsSync(localSettingsPath)) {
      const settings = JSON.parse(fs.readFileSync(localSettingsPath, "utf-8"));
      return settings.openaiApiKey;
    }
  } catch {
    // Ignore errors
  }

  return undefined;
}

async function main() {
  const args = process.argv.slice(2);
  const includeReadmes = args.includes("--include-readmes");
  const clearFirst = args.includes("--clear");

  console.log("RAG Indexing Script");
  console.log("==================");

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    const settingsKey = loadApiKeyFromSettings();
    if (settingsKey) {
      process.env.OPENAI_API_KEY = settingsKey;
      console.log("Using OpenAI API key from settings.");
    } else {
      console.error("\nError: OPENAI_API_KEY is required for generating embeddings.");
      console.error("Set it via environment variable or create a .settings.json file with:");
      console.error('  { "openaiApiKey": "sk-..." }');
      process.exit(1);
    }
  }

  if (clearFirst) {
    console.log("\nClearing existing collection...");
    await clearCollection();
  }

  console.log("\nIndexing content...");
  const documents = await getAllDocuments(includeReadmes);

  console.log(`\nTotal documents to index: ${documents.length}`);

  if (documents.length === 0) {
    console.log("No documents found to index.");
    return;
  }

  console.log("\nAdding documents to vector store...");
  await addDocuments(documents);

  const stats = await getCollectionStats();
  console.log(`\nIndexing complete!`);
  console.log(`Collection "${stats.name}" now has ${stats.count} documents.`);
}

main().catch((error) => {
  console.error("Indexing failed:", error);
  process.exit(1);
});
