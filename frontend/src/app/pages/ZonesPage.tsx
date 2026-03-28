import { useState } from "react";
import { CityMap } from "../components/CityMap";
import { FloatingZonePanel } from "../components/FloatingZonePanel";
import { ZoneDetailsPanel } from "../components/ZoneDetailsPanel";
import type { City, Zone } from "../data/mockData";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";

interface ZonesPageProps {
  currentCity: City;
}

export function ZonesPage({ currentCity }: ZonesPageProps) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white font-light mb-1">City Zones Map</h2>
          <p className="text-sm text-white/50 font-light">
            Interactive carbon emission heatmap
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
          <MapPin className="w-4 h-4 text-[#E8DCCF]" />
          <span className="text-sm text-white font-light">
            {currentCity.zones.length} Active Zones
          </span>
        </div>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Map View */}
        <div className="lg:col-span-2 h-[700px] relative">
          <CityMap
            zones={currentCity.zones}
            selectedZone={selectedZone}
            onZoneSelect={setSelectedZone}
          />
          
          <FloatingZonePanel
            zone={selectedZone}
            onClose={() => setSelectedZone(null)}
          />
        </div>

        {/* Zone Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:sticky lg:top-24 h-fit max-h-[700px] overflow-y-auto custom-scrollbar">
            <ZoneDetailsPanel zone={selectedZone} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
