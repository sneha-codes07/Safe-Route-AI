export type Role = "user" | "assistant";

export interface ConversationMessage {
  id: string;
  role: Role;
  content: string;
  status: "complete" | "loading" | "error";
}

export interface ConversationRequest {
  originalQuery: string;
  routeAnalysis: any; // We'll pass the JSON object of RouteAnalysis
  chatHistory: { role: Role; content: string }[];
  newQuestion: string;
}

export interface ConversationResponse {
  success: boolean;
  content?: string;
  error?: string;
}
