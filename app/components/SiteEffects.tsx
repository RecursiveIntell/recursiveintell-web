"use client";

// Content is visible in the server render. This hook only adds optional motion.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function SiteEffects() {
  const path = usePathname();
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    nodes.forEach((node) => node.classList.add("is-visible"));
  }, [path]);
  return null;
}
