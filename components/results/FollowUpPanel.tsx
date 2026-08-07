"use client";

import React, { useState, useRef, useEffect } from "react";
import { RouteAnalysis } from "@/types/route";
import { ConversationMessage } from "@/types/chat";
import { chatFollowUpAction } from "@/services/chatAnalysis";
import { useSearchFlow } from "../search/SearchFlowContext";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";

const defaultSuggestions = [
  "Why this route?",
  "Safer alternatives",
  "Travel later",
  "Public transport",
  "Working route?"
];

// Reusing UUID generation simple function since we don't need crypto securely here
const genId = () => Math.random().toString(36).substring(2, 9);

export function FollowUpPanel({ data }: { data: RouteAnalysis }) {
  const { query: originalQuery } = useSearchFlow();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const currentRequestId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    setInputValue("");
    currentRequestId.current++;
    const reqId = currentRequestId.current;

    const userMessage: ConversationMessage = { id: genId(), role: "user", content: trimmed, status: "complete" };
    const loadingMessage: ConversationMessage = { id: genId(), role: "assistant", content: "", status: "loading" };
    
    // Optimistic UI updates
    const previousMessages = [...messages];
    setMessages(prev => [...prev, userMessage, loadingMessage]);

    try {
      const response = await chatFollowUpAction({
        originalQuery,
        routeAnalysis: data,
        chatHistory: previousMessages.map(m => ({ role: m.role, content: m.content })),
        newQuestion: trimmed
      });

      if (currentRequestId.current !== reqId) return; // Stale request

      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, status: response.success ? "complete" : "error", content: response.success ? response.content! : response.error! }
            : msg
        )
      );
    } catch (err) {
      if (currentRequestId.current !== reqId) return;
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, status: "error", content: "Service unavailable. Please try again." }
            : msg
        )
      );
    }
  };

  return (
    <div className="w-full mt-12 mb-8 pt-8 border-t border-[var(--border)] max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Ask About This Route</h3>
        <p className="text-sm text-[var(--text-muted)]">Ask questions about your travel guidance.</p>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage 
                message={msg} 
                onRetry={msg.status === "error" ? () => {
                  // Simply pop the error and previous user prompt and resend
                  const lastUserMsg = messages[messages.length - 2];
                  if (lastUserMsg) {
                    setMessages(prev => prev.slice(0, -2));
                    handleSend(lastUserMsg.content);
                  }
                } : undefined} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} className="h-1" />
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {defaultSuggestions.map((suggestion, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(suggestion)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        <ChatInput 
          value={inputValue} 
          onChange={setInputValue} 
          onSubmit={() => handleSend(inputValue)}
          isLoading={messages[messages.length - 1]?.status === "loading"}
        />
      </div>
    </div>
  );
}
