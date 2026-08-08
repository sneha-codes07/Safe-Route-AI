"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { RouteAnalysis } from "@/types/route";
import { MOCK_ROUTE_ANALYSIS, getFallbackRouteAnalysis } from "@/lib/mockData";
import { analyzeRouteAction } from "@/services/routeAnalysis";

type FlowState = "idle" | "loading" | "results";

/** Minimum ms between successive analysis requests (simple rate limiting) */
const RATE_LIMIT_MS = 5_000;

/** Minimum UX hold time on the loading screen so the animation is meaningful */
const MIN_LOADING_MS = 2_800;

interface SearchFlowContextType {
  state: FlowState;
  query: string;
  setQuery: (q: string) => void;
  startAnalysis: () => void;
  resetFlow: () => void;
  analysisData: RouteAnalysis | null;
  isFallback: boolean;
  analysisError: string | null;
}

const SearchFlowContext = createContext<SearchFlowContextType | undefined>(undefined);

export function SearchFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>("idle");
  const [query, setQuery] = useState("");
  const [analysisData, setAnalysisData] = useState<RouteAnalysis | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  /** Per-session LRU cache — avoids duplicate Gemini calls for identical queries */
  const analysisCache = useRef<Map<string, RouteAnalysis>>(new Map());
  /** Stale-request guard — incrementing id invalidates any pending response */
  const currentRequestId = useRef(0);
  /** Timestamp of last successful analysis start (rate limiting) */
  const lastRequestAt = useRef(0);

  const startAnalysis = useCallback(async () => {
    const now = Date.now();
    const timeSinceLast = now - lastRequestAt.current;

    // Client-side rate limit
    if (lastRequestAt.current > 0 && timeSinceLast < RATE_LIMIT_MS) {
      setAnalysisError(
        `Please wait ${Math.ceil((RATE_LIMIT_MS - timeSinceLast) / 1000)}s before searching again.`
      );
      return;
    }

    setAnalysisError(null);
    setState("loading");
    lastRequestAt.current = now;

    const reqId = ++currentRequestId.current;
    const currentQuery = query.trim();

    /** Enforces MIN_LOADING_MS so the preloader is always fully animated */
    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_LOADING_MS)
    );

    try {
      // ── Cache hit ────────────────────────────────────────────────────────
      const cached = analysisCache.current.get(currentQuery);
      if (cached) {
        await minDelay;
        if (currentRequestId.current !== reqId) return;
        setAnalysisData(cached);
        setIsFallback(false);
        setState("results");
        return;
      }

      // ── Live analysis ────────────────────────────────────────────────────
      const [response] = await Promise.all([
        analyzeRouteAction(currentQuery),
        minDelay,
      ]);

      if (currentRequestId.current !== reqId) return; // Stale response — discard

      if (response.success && response.data) {
        // Keep cache bounded to 20 entries
        if (analysisCache.current.size >= 20) {
          const oldest = analysisCache.current.keys().next().value;
          if (oldest) analysisCache.current.delete(oldest);
        }
        analysisCache.current.set(currentQuery, response.data);
        setAnalysisData(response.data);
        setIsFallback(false);
      } else {
        // Graceful fallback with visible user warning (shown by ResultsDashboard)
        if (process.env.NODE_ENV !== "production") {
          console.warn("[SafeRoute AI] AI analysis failed:", response.error, "→ falling back to mock data");
        }
        setAnalysisData(getFallbackRouteAnalysis(currentQuery));
        setIsFallback(true);
      }

      setState("results");
    } catch (err: unknown) {
      if (currentRequestId.current !== reqId) return;
      if (process.env.NODE_ENV !== "production") {
        console.warn("[SafeRoute AI] Exception during analysis:", err);
      }
      setAnalysisData(getFallbackRouteAnalysis(currentQuery));
      setIsFallback(true);
      setState("results");
    }
  }, [query]);

  const resetFlow = useCallback(() => {
    currentRequestId.current++;
    setState("idle");
    setQuery("");
    setAnalysisError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <SearchFlowContext.Provider
      value={{
        state,
        query,
        setQuery,
        startAnalysis,
        resetFlow,
        analysisData,
        isFallback,
        analysisError,
      }}
    >
      {children}
    </SearchFlowContext.Provider>
  );
}

export function useSearchFlow(): SearchFlowContextType {
  const context = useContext(SearchFlowContext);
  if (!context) {
    throw new Error("useSearchFlow must be used within a SearchFlowProvider");
  }
  return context;
}
