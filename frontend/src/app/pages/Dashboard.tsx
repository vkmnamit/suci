import { useState } from "react";
import { StatCards } from "../components/StatCards";
import { CityMap } from "../components/CityMap";
import { FloatingZonePanel } from "../components/FloatingZonePanel";
import { AnalyticsPanel } from "../components/AnalyticsPanel";
import { SimulationPanel } from "../components/SimulationPanel";
import { RecommendationCards } from "../components/RecommendationCards";
import type { City, Zone } from "../data/mockData";
import { motion } from "motion/react";

interface DashboardProps {
  currentCity: City;
  totalEnergy: number;
}

export function Dashboard({ currentCity, totalEnergy }: DashboardProps) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Stats Cards */}
      <StatCards
        totalCarbon={currentCity.totalCarbon}
        energyUsage={totalEnergy}
        activeZones={currentCity.zones.length}
        solarPercentage={currentCity.solarPercentage}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* City Map */}
          <div className="h-[500px] relative">
            <CityMap
              zones={currentCity.zones}
              selectedZone={selectedZone}
              onZoneSelect={setSelectedZone}
            />
            
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
