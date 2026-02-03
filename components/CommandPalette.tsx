"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import searchIndex from "@/public/data/search-index.json";

type SearchItem = {
  id: string;
  title: string;
  type: string;
  summary: string;
  tags: string[];
  date: string;
  href: string;
};

const index = searchIndex as SearchItem[];

const typeIcons: Record<string, React.ReactNode> = {
  projects: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  lab: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  writing: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  "vault-prompts": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  "vault-tools": (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const quickActions = [
  { title: "Go to Projects", href: "/projects", type: "navigation" },
  { title: "Go to Lab", href: "/lab", type: "navigation" },
  { title: "Go to Writing", href: "/writing", type: "navigation" },
  { title: "Go to Vault", href: "/vault", type: "navigation" },
  { title: "Go to About", href: "/about", type: "navigation" },
  { title: "Go to Now", href: "/now", type: "navigation" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredResults = query.trim()
    ? index.filter((item) => {
        const searchText = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
    : [];

  const allResults = query.trim()
    ? filteredResults
    : quickActions.map((a) => ({ ...a, id: a.href, summary: "", tags: [], date: "" }));

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const selectItem = useCallback(
    (item: { href: string }) => {
      router.push(item.href);
      close();
    },
    [router, close]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allResults.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allResults.length - 1
        );
      }

      if (e.key === "Enter" && allResults[selectedIndex]) {
        e.preventDefault();
        selectItem(allResults[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close, allResults, selectedIndex, selectItem]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (listRef.current && allResults.length > 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, allResults.length]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 command-palette-backdrop"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-paper)] shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] px-4">
          <svg
            className="h-5 w-5 text-[color:var(--color-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, writing, lab experiments..."
            className="flex-1 bg-transparent py-4 text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-muted)]"
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            aria-activedescendant={
              allResults[selectedIndex]
                ? `result-${selectedIndex}`
                : undefined
            }
          />
          <kbd className="hidden rounded border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-2 py-0.5 text-xs text-[color:var(--color-muted)] sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="command-palette-results"
          role="listbox"
          className="max-h-80 overflow-y-auto p-2"
        >
          {allResults.length === 0 && query.trim() && (
            <div className="px-4 py-8 text-center text-[color:var(--color-muted)]">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {!query.trim() && (
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
              Quick Actions
            </div>
          )}

          {query.trim() && allResults.length > 0 && (
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
              Results
            </div>
          )}

          {allResults.map((item, idx) => (
            <button
              key={item.id || item.href}
              id={`result-${idx}`}
              role="option"
              aria-selected={idx === selectedIndex}
              onClick={() => selectItem(item)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                idx === selectedIndex
                  ? "bg-[color:var(--color-accent)] text-white"
                  : "text-[color:var(--color-text)] hover:bg-[color:var(--color-card)]"
              }`}
            >
              <span
                className={
                  idx === selectedIndex
                    ? "text-white/80"
                    : "text-[color:var(--color-muted)]"
                }
              >
                {typeIcons[item.type as keyof typeof typeIcons] || (
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                )}
              </span>
              <div className="flex-1 truncate">
                <div className="font-medium">{item.title}</div>
                {item.summary && (
                  <div
                    className={`truncate text-sm ${
                      idx === selectedIndex
                        ? "text-white/70"
                        : "text-[color:var(--color-muted)]"
                    }`}
                  >
                    {item.summary}
                  </div>
                )}
              </div>
              {item.type && item.type !== "navigation" && (
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    idx === selectedIndex
                      ? "bg-white/20 text-white"
                      : "bg-[color:var(--color-border)] text-[color:var(--color-muted)]"
                  }`}
                >
                  {item.type}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[color:var(--color-border)] px-4 py-2 text-xs text-[color:var(--color-muted)]">
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-1.5 py-0.5">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-1.5 py-0.5">
              ↵
            </kbd>
            <span>Select</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-1.5 py-0.5">
              ⌘K
            </kbd>
            <span>Toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
