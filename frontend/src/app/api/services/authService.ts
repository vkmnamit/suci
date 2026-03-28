// ─── Auth Service ────────────────────────────────────────────────────────────
import apiClient from "../client";
import type { AuthCredentials, AuthResponse } from "../types";

export const authService = {
  async signup(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/signup",
      credentials
    );
    // Store token if returned
    const token = response.token || response.access_token;
    if (token) {
      apiClient.setToken(token);
    }
    return response;
  },

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    // Store token if returned
    const token = response.token || response.access_token;
    if (token) {
      apiClient.setToken(token);
    }
    return response;
  },

  logout() {
    apiClient.setToken(null);
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },
};
