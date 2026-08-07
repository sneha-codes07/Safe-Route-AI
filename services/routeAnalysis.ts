"use server";

import { getModel } from "../lib/gemini";
import { parseGeminiResponse } from "../lib/parser";
import { validateAndMapResponse } from "../lib/validator";
import { RouteAnalysis } from "@/types/route";

const SYSTEM_PROMPT = `You are SafeRoute AI. You are an intelligent travel-risk analysis engine.
Your responsibility is to convert natural-language travel requests into structured flood-aware travel guidance.
You never answer conversationally. You never return markdown. You never explain outside JSON.
Always return valid JSON. If information is missing, infer reasonable values while lowering confidence.

Always return exactly this structure:
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
    {
      "title": "",
      "status": ""
    }
  ]
}

Never include additional fields.`;

export async function analyzeRouteAction(query: string): Promise<{ success: boolean; data?: RouteAnalysis; error?: string }> {
  try {
    const model = getModel();
    
    // Setup timeout controller
    const fetchPromise = model.generateContent({
      contents: [
        { role: "user", parts: [{ text: query }] }
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }]
      },
      generationConfig: {
        temperature: 0.2, // low temp for structured mapping
      }
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Gemini API timeout")), 25000)
    );

    // Race the API call against a 25s timeout (Server Actions usually cap at 10-30s depending on hosting)
    const result = await Promise.race([fetchPromise, timeoutPromise]) as any;

    const rawText = result.response.text();
    
    // Parse JSON
    const parsedData = parseGeminiResponse(rawText);
    
    // Validate & Map
    // We derive basic origin/destination broadly for fallback just in case the AI missed it completely.
    const fallbackContext = {
      origin: "Origin", 
      destination: "Destination" 
    };

    const finalData = validateAndMapResponse(parsedData, fallbackContext);
    
    return { success: true, data: finalData };
  } catch (error: any) {
    // We only log the detailed error severely internally. The client receives a generic error.
    if (process.env.NODE_ENV === "development") {
      console.error("\n[SafeRoute AI Debug] Gemini Route Analysis Extracted Error:");
      console.error(error?.message || error);
      console.error("Stack trace:", error?.stack);
      console.error("Phase:", error?.message?.includes("API key") ? "Initialization" : error?.message?.includes("JSON") ? "Parsing" : "Network/Execution");
      console.error("--------------------------------------------------\n");
    }
    
    let userMessage = "An unexpected error occurred during AI analysis.";
    if (error?.message?.includes("API key")) userMessage = "API Key configuration error.";
    else if (error?.message?.includes("JSON") || error?.message?.includes("Malformed")) userMessage = "Received malformed data from AI.";
    else if (error?.message?.includes("timeout")) userMessage = "AI service took too long to respond.";

    return { success: false, error: userMessage };
  }
}
