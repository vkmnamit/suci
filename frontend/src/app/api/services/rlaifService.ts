// ─── RLAIF Service ───────────────────────────────────────────────────────────
import apiClient from "../client";
import type { ApiAccuracyLog, ApiCritique } from "../types";

export const rlaifService = {
  /** GET /rlaif/accuracy-log — Model retraining history */
  async getAccuracyLogs(): Promise<ApiAccuracyLog[]> {
    const response = await apiClient.get<
      ApiAccuracyLog[] | { logs: ApiAccuracyLog[] }
    >("/rlaif/accuracy-log");
    return Array.isArray(response) ? response : response.logs || [];
  },

  /** GET /rlaif/critiques — AI Judge root-cause analyses */
  async getCritiques(): Promise<ApiCritique[]> {
    const response = await apiClient.get<
      ApiCritique[] | { critiques: ApiCritique[] }
    >("/rlaif/critiques");
    return Array.isArray(response) ? response : response.critiques || [];
  },
};
