// ─── Chat Service ────────────────────────────────────────────────────────────
import apiClient from "../client";
import type { ChatResponse, BriefingResponse } from "../types";

export const chatService = {
  /** POST /chat/message — Send a non-streaming chat message */
  async sendMessage(message: string): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>("/chat/message", {
      message,
      stream: false,
    });
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
