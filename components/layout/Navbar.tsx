"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useSearchFlow } from "../search/SearchFlowContext";

export function Navbar() {
  const { state, resetFlow } = useSearchFlow();
  const [activeSection, setActiveSection] = useState("home");
  const onNewSearch = state !== "idle" ? resetFlow : undefined;

  // Intersection Observer for scroll spy
  useEffect(() => {
    if (state !== "idle") {
      setActiveSection("");
      return;
    }

    const sections = ["home", "about", "how-it-works"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Detect active when section is somewhat in middle
        threshold: 0,
      }
    );

    // We consider the top of the document (hero area) as "home"
    const heroEl = document.getElementById("home");
    if (!heroEl) {
      // If we don't have a home ID, let's just observe the body assuming home is top
      document.body.id = "home";
    }

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [state]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();

    const scroll = () => {
      if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Focus search input purely for polish
        setTimeout(() => {
          const input = document.querySelector('textarea') as HTMLTextAreaElement;
          if (input) input.focus();
        }, 500); // give it time to scroll
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (state !== "idle") {
      resetFlow();
      // Wait for React to unmount results and mount the landing page sections
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
  };

  const linkClass = (id: string) => 
    `transition-colors ${activeSection === id ? "text-[var(--text-primary)] font-bold" : "hover:text-white"}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[var(--background)]/70 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, "home")}
            className="text-lg font-semibold tracking-tight text-[var(--text-primary)] hover:text-white transition-colors"
          >
            SafeRoute AI
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#home" onClick={(e) => handleNavClick(e, "home")} className={linkClass("home")}>
              Home
            </a>
            <a href="#about" onClick={(e) => handleNavClick(e, "about")} className={linkClass("about")}>
              About
            </a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} className={linkClass("how-it-works")}>
              How It Works
            </a>
          </nav>
        </div>
        <div className="flex items-center">
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={!onNewSearch} 
            onClick={onNewSearch}
          >
            New Search
          </Button>
        </div>
      </div>
    </header>
  );
}
