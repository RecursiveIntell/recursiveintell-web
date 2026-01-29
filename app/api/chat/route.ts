import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chat, streamChat } from "@/lib/chat/agent";
import { getMessages, generateSessionId } from "@/lib/chat/memory";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const messageSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  stream: z.boolean().optional().default(false),
});

// Server-side configuration - uses environment variables
const CHAT_CONFIG = {
  provider: "openai" as const,
  model: "gpt-4o-mini",
};

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    console.warn("Rate limiting disabled: UPSTASH_REDIS credentials not configured");
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({
      url: redisUrl,
      token: redisToken,
    }),
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
    prefix: "portfolio-chat",
  });

  return ratelimit;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const limiter = getRatelimit();
    if (limiter) {
      const ip = getClientIp(request);
      const { success, remaining, reset } = await limiter.limit(ip);

      if (!success) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: "Please wait before sending more messages.",
            retryAfter: reset,
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { message, sessionId: providedSessionId, stream } = parsed.data;
    const sessionId = providedSessionId || generateSessionId();

    // Use server-side API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          message: "Chat service is not configured. Please contact the site owner.",
        },
        { status: 503 }
      );
    }

    const chatOptions = {
      provider: CHAT_CONFIG.provider,
      model: CHAT_CONFIG.model,
      apiKey,
    };

    if (stream) {
      // Return streaming response using Server-Sent Events
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            const generator = streamChat(sessionId, message, chatOptions);

            for await (const chunk of generator) {
              const data = JSON.stringify({ type: "chunk", content: chunk });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }

            const doneData = JSON.stringify({ type: "done", sessionId });
            controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
            controller.close();
          } catch (error) {
            const errorData = JSON.stringify({
              type: "error",
              message: "An error occurred while generating the response.",
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming response
    const response = await chat(sessionId, message, chatOptions);

    return NextResponse.json({
      response,
      sessionId,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 }
    );
  }

  const messages = getMessages(sessionId);

  return NextResponse.json({
    sessionId,
    messages,
  });
}
