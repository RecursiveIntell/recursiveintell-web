"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/50 text-[color:var(--color-muted)] shadow-sm transition-all duration-200 hover:border-[color:var(--color-accent)]/50 hover:bg-[color:var(--color-card)] hover:text-[color:var(--color-accent)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {/* Sun icon for light mode */}
      <svg
        className={`h-5 w-5 transition-all duration-300 ${
          resolvedTheme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      {/* Moon icon for dark mode */}
      <svg
        className={`absolute h-5 w-5 transition-all duration-300 ${
          resolvedTheme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      {/* System indicator badge */}
      {theme === "system" && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[8px] font-bold text-white shadow-sm ring-2 ring-[color:var(--color-paper)]">
          A
        </span>
      )}
    </button>
  );
}
