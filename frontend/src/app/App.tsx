import { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { ZonesPage } from "./pages/ZonesPage";
import { ForecastPage } from "./pages/ForecastPage";
import { ScenariosPage } from "./pages/ScenariosPage";
import { InterventionsPage } from "./pages/InterventionsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { AiAssistant } from "./components/AiAssistant";
import { useCityZones } from "./hooks/useCityData";

export default function App() {
  const [selectedCity, setSelectedCity] = useState("bangalore");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Fetch live data from backend
  const { currentCity, loading, error, isFromApi, refetch } = useCityZones(selectedCity);

  // Calculate total energy usage
  const totalEnergy = useMemo(() => {
    return currentCity.zones.reduce(
      (sum, zone) => sum + zone.energyUsage,
      0
    );
  }, [currentCity]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Render active page content
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard currentCity={currentCity} totalEnergy={totalEnergy} />;
      case "zones":
        return <ZonesPage currentCity={currentCity} />;
      case "forecast":
        return <ForecastPage currentCity={currentCity} />;
      case "scenarios":
        return <ScenariosPage currentCity={currentCity} />;
      case "interventions":
        return <InterventionsPage selectedCity={selectedCity} />;
      case "reports":
        return <ReportsPage selectedCity={selectedCity} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard currentCity={currentCity} totalEnergy={totalEnergy} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        onMenuClick={toggleMobileSidebar}
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />

      {/* Main Content - Adjusted for sidebar */}
      <div className={`pt-16 transition-all duration-300 ${isSidebarExpanded ? 'lg:pl-[240px]' : 'lg:pl-[80px]'}`}>
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          {/* API Connection Indicator */}
          <ConnectionStatus 
            isFromApi={isFromApi} 
            error={error} 
            onRetry={refetch} 
          />

          <AnimatePresence mode="wait">
            <div key={activeTab}>{renderContent()}</div>
          </AnimatePresence>
        </div>
      </div>

      {/* AI Assistant */}
      <AiAssistant />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(232, 220, 207, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(232, 220, 207, 0.5);
        }
      `}</style>
    </div>
  );
}
