// ─── Forecast Service ────────────────────────────────────────────────────────
import apiClient from "../client";
import type { ApiForecastPoint, ApiCityForecast } from "../types";

export const forecastService = {
  /** GET /forecast/energy/{zone_id} — Zone energy forecast */
  async getZoneForecast(
    zoneId: string,
    hours?: number
  ): Promise<ApiForecastPoint[]> {
    const params: Record<string, string> = {};
    if (hours) {
      params.hours = String(hours);
    }
    const response = await apiClient.get<
      ApiForecastPoint[] | { forecast: ApiForecastPoint[] }
    >(`/forecast/energy/${zoneId}`, Object.keys(params).length ? params : undefined);
    return Array.isArray(response) ? response : response.forecast || [];
  },

  /** GET /forecast/all-zones — City-wide aggregated forecast */
  async getCityForecast(): Promise<ApiCityForecast> {
    return apiClient.get<ApiCityForecast>("/forecast/all-zones");
  },

  /** GET /forecast/map-trend — Predictive carbon trends for map */
  async getMapTrend(city?: string): Promise<{ trends: any[] }> {
    const params: Record<string, string> = city ? { city } : {};
    return apiClient.get<{ trends: any[] }>("/forecast/map-trend", Object.keys(params).length ? params : undefined);
  },
};
