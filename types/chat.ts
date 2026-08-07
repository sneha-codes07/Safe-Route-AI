import type { RouteAnalysis } from "./route";

export type Role = "user" | "assistant";

export interface ConversationMessage {
  id: string;
  role: Role;
  content: string;
  status: "complete" | "loading" | "error";
}

/**
 * Payload sent from the client to the chatFollowUpAction server action.
 * routeAnalysis is the fully-typed RouteAnalysis object (not `any`).
 */
export interface ConversationRequest {
  originalQuery: string;
  routeAnalysis: RouteAnalysis;
  chatHistory: { role: Role; content: string }[];
  newQuestion: string;
}

export interface ConversationResponse {
  success: boolean;
  content?: string;
  error?: string;
}
