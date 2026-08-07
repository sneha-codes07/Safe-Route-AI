import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ className, size = "md", ...props }: LoadingSpinnerProps) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div className={cn("inline-flex justify-center items-center", className)} {...props}>
      <div 
        className={cn(
          "rounded-full animate-spin border-[var(--primary)] border-t-transparent",
          sizes[size]
        )} 
      />
    </div>
  );
};
