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
