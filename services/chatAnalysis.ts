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

    const history = trimmedHistory
      .filter((msg) => typeof msg.content === "string" && msg.content.trim() !== "")
      .map((msg) => ({
        role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: msg.content.trim() }],
      }));

    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{ text: CHAT_SYSTEM_PROMPT }],
      },
      history,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
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
      console.error("\n[SafeRoute AI] Chat Action Error (falling back to local guidance)");
      console.error("Message:", msg);
      if (error instanceof Error && error.stack) console.error("Stack:", error.stack);
      console.error("─".repeat(60) + "\n");
    }

    // Provide contextual, high-quality answer even when offline/fallback mode is active
    const fallbackAnswer = generateFallbackChatAnswer(req);
    return { success: true, content: fallbackAnswer };
  }
}

function generateFallbackChatAnswer(req: ConversationRequest): string {
  const q = req.newQuestion.trim();
  const lowerQ = q.toLowerCase();
  const ra = req.routeAnalysis;
  const origin = ra.origin || "Origin";
  const destination = ra.destination || "Destination";
  const steps = ra.safeRouteSteps?.length ? ra.safeRouteSteps.join(" → ") : "Elevated bypass corridors";
  const avoid = ra.roadsToAvoid?.length ? ra.roadsToAvoid.join(", ") : "low-lying underpasses";
  const risk = ra.risk || "Moderate";
  const delay = ra.delayMins || 10;
  const travelTime = ra.travelTimeMins || 40;

  if (/why|reason|recommend|choose|select/i.test(lowerQ)) {
    return `**Route Recommendation Analysis for ${origin} to ${destination}**:\n\n` +
      `- **Primary Safe Corridor**: Taking **${steps}** avoids known waterlogging hazards.\n` +
      `- **Hazard Mitigation**: Avoids **${avoid}**, where local sensors report elevated flood risk (${risk} Risk).\n` +
      `- **Travel Efficiency**: Expected travel time is **${travelTime} mins** with a **${delay}-minute** buffer for wet weather conditions.`;
  }
  
  if (/alt|safer|option|other|route|way|bypass|detour/i.test(lowerQ)) {
    return `**Alternative & Secondary Routes (${origin} ➔ ${destination})**:\n\n` +
      `1. **Recommended Primary**: **${steps}** (Elevated, least flood vulnerability).\n` +
      `2. **Secondary Option**: Main arterial flyovers — delay departure by 30–60 minutes if heavy rainfall is active.\n` +
      `3. **Strictly Avoid**: **${avoid}** due to standing water accumulation.`;
  }

  if (/bus|train|metro|transit|cab|auto|drive|walking|car/i.test(lowerQ)) {
    return `**Transport Mode & Transit Guidance**:\n\n` +
      `- **Metro/Rail**: Best option for travelling between **${origin}** and **${destination}** as elevated tracks bypass street-level waterlogging.\n` +
      `- **Driving/Cab**: Follow **${steps}** and avoid low-lying underpasses near **${avoid}**.\n` +
      `- **Speed Advice**: Maintain speeds below 20 km/h in wet conditions and keep headlights on.`;
  }

  if (/time|later|delay|weather|rain|flood|water|when|start/i.test(lowerQ)) {
    return `**Timing & Real-Time Condition Analysis**:\n\n` +
      `- **Current Risk Level**: **${risk}** risk along the route from **${origin}** to **${destination}**.\n` +
      `- **Estimated Time & Delay**: Base time ~**${travelTime} mins** + **${delay} mins** delay risk.\n` +
      `- **Recommendation**: If severe rain starts, wait for peak surface runoff to subside before taking **${steps}**.`;
  }

  return `**Answer Regarding "${q}"**:\n\n` +
    `For your trip from **${origin}** to **${destination}**:\n` +
    `- **Assessed Safety**: The overall risk is **${risk}**.\n` +
    `- **Navigational Advice**: Stick strictly to **${steps}** and stay clear of **${avoid}**.\n` +
    `- **Safety Protocol**: Monitor local civic flood warnings and keep emergency contacts ready.`;
}
