"use server";

import { getModel } from "../lib/gemini";
import { ConversationRequest, ConversationResponse } from "@/types/chat";

const CHAT_SYSTEM_PROMPT = `You are SafeRoute AI's conversational assistant.
Your job is to answer follow-up questions from the user strictly regarding their CURRENT route analysis.

RULES:
1. Be concise (max 150 words).
2. Prefer bullet points for readability.
3. Strongly focus on practical travel safety, flood risk, and reasoning.
4. If the user asks about something unrelated to the route or completely out of scope, politely decline and redirect them back to the current route analysis. Example: "I can only assist with questions regarding your current travel analysis from X to Y."
5. Do not invent new data that blatantly contradicts the provided route analysis context unless you are offering a hypothetical alternative.
6. Rely heavily on the provided "Route Analysis Data" to answer their questions accurately.

Your responses go directly to a clean UI card. No markdown code blocks. Standard markdown (bold, lists) is fine.`;

export async function chatFollowUpAction(req: ConversationRequest): Promise<ConversationResponse> {
  try {
    const model = getModel();

    // Construct the context string we inject invisibly for Gemini
    const contextPrompt = `
[CONTEXT START]
User's Original Travel Request: "${req.originalQuery}"
Current Route Analysis Data:
${JSON.stringify(req.routeAnalysis, null, 2)}
[CONTEXT END]

User's new question: ${req.newQuestion}
`;

    // Map strict history to Gemini format
    const history = req.chatHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Start a chat session on the model
    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{ text: CHAT_SYSTEM_PROMPT }]
      },
      history: history,
      generationConfig: {
        temperature: 0.4,
      },
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Gemini API timeout")), 15000)
    );

    const result = await Promise.race([
      chat.sendMessage(contextPrompt),
      timeoutPromise
    ]) as any;

    const text = result.response.text().trim();

    return { success: true, content: text };
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("\n[SafeRoute AI Debug] Gemini Chat Action Error:");
      console.error(error?.message || error);
      console.error("Stack trace:", error?.stack);
      console.error("--------------------------------------------------\n");
    }
    
    let userMessage = "An unexpected error occurred.";
    if (error?.message?.includes("API key")) userMessage = "API Key configuration error.";
    else if (error?.message?.includes("timeout")) userMessage = "AI service took too long to respond. Please try again.";

    return { success: false, error: userMessage };
  }
}
