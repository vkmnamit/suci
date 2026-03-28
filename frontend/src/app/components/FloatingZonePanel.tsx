import { Zone } from "../data/mockData";
import { AlertTriangle, Zap, Car, Cloud, Users, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useZoneState } from "../hooks/useCityData";

interface FloatingZonePanelProps {
  zone: Zone | null;
  onClose: () => void;
}

export function FloatingZonePanel({ zone, onClose }: FloatingZonePanelProps) {
  const { data: liveState, loading: liveLoading } = useZoneState(zone?.id || null);

  if (!zone) return null;

  const carbonEmission = liveState?.live_carbon_score ?? liveState?.carbon_score ?? zone.carbonEmission;
  const energyUsage = liveState?.energy_demand_mwh ?? zone.energyUsage;
  const isHighRisk = carbonEmission > 3500 || zone.airQuality > 150;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 left-6 w-80 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 shadow-2xl z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>

        {/* Zone Header */}
        <div className="mb-5">
          <h3 className="text-xl text-white font-light mb-1">{zone.name}</h3>
          <p className="text-xs text-white/40 font-light">Zone ID: {zone.id}</p>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-2.5">
          {/* Energy Usage */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#E8DCCF]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs text-white/60 font-light">Energy Demand</span>
                    {liveState && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>}
                  </div>
                  <p className="text-sm text-white font-light">{Math.round(energyUsage)} {liveState ? 'MWh' : 'kWh'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Emission */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                  <Cloud className="w-3.5 h-3.5 text-[#E8DCCF]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs text-white/60 font-light">Carbon Score</span>
                    {liveState && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>}
                  </div>
                  <p className="text-sm text-white font-light">{Math.round(carbonEmission)} kg CO₂</p>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Level */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                  <Car className="w-3.5 h-3.5 text-[#E8DCCF]" />
                </div>
                <div>
                  <span className="text-xs text-white/60 font-light">Traffic</span>
                  <p className="text-sm text-white font-light">{zone.trafficLevel}%</p>
                </div>
              </div>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E8DCCF] to-[#B8A393] transition-all duration-500"
                style={{ width: `${zone.trafficLevel}%` }}
              ></div>
            </div>
          </div>

          {/* Population */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#E8DCCF]" />
              </div>
              <div>
                <span className="text-xs text-white/60 font-light">Population</span>
                <p className="text-sm text-white font-light">
                  {(zone.population / 1000).toFixed(0)}k residents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Data */}
        <div className="mt-4 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3">
          <h4 className="text-xs text-white/60 font-light mb-2">Weather</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-white/40 mb-0.5">Temp</p>
              <p className="text-sm text-white font-light">{zone.temperature}°C</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 mb-0.5">Humidity</p>
              <p className="text-sm text-white font-light">{zone.humidity}%</p>
            </div>
          </div>
        </div>

        {/* Alert */}
        {isHighRisk && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-3"
          >
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div className="flex-1">
                <h5 className="text-xs text-red-300 mb-0.5 font-light">High Risk Alert</h5>
                <p className="text-[10px] text-red-200/70 font-light leading-relaxed">
                  {carbonEmission > 3500 && "Critical carbon levels. "}
                  {zone.airQuality > 150 && "Poor air quality. "}
                  Intervention needed.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
