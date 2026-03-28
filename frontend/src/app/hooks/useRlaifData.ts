// ─── RLAIF Hooks ─────────────────────────────────────────────────────────────
import { useCallback, useMemo } from "react";
import { useApi } from "./useApi";
import { rlaifService } from "../api";
import type { ApiAccuracyLog, ApiCritique } from "../api/types";
import { modelPerformance as mockPerformance } from "../data/mockData";

/** Fetch accuracy / retraining logs */
export function useAccuracyLogs() {
  const fetcher = useCallback(() => rlaifService.getAccuracyLogs(), []);

  const { data, loading, error, refetch, isFromApi } = useApi<ApiAccuracyLog[]>({
    fetcher,
    fallback: [],
    pollInterval: 60000,
  });

  // Derive model performance metrics from accuracy logs
  const modelMetrics = useMemo(() => {
    if (isFromApi && data && data.length > 0) {
      const latest = data[data.length - 1];
      const avgMape =
        data.reduce((sum, log) => sum + (log.mape_after ?? log.mape_before ?? 5), 0) /
        data.length;
      const accuracy = Math.max(0, 100 - avgMape);

      return [
        { metric: "Accuracy", value: parseFloat(accuracy.toFixed(1)) },
        {
          metric: "MAPE Before",
          value: parseFloat((latest.mape_before ?? 8).toFixed(1)),
        },
        {
          metric: "MAPE After",
          value: parseFloat((latest.mape_after ?? 5).toFixed(1)),
        },
        {
          metric: "Improvement",
          value: parseFloat((latest.improvement ?? 3).toFixed(1)),
        },
      ];
    }
    return mockPerformance;
  }, [data, isFromApi]);

  return { logs: data, modelMetrics, loading, error, refetch, isFromApi };
}

/** Fetch AI Judge critiques */
export function useCritiques() {
  const fetcher = useCallback(() => rlaifService.getCritiques(), []);

  return useApi<ApiCritique[]>({
    fetcher,
    fallback: [],
    pollInterval: 60000,
  });
}
