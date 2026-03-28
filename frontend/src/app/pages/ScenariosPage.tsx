import { SimulationPanel } from "../components/SimulationPanel";
import type { City } from "../data/mockData";
import { motion } from "motion/react";
import { Sliders, Zap, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { useScenarios } from "../hooks/useScenarioData";

interface ScenariosPageProps {
  currentCity: City;
}

export function ScenariosPage({ currentCity }: ScenariosPageProps) {
  const { data: scenarios, loading } = useScenarios();

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
          <h2 className="text-2xl text-white font-light mb-1">Scenario Simulations</h2>
          <p className="text-sm text-white/50 font-light">
            Model carbon impact with different interventions
          </p>
        </div>
        <Button className="bg-[#E8DCCF] hover:bg-[#D4C5B3] text-[#0B0B0B] font-light">
          <Save className="w-4 h-4 mr-2" />
          Save Scenario
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Simulation */}
        <SimulationPanel currentCarbon={currentCity.totalCarbon} />

        {/* Secondary Simulation */}
        <SimulationPanel currentCarbon={currentCity.totalCarbon} />
      </div>

      {/* Saved Scenarios */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg text-white font-light mb-1">Saved Scenarios</h3>
            <p className="text-xs text-white/40 font-light">
              Previously created simulations
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-[#E8DCCF]" />
          </div>
        </div>

        <div className="space-y-3">
          {loading && (
            <div className="text-center py-10 text-white/40 font-light">Loading scenarios...</div>
          )}
          {!loading && (scenarios || []).map((scenario, index) => (
            <motion.div
              key={scenario.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm text-white font-light mb-1">
                    {scenario.name}
                  </h4>
                  <p className="text-xs text-white/40 font-light">{scenario.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl text-green-400 font-light">
                    -{scenario.reduction}%
                  </p>
                  <p className="text-[10px] text-white/40 font-light">reduction</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <Zap className="w-3 h-3 text-[#E8DCCF]" />
                <p className="text-[10px] text-white/60 font-light">
                  {scenario.params}
                </p>
              </div>
            </motion.div>
          ))}
          {!loading && (!scenarios || scenarios.length === 0) && (
            <div className="text-center py-10 text-white/40 font-light">No saved scenarios found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
