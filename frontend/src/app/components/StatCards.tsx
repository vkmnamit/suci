import { Cloud, Zap, MapPin, Sun } from "lucide-react";
import { motion } from "motion/react";

interface StatCardsProps {
  totalCarbon: number;
  energyUsage: number;
  activeZones: number;
  solarPercentage: number;
}

export function StatCards({
  totalCarbon,
  energyUsage,
  activeZones,
  solarPercentage,
}: StatCardsProps) {
  const stats = [
    {
      label: "Total Carbon Emission",
      value: totalCarbon.toLocaleString(),
      unit: "kg/h",
      icon: Cloud,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Energy Usage",
      value: energyUsage.toLocaleString(),
      unit: "kWh",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Active Zones",
      value: activeZones,
      unit: "zones",
      icon: MapPin,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Renewable Energy",
      value: solarPercentage,
      unit: "%",
      icon: Sun,
      color: "text-[#E8DCCF]",
      bgColor: "bg-[#E8DCCF]/10",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-xs text-white/50 font-light mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl text-white font-light">{stat.value}</p>
                <span className="text-sm text-white/40 font-light">
                  {stat.unit}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
