import { GeminiRouteAnalysis } from "@/types/ai";

export function parseGeminiResponse(rawText: string): GeminiRouteAnalysis {
  let textToParse = rawText.trim();

  // Strip markdown code fences if Gemini ignores the prompt
  if (textToParse.startsWith("```json")) {
    textToParse = textToParse.replace(/^```json/, "").trim();
  } else if (textToParse.startsWith("```")) {
    textToParse = textToParse.replace(/^```/, "").trim();
  }
  
  if (textToParse.endsWith("```")) {
    textToParse = textToParse.replace(/```$/, "").trim();
  }

  // Fallback cleanup: try to extract JSON from the string using regex if there's conversational wrap
  const jsonMatch = textToParse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    textToParse = jsonMatch[0];
  }

  try {
    const data = JSON.parse(textToParse);
    return data as GeminiRouteAnalysis;
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", err);
    throw new Error("Malformed JSON response from AI");
  }
}
