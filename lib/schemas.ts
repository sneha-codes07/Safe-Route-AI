/**
 * Zod runtime schemas for validating Gemini API responses.
 * These run at runtime after JSON.parse(), catching any structural drift
 * before data reaches the UI layer.
 */
import { z } from "zod";

// ─── Primitives ──────────────────────────────────────────────────────────────

const riskLevelSchema = z.enum(["Safe", "Moderate", "High", "Critical"]);

const timelineStepSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
});

// ─── Main AI Response Schema ──────────────────────────────────────────────────

/**
 * Validates the raw JSON Gemini returns for route analysis.
 * All fields are optional because Gemini may omit them; the validator.ts layer
 * supplies defaults for anything missing.
 */
export const geminiRouteAnalysisSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  travelTime: z.union([z.string(), z.number()]).optional(),
  estimatedDelay: z.union([z.string(), z.number()]).optional(),
  travelMode: z.string().optional(),
  status: z.string().optional(),
  floodRisk: riskLevelSchema.or(z.string()).optional(),
  confidence: z.union([z.number(), z.string()]).optional(),
  recommendedRoute: z.array(z.string()).optional(),
  roadsToAvoid: z.array(z.string()).optional(),
  reasoning: z.string().optional(),
  safetyTips: z.array(z.string()).optional(),
  timeline: z.array(timelineStepSchema).optional(),
});

export type GeminiRouteAnalysisSchema = z.infer<typeof geminiRouteAnalysisSchema>;

// ─── Input Validation ─────────────────────────────────────────────────────────

/** Validates and sanitizes the user's route query before sending to Gemini. */
export const routeQuerySchema = z
  .string()
  .min(10, "Please describe your journey in a bit more detail (at least 10 characters).")
  .max(600, "Query is too long. Please keep it under 600 characters.")
  .transform((s) => s.trim())
  // Strip any prompt-injection-style delimiter sequences
  .transform((s) =>
    s
      .replace(/\[CONTEXT (START|END)\]/gi, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/<[^>]{0,200}>/g, "") // strip HTML/XML tags
      .trim()
  );

/** Validates a follow-up chat question. */
export const chatQuestionSchema = z
  .string()
  .min(2, "Question is too short.")
  .max(300, "Question is too long. Please keep it under 300 characters.")
  .transform((s) => s.trim())
  .transform((s) =>
    s
      .replace(/\[CONTEXT (START|END)\]/gi, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/<[^>]{0,200}>/g, "")
      .trim()
  );

export type RouteQueryInput = z.infer<typeof routeQuerySchema>;
export type ChatQuestionInput = z.infer<typeof chatQuestionSchema>;
