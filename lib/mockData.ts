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

/**
 * Creates a dynamic fallback RouteAnalysis tailored to the user's input query
 * when live AI service is unavailable.
 */
export function getFallbackRouteAnalysis(query: string): RouteAnalysis {
  const cleanQuery = query.trim();
  if (!cleanQuery) return MOCK_ROUTE_ANALYSIS;

  const words = cleanQuery.split(/\s+/);
  const fromIdx = words.findIndex((w) => /^(from|leaving|start|starting)$/i.test(w));
  const toIdx = words.findIndex((w) => /^(to|toward|towards|reaching|for)$/i.test(w));

  let origin = "Origin";
  let destination = "Destination";

  if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
    origin = words.slice(fromIdx + 1, toIdx).join(" ").replace(/,/g, "").trim() || "Origin";
    destination = words.slice(toIdx + 1).join(" ").replace(/,/g, "").trim() || "Destination";
  } else if (toIdx !== -1) {
    origin = words.slice(0, toIdx).join(" ").replace(/,/g, "").trim() || "Origin";
    destination = words.slice(toIdx + 1).join(" ").replace(/,/g, "").trim() || "Destination";
  } else if (words.length >= 3 && /to/i.test(words[1])) {
    origin = words[0];
    destination = words.slice(2).join(" ");
  } else if (words.length >= 1) {
    origin = words.slice(0, Math.ceil(words.length / 2)).join(" ");
    destination = words.slice(Math.ceil(words.length / 2)).join(" ") || "Destination";
  }

  // Capitalize words
  origin = origin.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  destination = destination.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  // Compute pseudo-random but deterministic confidence score based on string length & char codes
  let hash = 0;
  for (let i = 0; i < cleanQuery.length; i++) {
    hash = (hash << 5) - hash + cleanQuery.charCodeAt(i);
    hash |= 0;
  }
  const confidenceScore = 70 + (Math.abs(hash) % 25); // 70 to 94 range

  return {
    origin,
    destination,
    travelTimeMins: 35 + (Math.abs(hash) % 30),
    risk: "Moderate",
    delayMins: 5 + (Math.abs(hash) % 15),
    roadsToAvoid: [`${origin} Low Expressway`, "Lowland Transit Corridor"],
    safeRouteSteps: [`${origin} Main Connector`, "Elevated Bypass", `${destination} Ring Road`],
    travelMode: "Driving",
    aiExplanation: `Simulated Analysis: Predicted route guidance from ${origin} to ${destination}. Elevated corridors remain clear, but low-lying underpasses may experience minor water accumulation. Taking the main elevated bypass minimizes delay risk.`,
    safetyTips: [
      "Avoid low-lying underpasses and subterranean roads.",
      "Maintain safe stopping distances in wet conditions.",
      "Check live weather updates before starting your trip.",
      "Carry emergency roadside assistance numbers."
    ],
    timeline: [
      { id: "tl-1", type: "start", location: origin, description: "Departure point - clear conditions" },
      { id: "tl-2", type: "checkpoint", location: `${origin} Main Junction`, description: "Normal traffic flow" },
      { id: "tl-3", type: "flood-zone", location: `${origin} Low Underpass (Avoided)`, description: "Waterlogging alert" },
      { id: "tl-4", type: "alternative", location: "Elevated Bypass Flyover", description: "Recommended safe route" },
      { id: "tl-5", type: "destination", location: destination, description: "Arrival point" }
    ],
    confidenceScore
  };
}
