import React from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--background)]">
      {/* Deep radial gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--background-secondary)_0%,_transparent_70%)]" />

      {/* Blurred Blob 1 - Blue */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] opacity-20 bg-[var(--primary)] animate-blob" 
        style={{ animationDuration: '20s', animationDelay: '0s' }}
      />
      
      {/* Blurred Blob 2 - Teal */}
      <div 
        className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[100px] opacity-10 bg-[var(--secondary)] animate-blob"
        style={{ animationDuration: '25s', animationDelay: '2s' }}
      />
      
      {/* Blurred Blob 3 - Dark Blue */}
      <div 
        className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 bg-[#1e3a8a] animate-blob"
        style={{ animationDuration: '30s', animationDelay: '4s' }}
      />
    </div>
  );
}
