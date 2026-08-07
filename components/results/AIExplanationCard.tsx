import React from "react";
import { Card } from "../ui/Card";
import { RouteAnalysis } from "@/types/route";

export function AIExplanationCard({ data }: { data: RouteAnalysis }) {
  return (
    <Card className="p-6 h-full flex flex-col items-start">
      <div className="flex flex-row items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Why this route?</h3>
      </div>
      
      <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
        {data.aiExplanation}
      </p>
    </Card>
  );
}
