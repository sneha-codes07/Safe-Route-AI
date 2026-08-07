import React from "react";
import { ConversationMessage } from "@/types/chat";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function ChatMessage({ message, onRetry }: { message: ConversationMessage, onRetry?: () => void }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm",
          isUser 
            ? "bg-[var(--primary)]/15 text-blue-100 rounded-br-sm border border-[var(--primary)]/30"
            : "bg-[var(--surface)] text-[var(--text-secondary)] rounded-bl-sm border border-[var(--border)]"
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          {!isUser && (
            <div className="w-5 h-5 rounded flex items-center justify-center bg-[var(--primary)]/20 text-[var(--primary)] shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
            </div>
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            {isUser ? "You" : "SafeRoute AI"}
          </span>
        </div>

        {message.status === "loading" ? (
          <div className="flex items-center gap-3 text-[var(--primary)] text-sm font-medium h-6">
            <LoadingSpinner size="sm" />
            <span className="animate-pulse">Thinking...</span>
          </div>
        ) : message.status === "error" ? (
          <div className="flex flex-col items-start gap-3">
             <span className="text-[var(--danger)] text-sm font-medium">{message.content}</span>
             {onRetry && (
               <button onClick={onRetry} className="text-xs font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                 Retry
               </button>
             )}
          </div>
        ) : (
          <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">
            {message.content.split("\n").map((line, i) => {
              if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                return (
                  <div key={i} className="flex gap-2 mt-1">
                    <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-[var(--text-secondary)]" />
                    <span>{line.replace(/^[-*]\s*/, "")}</span>
                  </div>
                );
              }
              if (line.trim().match(/^\d+\./)) {
                return <div key={i} className="mt-1 ml-1">{line}</div>;
              }
              return <p key={i} className={i !== 0 ? "mt-3" : ""}>{line}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
