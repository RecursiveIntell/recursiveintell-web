import { ImageResponse } from "next/og";
export const alt = "RecursiveIntell | Independent AI Systems Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#17241e",
          color: "#f1f0e8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
          }}
        >
          <span>RecursiveIntell</span>
          <span style={{ color: "#d9e6a1", fontSize: 18 }}>
            JOSH STEVENSON / SYSTEMS ENGINEER
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            lineHeight: 1.04,
            letterSpacing: "-4px",
          }}
        >
          <span>AI systems.</span>
          <span style={{ color: "#d9e6a1" }}>Built to be understood.</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#b6bfb0",
            letterSpacing: "3px",
          }}
        >
          AGENTS / MEMORY / INFRASTRUCTURE
        </div>
      </div>
    ),
    size,
  );
}
