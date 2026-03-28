// ─── City Hooks ──────────────────────────────────────────────────────────────
import { useMemo, useCallback } from "react";
import { useApi } from "./useApi";
import { cityService, forecastService } from "../api";
import type { ApiZone, ApiZoneState } from "../api/types";
import { cities } from "../data/mockData";
import type { Zone, City } from "../data/mockData";

/** Normalize an API zone to the frontend Zone shape */
function normalizeZone(apiZone: ApiZone, index: number, selectedCity: string): Zone {
  const fallbackCity = cities[selectedCity] || cities.bangalore;
  const fallbackZone = fallbackCity.zones[index] || fallbackCity.zones[0];
  
  return {
    id: apiZone.id || apiZone.zone_id || fallbackZone.id,
    name: apiZone.name || fallbackZone.name,
    coordinates: fallbackZone.coordinates,
    path: fallbackZone.path,
    carbonEmission: apiZone.carbon_intensity ?? apiZone.carbon_emission ?? apiZone.carbonEmission ?? fallbackZone.carbonEmission,
    energyUsage: apiZone.energy_consumption ?? apiZone.energy_usage ?? apiZone.energyUsage ?? fallbackZone.energyUsage,
    trafficLevel: apiZone.traffic_density ?? apiZone.traffic_level ?? apiZone.trafficLevel ?? fallbackZone.trafficLevel,
    temperature: apiZone.temperature ?? fallbackZone.temperature,
    humidity: apiZone.humidity ?? fallbackZone.humidity,
    airQuality: apiZone.air_quality ?? apiZone.airQuality ?? fallbackZone.airQuality,
    population: apiZone.population ?? fallbackZone.population,
    status: (apiZone as any).status || fallbackZone.status || "ACTIVE",
    alertLevel: (apiZone as any).alert_level || fallbackZone.alertLevel || "NONE",
  };
}

/** Fetch all zones and return as a City object */
export function useCityZones(selectedCity: string) {
  const fallbackCity = cities[selectedCity] || cities.bangalore;

  const fetcher = useCallback(() => cityService.getZones(selectedCity), [selectedCity]);

  const { data: apiZones, loading, error, refetch, isFromApi } = useApi<ApiZone[]>({
    fetcher,
    fallback: [],
    pollInterval: 30000, // refresh every 30s
    deps: [selectedCity],
  });

  const currentCity: City = useMemo(() => {
    if (isFromApi && apiZones && apiZones.length > 0) {
      const zones = apiZones.map((z, i) => normalizeZone(z, i, selectedCity));
      const totalCarbon = zones.reduce((sum, z) => sum + z.carbonEmission, 0);
      const avgRenewable =
        apiZones.reduce(
          (sum, z) =>
            sum + (z.renewable_percentage ?? z.renewablePercentage ?? 0),
          0
        ) / apiZones.length;

      return {
        id: selectedCity,
        name:
          selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1),
        zones,
        totalCarbon,
        solarPercentage: Math.round(avgRenewable) || fallbackCity.solarPercentage,
      };
    }
    return fallbackCity;
  }, [apiZones, isFromApi, selectedCity, fallbackCity]);

  return { currentCity, loading, error, refetch, isFromApi };
}

/** Fetch details for a single zone */
export function useZoneDetails(zoneId: string | null) {
  const fetcher = useCallback(
    () => (zoneId ? cityService.getZoneDetails(zoneId) : Promise.resolve(null)),
    [zoneId]
  );

  return useApi<ApiZone | null>({
    fetcher,
    fallback: null,
    autoFetch: !!zoneId,
    deps: [zoneId],
  });
}

/** Fetch live zone state (energy demand, carbon score) */
export function useZoneState(zoneId: string | null) {
  const fetcher = useCallback(
    () => (zoneId ? cityService.getZoneState(zoneId) : Promise.resolve(null)),
    [zoneId]
  );

  return useApi<ApiZoneState | null>({
    fetcher,
    fallback: null,
    autoFetch: !!zoneId,
    pollInterval: 15000, // refresh every 15s
    deps: [zoneId],
  });
}

/** Fetch carbon trend predictions for all zones (for map overlay) */
export function useMapTrend(selectedCity: string = "bangalore") {
  const fetcher = useCallback(() => forecastService.getMapTrend(selectedCity), [selectedCity]);

  return useApi<{ trends: any[] }>({
    fetcher,
    fallback: { trends: [] },
    pollInterval: 60000, // refresh every minute
    deps: [selectedCity]
  });
}
