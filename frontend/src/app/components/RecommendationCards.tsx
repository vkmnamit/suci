import { Sparkles, TrendingUp, Zap, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { useInterventions } from "../hooks/useInterventionData";

export function RecommendationCards() {
  const { data: interventions, loading } = useInterventions();
  const recommendations = interventions || [];

  const getPriorityColor = (impact: string) => {
    if (impact === "High") return "from-[#E8DCCF]/20 to-[#D4C5B3]/20 border-[#E8DCCF]/40";
    if (impact === "Medium") return "from-[#E8DCCF]/15 to-[#D4C5B3]/15 border-[#E8DCCF]/30";
    return "from-white/5 to-white/10 border-white/20";
  };

  const getPriorityBadge = (impact: string) => {
    if (impact === "High") return "High Impact";
    if (impact === "Medium") return "Medium Impact";
    return "Low Impact";
  };

  const getPriorityLevel = (impact: string) => {
    if (impact === "High") return 1;
    if (impact === "Medium") return 2;
    return 3;
  };

  const getIcon = (id: string) => {
    if (id.includes("int-1")) return Sun;
    if (id.includes("int-2")) return Zap;
    if (id.includes("int-3")) return Leaf;
    return TrendingUp;
  };

  // Helper to extract number from "12.5%" string
  const parseImpact = (val: string) => {
    return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg text-white font-light mb-1">
            AI Recommendations
          </h3>
          <p className="text-xs text-white/40 font-light">
            Ranked by carbon reduction impact
          </p>
        </div>
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent("suci-open-chat", { 
              detail: { message: "Analyze the current city recommendations and provide a tactical implementation strategy." } 
            }));
          }}
          className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 hover:bg-[#E8DCCF]/20 flex items-center justify-center transition-all active:scale-95 group"
        >
          <Sparkles className="w-5 h-5 text-[#E8DCCF] group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="text-center py-10 text-white/40 font-light italic">Analyzing city patterns...</div>
        )}
        {!loading && recommendations.map((rec, index) => {
          const Icon = getIcon(rec.id);
          const impactPercent = parseImpact(rec.co2_reduction);
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`bg-gradient-to-br ${getPriorityColor(
                rec.impact
              )} backdrop-blur-sm border rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#E8DCCF]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8DCCF]/30 transition-colors">
                  <Icon className="w-5 h-5 text-[#E8DCCF]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm text-white font-light leading-tight">
                      {rec.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-light flex-shrink-0 ${
                        rec.impact === "High"
                          ? "bg-[#E8DCCF]/20 text-[#E8DCCF]"
                          : rec.impact === "Medium"
                          ? "bg-white/10 text-white/80"
                          : "bg-white/5 text-white/60"
                      }`}
                    >
                      {getPriorityBadge(rec.impact)}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 font-light leading-relaxed mb-3">
                    {rec.description}
                  </p>

                  {/* Impact Metric */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${impactPercent * 4}%` }} // Multiplying for visual effect as % are small
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-[#E8DCCF] to-[#B8A393]"
                      ></motion.div>
                    </div>
                    <span className="text-xs text-[#E8DCCF] font-light flex-shrink-0">
                      -{rec.co2_reduction}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/60 font-light">
              Total Potential Reduction
            </p>
            <p className="text-[10px] text-white/40 font-light mt-0.5">
              If all recommendations applied
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl text-[#E8DCCF] font-light">62.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
