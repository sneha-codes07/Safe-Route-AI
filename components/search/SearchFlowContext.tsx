"use client";

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import { RouteAnalysis } from "@/types/route";
import { MOCK_ROUTE_ANALYSIS } from "@/lib/mockData";
import { analyzeRouteAction } from "@/services/routeAnalysis";

type FlowState = "idle" | "loading" | "results";

interface SearchFlowContextType {
  state: FlowState;
  query: string;
  setQuery: (q: string) => void;
  startAnalysis: () => void;
  resetFlow: () => void;
  analysisData: RouteAnalysis | null;
  isFallback: boolean;
}

const SearchFlowContext = createContext<SearchFlowContextType | undefined>(undefined);

export function SearchFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>("idle");
  const [query, setQuery] = useState("");
  const [analysisData, setAnalysisData] = useState<RouteAnalysis | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  
  // Cache results per session
  const analysisCache = useRef<Record<string, RouteAnalysis>>({});
  
  // Track ongoing request to handle cancellation natively
  const currentRequestId = useRef<number>(0);

  const startAnalysis = async () => {
    setState("loading");
    
    const reqId = ++currentRequestId.current;
    const currentQuery = query.trim();

    // Enforce artificial delay for realism and smooth UX even if cached
    const realisticUXDelay = new Promise(resolve => setTimeout(resolve, 3000));

    try {
      if (analysisCache.current[currentQuery]) {
        // Use cached analysis if exact same string
        await realisticUXDelay;
        if (currentRequestId.current !== reqId) return; // Request was cancelled
        setAnalysisData(analysisCache.current[currentQuery]);
        setIsFallback(false);
        setState("results");
        return;
      }

      // Call Gemini Backend Action
      const [response] = await Promise.all([
        analyzeRouteAction(currentQuery),
        realisticUXDelay
      ]);

      if (currentRequestId.current !== reqId) {
        // A newer search started, ignore this result completely.
        return; 
      }

      if (response.success && response.data) {
        analysisCache.current[currentQuery] = response.data;
        setAnalysisData(response.data);
        setIsFallback(false);
      } else {
        // Fallback safely to mock data upon AI failure
        console.warn("AI Analysis Failed:", response.error, "Reverting to mock data.");
        setAnalysisData(MOCK_ROUTE_ANALYSIS);
        setIsFallback(true);
      }
      
      setState("results");

    } catch (err) {
      if (currentRequestId.current !== reqId) return;
      console.warn("Exception during analysis:", err);
      // Hard fallback on crash
      setAnalysisData(MOCK_ROUTE_ANALYSIS);
      setIsFallback(true);
      setState("results");
    }
  };

  const resetFlow = () => {
    currentRequestId.current++; // Cancels pending operations
    setState("idle");
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SearchFlowContext.Provider value={{ state, query, setQuery, startAnalysis, resetFlow, analysisData, isFallback }}>
      {children}
    </SearchFlowContext.Provider>
  );
}

export function useSearchFlow() {
  const context = useContext(SearchFlowContext);
  if (!context) throw new Error("useSearchFlow must be used within SearchFlowProvider");
  return context;
}
