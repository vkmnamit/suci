import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  Sliders,
  Lightbulb,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "zones", label: "Zones / Map", icon: Map },
  { id: "forecast", label: "Forecast", icon: TrendingUp },
  { id: "scenarios", label: "Scenarios", icon: Sliders },
  { id: "interventions", label: "Interventions", icon: Lightbulb },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  isMobileOpen, 
  onMobileClose,
  isExpanded,
  onToggle
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMenuClick = (tabId: string) => {
    onTabChange(tabId);
    if (isMobile) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <>
      {/* Toggle Button - Desktop Only */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#E8DCCF] hover:bg-[#D4C5B3] flex items-center justify-center transition-all duration-300 shadow-lg z-50 hover:scale-110"
        >
          {isExpanded ? (
            <ChevronLeft className="w-3.5 h-3.5 text-[#0B0B0B]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#0B0B0B]" />
          )}
        </button>
      )}

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? "bg-[#E8DCCF]/20 border border-[#E8DCCF]/40 text-[#E8DCCF] shadow-lg shadow-[#E8DCCF]/10"
                  : "hover:bg-white/5 text-white/60 hover:text-white/90 border border-transparent"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#E8DCCF] rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#E8DCCF]/0 via-[#E8DCCF]/5 to-[#E8DCCF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <Icon className={`w-5 h-5 flex-shrink-0 relative z-10 ${isActive ? "drop-shadow-[0_0_8px_rgba(232,220,207,0.5)]" : ""}`} />
              
              {(isExpanded || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-light whitespace-nowrap relative z-10"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Indicator */}
      {(isExpanded || isMobile) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-4 border-t border-white/10"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-white/40 font-light">System Active</span>
          </div>
          <p className="text-[10px] text-white/30 font-light mt-1">
            Last updated: just now
          </p>
        </motion.div>
      )}
    </>
  );

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-16 bottom-0 bg-black/30 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col"
      >
        {sidebarContent}
      </motion.div>
    );
  }

  // Mobile Sidebar (Overlay)
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-16 bottom-0 w-72 bg-black/95 backdrop-blur-2xl border-r border-white/20 z-50 flex flex-col shadow-2xl"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
