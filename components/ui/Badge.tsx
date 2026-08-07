import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "subtle" | "outline";
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "gray";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "subtle", colorScheme = "gray", children, ...props }, ref) => {
    
    const colors = {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      success: "var(--success)",
      warning: "var(--warning)",
      danger: "var(--danger)",
      gray: "var(--text-secondary)",
    };

    const styles = {
      solid: "text-white bg-current border-transparent",
      subtle: "bg-current/10 text-current border-transparent",
      outline: "bg-transparent text-current border border-current/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide border transition-colors",
          styles[variant],
          className
        )}
        style={{ color: colors[colorScheme] }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";
