"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import SplitFlapText from "../ui/SplitFlapText";

const loadingSteps = [
  "UNDERSTANDING YOUR REQUEST",
  "EXTRACTING LOCATIONS",
  "ASSESSING FLOOD RISK",
  "FINDING SAFER ALTERNATIVES",
  "PREPARING TRAVEL GUIDANCE",
];

export function LoadingExperience() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 5 steps over 3 seconds => ~600ms per step
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col justify-center min-h-[300px] px-6">
      <div className="space-y-4 flex flex-col">
        <AnimatePresence mode="popLayout">
          {loadingSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isPending = index > currentStep;

            if (isPending) return null;

            return (
              <motion.div
                layout
                key={step}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4"
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-[var(--primary)]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  ) : (
                    <LoadingSpinner size="sm" />
                  )}
                </div>
                <SplitFlapText
                  text={step}
                  flipDuration={0.08}
                  stagger={0.03}
                  charset="alpha"
                  flipsPerChar={5}
                  tileColor={isActive ? "var(--background-secondary)" : "transparent"}
                  textColor={isActive ? "var(--text-primary)" : "var(--text-muted)"}
                  tileRadius={4}
                  gap={3}
                  fontSize={16}
                  padTo={step.length}
                  style={{ opacity: isCompleted ? 0.45 : 1, transition: "opacity 0.4s" }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
