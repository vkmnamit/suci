// ─── Chat Service ────────────────────────────────────────────────────────────
import apiClient from "../client";
import type { ChatResponse, BriefingResponse } from "../types";

export const chatService = {
  /** POST /chat/message — Send a non-streaming chat message */
  async sendMessage(message: string): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>("/chat/message", {
      message,
      conversation_id: "default",
      stream: false,
    });
  },

  /** GET /chat/history — Fetch chat history */
  async getHistory(conversationId: string = "default"): Promise<{ history: any[] }> {
    return apiClient.get<{ history: any[] }>(`/chat/history?conversation_id=${conversationId}`);
  },

  /** POST /chat/message — Stream a chat message via SSE */
  async sendMessageStream(
    message: string,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    return apiClient.postStream(
      "/chat/message",
      { message, stream: true },
      onChunk,
      onDone,
      onError
    );
  },

  /** POST /chat/briefing — Generate morning briefing */
  async generateBriefing(): Promise<BriefingResponse> {
    return apiClient.post<BriefingResponse>("/chat/briefing");
  },
};
