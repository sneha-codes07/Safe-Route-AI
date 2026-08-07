"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const LOADING_STEPS = [
  "UNDERSTANDING YOUR REQUEST",
  "EXTRACTING LOCATIONS",
  "ASSESSING FLOOD RISK",
  "FINDING SAFER ALTERNATIVES",
  "PREPARING TRAVEL GUIDANCE",
] as const;

/**
 * Total time the loading animation runs. Matches MIN_LOADING_MS in SearchFlowContext
 * so we always reach the last step before transitioning to results.
 */
const TOTAL_DURATION_MS = 2_600;

/** Per-step hold time in ms (slight variance makes it feel organic) */
const STEP_DURATIONS = [520, 480, 560, 500, 540]; // sum = 2600ms

/** Cubic-bezier ease-out for step-reveal animations */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function LoadingExperience() {
  const [currentStep, setCurrentStep] = useState(0);
  const stepRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    /** Build cumulative thresholds: [520, 1000, 1560, 2060, 2600] */
    const thresholds = STEP_DURATIONS.reduce<number[]>((acc, d, i) => {
      acc.push((acc[i - 1] ?? 0) + d);
      return acc;
    }, []);

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Determine which step we should be on based on elapsed time
      let targetStep = 0;
      for (let i = 0; i < thresholds.length; i++) {
        if (elapsed >= thresholds[i]) targetStep = i + 1;
      }
      targetStep = Math.min(targetStep, LOADING_STEPS.length - 1);

      if (targetStep !== stepRef.current) {
        stepRef.current = targetStep;
        setCurrentStep(targetStep);
      }

      if (elapsed < TOTAL_DURATION_MS) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="w-full max-w-xl mx-auto flex flex-col justify-center min-h-[300px] px-6"
      role="status"
      aria-label="Analyzing your route"
      aria-live="polite"
    >
      {/* Progress bar */}
      <div className="w-full h-[2px] bg-[var(--border)] rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <AnimatePresence mode="popLayout" initial={false}>
          {LOADING_STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            if (index > currentStep) return null;

            return (
              <motion.div
                layout
                key={step}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{
                  opacity: isCompleted ? 0.45 : 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.45,
                  ease: EASE_OUT,
                  opacity: { duration: isCompleted ? 0.6 : 0.45 },
                }}
                className="flex items-center gap-4"
              >
                {/* Status icon */}
                <div
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 340,
                        damping: 22,
                      }}
                      className="text-[var(--primary)]"
                    >
                      <CheckIcon />
                    </motion.div>
                  ) : (
                    <LoadingSpinner size="sm" />
                  )}
                </div>

                {/* Step label */}
                <motion.span
                  animate={{
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                    letterSpacing: isActive ? "0.04em" : "0.02em",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-sm md:text-base font-mono font-semibold tracking-wide select-none"
                >
                  {step}
                </motion.span>

                {/* Animated underline for active step */}
                {isActive && (
                  <motion.span
                    layoutId="active-underline"
                    className="ml-auto h-[2px] w-6 rounded-full bg-[var(--primary)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Screen-reader announcement */}
      <span className="sr-only">
        Step {currentStep + 1} of {LOADING_STEPS.length}:{" "}
        {LOADING_STEPS[currentStep]}
      </span>
    </div>
  );
}
