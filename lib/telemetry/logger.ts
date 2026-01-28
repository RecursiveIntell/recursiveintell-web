import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
  base: {
    service: "portfolio-website",
    version: process.env.npm_package_version || "0.1.0",
  },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    remove: true,
  },
});

// Create child loggers for specific components
export const chatLogger = logger.child({ component: "chat" });
export const ragLogger = logger.child({ component: "rag" });
export const apiLogger = logger.child({ component: "api" });

// Utility functions for common log patterns
export function logChatSession(sessionId: string, action: string, meta?: Record<string, unknown>) {
  chatLogger.info({ sessionId, action, ...meta }, `Chat ${action}`);
}

export function logRagQuery(query: string, documentsFound: number, durationMs: number) {
  ragLogger.info(
    { query: query.slice(0, 100), documentsFound, durationMs },
    "RAG query completed"
  );
}

export function logRateLimitHit(ip: string, remaining: number, reset: number) {
  apiLogger.warn(
    { ip, remaining, resetAt: new Date(reset).toISOString() },
    "Rate limit exceeded"
  );
}

export function logApiError(error: Error, context?: Record<string, unknown>) {
  apiLogger.error(
    { err: error, ...context },
    `API error: ${error.message}`
  );
}

export function logLlmCall(
  provider: string,
  model: string,
  durationMs: number,
  tokensUsed?: number
) {
  chatLogger.info(
    { provider, model, durationMs, tokensUsed },
    "LLM call completed"
  );
}

// Performance timing utility
export function createTimer() {
  const start = performance.now();
  return {
    elapsed: () => Math.round(performance.now() - start),
    log: (message: string, context?: Record<string, unknown>) => {
      logger.debug({ durationMs: Math.round(performance.now() - start), ...context }, message);
    },
  };
}

export default logger;
