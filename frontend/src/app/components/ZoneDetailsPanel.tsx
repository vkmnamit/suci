import { Zone } from "../data/mockData";
import { AlertTriangle, Zap, Car, Cloud, Users } from "lucide-react";
import { motion } from "motion/react";
import { useZoneState } from "../hooks/useCityData";

interface ZoneDetailsPanelProps {
  zone: Zone | null;
}

export function ZoneDetailsPanel({ zone }: ZoneDetailsPanelProps) {
  const { data: liveState } = useZoneState(zone?.id || null);

  if (!zone) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-white/40 font-light">Select a zone on the map</p>
      </div>
    );
  }

  const carbonEmission = liveState?.live_carbon_score ?? liveState?.carbon_score ?? zone.carbonEmission;
  const energyUsage = liveState?.energy_demand_mwh ?? zone.energyUsage;
  const isHighRisk = carbonEmission > 3500 || zone.airQuality > 150;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Zone Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-light text-white mb-1">{zone.name}</h2>
        <p className="text-xs text-white/50 font-light">Zone ID: {zone.id}</p>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-3 mb-6">
        {/* Energy Usage */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#E8DCCF]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/60 font-light">Energy Demand</span>
                {liveState && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>}
              </div>
            </div>
            <span className="text-lg text-white font-light">{Math.round(energyUsage)}</span>
          </div>
          <p className="text-[10px] text-white/40">{liveState ? 'MWh' : 'kWh'} per hour</p>
        </div>

        {/* Carbon Emission */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-[#E8DCCF]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/60 font-light">Carbon Score</span>
                {liveState && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>}
              </div>
            </div>
            <span className="text-lg text-white font-light">{Math.round(carbonEmission)}</span>
          </div>
          <p className="text-[10px] text-white/40">kg CO₂ per hour</p>
        </div>

        {/* Traffic Level */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                <Car className="w-4 h-4 text-[#E8DCCF]" />
              </div>
              <span className="text-xs text-white/60 font-light">Traffic Level</span>
            </div>
            <span className="text-lg text-white font-light">{zone.trafficLevel}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-[#E8DCCF] to-[#B8A393] transition-all duration-500"
              style={{ width: `${zone.trafficLevel}%` }}
            ></div>
          </div>
        </div>

        {/* Population */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#E8DCCF]" />
              </div>
              <span className="text-xs text-white/60 font-light">Population</span>
            </div>
            <span className="text-lg text-white font-light">
              {(zone.population / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>

      {/* Weather Data */}
      <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6">
        <h3 className="text-xs text-white/60 font-light mb-3">Weather Conditions</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-white/40 mb-1">Temperature</p>
            <p className="text-sm text-white font-light">{zone.temperature}°C</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 mb-1">Humidity</p>
            <p className="text-sm text-white font-light">{zone.humidity}%</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {isHighRisk && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-red-300 mb-1 font-light">High Risk Alert</h4>
              <p className="text-xs text-red-200/70 font-light leading-relaxed">
                {carbonEmission > 3500 && "Carbon emission levels are critically high. "}
                {zone.airQuality > 150 && "Air quality index exceeds safe threshold. "}
                Immediate intervention recommended.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
