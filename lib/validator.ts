import { GeminiRouteAnalysis } from "@/types/ai";
import { RouteAnalysis, RiskLevel, TimelineStep } from "@/types/route";

function normalizeRiskLevel(rawRisk?: string): RiskLevel {
  if (!rawRisk) return "Moderate";
  const normalized = rawRisk.toLowerCase().trim();
  
  if (normalized.includes("safe") || normalized.includes("low")) return "Safe";
  if (normalized.includes("high") || normalized.includes("severe") || normalized.includes("danger")) return "High";
  if (normalized.includes("critical") || normalized.includes("extreme")) return "Critical";
  
  return "Moderate"; // default fallback for 'medium', 'moderate', or unknown
}

function parseNumeric(raw?: string | number, fallback = 0): number {
  if (typeof raw === "number") return isNaN(raw) ? fallback : raw;
  if (!raw) return fallback;
  
  const matches = String(raw).match(/(\d+)/);
  if (matches && matches[1]) {
    const num = parseInt(matches[1], 10);
    return isNaN(num) ? fallback : num;
  }
  return fallback;
}

function normalizeTimeline(steps: any[] = []): TimelineStep[] {
  if (!Array.isArray(steps) || steps.length === 0) {
    return [
      { id: "tl-unknown-1", type: "start", location: "Origin", description: "Route started" },
      { id: "tl-unknown-2", type: "destination", location: "Destination", description: "Route ended" }
    ];
  }

  return steps.map((step, idx) => {
    let mappedType: TimelineStep["type"] = "checkpoint";
    if (idx === 0) mappedType = "start";
    else if (idx === steps.length - 1) mappedType = "destination";
    else {
      const status = (step.status || "").toLowerCase();
      if (status.includes("flood") || status.includes("avoid") || status.includes("danger") || status.includes("hazard")) {
        mappedType = "flood-zone";
      } else if (status.includes("alt") || status.includes("safe") || status.includes("detour")) {
        mappedType = "alternative";
      }
    }

    return {
      id: `tl-gen-${idx}`,
      location: step.title || step.location || `Point ${idx + 1}`,
      type: mappedType,
      description: typeof step.status === "string" ? step.status : undefined,
    };
  });
}

export function validateAndMapResponse(aiData: GeminiRouteAnalysis, fallbackContext: { origin: string; destination: string }): RouteAnalysis {
  return {
    origin: aiData.origin || fallbackContext.origin,
    destination: aiData.destination || fallbackContext.destination,
    travelTimeMins: parseNumeric(aiData.travelTime, 30),
    delayMins: parseNumeric(aiData.estimatedDelay, 0),
    risk: normalizeRiskLevel(aiData.floodRisk),
    roadsToAvoid: Array.isArray(aiData.roadsToAvoid) ? aiData.roadsToAvoid : [],
    safeRouteSteps: Array.isArray(aiData.recommendedRoute) ? aiData.recommendedRoute : [],
    travelMode: aiData.travelMode || "Driving",
    aiExplanation: aiData.reasoning || "Based on predictive weather and traffic mapping, this route avoids the most severe expected flooding zones while maintaining reasonable efficiency.",
    safetyTips: Array.isArray(aiData.safetyTips) ? aiData.safetyTips : ["Carry emergency contacts.", "Follow local authorities' advice.", "Be aware of rapidly changing conditions."],
    confidenceScore: parseNumeric(aiData.confidence, 50),
    timeline: normalizeTimeline(aiData.timeline)
  };
}
