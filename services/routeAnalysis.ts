"use server";

import { getModel } from "../lib/gemini";
import { parseGeminiResponse } from "../lib/parser";
import { validateAndMapResponse } from "../lib/validator";
import { routeQuerySchema } from "../lib/schemas";
import type { RouteAnalysis } from "@/types/route";

const ROUTE_ANALYSIS_TIMEOUT_MS = 25_000;

const SYSTEM_PROMPT = `You are SafeRoute AI — an intelligent flood-aware travel risk engine.
Convert natural-language travel requests into structured, actionable flood risk guidance.

STRICT RULES:
- Return ONLY valid JSON. No markdown. No explanation outside JSON.
- If information is ambiguous, infer reasonable values and lower the confidence score.
- floodRisk must be exactly one of: "Safe", "Moderate", "High", "Critical"
- confidence must be an integer 0-100

Return exactly this JSON structure (no extra fields):
{
  "origin": "",
  "destination": "",
  "travelTime": "",
  "estimatedDelay": "",
  "travelMode": "",
  "status": "",
  "floodRisk": "Safe | Moderate | High | Critical",
  "confidence": 0,
  "recommendedRoute": [],
  "roadsToAvoid": [],
  "reasoning": "",
  "safetyTips": [],
  "timeline": [
    { "title": "", "status": "" }
  ]
}`;

/**
 * Server Action: analyzes a flood-aware travel route using Gemini AI.
 *
 * Input is validated and sanitized before reaching the model.
 * The response is parsed, Zod-validated, and mapped to a typed RouteAnalysis.
 * Errors are categorized and sanitized before returning to the client.
 */
export async function analyzeRouteAction(
  rawQuery: string
): Promise<{ success: boolean; data?: RouteAnalysis; error?: string }> {
  // ── 1. Validate + sanitize user input ──────────────────────────────────────
  const queryResult = routeQuerySchema.safeParse(rawQuery);
  if (!queryResult.success) {
    return {
      success: false,
      error: queryResult.error.issues[0]?.message ?? "Invalid input.",
    };
  }
  const query = queryResult.data;

  // ── 2. Abort controller for clean cancellation ────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ROUTE_ANALYSIS_TIMEOUT_MS);

  let rawText = "";
  try {
    const model = getModel();

    const fetchPromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: query }] }],
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.2, // low temperature for deterministic structured output
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    // Race against AbortController timeout
    const result = await Promise.race([
      fetchPromise,
      new Promise<never>((_, reject) =>
        controller.signal.addEventListener("abort", () =>
          reject(new Error("Gemini API timeout after 25s"))
        )
      ),
    ]);

    clearTimeout(timeoutId);

    // Guard against truncated responses before attempting to parse
    const finishReason = result.response.candidates?.[0]?.finishReason;
    if (finishReason === "MAX_TOKENS") {
      throw new Error("Gemini response was truncated (MAX_TOKENS). Response may be too long.");
    }

    rawText = result.response.text();

    // ── 3. Parse JSON ─────────────────────────────────────────────────────────
    const parsedData = parseGeminiResponse(rawText);

    // ── 4. Extract fallback context from the sanitized query ─────────────────
    const words = query.split(/\s+/);
    const fromIdx = words.findIndex((w) => /^(from|leaving)$/i.test(w));
    const toIdx = words.findIndex((w) => /^(to|toward|towards|reaching)$/i.test(w));
    const fallbackContext = {
      origin: fromIdx !== -1 ? words.slice(fromIdx + 1, fromIdx + 3).join(" ") : "Origin",
      destination: toIdx !== -1 ? words.slice(toIdx + 1, toIdx + 3).join(" ") : "Destination",
    };

    // ── 5. Validate + map to domain type ─────────────────────────────────────
    const finalData = validateAndMapResponse(parsedData, fallbackContext);

    return { success: true, data: finalData };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    // Log detailed error server-side only
    if (process.env.NODE_ENV !== "production") {
      const msg = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error("\n[SafeRoute AI] Route Analysis Error");
      console.error("Message:", msg);
      console.error("Phase:", classifyErrorPhase(msg));
      if (stack) console.error("Stack:", stack);
      console.error("─".repeat(60) + "\n");
    }

    return { success: false, error: classifyUserError(error) };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function classifyErrorPhase(message: string): string {
  if (message.includes("API key")) return "Initialization";
  if (message.includes("JSON") || message.includes("Malformed") || message.includes("Invalid AI")) return "Parsing";
  if (message.includes("timeout") || message.includes("abort")) return "Network/Timeout";
  return "Execution";
}

function classifyUserError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("Invalid input")) return message;
  if (
    message.includes("API key") ||
    message.includes("401") ||
    message.includes("Unauthorized") ||
    message.includes("UNAUTHENTICATED") ||
    message.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED")
  ) {
    return "Invalid or missing Gemini API Key. Please set a valid GOOGLE_GENERATIVE_AI_API_KEY in .env.local.";
  }
  if (message.includes("JSON") || message.includes("Malformed") || message.includes("Invalid AI"))
    return "The AI returned an unexpected response format. Please try again.";
  if (message.includes("timeout") || message.includes("abort"))
    return "The AI took too long to respond. Please try again.";
  if (message.includes("quota") || message.includes("429") || message.includes("RESOURCE_EXHAUSTED") || message.includes("rate limit"))
    return "API rate limit reached. Please wait a moment and try again.";
  return "An unexpected error occurred during AI analysis. Showing simulated route guidance.";
}
