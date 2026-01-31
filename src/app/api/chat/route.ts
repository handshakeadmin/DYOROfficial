import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
} from "@/lib/chat-rate-limiter";
import {
  buildGuestSystemPrompt,
  buildAuthenticatedSystemPrompt,
  buildProductContext,
  buildQueryContext,
} from "@/lib/chat-context";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

interface UserOrder {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  status: string;
  tracking_number?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before sending another message.",
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Parse request body
    const body: ChatRequest = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let systemPrompt: string;
    let userFirstName = "";

    if (user) {
      // Authenticated user - fetch profile and orders
      const [profileResult, ordersResult] = await Promise.all([
        supabase.from("users").select("first_name, email").eq("id", user.id).single(),
        supabase
          .from("orders")
          .select("id, order_number, created_at, total, status, tracking_number")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const profile = profileResult.data;
      const orders: UserOrder[] = ordersResult.data || [];

      userFirstName = profile?.first_name || "";

      systemPrompt = buildAuthenticatedSystemPrompt({
        firstName: userFirstName,
        email: profile?.email || user.email || "",
        orders: orders.map((o) => ({
          id: o.id,
          orderNumber: o.order_number,
          createdAt: o.created_at,
          total: o.total,
          status: o.status,
          trackingNumber: o.tracking_number,
        })),
      });
    } else {
      // Guest user
      systemPrompt = buildGuestSystemPrompt();
    }

    // Add product context
    const productContext = buildProductContext();
    const queryContext = buildQueryContext(message);

    const fullSystemPrompt = `${systemPrompt}

${productContext}
${queryContext}`;

    // Build message history for Claude
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    // Add conversation history (limit to last 10 messages to manage context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Add current message
    messages.push({
      role: "user",
      content: message,
    });

    // Call Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set in environment variables");
      return NextResponse.json(
        { success: false, error: "Chat service is not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: fullSystemPrompt,
      messages,
    });

    // Extract text response
    const textContent = response.content.find((block) => block.type === "text");
    const assistantMessage = textContent && "text" in textContent ? textContent.text : "";

    return NextResponse.json(
      {
        success: true,
        response: assistantMessage,
        isAuthenticated: !!user,
        userName: userFirstName,
      },
      {
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);

    // Handle specific errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { success: false, error: "Chat service configuration error" },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { success: false, error: "Chat service is busy. Please try again shortly." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  }
}
