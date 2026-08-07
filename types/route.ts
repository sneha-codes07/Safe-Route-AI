export type RiskLevel = "Safe" | "Moderate" | "High" | "Critical";

export interface TimelineStep {
  id: string;
  location: string;
  type: "start" | "checkpoint" | "flood-zone" | "alternative" | "destination";
  description?: string;
}

export interface RouteAnalysis {
  origin: string;
  destination: string;
  travelTimeMins: number;
  risk: RiskLevel;
  delayMins: number;
  roadsToAvoid: string[];
  safeRouteSteps: string[];
  travelMode: string;
  aiExplanation: string;
  safetyTips: string[];
  timeline: TimelineStep[];
  confidenceScore: number;
}
