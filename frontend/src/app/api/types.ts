// ─── API Type Definitions ────────────────────────────────────────────────────
// Types matching the SUCI backend responses

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user?: {
    id: string;
    email: string;
  };
  message?: string;
}

// ─── City & Infrastructure ───────────────────────────────────────────────────
export interface ApiZone {
  id: string;
  zone_id?: string;
  name: string;
  carbon_emission?: number;
  carbon_intensity?: number;
  carbonEmission?: number;
  energy_usage?: number;
  energy_consumption?: number;
  energyUsage?: number;
  renewable_percentage?: number;
  renewablePercentage?: number;
  population?: number;
  buildings?: ApiBuilding[];
  substations?: ApiSubstation[];
  traffic_level?: number;
  traffic_density?: number;
  trafficLevel?: number;
  temperature?: number;
  humidity?: number;
  air_quality?: number;
  airQuality?: number;
  lat?: number;
  lng?: number;
}

export interface ApiBuilding {
  id: string;
  name: string;
  type: string;
  energy_consumption?: number;
  carbon_footprint?: number;
}

export interface ApiSubstation {
  id: string;
  name: string;
  capacity_mw?: number;
  current_load_mw?: number;
}

export interface ApiZoneState {
  zone_id: string;
  energy_demand_mwh?: number;
  carbon_score?: number;
  live_carbon_score?: number;
  timestamp?: string;
}

// ─── Forecast ────────────────────────────────────────────────────────────────
export interface ApiForecastPoint {
  timestamp?: string;
  time?: string;
  hour?: number;
  actual_mwh?: number;
  predicted_mwh?: number;
  actual?: number;
  predicted?: number;
  energy?: number;
  carbon?: number;
}

export interface ApiCityForecast {
  total_actual_mwh?: number;
  total_predicted_mwh?: number;
  zones?: Array<{
    zone_id: string;
    forecast: ApiForecastPoint[];
  }>;
  forecast?: ApiForecastPoint[];
}

// ─── RLAIF ───────────────────────────────────────────────────────────────────
export interface ApiAccuracyLog {
  id?: string;
  timestamp?: string;
  date?: string;
  mape_before?: number;
  mape_after?: number;
  improvement?: number;
  retrain_triggered?: boolean;
}

export interface ApiCritique {
  id?: string;
  timestamp?: string;
  date?: string;
  zone_id?: string;
  root_cause?: string;
  analysis?: string;
  severity?: string;
  recommendation?: string;
  suggested_fix?: string;
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  message: string;
  stream?: boolean;
}

export interface ChatResponse {
  response?: string;
  message?: string;
  content?: string;
}

export interface BriefingResponse {
  briefing?: string;
  summary?: string;
  content?: string;
}
