// ─── City Hooks ──────────────────────────────────────────────────────────────
import { useMemo, useCallback } from "react";
import { useApi } from "./useApi";
import { cityService, forecastService } from "../api";
import type { ApiZone, ApiZoneState } from "../api/types";
import { cities } from "../data/mockData";
import type { Zone, City } from "../data/mockData";

/** Normalize an API zone to the frontend Zone shape */
function normalizeZone(apiZone: ApiZone, index: number): Zone {
  // Use real coordinates from API if available, otherwise use grid layout
  const hasGeo = apiZone.lat && apiZone.lng && apiZone.lat !== 0;
  
  // Projection logic for India cities to 1000x700 SVG
  // Map typical India lats (8-35) and lngs (68-97) to the viewport
  // For Bengaluru specifically (12.9, 77.5):
  // Let's scope to a general "City View" if they are close together
  const lat = apiZone.lat ?? 0;
  const lng = apiZone.lng ?? 0;
  
  // Adaptive projection: if we have geo, project it. Otherwise grid.
  let x = 100 + (index % 3) * 220;
  let y = 100 + Math.floor(index / 3) * 170;

  if (hasGeo) {
    // Relative positioning to city center if it's a specific city, 
    // or just a zoomed-out view for all of India
    // This simple projection assumes most zones are in the same general area
    // Scoped to Bengaluru region for best visual fit:
    x = 100 + (lng - 77.4) * 1500; // Zoomed in
    y = 600 - (lat - 12.8) * 1200; // Zoomed in
    
    // Safety constraining to viewport
    x = Math.max(50, Math.min(850, x));
    y = Math.max(50, Math.min(550, y));
  }

  return {
    id: apiZone.id || apiZone.zone_id || `zone-${index + 1}`,
    name: apiZone.name || `Zone ${index + 1}`,
    coordinates: {
      x,
      y,
      width: 140,
      height: 100,
    },
    carbonEmission: apiZone.carbon_intensity ?? apiZone.carbon_emission ?? apiZone.carbonEmission ?? 0,
    energyUsage: apiZone.energy_consumption ?? apiZone.energy_usage ?? apiZone.energyUsage ?? 0,
    trafficLevel: apiZone.traffic_density ?? apiZone.traffic_level ?? apiZone.trafficLevel ?? 0,
    temperature: apiZone.temperature ?? 27,
    humidity: apiZone.humidity ?? 65,
    airQuality: apiZone.air_quality ?? apiZone.airQuality ?? 0,
    population: apiZone.population ?? 0,
    status: (apiZone as any).status || "ACTIVE",
    alertLevel: (apiZone as any).alert_level || "NONE",
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

/** Fetch carbon trend predictions for all zones (for map overlay) */
export function useMapTrend() {
  const fetcher = useCallback(() => forecastService.getMapTrend(), []);

  return useApi<{ trends: any[] }>({
    fetcher,
    fallback: { trends: [] },
    pollInterval: 60000, // refresh every minute
  });
}
