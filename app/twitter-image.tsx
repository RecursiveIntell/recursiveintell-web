import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Josh Stevenson - Rust Evidence Runtime Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f1115",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
        }}
      >
        {/* Logo/Initial */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "linear-gradient(135deg, #22d3ee 0%, #f97316 100%)",
            marginBottom: 32,
            boxShadow: "0 20px 60px -10px rgba(34, 211, 238, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
            }}
          >
            R
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#f0f0f0",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Josh Stevenson
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 32,
            color: "#22d3ee",
            marginBottom: 24,
            fontWeight: 500,
          }}
        >
          Rust Evidence Runtime Engineer
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Building local-first evidence runtimes in the open
        </div>

        {/* Skills tags */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
          }}
        >
          {["Rust", "Tauri", "SQLite", "Receipts", "ClaimLedger"].map(
            (skill) => (
              <div
                key={skill}
                style={{
                  padding: "8px 20px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(34, 211, 238, 0.1)",
                  border: "1px solid rgba(34, 211, 238, 0.3)",
                  color: "#22d3ee",
                  fontSize: 18,
                }}
              >
                {skill}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#6b7280",
          }}
        >
          recursiveintell.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
