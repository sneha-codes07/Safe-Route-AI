"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "../ui/Button";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative flex items-end gap-2 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)] transition-all p-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a follow-up question..."
        disabled={isLoading}
        rows={1}
        className="w-full resize-none overflow-y-auto bg-transparent border-0 focus:ring-0 text-[var(--text-primary)] placeholder-[var(--text-muted)] p-3 text-sm md:text-base focus-visible:outline-none max-h-[120px] disabled:opacity-50"
        style={{ scrollbarWidth: "none" }}
      />
      <Button 
        size="sm" 
        onClick={onSubmit} 
        disabled={isLoading || !value.trim()}
        className="h-[36px] w-[36px] shrink-0 p-0 rounded-lg self-end mb-1 mr-1 flex items-center justify-center transition-all bg-[var(--primary)] hover:bg-blue-600 disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-muted)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </Button>
    </div>
  );
}
