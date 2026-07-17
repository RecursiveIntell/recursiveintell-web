"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

const SAFE_ATTRIBUTE = /^data-event-(label|context|host|surface|source|offer|package|command|os|shell|step)$/;
const eventAliases: Record<string, string> = {
  install_host_select: "install_host_selected",
  install_command_copy: "install_command_copied",
  install_source_open: "canonical_docs_opened",
  github_opened: "github_repo_opened",
};

export default function SiteAnalytics() {
  useEffect(() => {
    function capture(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-event]");
      if (!target) return;

      const name = target.dataset.event;
      if (!name || !/^[a-z0-9_]{2,48}$/.test(name)) return;

      const properties: Record<string, string> = {};
      for (const attribute of target.attributes) {
        if (!SAFE_ATTRIBUTE.test(attribute.name) || attribute.name === "data-event") continue;
        properties[attribute.name.replace("data-event-", "")] = attribute.value.slice(0, 120);
      }

      track(eventAliases[name] || name, properties);
    }

    function captureError() {
      track("client_error", { surface: window.location.pathname.slice(0, 120), context: "window" });
    }

    function captureRejection() {
      track("client_error", { surface: window.location.pathname.slice(0, 120), context: "unhandled_rejection" });
    }

    document.addEventListener("click", capture, { passive: true });
    window.addEventListener("error", captureError);
    window.addEventListener("unhandledrejection", captureRejection);
    return () => {
      document.removeEventListener("click", capture);
      window.removeEventListener("error", captureError);
      window.removeEventListener("unhandledrejection", captureRejection);
    };
  }, []);

  return null;
}
