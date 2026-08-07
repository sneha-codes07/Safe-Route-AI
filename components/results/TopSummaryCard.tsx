import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { RouteAnalysis } from "@/types/route";

export function TopSummaryCard({ data }: { data: RouteAnalysis }) {
  const riskColorMap = {
    Safe: "success",
    Moderate: "warning",
    High: "danger",
    Critical: "danger",
  } as const;

  return (
    <Card className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Origin</span>
          <span className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">{data.origin}</span>
        </div>
        
        <div className="hidden md:flex text-[var(--text-muted)]">
          &rarr;
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Destination</span>
          <span className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">{data.destination}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
        <div className="flex flex-col mr-4">
          <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Est. Time</span>
          <span className="text-lg font-bold text-[var(--text-primary)]">{data.travelTimeMins} mins</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1.5">Flood Risk</span>
          <Badge variant="subtle" colorScheme={riskColorMap[data.risk]}>
            <span className="font-bold tracking-wide">{data.risk}</span>
          </Badge>
        </div>
      </div>
    </Card>
  );
}
