"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "../ui/Container";
import SplitFlapText from "../ui/SplitFlapText";

export function Hero() {
  return (
    <Container className="pt-24 pb-12 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)]"
      >
        Navigate Floods
      </motion.h1>

      {/* Animated split-flap tagline replaces the static gradient span */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 md:mt-4"
      >
        <SplitFlapText
          words={["WITH CONFIDENCE", "STAY SAFE TODAY", "FIND SAFE ROUTES", "AVOID FLOOD ZONES"]}
          flipDuration={0.1}
          stagger={0.05}
          cycleDelay={2800}
          charset="alpha"
          flipsPerChar={6}
          tileColor="transparent"
          textColor="#38bdf8"
          tileRadius={6}
          gap={4}
          fontSize="clamp(1.75rem, 5vw, 4.5rem)"
          loop
          padTo={16}
          style={{ fontWeight: 800, letterSpacing: "-0.02em", filter: "drop-shadow(0 0 22px rgba(56,189,248,0.65))" }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 md:mt-8 max-w-2xl text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed"
      >
        Describe where you want to travel in natural language and SafeRoute AI will help identify flood risks, safer routes and travel recommendations.
      </motion.p>
    </Container>
  );
}
