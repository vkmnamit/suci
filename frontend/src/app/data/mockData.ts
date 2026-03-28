// Mock data for the Climate Intelligence Dashboard

export interface Zone {
  id: string;
  name: string;
  coordinates: { x: number; y: number; width: number; height: number }; // Retained for backwards compatibility
  path?: string; // High-fidelity geospatial polygon
  carbonEmission: number; // kg CO2 per hour
  energyUsage: number; // kWh
  trafficLevel: number; // 0-100
  temperature: number; // Celsius
  humidity: number; // percentage
  airQuality: number; // AQI
  population: number;
  status?: string;
  alertLevel?: string;
}

export interface City {
  id: string;
  name: string;
  zones: Zone[];
  totalCarbon: number;
  solarPercentage: number;
}

export interface ForecastData {
  time: string;
  energy: number;
  carbon: number;
  predicted: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: number; // percentage reduction
  priority: number; // 1-5
}

export const cities: Record<string, City> = {
  bangalore: {
    id: "bangalore",
    name: "Bangalore",
    totalCarbon: 15420,
    solarPercentage: 32,
    zones: [
      {
        id: "zone-1",
        name: "MG Road District",
        coordinates: { x: 480, y: 340, width: 0, height: 0 },
        path: "M410,290 L530,280 L580,360 L490,420 L390,360 Z",
        carbonEmission: 2850,
        energyUsage: 4200,
        trafficLevel: 78,
        temperature: 28,
        humidity: 65,
        airQuality: 156,
        population: 185000,
      },
      {
        id: "zone-2",
        name: "Electronic City",
        coordinates: { x: 600, y: 590, width: 0, height: 0 },
        path: "M535,520 L685,530 L720,640 L580,670 L480,600 Z",
        carbonEmission: 3420,
        energyUsage: 5800,
        trafficLevel: 85,
        temperature: 29,
        humidity: 62,
        airQuality: 168,
        population: 245000,
      },
      {
        id: "zone-3",
        name: "Whitefield Tech Park",
        coordinates: { x: 700, y: 290, width: 0, height: 0 },
        path: "M545,275 L630,195 L780,180 L840,300 L740,400 L590,365 Z",
        carbonEmission: 3180,
        energyUsage: 5200,
        trafficLevel: 82,
        temperature: 27,
        humidity: 68,
        airQuality: 142,
        population: 210000,
      },
      {
        id: "zone-4",
        name: "Jayanagar Residential",
        coordinates: { x: 380, y: 480, width: 0, height: 0 },
        path: "M280,380 L385,365 L485,420 L520,510 L470,600 L320,550 L250,450 Z",
        carbonEmission: 1650,
        energyUsage: 2800,
        trafficLevel: 45,
        temperature: 26,
        humidity: 70,
        airQuality: 98,
        population: 125000,
      },
      {
        id: "zone-5",
        name: "Hebbal Industrial",
        coordinates: { x: 480, y: 200, width: 0, height: 0 },
        path: "M360,160 L540,120 L620,190 L530,270 L410,280 L320,220 Z",
        carbonEmission: 4320,
        energyUsage: 6500,
        trafficLevel: 72,
        temperature: 30,
        humidity: 58,
        airQuality: 178,
        population: 95000,
      },
      {
        id: "zone-6",
        name: "Koramangala Hub",
        coordinates: { x: 610, y: 440, width: 0, height: 0 },
        path: "M495,425 L585,370 L730,410 L680,520 L530,510 Z",
        carbonEmission: 2890,
        energyUsage: 4400,
        trafficLevel: 68,
        temperature: 27,
        humidity: 66,
        airQuality: 132,
        population: 165000,
      },
    ],
  }
};

export const forecastData: ForecastData[] = [
  { time: "00:00", energy: 4200, carbon: 2850, predicted: 2820 },
  { time: "04:00", energy: 3800, carbon: 2580, predicted: 2610 },
  { time: "08:00", energy: 5600, carbon: 3800, predicted: 3750 },
  { time: "12:00", energy: 6200, carbon: 4200, predicted: 4180 },
  { time: "16:00", energy: 5800, carbon: 3950, predicted: 3920 },
  { time: "20:00", energy: 5200, carbon: 3520, predicted: 3550 },
  { time: "24:00", energy: 4500, carbon: 3050, predicted: 3020 },
];

export const carbonTrendData = [
  { month: "Jan", carbon: 14200, target: 13500 },
  { month: "Feb", carbon: 14800, target: 13200 },
  { month: "Mar", carbon: 15420, target: 12900 },
  { month: "Apr", carbon: 15100, target: 12600 },
  { month: "May", carbon: 14650, target: 12300 },
  { month: "Jun", carbon: 14200, target: 12000 },
];

export const modelPerformance = [
  { metric: "Accuracy", value: 94.8 },
  { metric: "Precision", value: 92.3 },
  { metric: "Recall", value: 91.7 },
  { metric: "F1 Score", value: 93.5 },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Increase solar capacity in Zone 5",
    description: "Deploy 500 additional solar panels in Hebbal Industrial area",
    impact: 18.5,
    priority: 1,
  },
  {
    id: "rec-2",
    title: "Optimize traffic flow in Zone 2",
    description: "Implement AI traffic signals in Electronic City during peak hours",
    impact: 14.2,
    priority: 2,
  },
  {
    id: "rec-3",
    title: "Building efficiency program",
    description: "Retrofit 200 buildings with smart HVAC systems in MG Road",
    impact: 12.8,
    priority: 2,
  },
  {
    id: "rec-4",
    title: "Expand EV charging network",
    description: "Add 50 fast-charging stations across high-traffic zones",
    impact: 10.3,
    priority: 3,
  },
  {
    id: "rec-5",
    title: "Green corridor development",
    description: "Plant 5,000 trees along major thoroughfares",
    impact: 6.7,
    priority: 4,
  },
];