import { apiClient } from "../client";

export const interventionsService = {
  getInterventions: async () => {
    const response = await apiClient.get("/interventions/");
    return response.data;
  },
  activateIntervention: async (id: string) => {
    const response = await apiClient.post(`/interventions/${id}/activate`);
    return response.data;
  }
};
