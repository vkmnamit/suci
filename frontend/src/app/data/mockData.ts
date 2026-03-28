// Mock data for the Climate Intelligence Dashboard

export interface Zone {
  id: string;
  name: string;
  coordinates: { x: number; y: number; width: number; height: number };
  carbonEmission: number; // kg CO2 per hour
  energyUsage: number; // kWh
  trafficLevel: number; // 0-100
  temperature: number; // Celsius
  humidity: number; // percentage
  airQuality: number; // AQI
  population: number;
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
        coordinates: { x: 100, y: 100, width: 180, height: 140 },
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
        coordinates: { x: 320, y: 100, width: 180, height: 140 },
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
        coordinates: { x: 540, y: 100, width: 180, height: 140 },
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
        coordinates: { x: 100, y: 270, width: 180, height: 140 },
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
        coordinates: { x: 320, y: 270, width: 180, height: 140 },
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
        coordinates: { x: 540, y: 270, width: 180, height: 140 },
        carbonEmission: 2890,
        energyUsage: 4400,
        trafficLevel: 68,
        temperature: 27,
        humidity: 66,
        airQuality: 132,
        population: 165000,
      },
    ],
  },
  delhi: {
    id: "delhi",
    name: "Delhi",
    totalCarbon: 18900,
    solarPercentage: 24,
    zones: [
      {
        id: "zone-d1",
        name: "Connaught Place",
        coordinates: { x: 100, y: 100, width: 180, height: 140 },
        carbonEmission: 3650,
        energyUsage: 5400,
        trafficLevel: 88,
        temperature: 32,
        humidity: 55,
        airQuality: 198,
        population: 165000,
      },
      {
        id: "zone-d2",
        name: "Dwarka Sector",
        coordinates: { x: 320, y: 100, width: 180, height: 140 },
        carbonEmission: 2980,
        energyUsage: 4600,
        trafficLevel: 72,
        temperature: 33,
        humidity: 52,
        airQuality: 172,
        population: 220000,
      },
      {
        id: "zone-d3",
        name: "Noida Tech Hub",
        coordinates: { x: 540, y: 100, width: 180, height: 140 },
        carbonEmission: 4280,
        energyUsage: 6800,
        trafficLevel: 91,
        temperature: 31,
        humidity: 58,
        airQuality: 205,
        population: 285000,
      },
      {
        id: "zone-d4",
        name: "Saket District",
        coordinates: { x: 100, y: 270, width: 180, height: 140 },
        carbonEmission: 3120,
        energyUsage: 4900,
        trafficLevel: 68,
        temperature: 32,
        humidity: 54,
        airQuality: 165,
        population: 195000,
      },
      {
        id: "zone-d5",
        name: "Rohini Industrial",
        coordinates: { x: 320, y: 270, width: 180, height: 140 },
        carbonEmission: 4870,
        energyUsage: 7200,
        trafficLevel: 75,
        temperature: 34,
        humidity: 48,
        airQuality: 215,
        population: 142000,
      },
      {
        id: "zone-d6",
        name: "Gurgaon IT Corridor",
        coordinates: { x: 540, y: 270, width: 180, height: 140 },
        carbonEmission: 3820,
        energyUsage: 5700,
        trafficLevel: 84,
        temperature: 33,
        humidity: 50,
        airQuality: 188,
        population: 195000,
      },
    ],
  },
  mumbai: {
    id: "mumbai",
    name: "Mumbai",
    totalCarbon: 17300,
    solarPercentage: 28,
    zones: [
      {
        id: "zone-m1",
        name: "BKC Business District",
        coordinates: { x: 100, y: 100, width: 180, height: 140 },
        carbonEmission: 3850,
        energyUsage: 5900,
        trafficLevel: 84,
        temperature: 30,
        humidity: 78,
        airQuality: 152,
        population: 195000,
      },
      {
        id: "zone-m2",
        name: "Andheri West",
        coordinates: { x: 320, y: 100, width: 180, height: 140 },
        carbonEmission: 2920,
        energyUsage: 4500,
        trafficLevel: 76,
        temperature: 29,
        humidity: 80,
        airQuality: 138,
        population: 245000,
      },
      {
        id: "zone-m3",
        name: "Lower Parel Mills",
        coordinates: { x: 540, y: 100, width: 180, height: 140 },
        carbonEmission: 3480,
        energyUsage: 5300,
        trafficLevel: 81,
        temperature: 31,
        humidity: 76,
        airQuality: 148,
        population: 175000,
      },
      {
        id: "zone-m4",
        name: "Navi Mumbai",
        coordinates: { x: 100, y: 270, width: 180, height: 140 },
        carbonEmission: 2650,
        energyUsage: 4100,
        trafficLevel: 58,
        temperature: 28,
        humidity: 82,
        airQuality: 122,
        population: 310000,
      },
      {
        id: "zone-m5",
        name: "Worli Seaface",
        coordinates: { x: 320, y: 270, width: 180, height: 140 },
        carbonEmission: 4400,
        energyUsage: 6700,
        trafficLevel: 72,
        temperature: 29,
        humidity: 85,
        airQuality: 165,
        population: 85000,
      },
      {
        id: "zone-m6",
        name: "Powai Tech Park",
        coordinates: { x: 540, y: 270, width: 180, height: 140 },
        carbonEmission: 3150,
        energyUsage: 4850,
        trafficLevel: 65,
        temperature: 28,
        humidity: 79,
        airQuality: 142,
        population: 155000,
      },
    ],
  },
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