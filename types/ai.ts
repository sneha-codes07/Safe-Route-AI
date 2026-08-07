export interface GeminiTimelineStep {
  title: string;
  status: string;
}

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
