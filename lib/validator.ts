import type { GeminiRouteAnalysis } from "@/types/ai";
import type { RouteAnalysis, RiskLevel, TimelineStep } from "@/types/route";

/** Explicit allowlist avoids "highlander".includes("high") false positives */
const RISK_MAP: Record<string, RiskLevel> = {
  safe: "Safe",
  low: "Safe",
  moderate: "Moderate",
  medium: "Moderate",
  high: "High",
  severe: "High",
  danger: "High",
  dangerous: "High",
  critical: "Critical",
  extreme: "Critical",
};

function normalizeRiskLevel(rawRisk?: string): RiskLevel {
  if (!rawRisk) return "Moderate";
  const key = rawRisk.toLowerCase().trim();
  return RISK_MAP[key] ?? "Moderate";
}

function parseNumeric(raw?: string | number, fallback = 0): number {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : fallback;
  if (!raw) return fallback;
  const match = String(raw).match(/(\d+)/);
  if (match?.[1]) {
    const n = parseInt(match[1], 10);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function normalizeTimeline(steps?: GeminiRouteAnalysis["timeline"]): TimelineStep[] {
  if (!Array.isArray(steps) || steps.length === 0) {
    return [
      {
        id: "tl-fallback-start",
        type: "start",
        location: "Origin",
        description: "Route started",
      },
      {
        id: "tl-fallback-end",
        type: "destination",
        location: "Destination",
        description: "Route ended",
      },
    ];
  }

  return steps.map((step, idx) => {
    let type: TimelineStep["type"] = "checkpoint";

    if (idx === 0) {
      type = "start";
    } else if (idx === steps.length - 1) {
      type = "destination";
    } else {
      const status = (step.status ?? "").toLowerCase();
      const FLOOD_KEYWORDS = ["flood", "avoid", "danger", "hazard", "waterlog", "submerge"];
      const ALT_KEYWORDS = ["alt", "safe", "detour", "bypass"];
      if (FLOOD_KEYWORDS.some((k) => status.includes(k))) type = "flood-zone";
      else if (ALT_KEYWORDS.some((k) => status.includes(k))) type = "alternative";
    }

    return {
      id: `tl-${idx}-${step.title?.slice(0, 8).replace(/\s+/g, "") ?? idx}`,
      location: step.title ?? step.location ?? `Point ${idx + 1}`,
      type,
      description: typeof step.status === "string" ? step.status : undefined,
    };
  });
}

/**
 * Maps a validated GeminiRouteAnalysis to the app's RouteAnalysis domain type.
 * Every field has a safe default so the UI never receives undefined values.
 */
export function validateAndMapResponse(
  aiData: GeminiRouteAnalysis,
  fallbackContext: { origin: string; destination: string }
): RouteAnalysis {
  return {
    origin: aiData.origin?.trim() || fallbackContext.origin,
    destination: aiData.destination?.trim() || fallbackContext.destination,
    travelTimeMins: parseNumeric(aiData.travelTime, 30),
    delayMins: parseNumeric(aiData.estimatedDelay, 0),
    risk: normalizeRiskLevel(aiData.floodRisk),
    roadsToAvoid: Array.isArray(aiData.roadsToAvoid)
      ? aiData.roadsToAvoid.filter((r) => typeof r === "string")
      : [],
    safeRouteSteps: Array.isArray(aiData.recommendedRoute)
      ? aiData.recommendedRoute.filter((s) => typeof s === "string")
      : [],
    travelMode: aiData.travelMode?.trim() || "Driving",
    aiExplanation:
      aiData.reasoning?.trim() ||
      "Based on predictive weather and traffic mapping, this route avoids the most severe expected flooding zones while maintaining reasonable efficiency.",
    safetyTips: Array.isArray(aiData.safetyTips) && aiData.safetyTips.length > 0
      ? aiData.safetyTips.filter((t) => typeof t === "string")
      : [
          "Carry emergency contacts.",
          "Follow local authorities' advice.",
          "Be aware of rapidly changing conditions.",
        ],
    confidenceScore: Math.min(100, Math.max(0, parseNumeric(aiData.confidence, 50))),
    timeline: normalizeTimeline(aiData.timeline),
  };
}
