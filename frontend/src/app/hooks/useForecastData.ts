// ─── Forecast Hooks ──────────────────────────────────────────────────────────
import { useCallback, useMemo } from "react";
import { useApi } from "./useApi";
import { forecastService } from "../api";
import type { ApiForecastPoint, ApiCityForecast } from "../api/types";
import { forecastData as mockForecastData } from "../data/mockData";
import type { ForecastData } from "../data/mockData";

/** Normalize API forecast point to frontend shape */
function normalizeForecastPoint(point: ApiForecastPoint, index: number): ForecastData {
  const hour = point.hour ?? index * 4;
  const time = point.time || point.timestamp || `${String(hour).padStart(2, "0")}:00`;

  return {
    time,
    energy: point.actual_mwh ?? point.actual ?? point.energy ?? 0,
    carbon: point.carbon ?? Math.round((point.actual_mwh ?? point.actual ?? 0) * 0.68),
    predicted: point.predicted_mwh ?? point.predicted ?? 0,
  };
}

/** Fetch zone-level energy forecast */
export function useZoneForecast(zoneId: string, hours?: number) {
  const fetcher = useCallback(
    () => forecastService.getZoneForecast(zoneId, hours),
    [zoneId, hours]
  );

  const { data: apiData, loading, error, refetch, isFromApi } =
    useApi<ApiForecastPoint[]>({
      fetcher,
      fallback: [],
      deps: [zoneId, hours],
    });

  const forecast: ForecastData[] = useMemo(() => {
    if (isFromApi && apiData && apiData.length > 0) {
      return apiData.map((p, i) => normalizeForecastPoint(p, i));
    }
    return mockForecastData;
  }, [apiData, isFromApi]);

  return { forecast, loading, error, refetch, isFromApi };
}

/** Fetch aggregated city-wide forecast */
export function useCityForecast() {
  const fetcher = useCallback(() => forecastService.getCityForecast(), []);

  const { data: apiData, loading, error, refetch, isFromApi } =
    useApi<ApiCityForecast>({
      fetcher,
      fallback: undefined,
      pollInterval: 60000, // refresh every minute
    });

  const forecast: ForecastData[] = useMemo(() => {
    if (isFromApi && apiData) {
      const points = apiData.forecast || [];
      if (points.length > 0) {
        return points.map((p, i) => normalizeForecastPoint(p, i));
      }
    }
    return mockForecastData;
  }, [apiData, isFromApi]);

  const summary = useMemo(() => {
    if (isFromApi && apiData) {
      return {
        totalActual: apiData.total_actual_mwh ?? 0,
        totalPredicted: apiData.total_predicted_mwh ?? 0,
      };
    }
    return null;
  }, [apiData, isFromApi]);

  return { forecast, summary, loading, error, refetch, isFromApi };
}
