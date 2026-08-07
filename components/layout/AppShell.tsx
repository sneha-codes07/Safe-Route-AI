import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import LineWaves from "../ui/LineWaves";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Global full-viewport LineWaves — sits beneath everything */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#081229]">
        <LineWaves
          speed={0.25}
          innerLineCount={28}
          outerLineCount={32}
          warpIntensity={0.8}
          rotation={-35}
          edgeFadeWidth={0.1}
          colorCycleSpeed={0.6}
          brightness={0.18}
          color1="#3b82f6"
          color2="#1e3a8a"
          color3="#0f172a"
          enableMouseInteraction={true}
          mouseInfluence={1.4}
        />
      </div>
      <Navbar />
      <main className="flex-grow flex flex-col pt-16 z-10 relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
