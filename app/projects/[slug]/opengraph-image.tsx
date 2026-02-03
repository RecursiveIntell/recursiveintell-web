import { ImageResponse } from "next/og";
import { getContentBySlug } from "@/lib/content";

// Use Node.js runtime since we need file system access
export const runtime = "nodejs";

export const alt = "Project";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getContentBySlug("projects", slug);

  const title = entry?.title || "Project";
  const summary = entry?.summary || "";
  const tags = entry?.tags || [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f1115",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
          padding: 60,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "linear-gradient(135deg, #22d3ee 0%, #f97316 100%)",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>R</span>
          </div>
          <div style={{ fontSize: 24, color: "#a1a1aa" }}>RecursiveIntell / Projects</div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#f0f0f0",
            marginBottom: 24,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>

        {/* Summary */}
        <div
          style={{
            fontSize: 26,
            color: "#a1a1aa",
            marginBottom: 40,
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          {summary.slice(0, 150)}
          {summary.length > 150 ? "..." : ""}
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: "auto",
          }}
        >
          {tags.slice(0, 5).map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                borderRadius: 9999,
                backgroundColor: "rgba(34, 211, 238, 0.1)",
                border: "1px solid rgba(34, 211, 238, 0.3)",
                color: "#22d3ee",
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
