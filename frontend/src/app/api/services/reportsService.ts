import { apiClient } from "../client";

export const reportsService = {
  getReports: async () => {
    const response = await apiClient.get("/reports/");
    return response.data;
  }
};
