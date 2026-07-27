export type PortfolioSourceStatus = {
  state: "loading" | "live" | "partial" | "snapshot" | "stale" | "unavailable" | "unknown";
  label: string;
  detail: string;
  live: boolean;
};

type PortfolioSourceInput = {
  state?: string;
  loading?: boolean;
  requestFailed?: boolean;
  generatedAt?: string;
  observedAt?: string;
  cacheSeconds?: number;
};

type PortfolioMeta = {
  generatedAt?: string;
  cacheSeconds?: number;
  sources?: {
    github?: { state?: string };
    crates?: { state?: string; observedAt?: string };
  };
};

function validTimestamp(value: string | undefined): number | null {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function sourceTimestamp(value: string | undefined): string {
  const timestamp = validTimestamp(value);
  if (timestamp === null) return "observation time unavailable";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(timestamp);
}

export function portfolioSourceStatus(
  input: PortfolioSourceInput,
  now = Date.now(),
): PortfolioSourceStatus {
  if (input.loading) {
    return {
      state: "loading",
      label: "REFRESHING",
      detail: "Requesting the public source now.",
      live: false,
    };
  }

  if (input.requestFailed || input.state === "unavailable") {
    return {
      state: "unavailable",
      label: "UNAVAILABLE",
      detail: "No current value is inferred for this source.",
      live: false,
    };
  }

  if (input.state === "snapshot") {
    return {
      state: "snapshot",
      label: "DATED SNAPSHOT",
      detail: `Observed ${sourceTimestamp(input.observedAt)}.`,
      live: false,
    };
  }

  if (input.state === "partial") {
    return {
      state: "partial",
      label: "PARTIAL INVENTORY",
      detail: `The public API response is incomplete · generated ${sourceTimestamp(input.generatedAt)}.`,
      live: false,
    };
  }

  if (input.state === "live") {
    const generated = validTimestamp(input.generatedAt);
    const staleAfterSeconds = Math.max((input.cacheSeconds ?? 900) * 2, 1_800);
    if (generated !== null && now - generated > staleAfterSeconds * 1_000) {
      return {
        state: "stale",
        label: "STALE CACHED RESPONSE",
        detail: `Last generated ${sourceTimestamp(input.generatedAt)}.`,
        live: false,
      };
    }
    return {
      state: "live",
      label: "LIVE PUBLIC API",
      detail: `Response generated ${sourceTimestamp(input.generatedAt)}.`,
      live: true,
    };
  }

  return {
    state: "unknown",
    label: "STATE UNKNOWN",
    detail: "The source did not report a recognized freshness state.",
    live: false,
  };
}

export function portfolioDashboardState(
  meta: PortfolioMeta | null | undefined,
  metricsFailed: boolean,
  crateFallbackObservedAt: string,
  now = Date.now(),
) {
  return {
    github: portfolioSourceStatus({
      state: meta?.sources?.github?.state,
      loading: !meta && !metricsFailed,
      requestFailed: metricsFailed,
      generatedAt: meta?.generatedAt,
      cacheSeconds: meta?.cacheSeconds,
    }, now),
    crates: portfolioSourceStatus({
      state: metricsFailed ? "snapshot" : meta?.sources?.crates?.state,
      loading: !meta && !metricsFailed,
      generatedAt: meta?.generatedAt,
      observedAt: meta?.sources?.crates?.observedAt ?? crateFallbackObservedAt,
      cacheSeconds: meta?.cacheSeconds,
    }, now),
  };
}
