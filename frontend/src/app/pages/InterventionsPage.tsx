import { RecommendationCards } from "../components/RecommendationCards";
import { motion } from "motion/react";
import { Lightbulb, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useInterventions } from "../hooks/useInterventionData";

export function InterventionsPage() {
  const { data: interventions, loading } = useInterventions();
  const safeInterventions = interventions || [];

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
          <h2 className="text-2xl text-white font-light mb-1">AI Interventions</h2>
          <p className="text-sm text-white/50 font-light">
            Smart recommendations to reduce carbon emissions
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
          <Lightbulb className="w-4 h-4 text-[#E8DCCF]" />
          <span className="text-sm text-white font-light">
            {loading ? "..." : safeInterventions.length} Recommendations
          </span>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-green-300/70 font-light">Completed</p>
              <p className="text-2xl text-green-300 font-light">8</p>
            </div>
          </div>
          <p className="text-[10px] text-green-300/60 font-light">
            Successfully implemented interventions
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-yellow-300/70 font-light">In Progress</p>
              <p className="text-2xl text-yellow-300 font-light">3</p>
            </div>
          </div>
          <p className="text-[10px] text-yellow-300/60 font-light">
            Currently being implemented
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-blue-300/70 font-light">Pending</p>
              <p className="text-2xl text-blue-300 font-light">
                {loading ? "..." : safeInterventions.filter(i => i.status === 'ready' || i.status === 'planned').length}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-blue-300/60 font-light">
            Awaiting review and approval
          </p>
        </div>
      </div>

      {/* Main Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendationCards />

        {/* Impact Summary */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg text-white font-light mb-1">
                Potential Impact
              </h3>
              <p className="text-xs text-white/40 font-light">
                If all recommendations applied
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-[#E8DCCF]" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Total Reduction */}
            <div className="text-center py-6 bg-gradient-to-br from-[#E8DCCF]/10 to-[#D4C5B3]/10 backdrop-blur-sm border border-[#E8DCCF]/30 rounded-xl">
              <p className="text-sm text-white/60 mb-2 font-light">
                Total Carbon Reduction
              </p>
              <p className="text-5xl text-[#E8DCCF] font-light mb-2">62.5%</p>
              <p className="text-xs text-white/40 font-light">
                ~9,638 kg CO₂ per hour
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70 font-light">Solar Energy</span>
                <span className="text-sm text-[#E8DCCF] font-light">18.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70 font-light">
                  Traffic Optimization
                </span>
                <span className="text-sm text-[#E8DCCF] font-light">14.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70 font-light">
                  Building Efficiency
                </span>
                <span className="text-sm text-[#E8DCCF] font-light">12.8%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70 font-light">
                  EV Infrastructure
                </span>
                <span className="text-sm text-[#E8DCCF] font-light">10.3%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white/70 font-light">Green Corridors</span>
                <span className="text-sm text-[#E8DCCF] font-light">6.7%</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2 font-light">
                Estimated Implementation Timeline
              </p>
              <p className="text-sm text-white font-light">6-12 months</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
