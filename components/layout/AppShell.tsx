import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import LineWaves from "../ui/LineWaves";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Global full-viewport LineWaves — sits beneath everything */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#0a0010]">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1.0}
          rotation={-45}
          edgeFadeWidth={0.0}
          colorCycleSpeed={1.0}
          brightness={0.28}
          color1="#e00000"
          color2="#ff0000"
          color3="#38078b"
          enableMouseInteraction={true}
          mouseInfluence={2.0}
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
