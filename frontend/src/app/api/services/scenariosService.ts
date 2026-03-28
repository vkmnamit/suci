import { apiClient } from "../client";

export const scenariosService = {
  getScenarios: async () => {
    const response = await apiClient.get("/scenarios/");
    return response.data;
  },
  saveScenario: async (scenario: any) => {
    const response = await apiClient.post("/scenarios/", scenario);
    return response.data;
  }
};
