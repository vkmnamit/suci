import { useCallback } from "react";
import { useApi } from "./useApi";
import { scenariosService } from "../api";

export function useScenarios() {
  const fetcher = useCallback(() => scenariosService.getScenarios(), []);

  return useApi<any[]>({
    fetcher,
    fallback: [],
    pollInterval: 60000,
  });
}
