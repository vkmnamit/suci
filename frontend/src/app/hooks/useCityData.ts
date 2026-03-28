// ─── City Hooks ──────────────────────────────────────────────────────────────
import { useMemo, useCallback } from "react";
import { useApi } from "./useApi";
import { cityService } from "../api";
import type { ApiZone, ApiZoneState } from "../api/types";
import { cities } from "../data/mockData";
import type { Zone, City } from "../data/mockData";

/** Normalize an API zone to the frontend Zone shape */
function normalizeZone(apiZone: ApiZone, index: number): Zone {
  // Grid layout positions
  const col = index % 3;
  const row = Math.floor(index / 3);

  return {
    id: apiZone.id || apiZone.zone_id || `zone-${index + 1}`,
    name: apiZone.name || `Zone ${index + 1}`,
    coordinates: {
      x: 100 + col * 220,
      y: 100 + row * 170,
      width: 180,
      height: 140,
    },
    carbonEmission: apiZone.carbon_emission ?? apiZone.carbonEmission ?? 0,
    energyUsage: apiZone.energy_usage ?? apiZone.energyUsage ?? 0,
    trafficLevel: apiZone.traffic_level ?? apiZone.trafficLevel ?? 0,
    temperature: apiZone.temperature ?? 27,
    humidity: apiZone.humidity ?? 65,
    airQuality: apiZone.air_quality ?? apiZone.airQuality ?? 0,
    population: apiZone.population ?? 0,
  };
}

/** Fetch all zones and return as a City object */
export function useCityZones(selectedCity: string) {
  const fallbackCity = cities[selectedCity] || cities.bangalore;

  const fetcher = useCallback(() => cityService.getZones(), []);

  const { data: apiZones, loading, error, refetch, isFromApi } = useApi<ApiZone[]>({
    fetcher,
    fallback: [],
    pollInterval: 30000, // refresh every 30s
  });

  const currentCity: City = useMemo(() => {
    if (isFromApi && apiZones && apiZones.length > 0) {
      const zones = apiZones.map((z, i) => normalizeZone(z, i));
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
