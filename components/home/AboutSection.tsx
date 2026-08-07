"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import SplitFlapText from "../ui/SplitFlapText";

export function AboutSection() {
  const features = [
    {
      title: "AI-Powered Route Analysis",
      description: "Gemini 2.5 Flash analyzes real-time topological and meteorological data to plot the optimal path.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
      )
    },
    {
      title: "Flood Risk Assessment",
      description: "Instantly gauge the safety of your route against live urban drainage and flooding metrics.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1"/><path d="M12 2v10"/><path d="M8 8l4 4 4-4"/></svg>
      )
    },
    {
      title: "Context-Aware Travel Guidance",
      description: "Receive practical steps you should take and gear you should bring based on specific zonal dangers.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      )
    },
    {
      title: "Smart Safety Recommendations",
      description: "Ask follow-up questions to drill down on exact alternatives without disrupting the mapped context.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
      )
    }
  ];

  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
      >
        <span className="text-[var(--primary)] font-semibold tracking-wider uppercase text-sm mb-4 block">About SafeRoute</span>
        <div className="mb-6">
          <SplitFlapText
            words={["NAVIGATE URBAN", "FLOODING SECURELY", "TRAVEL SAFER TODAY"]}
            flipDuration={0.1}
            stagger={0.04}
            cycleDelay={3000}
            charset="alpha"
            flipsPerChar={6}
            tileColor="var(--background-secondary)"
            textColor="var(--text-primary)"
            tileRadius={6}
            gap={4}
            fontSize="clamp(1.5rem, 3.5vw, 3rem)"
            loop
            padTo={18}
          />
        </div>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          SafeRoute AI bridges the gap between chaotic seasonal flooding and essential travel. Built with Google Gemini, it empowers commuters to make intelligent, hyper-local transit decisions using real-time generative risk analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col group border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors bg-[var(--background-secondary)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">{feature.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
