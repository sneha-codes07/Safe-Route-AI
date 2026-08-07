import React from "react";
import { cn } from "@/lib/utils";

export const SkeletonLoader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn("animate-pulse rounded-md bg-[var(--border)]", className)} 
      {...props} 
    />
  );
};
