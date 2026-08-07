import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Divider } from "../ui/Divider";
import { RouteAnalysis } from "@/types/route";
import SplitFlapText from "../ui/SplitFlapText";

export function RouteRecommendationCard({ data }: { data: RouteAnalysis }) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <SplitFlapText
        text="RECOMMENDED ROUTE"
        flipDuration={0.09}
        stagger={0.03}
        charset="alpha"
        flipsPerChar={5}
        tileColor="var(--background-secondary)"
        textColor="var(--text-primary)"
        tileRadius={4}
        gap={3}
        fontSize={14}
        padTo={17}
        className="mb-4"
      />
      
      <div className="flex-grow space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--success)] block mb-2">
            Safe Route
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {data.safeRouteSteps.map((step, index) => (
              <React.Fragment key={index}>
                <span className="text-[var(--text-primary)] font-medium">{step}</span>
                {index < data.safeRouteSteps.length - 1 && (
                  <span className="text-[var(--text-muted)] text-sm">&rarr;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Divider />

        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--danger)] block mb-2">
            Roads to Avoid
          </span>
          <div className="flex flex-wrap gap-2">
            {data.roadsToAvoid.map((road, index) => (
              <Badge key={index} variant="outline" colorScheme="danger">
                {road}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <div>
          <span className="text-xs text-[var(--text-muted)] block">Est. Delay</span>
          <span className="text-sm font-medium text-[var(--warning)]">+{data.delayMins} mins</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-[var(--text-muted)] block">Travel Mode</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">{data.travelMode}</span>
        </div>
      </div>
    </Card>
  );
}
