import { useCallback } from "react";
import { useApi } from "./useApi";
import { interventionsService } from "../api";

export function useInterventions() {
  const fetcher = useCallback(() => interventionsService.getInterventions(), []);

  return useApi<any[]>({
    fetcher,
    fallback: [],
    pollInterval: 60000,
  });
}
