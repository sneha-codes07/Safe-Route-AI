import { geminiRouteAnalysisSchema, type GeminiRouteAnalysisSchema } from "./schemas";
import type { GeminiRouteAnalysis } from "@/types/ai";

/**
 * Strips optional markdown code fences that Gemini occasionally wraps around
 * its JSON output, then extracts the first JSON object literal found.
 */
function extractJson(rawText: string): string {
  let text = rawText.trim();

  // Remove ```json ... ``` or ``` ... ``` fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // If there is still conversational wrap, pull out the first {...} block
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return match[0];

  return text;
}

/**
 * Parses the raw Gemini text response into a typed, Zod-validated object.
 *
 * Throws `Error("Malformed JSON response from AI")` if the text cannot be
 * parsed as JSON, or `Error("Invalid AI response structure: ...")` if the
 * parsed object fails schema validation.
 */
export function parseGeminiResponse(rawText: string): GeminiRouteAnalysis {
  const textToParse = extractJson(rawText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(textToParse);
  } catch {
    throw new Error("Malformed JSON response from AI");
  }

  // Runtime validation — catches Gemini returning error objects or wrong shapes
  const result = geminiRouteAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid AI response structure: ${issues}`);
  }

  return result.data as GeminiRouteAnalysis;
}
