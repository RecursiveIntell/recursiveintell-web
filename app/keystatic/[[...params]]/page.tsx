"use client";

import { useEffect, useState } from "react";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../../keystatic.config";

const KeystaticPage = makePage(config);

export default function DebugPage() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ padding: 20, background: "yellow" }}>Loading Keystatic...</div>;
  }

  try {
    return (
      <div style={{ minHeight: "100vh" }}>
        <div style={{ padding: 10, background: "lime" }}>Keystatic wrapper mounted</div>
        <KeystaticPage />
      </div>
    );
  } catch (e) {
    return <div style={{ padding: 20, background: "red", color: "white" }}>Error: {String(e)}</div>;
  }
}
