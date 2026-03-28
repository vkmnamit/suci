// ─── SUCI API Client ─────────────────────────────────────────────────────────
// Central HTTP client for the SUCI backend (http://localhost:8000/api/v1)

const API_BASE_URL = "http://localhost:8000/api/v1";

export interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Restore token from localStorage on init
    this.token = localStorage.getItem("suci_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("suci_token", token);
    } else {
      localStorage.removeItem("suci_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(contentType?: string): HeadersInit {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `API Error: ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders("application/json"),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `API Error: ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  // SSE streaming for chat
  async postStream(
    endpoint: string,
    body: unknown,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders("application/json"),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onDone();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              onDone();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content || parsed.message || parsed.text) {
                onChunk(parsed.content || parsed.message || parsed.text);
              }
            } catch {
              // If not JSON, treat as raw text
              if (data.trim()) {
                onChunk(data);
              }
            }
          }
        }
      }
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
