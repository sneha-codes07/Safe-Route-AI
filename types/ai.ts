/**
 * Raw shape of a timeline step as returned by the Gemini API.
 * All fields are optional to guard against partial/malformed responses.
 */
export interface GeminiTimelineStep {
  title?: string;
  location?: string;
  status?: string;
}

/**
 * Raw shape of the structured JSON Gemini is instructed to return for route analysis.
 * All fields optional — runtime validation (Zod) enforces correctness after parsing.
 */
export interface GeminiRouteAnalysis {
  origin?: string;
  destination?: string;
  travelTime?: string | number;
  estimatedDelay?: string | number;
  travelMode?: string;
  status?: string;
  floodRisk?: string;
  confidence?: number | string;
  recommendedRoute?: string[];
  roadsToAvoid?: string[];
  reasoning?: string;
  safetyTips?: string[];
  timeline?: GeminiTimelineStep[];
}

/**
 * Error shape returned when parsing fails completely.
 */
export interface GeminiParseError {
  parseError: true;
  rawText: string;
}
