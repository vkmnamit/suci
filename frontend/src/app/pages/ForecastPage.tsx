import { AnalyticsPanel } from "../components/AnalyticsPanel";
import { carbonTrendData } from "../data/mockData";
import { motion } from "motion/react";
import { TrendingUp, Calendar, Activity } from "lucide-react";
import { useCityForecast } from "../hooks/useForecastData";
import type { City } from "../data/mockData";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ForecastPageProps {
  currentCity: City;
}

export function ForecastPage({ currentCity }: ForecastPageProps) {
  const { forecast, loading, error, isFromApi } = useCityForecast();
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
          <h2 className="text-2xl text-white font-light mb-1">AI Forecast & Analytics</h2>
          <p className="text-sm text-white/50 font-light">
            Predictive analysis and carbon trends
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
          <Activity className="w-4 h-4 text-[#E8DCCF]" />
          <span className="text-sm text-white font-light">Live Data</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Large Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Extended Forecast Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg text-white font-light mb-1">
                  24-Hour Energy & Carbon Forecast
                </h3>
                <p className="text-xs text-white/40 font-light">
                  AI-powered prediction model
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#E8DCCF]" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8DCCF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E8DCCF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B8A393" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#B8A393" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.05} />
                <XAxis
                  dataKey="time"
                  stroke="#FFFFFF"
                  opacity={0.4}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#FFFFFF"
                  opacity={0.4}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0B0B",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "#E8DCCF" }}
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="#E8DCCF"
                  strokeWidth={2}
                  fill="url(#colorEnergy)"
                  name="Energy (kWh)"
                />
                <Area
                  type="monotone"
                  dataKey="carbon"
                  stroke="#B8A393"
                  strokeWidth={2}
                  fill="url(#colorCarbon)"
                  name="Carbon (kg)"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#4ADE80"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorPredicted)"
                  name="AI Predicted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg text-white font-light mb-1">
                  Monthly Carbon Trend
                </h3>
                <p className="text-xs text-white/40 font-light">
                  Historical data vs target goals
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#E8DCCF]" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={carbonTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.05} />
                <XAxis
                  dataKey="month"
                  stroke="#FFFFFF"
                  opacity={0.4}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#FFFFFF"
                  opacity={0.4}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0B0B",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "#E8DCCF" }}
                />
                <Line
                  type="monotone"
                  dataKey="carbon"
                  stroke="#B8A393"
                  strokeWidth={3}
                  dot={{ fill: "#B8A393", r: 4 }}
                  name="Actual Emission"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#E8DCCF"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ fill: "#E8DCCF", r: 3 }}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-white/40 mb-2 font-light">Prediction Accuracy</p>
              <p className="text-3xl text-white font-light mb-1">94.8%</p>
              <p className="text-[10px] text-green-400 font-light">↑ 2.3% vs last month</p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-white/40 mb-2 font-light">Avg Daily Carbon</p>
              <p className="text-3xl text-white font-light mb-1">15.4k</p>
              <p className="text-[10px] text-red-400 font-light">↓ 5.2% reduction needed</p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-white/40 mb-2 font-light">Model Confidence</p>
              <p className="text-3xl text-white font-light mb-1">96.2%</p>
              <p className="text-[10px] text-green-400 font-light">High confidence</p>
            </div>
          </div>

          {/* AI Strategic Synthesis / Conclusions */}
          <div className="bg-[#E8DCCF]/5 backdrop-blur-2xl border border-[#E8DCCF]/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8DCCF]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#E8DCCF] animate-pulse" />
                <h3 className="text-[#E8DCCF] text-xs uppercase tracking-[0.3em] font-medium">Metropolitan Strategy Conclusion</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-white text-lg font-light mb-3">Predictive Summary</h4>
                  <p className="text-white/60 text-sm font-light leading-relaxed">
                    Based on current trajectory, the Bangalore Hub is projected to exceed its sectoral carbon budget by <span className="text-[#E8DCCF] font-medium">12.4%</span> in the next 72 hours. AI model <span className="italic text-white/80">SUCI-9v2</span> confirms that current mitigation protocols are insufficient to counteract the peak industrial flux.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] text-[#E8DCCF] uppercase tracking-widest font-medium opacity-50">Critical Interventions</p>
                    <ul className="space-y-4">
                      {[
                        "Shift localized grid phases by 1.4µs to eliminate reactive flux.",
                        "Enforce $10^{-4}m$ road centerline realignments in Zone A.",
                        "Recalibrate industrial exhaust vent angles by 0.002°."
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-white/70 text-xs font-light">
                          <span className="text-[#E8DCCF] opacity-50">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] text-[#E8DCCF] uppercase tracking-widest font-medium opacity-50">Predicted Reduction Impact</p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-2xl text-white font-light">28.5%</span>
                        <span className="text-[10px] text-green-400 mb-1">Potential</span>
                      </div>
                      <p className="text-[10px] text-white/30 font-light">If all micro-tactics are deployed within 6 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Analytics Panel */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <AnalyticsPanel />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
