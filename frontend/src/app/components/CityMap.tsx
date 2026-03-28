import { useState } from "react";
import { Zone } from "../data/mockData";
import { motion } from "motion/react";

interface CityMapProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onZoneSelect: (zone: Zone) => void;
}

export function CityMap({ zones, selectedZone, onZoneSelect }: CityMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Calculate color based on carbon emission (heatmap) and operational status
  const getZoneColor = (emission: number, status?: string) => {
    if (status === "CRITICAL" || emission > 3500) return "#EF4444"; // Red - Critical
    if (status === "HIGH" || emission > 2500) return "#F59E0B"; // Yellow/Amber - Moderate
    return "#10B981"; // Green - Optimal
  };

  const getZoneOpacity = (zoneId: string) => {
    if (!hoveredZone && !selectedZone) return 0.85;
    if (selectedZone?.id === zoneId) return 1;
    if (hoveredZone === zoneId) return 0.95;
    return 0.6;
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-[#0B0B0B] via-[#151515] to-[#0B0B0B] rounded-2xl overflow-hidden">
      {/* Grid overlay for tech feel */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(#E8DCCF 1px, transparent 1px),
            linear-gradient(90deg, #E8DCCF 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* SVG Map with better viewBox for no overlap */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background subtle glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hover-glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render zones */}
        {zones.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          const isHovered = hoveredZone === zone.id;
          const isCritical = zone.status === "CRITICAL";
          
          const strokeColor = isCritical ? "#EF4444" : (isSelected || isHovered) ? "#E8DCCF" : "#FFFFFF";
          const strokeWidthVal = isCritical ? 4 : (isSelected ? 3 : 1.5);
          const strokeOpacityVal = isCritical ? 0.9 : (isSelected ? 0.8 : 0.3);
          const filterVal = isCritical || isSelected || isHovered ? "url(#hover-glow)" : "url(#glow)";
          const classNameVal = `cursor-pointer transition-all duration-300 ${isCritical ? "animate-pulse" : ""}`;
          
          const centerX = zone.path ? zone.coordinates.x : zone.coordinates.x + zone.coordinates.width / 2;
          const centerY = zone.path ? zone.coordinates.y : zone.coordinates.y + zone.coordinates.height / 2;

          return (
            <g key={zone.id}>
              {zone.path ? (
                <motion.path
                  d={zone.path}
                  fill={getZoneColor(zone.carbonEmission, zone.status)}
                  opacity={getZoneOpacity(zone.id)}
                  stroke={strokeColor}
                  strokeWidth={strokeWidthVal}
                  strokeOpacity={strokeOpacityVal}
                  filter={filterVal}
                  className={classNameVal}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onClick={() => onZoneSelect(zone)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                />
              ) : (
                <motion.rect
                  x={zone.coordinates.x}
                  y={zone.coordinates.y}
                  width={zone.coordinates.width}
                  height={zone.coordinates.height}
                  fill={getZoneColor(zone.carbonEmission, zone.status)}
                  opacity={getZoneOpacity(zone.id)}
                  stroke={strokeColor}
                  strokeWidth={strokeWidthVal}
                  strokeOpacity={strokeOpacityVal}
                  rx={8}
                  filter={filterVal}
                  className={classNameVal}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onClick={() => onZoneSelect(zone)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                />
              )}

              {/* Zone label */}
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-light pointer-events-none select-none"
                fill={zone.carbonEmission > 3500 ? "#FFFFFF" : "#0B0B0B"}
                opacity={0.9}
              >
                {zone.name.split(" ")[0]}
              </text>

              {/* Emission value */}
              <text
                x={centerX}
                y={centerY + 18}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-light pointer-events-none select-none"
                fill={zone.carbonEmission > 3500 ? "#E8DCCF" : "#0B0B0B"}
                opacity={0.7}
              >
                {zone.carbonEmission} kg
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <p className="text-xs text-[#E8DCCF] mb-3 font-light">
          Carbon Emission Scale
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded-sm bg-[#10B981]"></div>
            <span className="text-[10px] text-white/60">Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded-sm bg-[#F59E0B]"></div>
            <span className="text-[10px] text-white/60">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-3 rounded-sm bg-[#EF4444]"></div>
            <span className="text-[10px] text-white/60">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}