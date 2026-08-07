import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function CompactSearchQuery({ query }: { query: string }) {
  return (
    <Card className="w-full max-w-7xl mx-auto p-4 md:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          You searched
        </span>
        <p className="text-sm md:text-base text-[var(--text-primary)] font-medium line-clamp-2 italic">
          "{query}"
        </p>
      </div>
      <Button variant="secondary" size="sm" className="shrink-0 whitespace-nowrap self-start md:self-auto">
        Edit Search
      </Button>
    </Card>
  );
}
