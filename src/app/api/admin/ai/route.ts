import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/admin";
import {
  checkAdminRateLimit,
  getAdminRateLimitHeaders,
} from "@/lib/admin-rate-limiter";
import {
  buildAdminSystemPrompt,
  buildProductAutofillPrompt,
  parseAutofillResponse,
} from "@/lib/admin-ai-context";
import {
  AdminAIRequest,
  AdminAIResponse,
} from "@/types/admin-ai";

export async function POST(request: Request): Promise<Response> {
  try {
    // Verify admin authentication
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    // Rate limiting by user ID
    const rateLimitResult = checkAdminRateLimit(adminUser.id);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before sending another message.",
        },
        {
          status: 429,
          headers: getAdminRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Parse request body
    const body: AdminAIRequest = await request.json();
    const { message, context, mode, history = [] } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    if (!context || !context.page) {
      return NextResponse.json(
        { success: false, error: "Context with page is required" },
        { status: 400 }
      );
    }

    // Call Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY is not set in environment variables");
      return NextResponse.json(
        { success: false, error: "AI service is not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Handle autofill mode
    if (mode === "autofill") {
      const peptideName = context.formData?.name as string || message;
      const autofillPrompt = buildProductAutofillPrompt(peptideName);

      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 2048,
        system: autofillPrompt,
        messages: [
          {
            role: "user",
            content: `Research and provide product information for: ${peptideName}`,
          },
        ],
      });

      const textContent = response.content.find((block) => block.type === "text");
      const responseText = textContent && "text" in textContent ? textContent.text : "";

      const structuredData = parseAutofillResponse(responseText);

      if (!structuredData) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to parse AI response. Please try again.",
          },
          { status: 500 }
        );
      }

      const autofillResponse: AdminAIResponse = {
        success: true,
        structuredData,
        mode: "autofill",
      };

      return NextResponse.json(autofillResponse, {
        headers: getAdminRateLimitHeaders(rateLimitResult),
      });
    }

    // Handle chat mode
    const systemPrompt = buildAdminSystemPrompt(context);

    // Build message history
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    // Add conversation history (limit to last 20 messages for admin)
    const recentHistory = history.slice(-20);
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

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const textContent = response.content.find((block) => block.type === "text");
    const assistantMessage = textContent && "text" in textContent ? textContent.text : "";

    const chatResponse: AdminAIResponse = {
      success: true,
      response: assistantMessage,
      mode: "chat",
    };

    return NextResponse.json(chatResponse, {
      headers: getAdminRateLimitHeaders(rateLimitResult),
    });
  } catch (error) {
    console.error("Admin AI API error:", error);

    // Handle specific errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { success: false, error: "AI service configuration error" },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { success: false, error: "AI service is busy. Please try again shortly." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
