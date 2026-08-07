"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useSearchFlow } from "./SearchFlowContext";

export function SearchCard() {
  const { query, setQuery, startAnalysis, state } = useSearchFlow();
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when returning to idle
  useEffect(() => {
    if (state === "idle" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state]);

  const handleAnalyze = () => {
    if (!query.trim()) {
      setError("Please describe where you want to travel.");
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setError("");
    startAnalysis();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto px-6 md:px-0"
    >
      <Card className={`p-2 md:p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(18,25,43,0.8)] ${error ? 'ring-2 ring-[var(--danger)]/50' : ''}`}>
        <div className="flex flex-col md:flex-row gap-2 relative bg-[var(--background-secondary)] rounded-xl overflow-hidden border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-[1.5px] focus-within:ring-[var(--primary)] transition-all duration-300">
          <Input 
            ref={inputRef}
            placeholder="I need to travel from Salt Lake to Park Street around 6 PM." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError("");
            }}
            onEnterPress={handleAnalyze}
            className="w-full min-h-[64px] border-none"
          />
          <div className="p-2 flex items-end justify-end shrink-0">
            <Button onClick={handleAnalyze} size="lg" className="w-full md:w-auto h-12 md:h-[calc(100%-16px)] rounded-lg">
              Analyze Route
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Inline validation error */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="mt-3 text-[var(--danger)] text-sm px-2 text-left w-full flex items-center gap-1.5 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
