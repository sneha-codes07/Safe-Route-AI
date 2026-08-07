"use client";

import React from "react";
import { motion } from "framer-motion";
import SplitFlapText from "../ui/SplitFlapText";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Describe your journey",
      desc: "Type out where you need to go using natural language.",
    },
    {
      num: "02",
      title: "Gemini analyzes your request",
      desc: "Our AI model extracts locations and processes the optimal geometry.",
    },
    {
      num: "03",
      title: "Flood risk is assessed",
      desc: "Hyper-local topographical vulnerabilities are checked.",
    },
    {
      num: "04",
      title: "Receive safer travel guidance",
      desc: "Get an actionable timeline, alternatives, and safety advice.",
    }
  ];

  return (
    <section id="how-it-works" className="w-full max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20"
      >
        <span className="text-[var(--secondary)] font-semibold tracking-wider uppercase text-sm mb-4 block">Workflow</span>
        <SplitFlapText
          text="HOW IT WORKS"
          flipDuration={0.1}
          stagger={0.05}
          charset="alpha"
          flipsPerChar={7}
          tileColor="var(--background-secondary)"
          textColor="var(--text-primary)"
          tileRadius={6}
          gap={4}
          fontSize="clamp(1.5rem, 3.5vw, 3rem)"
          padTo={12}
        />
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between relative mt-16 max-w-6xl mx-auto gap-8 md:gap-4">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-[28px] left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-[var(--border)] via-[var(--primary)]/30 to-[var(--border)] -z-10" />
        
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="flex flex-col items-center text-center max-w-[240px] mx-auto group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:-translate-y-1 transition-transform duration-300 group-hover:border-[var(--primary)]/50">
              <span className="text-lg font-bold text-[var(--text-primary)]">{step.num}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{step.title}</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
