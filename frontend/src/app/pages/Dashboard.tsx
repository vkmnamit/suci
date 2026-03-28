import { useState, useMemo } from "react";
import { StatCards } from "../components/StatCards";
import { CityMap } from "../components/CityMap";
import { CityGraph3D } from "../components/CityGraph3D";
import { FloatingZonePanel } from "../components/FloatingZonePanel";
import { AnalyticsPanel } from "../components/AnalyticsPanel";
import { SimulationPanel } from "../components/SimulationPanel";
import { RecommendationCards } from "../components/RecommendationCards";
import type { City, Zone } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Zap, ShieldAlert, Layers, Box, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { useMapTrend } from "../hooks/useCityData";

interface DashboardProps {
  currentCity: City;
  totalEnergy: number;
}

export function Dashboard({ currentCity, totalEnergy }: DashboardProps) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [forecastMode, setForecastMode] = useState(false);

  const { data: trendData } = useMapTrend();

  // Merge trends into zones for visualization if in forecast mode
  const displayZones = useMemo(() => {
    if (!forecastMode || !trendData?.trends) return currentCity.zones;
    
    return currentCity.zones.map(zone => {
      const trend = trendData.trends.find((t: any) => t.zone_id === zone.id);
      if (trend) {
        return {
          ...zone,
          carbonEmission: trend.predicted_carbon,
          energyUsage: trend.predicted_energy || zone.energyUsage * 1.05, // Use predicted energy or mock growth
          status: trend.predicted_carbon > 3500 ? "CRITICAL" : (trend.predicted_carbon > 2500 ? "HIGH" : zone.status)
        };
      }
      return zone;
    });
  }, [currentCity.zones, forecastMode, trendData]);

  const totalPredictedEnergy = useMemo(() => 
    displayZones.reduce((sum, z) => sum + z.energyUsage, 0),
    [displayZones]
  );

  const totalPredictedCarbon = useMemo(() => 
    displayZones.reduce((sum, z) => sum + z.carbonEmission, 0),
    [displayZones]
  );

  const criticalZones = useMemo(() => 
    displayZones.filter(z => z.status === "CRITICAL"),
    [displayZones]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {criticalZones.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between mb-6 backdrop-blur-xl animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-light text-red-100 mb-0.5">CRITICAL RED ALERT</h4>
                  <p className="text-xs font-light text-red-200/60">
                    {criticalZones.length} urban zones have exceeded carbon safety limits. Immediate intervention required.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-xs text-red-200 hover:bg-red-500/10 font-light">
                  View All Alerts
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white text-xs font-light px-6 border-none">
                  <Zap className="w-3 h-3 mr-2 fill-current" />
                  Apply Emergency Protocol
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats Cards */}
      <StatCards
        totalCarbon={forecastMode ? totalPredictedCarbon : currentCity.totalCarbon}
        energyUsage={forecastMode ? totalPredictedEnergy : totalEnergy}
        activeZones={currentCity.zones.length}
        solarPercentage={currentCity.solarPercentage}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* City Projection (2D/3D) */}
          <div className="h-[500px] relative">
            <AnimatePresence mode="wait">
              {is3D ? (
                <motion.div 
                  key="3d" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <CityGraph3D 
                    zones={displayZones} 
                    onZoneSelect={setSelectedZone} 
                    selectedZoneId={selectedZone?.id}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="2d" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <CityMap
                    zones={displayZones}
                    selectedZone={selectedZone}
                    onZoneSelect={setSelectedZone}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* View Toggle Button */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-1 flex items-center gap-1">
                <button
                  onClick={() => setForecastMode(!forecastMode)}
                  className={`p-2 rounded-lg transition-all flex items-center gap-2 px-3 ${forecastMode ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-white/40 hover:text-white'}`}
                  title="Toggle ML Forecast Mode"
                >
                  <TrendingUp className={`w-4 h-4 ${forecastMode ? 'animate-pulse' : ''}`} />
                  <span className="text-[10px] uppercase tracking-tighter font-bold">{forecastMode ? 'Live Prediction' : 'Forecast'}</span>
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => setIs3D(false)}
                  className={`p-2 rounded-lg transition-all ${!is3D ? 'bg-[#E8DCCF] text-[#0B0B0B]' : 'text-white/40 hover:text-white'}`}
                  title="2D Map View"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIs3D(true)}
                  className={`p-2 rounded-lg transition-all ${is3D ? 'bg-[#E8DCCF] text-[#0B0B0B]' : 'text-white/40 hover:text-white'}`}
                  title="3D Topological View"
                >
                  <Box className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Floating Zone Details */}
            <FloatingZonePanel
              zone={selectedZone}
              onClose={() => setSelectedZone(null)}
            />
          </div>

          {/* Simulation & Recommendations Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SimulationPanel currentCarbon={currentCity.totalCarbon} />
            <RecommendationCards />
          </div>
        </div>

        {/* Right: Analytics Panel */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <AnalyticsPanel />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
