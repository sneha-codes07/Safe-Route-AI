import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchFlowProvider } from "@/components/search/SearchFlowContext";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeRoute AI – Navigate Floods with Confidence",
  description: "AI-powered flood-aware travel assistant helping commuters find safer routes during urban flooding.",
};

export const viewport: Viewport = {
  themeColor: "#081229",
};

import LineWaves from "@/components/ui/LineWaves";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} min-h-screen bg-[var(--background)] text-[var(--text-primary)] antialiased selection:bg-[var(--primary)] selection:text-white`}
    >
      <body className="min-h-screen flex flex-col relative overflow-x-hidden bg-[var(--background)]">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <LineWaves
            speed={0.4}
            innerLineCount={32}
            outerLineCount={36}
            warpIntensity={1.0}
            rotation={-45}
            edgeFadeWidth={0.0}
            colorCycleSpeed={1.0}
            brightness={0.6}
            color1="#00f2fe"
            color2="#3a7bd5"
            color3="#6b11ff"
            enableMouseInteraction={true}
            mouseInfluence={2.0}
          />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <SearchFlowProvider>
            <AppShell>{children}</AppShell>
          </SearchFlowProvider>
        </div>
      </body>
    </html>
  );
}
