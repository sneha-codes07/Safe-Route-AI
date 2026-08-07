"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hero } from "@/components/hero/Hero";
import { SearchCard } from "@/components/search/SearchCard";
import { LoadingExperience } from "@/components/search/LoadingExperience";
import { CompactSearchQuery } from "@/components/search/CompactSearchQuery";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { useSearchFlow } from "@/components/search/SearchFlowContext";
import { AboutSection } from "@/components/home/AboutSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";

export default function HomePage() {
  const { state, query, analysisData } = useSearchFlow();

  return (
    <div id="home" className="flex flex-col w-full min-h-[calc(100vh-160px)] pb-12 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            className="w-full flex-grow flex flex-col"
          >
            {/* The initial Hero view wrapped to command the first fold */}
            <div className="w-full flex flex-col items-center justify-center pt-16 md:pt-24 min-h-[80vh]">
              <Hero />
              <SearchCard />
            </div>

            <AboutSection />
            <HowItWorksSection />
          </motion.div>
        )}

        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-grow flex items-center justify-center min-h-[50vh]"
          >
            <LoadingExperience />
          </motion.div>
        )}

        {state === "results" && analysisData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-grow pt-8"
          >
            <CompactSearchQuery query={query} />
            <ResultsDashboard data={analysisData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
