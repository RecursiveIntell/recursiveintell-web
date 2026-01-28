"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { StatusBadge, type ContentStatus } from "@/components/StatusBadge";
import { TagChip } from "@/components/TagChip";

type FeaturedProject = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
  status?: ContentStatus;
};

type FeaturedCarouselProps = {
  projects: FeaturedProject[];
};

export function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (isPaused || projects.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, projects.length, nextSlide]);

  if (projects.length === 0) return null;

  const current = projects[currentIndex];

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[320px] p-8 md:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[color:var(--color-accent-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Featured
          </span>
          {current.status && <StatusBadge status={current.status} />}
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            {formatDate(current.date)}
          </span>
        </div>

        <Link href={current.href} className="group mt-6 block">
          <h2 className="text-4xl font-semibold transition-colors group-hover:text-[color:var(--color-accent)] md:text-5xl">
            {current.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[color:var(--color-muted)]">
            {current.summary}
          </p>
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          {current.tags.slice(0, 6).map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>

        <Link
          href={current.href}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-transparent bg-[color:var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[color:var(--color-accent-2)]"
        >
          Explore Project
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>

      {projects.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-[color:var(--color-border)] bg-white/90 p-2 text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
            aria-label="Previous project"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-[color:var(--color-border)] bg-white/90 p-2 text-[color:var(--color-muted)] transition-all hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
            aria-label="Next project"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-[color:var(--color-accent)]"
                    : "w-2 bg-[color:var(--color-border)] hover:bg-[color:var(--color-muted)]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
