import { describe, it, expect } from "vitest";
import { parseGeminiResponse } from "../../lib/parser";

const VALID_JSON = {
  origin: "Salt Lake",
  destination: "Park Street",
  travelTime: "45",
  estimatedDelay: "15",
  travelMode: "Driving",
  status: "Operational",
  floodRisk: "High",
  confidence: 72,
  recommendedRoute: ["Take VIP Road", "Use flyover"],
  roadsToAvoid: ["Park Circus connector"],
  reasoning: "Heavy flooding expected near Park Circus.",
  safetyTips: ["Carry emergency contacts.", "Avoid waterlogged roads."],
  timeline: [
    { title: "Salt Lake Sector V", status: "Route start" },
    { title: "Park Circus Connector", status: "Flood zone — avoid" },
    { title: "Park Street", status: "Destination" },
  ],
};

describe("parseGeminiResponse", () => {
  it("parses clean JSON correctly", () => {
    const result = parseGeminiResponse(JSON.stringify(VALID_JSON));
    expect(result.origin).toBe("Salt Lake");
    expect(result.destination).toBe("Park Street");
    expect(result.floodRisk).toBe("High");
    expect(result.confidence).toBe(72);
    expect(result.timeline).toHaveLength(3);
  });

  it("strips ```json ... ``` markdown fences", () => {
    const fenced = `\`\`\`json\n${JSON.stringify(VALID_JSON)}\n\`\`\``;
    const result = parseGeminiResponse(fenced);
    expect(result.origin).toBe("Salt Lake");
  });

  it("strips ``` ... ``` fences without language specifier", () => {
    const fenced = `\`\`\`\n${JSON.stringify(VALID_JSON)}\n\`\`\``;
    const result = parseGeminiResponse(fenced);
    expect(result.destination).toBe("Park Street");
  });

  it("extracts JSON from conversational wrapping text", () => {
    const wrapped = `Sure! Here is your analysis: ${JSON.stringify(VALID_JSON)} Let me know if you have questions.`;
    const result = parseGeminiResponse(wrapped);
    expect(result.floodRisk).toBe("High");
  });

  it("throws on completely invalid JSON", () => {
    expect(() => parseGeminiResponse("not json at all")).toThrow(
      "Malformed JSON response from AI"
    );
  });

  it("handles response with missing optional fields (partial response)", () => {
    const partial = JSON.stringify({ origin: "Howrah", floodRisk: "Moderate" });
    const result = parseGeminiResponse(partial);
    expect(result.origin).toBe("Howrah");
    expect(result.destination).toBeUndefined();
  });
});
