import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--surface)] border border-[var(--border)] rounded-2xl md:rounded-3xl",
          "backdrop-blur-md overflow-hidden",
          "transition-all duration-300 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-[2px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
