// ─── City & Infrastructure Service ──────────────────────────────────────────
import apiClient from "../client";
import type { ApiZone, ApiZoneState } from "../types";

export const cityService = {
  /** GET /city/zones — All city zones */
  async getZones(): Promise<ApiZone[]> {
    const response = await apiClient.get<ApiZone[] | { zones: ApiZone[] }>(
      "/city/zones"
    );
    // Handle both array and wrapped response
    return Array.isArray(response) ? response : response.zones || [];
  },

  /** GET /city/zones/{zone_id} — Detailed zone info */
  async getZoneDetails(zoneId: string): Promise<ApiZone> {
    return apiClient.get<ApiZone>(`/city/zones/${zoneId}`);
  },

  /** GET /city/zones/{zone_id}/state — Live zone state */
  async getZoneState(zoneId: string): Promise<ApiZoneState> {
    return apiClient.get<ApiZoneState>(`/city/zones/${zoneId}/state`);
  },
};
