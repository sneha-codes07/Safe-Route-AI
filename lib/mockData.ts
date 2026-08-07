import { RouteAnalysis } from "../types/route";

export const MOCK_ROUTE_ANALYSIS: RouteAnalysis = {
  origin: "Salt Lake",
  destination: "Park Street",
  travelTimeMins: 42,
  risk: "Moderate",
  delayMins: 8,
  roadsToAvoid: ["EM Bypass", "Canal Road"],
  safeRouteSteps: ["Sector V", "AJC Bose Road", "Park Street"],
  travelMode: "Driving",
  aiExplanation: "Traffic data and local sensors indicate severe waterlogging on the EM Bypass due to recent heavy rainfall. We recommend taking the AJC Bose Road flyover, which remains entirely unaffected, ensuring a safer and more predictable journey despite a slight distance increase.",
  safetyTips: [
    "Use public transport if possible.",
    "Avoid waterlogged intersections.",
    "Carry emergency contacts.",
    "Drive below 20km/h in shallow water."
  ],
  timeline: [
    { id: "t1", type: "start", location: "Salt Lake Sector V", description: "Clear conditions" },
    { id: "t2", type: "checkpoint", location: "Chingrighata Crossing", description: "Mild traffic" },
    { id: "t3", type: "flood-zone", location: "EM Bypass (Avoided)", description: "Heavy waterlogging reported" },
    { id: "t4", type: "alternative", location: "AJC Bose Road Flyover", description: "Elevated, safe route" },
    { id: "t5", type: "destination", location: "Park Street", description: "Safe arrival" }
  ],
  confidenceScore: 94
};
