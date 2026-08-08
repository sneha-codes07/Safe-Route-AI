import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary:
        "bg-[#0B0B0B] text-white font-semibold border border-white/[0.14] shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:bg-[#151515] hover:border-white/[0.22] hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      secondary:
        "bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:bg-white/[0.06] hover:border-white/[0.22]",
      danger: "bg-[var(--danger)] text-white hover:bg-red-600",
      ghost:
        "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.06]",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
          "active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

