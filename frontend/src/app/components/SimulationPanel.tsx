import { useState } from "react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Play, RotateCcw, TrendingDown, Sun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SimulationPanelProps {
  currentCarbon: number;
}

export function SimulationPanel({ currentCarbon }: SimulationPanelProps) {
  const [traffic, setTraffic] = useState([70]);
  const [energy, setEnergy] = useState([65]);
  const [solar, setSolar] = useState([32]);
  const [showResults, setShowResults] = useState(false);
  const [simulatedCarbon, setSimulatedCarbon] = useState(0);

  const runSimulation = () => {
    // Simple calculation for carbon reduction
    const trafficImpact = (100 - traffic[0]) * 0.15;
    const energyImpact = (100 - energy[0]) * 0.12;
    const solarImpact = solar[0] * 0.18;
    
    const totalReduction = trafficImpact + energyImpact + solarImpact;
    const newCarbon = Math.max(currentCarbon * (1 - totalReduction / 100), currentCarbon * 0.3);
    
    setSimulatedCarbon(Math.round(newCarbon));
    setShowResults(true);
  };

  const resetSimulation = () => {
    setTraffic([70]);
    setEnergy([65]);
    setSolar([32]);
    setShowResults(false);
  };

  const reduction = showResults
    ? Math.round(((currentCarbon - simulatedCarbon) / currentCarbon) * 100)
    : 0;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg text-white font-light mb-1">
            Scenario Simulation
          </h3>
          <p className="text-xs text-white/40 font-light">
            Adjust parameters to predict impact
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
          <Play className="w-5 h-5 text-[#E8DCCF]" />
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-6 mb-6">
        {/* Traffic Control */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-white/80 font-light">
              Traffic Level
            </label>
            <span className="text-sm text-[#E8DCCF] font-light">
              {traffic[0]}%
            </span>
          </div>
          <Slider
            value={traffic}
            onValueChange={setTraffic}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-[10px] text-white/40 mt-2 font-light">
            Lower traffic = reduced emissions
          </p>
        </div>

        {/* Energy Usage */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-white/80 font-light">
              Energy Consumption
            </label>
            <span className="text-sm text-[#E8DCCF] font-light">
              {energy[0]}%
            </span>
          </div>
          <Slider
            value={energy}
            onValueChange={setEnergy}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-[10px] text-white/40 mt-2 font-light">
            Reduce consumption through efficiency
          </p>
        </div>

        {/* Solar/Renewable */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-white/80 font-light flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-[#E8DCCF]" />
              Solar Energy
            </label>
            <span className="text-sm text-[#E8DCCF] font-light">
              {solar[0]}%
            </span>
          </div>
          <Slider
            value={solar}
            onValueChange={setSolar}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-[10px] text-white/40 mt-2 font-light">
            Increase renewable energy capacity
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button
          onClick={runSimulation}
          className="flex-1 bg-[#E8DCCF] hover:bg-[#D4C5B3] text-[#0B0B0B] font-light transition-all duration-300"
        >
          <Play className="w-4 h-4 mr-2" />
          Run Simulation
        </Button>
        <Button
          onClick={resetSimulation}
          variant="outline"
          className="border-white/20 hover:bg-white/5 text-white font-light"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div>
              <p className="text-xs text-white/60 mb-3 font-light">
                Simulation Results
              </p>

              {/* Comparison Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Before */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-[10px] text-white/40 mb-1 font-light">
                    Current
                  </p>
                  <p className="text-2xl text-white font-light mb-1">
                    {currentCarbon.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/40 font-light">
                    kg CO₂/hour
                  </p>
                </div>

                {/* After */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-[10px] text-green-300/70 mb-1 font-light">
                    Projected
                  </p>
                  <p className="text-2xl text-green-300 font-light mb-1">
                    {simulatedCarbon.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-green-300/70 font-light">
                    kg CO₂/hour
                  </p>
                </div>
              </div>

              {/* Impact Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 bg-gradient-to-r from-[#E8DCCF]/10 to-[#E8DCCF]/5 border border-[#E8DCCF]/30 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60 font-light">
                        Carbon Reduction
                      </p>
                      <p className="text-[10px] text-white/40 font-light">
                        {(currentCarbon - simulatedCarbon).toLocaleString()} kg CO₂
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-green-400 font-light">
                      {reduction}%
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
