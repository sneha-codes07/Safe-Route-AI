import React from "react";
import { TopSummaryCard } from "./TopSummaryCard";
import { RouteRecommendationCard } from "./RouteRecommendationCard";
import { RouteTimeline } from "./RouteTimeline";
import { AIExplanationCard } from "./AIExplanationCard";
import { SafetyAdviceCard } from "./SafetyAdviceCard";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { FollowUpPanel } from "./FollowUpPanel";
import { RouteAnalysis } from "@/types/route";
import { useSearchFlow } from "../search/SearchFlowContext";
import { motion, AnimatePresence } from "framer-motion";

export function ResultsDashboard({ data }: { data: RouteAnalysis }) {
  const { isFallback } = useSearchFlow();

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-8 space-y-8 pb-24 relative">
      <AnimatePresence>
        {isFallback && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-[var(--surface-hover)] border border-[var(--warning)]/50 rounded-xl p-3 md:p-4 mb-4 flex items-center justify-center gap-3 text-[var(--warning)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span className="text-sm font-medium">Live AI is temporarily unavailable. Showing a simulated analysis.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <TopSummaryCard data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-8">
          <RouteRecommendationCard data={data} />
          <RouteTimeline data={data} />
        </div>
        
        <div className="flex flex-col space-y-8">
          <AIExplanationCard data={data} />
          <SafetyAdviceCard data={data} />
        </div>
      </div>
      
      <ConfidenceIndicator data={data} />

      <FollowUpPanel data={data} />
    </div>
  );
}
