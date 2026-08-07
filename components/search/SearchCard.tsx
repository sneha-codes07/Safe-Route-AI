"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useSearchFlow } from "./SearchFlowContext";

const MAX_QUERY_LENGTH = 600;

const ErrorIcon = () => (
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
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export function SearchCard() {
  const { query, setQuery, startAnalysis, state, analysisError } = useSearchFlow();
  const [localError, setLocalError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // The server/context may also surface a rate-limit error
  const displayError = localError || analysisError || "";

  // Focus input when returning to idle
  useEffect(() => {
    if (state === "idle" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state]);

  const handleAnalyze = () => {
    const trimmed = query.trim();

    if (!trimmed) {
      setLocalError("Please describe where you want to travel.");
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length < 10) {
      setLocalError("Please provide a bit more detail about your journey.");
      inputRef.current?.focus();
      return;
    }

    setLocalError("");
    startAnalysis();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Enforce max length client-side
    if (e.target.value.length > MAX_QUERY_LENGTH) return;
    setQuery(e.target.value);
    if (localError) setLocalError("");
  };

  const charsRemaining = MAX_QUERY_LENGTH - query.length;
  const showCharCount = query.length > MAX_QUERY_LENGTH * 0.8;
  const hasError = Boolean(displayError);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto px-6 md:px-0"
    >
      <Card
        className={`p-2 md:p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(18,25,43,0.8)] ${
          hasError ? "ring-2 ring-[var(--danger)]/50" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row gap-2 relative bg-[var(--background-secondary)] rounded-xl overflow-hidden border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-[1.5px] focus-within:ring-[var(--primary)] transition-all duration-300">
          <Input
            ref={inputRef}
            placeholder="I need to travel from Salt Lake to Park Street around 6 PM."
            value={query}
            onChange={handleChange}
            onEnterPress={handleAnalyze}
            className="w-full min-h-[64px] border-none"
            maxLength={MAX_QUERY_LENGTH}
            aria-label="Travel route description"
            aria-describedby={hasError ? "search-error" : undefined}
          />
          <div className="p-2 flex items-end justify-end shrink-0">
            <Button
              onClick={handleAnalyze}
              size="lg"
              className="w-full md:w-auto h-12 md:h-[calc(100%-16px)] rounded-lg"
              aria-label="Analyze flood risk for this route"
            >
              Analyze Route
            </Button>
          </div>
        </div>

        {/* Character counter */}
        <AnimatePresence>
          {showCharCount && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs mt-1 px-1 text-right ${
                charsRemaining < 50 ? "text-[var(--warning)]" : "text-[var(--text-muted)]"
              }`}
              aria-live="polite"
            >
              {charsRemaining} characters remaining
            </motion.p>
          )}
        </AnimatePresence>
      </Card>

      {/* Inline validation / rate-limit error */}
      <AnimatePresence>
        {displayError && (
          <motion.div
            id="search-error"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 text-[var(--danger)] text-sm px-2 text-left w-full flex items-center gap-1.5 font-medium"
          >
            <ErrorIcon />
            {displayError}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
