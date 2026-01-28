import fs from "fs/promises";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";
import { indexAllContent } from "../lib/rag/indexer";

const OUTPUT_PATH = path.join(process.cwd(), "data", "rag", "excerpts.json");

const PROMPT = `You are generating short, interesting facts about a developer's portfolio for a scrolling ticker on their website.

Based on the following project content, generate 20-30 short excerpts (1 sentence each, max 80 characters) about their work.

Categories:
- "skill": Technical skills and technologies used
- "project": Specific project highlights
- "achievement": Notable accomplishments

Requirements:
- Each excerpt should be factual based on the content provided
- Keep them concise and scannable
- Make them interesting to potential employers or collaborators
- Vary the categories

Content from portfolio:
{content}

Return a JSON array with this exact format (no markdown, just the JSON):
[
  {"text": "Excerpt text here", "category": "skill"},
  {"text": "Another excerpt", "category": "project"}
]`;

async function main() {
  console.log("Excerpt Generation Script");
  console.log("=========================\n");

  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }

  console.log("Indexing content...");
  const documents = await indexAllContent();

  // Combine content from all documents
  const contentSummary = documents
    .map((doc) => {
      const title = doc.metadata.title || "Untitled";
      const summary = doc.metadata.summary || "";
      const tags = (doc.metadata.tags as string[])?.join(", ") || "";
      return `## ${title}\n${summary}\nTags: ${tags}`;
    })
    .join("\n\n");

  console.log(`Found ${documents.length} documents\n`);

  console.log("Generating excerpts with LLM...");

  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.8,
  });

  const prompt = PROMPT.replace("{content}", contentSummary);
  const response = await llm.invoke(prompt);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  // Parse the JSON response
  let excerpts: Array<{ text: string; category: string }>;
  try {
    // Try to extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }
    excerpts = JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to parse LLM response:", error);
    console.log("Raw response:", content);
    process.exit(1);
  }

  // Validate excerpts
  const validExcerpts = excerpts.filter(
    (e) =>
      e.text &&
      typeof e.text === "string" &&
      ["skill", "project", "achievement"].includes(e.category)
  );

  console.log(`Generated ${validExcerpts.length} valid excerpts\n`);

  // Ensure output directory exists
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

  // Write to file
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(validExcerpts, null, 2));

  console.log(`Excerpts saved to: ${OUTPUT_PATH}`);

  // Show a preview
  console.log("\nPreview of first 5 excerpts:");
  validExcerpts.slice(0, 5).forEach((e, i) => {
    console.log(`  ${i + 1}. [${e.category}] ${e.text}`);
  });
}

main().catch((error) => {
  console.error("Excerpt generation failed:", error);
  process.exit(1);
});
