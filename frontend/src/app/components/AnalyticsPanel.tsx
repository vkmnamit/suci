import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { carbonTrendData } from "../data/mockData";
import { TrendingUp, Brain } from "lucide-react";
import { useCityForecast } from "../hooks/useForecastData";
import { useAccuracyLogs } from "../hooks/useRlaifData";

export function AnalyticsPanel() {
  const { forecast } = useCityForecast();
  const { modelMetrics } = useAccuracyLogs();
  return (
    <div className="flex flex-col space-y-6 custom-scrollbar">
      {/* AI Forecast Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-white font-light mb-1">
              AI Forecast
            </h3>
            <p className="text-[10px] text-white/40 font-light">
              24h prediction
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#E8DCCF]" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={forecast}>
            <defs>
              <linearGradient
                id="colorEnergy"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#E8DCCF"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="#E8DCCF"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id="colorCarbon"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#B8A393"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="#B8A393"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#FFFFFF"
              opacity={0.05}
            />
            <XAxis
              dataKey="time"
              stroke="#FFFFFF"
              opacity={0.4}
              tick={{ fontSize: 9 }}
              tickLine={false}
            />
            <YAxis
              stroke="#FFFFFF"
              opacity={0.4}
              tick={{ fontSize: 9 }}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0B0B",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "10px",
              }}
              labelStyle={{ color: "#E8DCCF" }}
            />
            <Area
              type="monotone"
              dataKey="energy"
              stroke="#E8DCCF"
              strokeWidth={2}
              fill="url(#colorEnergy)"
              name="Energy"
            />
            <Area
              type="monotone"
              dataKey="carbon"
              stroke="#B8A393"
              strokeWidth={2}
              fill="url(#colorCarbon)"
              name="Carbon"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Carbon Trend */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-white font-light mb-1">
              Carbon Trend
            </h3>
            <p className="text-[10px] text-white/40 font-light">
              vs target
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#E8DCCF]/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#E8DCCF]" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={carbonTrendData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#FFFFFF"
              opacity={0.05}
            />
            <XAxis
              dataKey="month"
              stroke="#FFFFFF"
              opacity={0.4}
              tick={{ fontSize: 9 }}
              tickLine={false}
            />
            <YAxis
              stroke="#FFFFFF"
              opacity={0.4}
              tick={{ fontSize: 9 }}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0B0B",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "10px",
              }}
              labelStyle={{ color: "#E8DCCF" }}
            />
            <Line
              type="monotone"
              dataKey="carbon"
              stroke="#B8A393"
              strokeWidth={2}
              dot={{ fill: "#B8A393", r: 3 }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#E8DCCF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#E8DCCF", r: 2 }}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Performance */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="text-sm text-white font-light mb-1">
            Model Performance
          </h3>
          <p className="text-[10px] text-white/40 font-light">
            Accuracy metrics
          </p>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={modelMetrics} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#FFFFFF"
              opacity={0.05}
            />
            <XAxis
              type="number"
              stroke="#FFFFFF"
              opacity={0.4}
              tick={{ fontSize: 9 }}
              domain={[0, 100]}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="metric"
              stroke="#FFFFFF"
              opacity={0.4}
              tick={{ fontSize: 9 }}
              width={60}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0B0B",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "10px",
              }}
              labelStyle={{ color: "#E8DCCF" }}
            />
            <Bar
              dataKey="value"
              fill="#E8DCCF"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-white/40 mb-1 font-light">
            Avg Accuracy
          </p>
          <p className="text-2xl text-white font-light">
            {modelMetrics.find(m => m.metric === 'Accuracy')?.value || 94.8}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-white/40 mb-1 font-light">
            Data Points
          </p>
          <p className="text-2xl text-white font-light">2.4M</p>
        </div>
      </div>
    </div>
  );
}