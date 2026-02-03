"use client";

import { useState } from "react";

type Excerpt = {
  text: string;
  category: "skill" | "project" | "achievement";
};

type ExcerptTickerProps = {
  excerpts: Excerpt[];
};

export function ExcerptTicker({ excerpts }: ExcerptTickerProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (excerpts.length === 0) return null;

  // Duplicate excerpts to create seamless loop
  const displayExcerpts = [...excerpts, ...excerpts];

  return (
    <div
      className="relative overflow-hidden border-b border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 py-3 backdrop-blur"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex whitespace-nowrap ${isPaused ? "[animation-play-state:paused]" : ""}`}
        style={{
          animation: "scroll 60s linear infinite",
        }}
      >
        {displayExcerpts.map((excerpt, index) => (
          <span
            key={index}
            className="mx-8 inline-flex items-center gap-2 text-sm"
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                excerpt.category === "skill"
                  ? "bg-[color:var(--color-accent)]"
                  : excerpt.category === "project"
                    ? "bg-[color:var(--color-accent-2)]"
                    : "bg-green-500"
              }`}
            />
            <span className="text-[color:var(--color-muted)]">
              {excerpt.text}
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
