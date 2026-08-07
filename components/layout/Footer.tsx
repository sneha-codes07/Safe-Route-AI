import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-8 text-center text-sm text-[var(--text-muted)] mt-auto z-10 border-t border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-4">
        <span>&copy; {new Date().getFullYear()} SafeRoute AI</span>
        <span className="flex items-center gap-1.5">
          Powered by <span className="font-medium text-[var(--text-secondary)]">Gemini</span>
        </span>
      </div>
    </footer>
  );
}
