import { useCallback } from "react";
import { useApi } from "./useApi";
import { reportsService } from "../api";

export function useReports() {
  const fetcher = useCallback(() => reportsService.getReports(), []);

  return useApi<any[]>({
    fetcher,
    fallback: [],
    pollInterval: 120000,
  });
}
