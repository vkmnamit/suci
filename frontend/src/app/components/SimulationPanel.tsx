import { useState } from "react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Play, RotateCcw, TrendingDown, Sun, FileText } from "lucide-react";
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
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiReasoning, setAiReasoning] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const runSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      const resp = await fetch(`http://localhost:8000/api/v1/scenarios/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traffic: traffic[0],
          energy: energy[0],
          solar: solar[0]
        }),
      });
      const data = await resp.json();
      
      const reductionVal = data.calculated_reduction || 0;
      // Ensure we have a base to calculate from
      const baseCarbon = currentCarbon > 0 ? currentCarbon : 1250;
      const newCarbon = baseCarbon * (1 - reductionVal / 100);
      
      setSimulatedCarbon(Math.round(newCarbon));
      setAiReasoning(data.reasoning || "");
      setSuggestions(data.suggestions || []);
      setShowResults(true);
    } catch (e) {
      console.error("Simulation failed:", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const resetSimulation = () => {
    setTraffic([70]);
    setEnergy([65]);
    setSolar([32]);
    setShowResults(false);
    setAiReasoning("");
    setSuggestions([]);
  };

  const reductionPercent = showResults
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
          disabled={isSimulating}
          className="flex-1 bg-[#E8DCCF] hover:bg-[#D4C5B3] text-[#0B0B0B] font-light transition-all duration-300 h-11 relative overflow-hidden group shadow-[0_0_20px_rgba(232,220,207,0.1)]"
        >
          {isSimulating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0B0B0B] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Thinking</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Initiate Simulation</span>
            </div>
          )}
          
          {/* Subtle scanline effect when thinking */}
          {isSimulating && (
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full skew-x-12"
            />
          )}
        </Button>
        <Button
          onClick={resetSimulation}
          variant="outline"
          disabled={isSimulating}
          className="border-white/10 hover:bg-white/5 text-white/40 h-11 w-11 p-0 transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-180" />
        </Button>
      </div>

      {/* Save & Report Actions (Visible after simulation) */}
      <AnimatePresence>
        {showResults && !isSimulating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-3 mb-6"
          >
            <Button
              onClick={async () => {
                const resp = await fetch(`http://localhost:8000/api/v1/scenarios/generate-report`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    traffic: traffic[0],
                    solar: solar[0],
                    energy: energy[0],
                    calculated_reduction: reductionPercent
                  }),
                });
                const data = await resp.json();
                alert(`Strategic Report Generated: ${data.filename}\n\nScenario ID: ${data.scenario_id}`);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-[#E8DCCF] border border-[#E8DCCF]/20 font-light h-10 text-[10px] uppercase tracking-widest"
            >
              <FileText className="w-3.5 h-3.5 mr-2" />
              Save & Generate Report
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

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

              {/* AI Reasoning */}
              {aiReasoning && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <p className="text-[11px] text-[#E8DCCF] mb-1 font-medium tracking-tight uppercase opacity-80">Tactical AI Insight</p>
                  <p className="text-xs text-white/70 font-light leading-relaxed italic">
                    {aiReasoning}
                  </p>
                </motion.div>
              )}

              {/* Tactical Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[11px] text-[#E8DCCF] mb-2 font-medium tracking-tight uppercase opacity-80 ml-1">AI Tactical Suggestions</p>
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-[#E8DCCF]/20 transition-all duration-300"
                    >
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#E8DCCF] shrink-0" />
                      <p className="text-xs text-white/70 font-light leading-snug">
                        {s}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

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
                      {reductionPercent}%
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
