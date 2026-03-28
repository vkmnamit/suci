// ─── Chat Hook ───────────────────────────────────────────────────────────────
import { useState, useCallback, useEffect } from "react";
import { chatService } from "../api";

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isNew?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatEntry[]>(() => {
    const saved = localStorage.getItem("suci_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, isNew: false }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch history from backend on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await chatService.getHistory();
        if (response.history && response.history.length > 0) {
          const formatted = response.history.map((m: any) => ({
            id: m.id || `${m.role}-${Date.now()}-${Math.random()}`,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp || Date.now()),
            isNew: false
          }));
          setMessages(formatted);
          localStorage.setItem("suci_chat_history", JSON.stringify(formatted));
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    }
    fetchHistory();
  }, []);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem("suci_chat_history", JSON.stringify(messages));
  }, [messages]);

  /** Send a message (non-streaming) */
  const sendMessage = useCallback(async (message: string) => {
    const userEntry: ChatEntry = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
      isNew: true,
    };

    setMessages((prev) => [...prev, userEntry]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(message);
      const assistantContent =
        response.response || response.message || response.content || "No response received.";

      const assistantEntry: ChatEntry = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
        isNew: true,
      };

      setMessages((prev) => [...prev, assistantEntry]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMsg);
      
      // Provide fallback response
      const fallbackEntry: ChatEntry = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `⚠️ Unable to reach the AI reasoning model. Please ensure the backend is running at http://localhost:8000 and Ollama is active.\n\nError: ${errorMsg}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackEntry]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Send a streaming message */
  const sendMessageStream = useCallback(async (message: string) => {
    const userEntry: ChatEntry = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    const assistantId = `assistant-${Date.now()}`;
    const assistantEntry: ChatEntry = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userEntry, assistantEntry]);
    setIsLoading(true);
    setError(null);

    await chatService.sendMessageStream(
      message,
      // onChunk
      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + chunk }
              : m
          )
        );
      },
      // onDone
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
        setIsLoading(false);
      },
      // onError
      (err) => {
        setError(err.message);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `⚠️ Stream interrupted: ${err.message}`,
                  isStreaming: false,
                }
              : m
          )
        );
        setIsLoading(false);
      }
    );
  }, []);

  /** Generate morning briefing */
  const generateBriefing = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.generateBriefing();
      const content =
        response.briefing || response.summary || response.content || "Briefing not available.";

      const briefingEntry: ChatEntry = {
        id: `briefing-${Date.now()}`,
        role: "assistant",
        content: `📋 **Morning Briefing**\n\n${content}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, briefingEntry]);
      return content;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate briefing";
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("suci_chat_history");
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendMessageStream,
    generateBriefing,
    clearMessages,
  };
}
