"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { RouteAnalysis } from "@/types/route";

export function RouteTimeline({ data }: { data: RouteAnalysis }) {
  const getStepColor = (type: string) => {
    switch (type) {
      case "start":
      case "destination":
      case "checkpoint":
        return "bg-[var(--primary)]";
      case "flood-zone":
        return "bg-[var(--danger)]";
      case "alternative":
        return "bg-[var(--success)]";
      default:
        return "bg-[var(--border)]";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Live Timeline</h3>
      
      <div className="relative pl-3">
        {/* Vertical line connecting timeline nodes */}
        <div className="absolute left-[16.5px] top-3 bottom-0 w-[1.5px] bg-[var(--border)] -z-10" />

        <div className="space-y-8">
          {data.timeline.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative flex items-start gap-4"
            >
              <div className="relative mt-1 group">
                <div className={`w-2.5 h-2.5 rounded-full ${getStepColor(step.type)} ring-4 ring-[var(--surface)] transition-transform duration-300 group-hover:scale-125`} />
              </div>
              
              <div className="flex flex-col flex-grow pt-0.5">
                <span className={`text-sm font-medium ${step.type === 'flood-zone' ? 'text-[var(--danger)] line-through opacity-70' : 'text-[var(--text-primary)]'}`}>
                  {step.location}
                </span>
                {step.description && (
                  <span className="text-xs text-[var(--text-muted)] mt-0.5">
                    {step.description}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
