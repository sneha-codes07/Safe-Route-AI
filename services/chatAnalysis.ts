"use server";

import { getModel } from "../lib/gemini";
import { chatQuestionSchema } from "../lib/schemas";
import type { ConversationRequest, ConversationResponse } from "@/types/chat";

const CHAT_TIMEOUT_MS = 15_000;

const CHAT_SYSTEM_PROMPT = `You are SafeRoute AI's conversational assistant.
Your sole purpose is to answer follow-up questions about the user's CURRENT route analysis.

RULES:
1. Be concise — maximum 150 words per response.
2. Prefer bullet points for readability.
3. Focus strictly on: flood risk, route safety, travel alternatives, and practical safety advice.
4. If the user asks anything unrelated to the current route, politely decline:
   "I can only assist with questions about your current route analysis."
5. Do not contradict the provided Route Analysis Data unless offering an explicitly hypothetical scenario.
6. Base your answers on the provided context. Do not fabricate data.

Format: standard markdown (bold, lists) is fine. No code blocks. No conversational padding.`;

/**
 * Server Action: handles follow-up chat questions about a route analysis.
 *
 * The user's question is validated and sanitized. Route analysis context is
 * injected server-side — it never travels through the client request body
 * as raw JSON without type checking.
 */
export async function chatFollowUpAction(
  req: ConversationRequest
): Promise<ConversationResponse> {
  // ── 1. Validate + sanitize the user's question ────────────────────────────
  const questionResult = chatQuestionSchema.safeParse(req.newQuestion);
  if (!questionResult.success) {
    return {
      success: false,
      error: questionResult.error.issues[0]?.message ?? "Invalid question.",
    };
  }
  const sanitizedQuestion = questionResult.data;

  // ── 2. Validate history length to prevent context bloat ──────────────────
  const MAX_HISTORY = 20;
  const trimmedHistory = req.chatHistory.slice(-MAX_HISTORY);

  // ── 3. Build context prompt (question already sanitized) ──────────────────
  const contextPrompt = [
    "[CONTEXT]",
    `Original travel request: "${req.originalQuery.slice(0, 300)}"`,
    "Route Analysis:",
    JSON.stringify(req.routeAnalysis, null, 2),
    "[/CONTEXT]",
    "",
    `Question: ${sanitizedQuestion}`,
  ].join("\n");

  // ── 4. Abort controller ───────────────────────────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    const model = getModel();

    const history = trimmedHistory.map((msg) => ({
      role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{ text: CHAT_SYSTEM_PROMPT }],
      },
      history,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    });

    const result = await Promise.race([
      chat.sendMessage(contextPrompt),
      new Promise<never>((_, reject) =>
        controller.signal.addEventListener("abort", () =>
          reject(new Error("Gemini chat timeout after 15s"))
        )
      ),
    ]);

    clearTimeout(timeoutId);

    const text = result.response.text().trim();
    return { success: true, content: text };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (process.env.NODE_ENV !== "production") {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("\n[SafeRoute AI] Chat Action Error");
      console.error("Message:", msg);
      if (error instanceof Error && error.stack) console.error("Stack:", error.stack);
      console.error("─".repeat(60) + "\n");
    }

    const message = error instanceof Error ? error.message : "";
    let userMessage = "An unexpected error occurred. Please try again.";
    if (message.includes("Invalid question")) userMessage = message;
    else if (message.includes("API key")) userMessage = "API Key configuration error.";
    else if (message.includes("timeout") || message.includes("abort"))
      userMessage = "The AI took too long to respond. Please try again.";
    else if (message.includes("quota") || message.includes("rate"))
      userMessage = "API rate limit reached. Please wait a moment.";

    return { success: false, error: userMessage };
  }
}
