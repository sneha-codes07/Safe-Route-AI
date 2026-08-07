import React from "react";
import { Card } from "../ui/Card";
import { RouteAnalysis } from "@/types/route";

export function SafetyAdviceCard({ data }: { data: RouteAnalysis }) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-[var(--danger)] mb-4">Safety Advice</h3>
      
      <ul className="space-y-4">
        {data.safetyTips.map((tip, index) => (
          <li key={index} className="flex gap-3 text-sm md:text-base text-[var(--text-secondary)]">
            <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[var(--danger)]" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
