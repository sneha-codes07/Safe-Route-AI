import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

/**
 * Fail fast if the API key is missing.
 * In production builds this surfaces immediately rather than failing silently on first request.
 */
if (!apiKey) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY is not set. Set this environment variable before starting the server."
    );
  } else {
    console.warn(
      "[SafeRoute AI] GOOGLE_GENERATIVE_AI_API_KEY is not defined. " +
        "Create a .env.local file based on .env.example and add your API key."
    );
  }
}

export const genAI = new GoogleGenerativeAI(apiKey ?? "");

/**
 * Returns a configured Gemini generative model instance.
 * The model name is read from env so it can be swapped without code changes.
 */
export const getModel = () => {
  const modelName =
    process.env.GEMINI_MODEL_NAME ?? "gemini-2.5-flash-lite-preview-06-17";
  return genAI.getGenerativeModel({ model: modelName });
};
