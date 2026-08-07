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
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        <SearchFlowProvider>
          <AppShell>{children}</AppShell>
        </SearchFlowProvider>
      </body>
    </html>
  );
}
