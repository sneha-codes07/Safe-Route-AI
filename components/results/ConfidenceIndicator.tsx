"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { RouteAnalysis } from "@/types/route";

export function ConfidenceIndicator({ data }: { data: RouteAnalysis }) {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-6 p-6">
      <div className="flex flex-col whitespace-nowrap min-w-max">
        <span className="text-sm text-[var(--text-muted)]">AI Route Confidence</span>
        <span className="text-2xl font-bold text-[var(--text-primary)]">
          {data.confidenceScore}%
        </span>
      </div>
      
      <div className="w-full bg-[var(--background-secondary)] rounded-full h-3 overflow-hidden border border-[var(--border)]">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${data.confidenceScore}%` }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </Card>
  );
}
