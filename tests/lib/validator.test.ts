import { describe, it, expect } from "vitest";
import { validateAndMapResponse } from "../../lib/validator";
import type { GeminiRouteAnalysis } from "../../types/ai";

const BASE_AI_DATA: GeminiRouteAnalysis = {
  origin: "Salt Lake",
  destination: "Park Street",
  travelTime: "45",
  estimatedDelay: "15",
  travelMode: "Driving",
  floodRisk: "High",
  confidence: 72,
  recommendedRoute: ["Take VIP Road"],
  roadsToAvoid: ["Park Circus connector"],
  reasoning: "Heavy flooding near Park Circus.",
  safetyTips: ["Carry emergency contacts."],
  timeline: [
    { title: "Salt Lake", status: "Route start" },
    { title: "Park Circus", status: "Flood zone — avoid" },
    { title: "Park Street", status: "Destination" },
  ],
};

const FALLBACK = { origin: "Origin", destination: "Destination" };

describe("validateAndMapResponse", () => {
  it("maps all fields correctly from valid AI data", () => {
    const result = validateAndMapResponse(BASE_AI_DATA, FALLBACK);
    expect(result.origin).toBe("Salt Lake");
    expect(result.destination).toBe("Park Street");
    expect(result.travelTimeMins).toBe(45);
    expect(result.delayMins).toBe(15);
    expect(result.risk).toBe("High");
    expect(result.confidenceScore).toBe(72);
    expect(result.travelMode).toBe("Driving");
    expect(result.roadsToAvoid).toEqual(["Park Circus connector"]);
    expect(result.timeline).toHaveLength(3);
  });

  it("uses fallback context when origin/destination are missing", () => {
    const result = validateAndMapResponse({}, FALLBACK);
    expect(result.origin).toBe("Origin");
    expect(result.destination).toBe("Destination");
  });

  it("normalises risk level correctly — exact matches", () => {
    const cases: [string, string][] = [
      ["Safe", "Safe"],
      ["safe", "Safe"],
      ["low", "Safe"],
      ["moderate", "Moderate"],
      ["medium", "Moderate"],
      ["high", "High"],
      ["severe", "High"],
      ["critical", "Critical"],
      ["extreme", "Critical"],
    ];
    for (const [input, expected] of cases) {
      const result = validateAndMapResponse({ floodRisk: input }, FALLBACK);
      expect(result.risk).toBe(expected);
    }
  });

  it("does NOT false-positive on 'highlander' → High (explicit allowlist check)", () => {
    const result = validateAndMapResponse({ floodRisk: "highlander" }, FALLBACK);
    expect(result.risk).toBe("Moderate"); // unknown → default
  });

  it("returns default safety tips when none are provided", () => {
    const result = validateAndMapResponse({}, FALLBACK);
    expect(result.safetyTips.length).toBeGreaterThan(0);
  });

  it("clamps confidenceScore between 0 and 100", () => {
    expect(
      validateAndMapResponse({ confidence: 150 }, FALLBACK).confidenceScore
    ).toBe(100);
    expect(
      validateAndMapResponse({ confidence: -10 }, FALLBACK).confidenceScore
    ).toBe(0);
  });

  it("generates unique fallback timeline IDs (no duplicate React keys)", () => {
    const result = validateAndMapResponse({}, FALLBACK);
    const ids = result.timeline.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("assigns flood-zone type to timeline steps with flood keywords", () => {
    const result = validateAndMapResponse(
      {
        timeline: [
          { title: "Start", status: "Route start" },
          { title: "River Road", status: "Heavy flooding — avoid" },
          { title: "End", status: "Destination" },
        ],
      },
      FALLBACK
    );
    expect(result.timeline[1].type).toBe("flood-zone");
    expect(result.timeline[0].type).toBe("start");
    expect(result.timeline[2].type).toBe("destination");
  });

  it("parses numeric travelTime from mixed strings like '45 mins'", () => {
    const result = validateAndMapResponse({ travelTime: "45 mins" }, FALLBACK);
    expect(result.travelTimeMins).toBe(45);
  });
});
