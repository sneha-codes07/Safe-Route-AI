"use client";

import React, { useRef, useEffect, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onEnterPress?: () => void;
}

export const Input = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, onEnterPress, onChange, value, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    
    // Combine refs
    const textareaRef = (node: HTMLTextAreaElement) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement>).current = node;
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const target = e.target;
      target.style.height = "auto"; 
      // max ~5 lines: assuming line height ~24px, 5 lines = 120px + padding ~ 24px = 144px.
      // We handle max-height in css/className and overflow-y-auto to allow scrolling if exceeding.
      target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
      if (onChange) {
        onChange(e);
      }
    };

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.style.height = "auto";
        internalRef.current.style.height = `${Math.min(internalRef.current.scrollHeight, 180)}px`;
      }
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onEnterPress?.();
      }
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        rows={1}
        className={cn(
          "w-full resize-none overflow-hidden bg-transparent border-0 focus:ring-0",
          "text-[var(--text-primary)] placeholder-[var(--text-muted)]",
          "py-4 px-5 text-base md:text-lg leading-relaxed shadow-none focus-visible:outline-none",
          "transition-colors duration-200",
          "max-h-[180px] overflow-y-auto",
          className
        )}
        style={{ scrollbarWidth: "none" }} // Hide scrollbar for cleaner look
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
