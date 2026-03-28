import { useState } from "react";
import { motion } from "motion/react";
import { Settings, Bell, Shield, Database, Palette, Globe, User, LogOut, Key } from "lucide-react";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

export function SettingsPage() {
  const { isAuthenticated, login, logout, isLoading, error } = useAuth();
  
  // Settings State
  const [notifications, setNotifications] = useState({
    alerts: true,
    reports: true,
    modelUpdates: false
  });
  
  const [privacy, setPrivacy] = useState({
    analytics: true,
    export: true,
    integrations: false
  });
  
  const [modelConfig, setModelConfig] = useState({
    confidence: 94,
    refreshRate: "Real-time",
    range: "Last 30 days"
  });

  const [appearance, setAppearance] = useState({
    theme: "Dark",
    compact: false,
    animations: true
  });

  const [regional, setRegional] = useState({
    language: "English",
    timezone: "IST (UTC +5:30)",
    units: "Metric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl text-white font-light mb-1 border-b border-white/5 pb-2 inline-block pr-8 uppercase tracking-widest text-[14px]">Intelligence Node Configuration</h2>
        <p className="text-xs text-white/40 font-light mt-1 uppercase tracking-tighter">
          Master Metropolitan Governance Parameters
        </p>
      </div>

      {/* User Account Section */}
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/5 flex items-center justify-center border border-white/5">
            <User className="w-5 h-5 text-[#E8DCCF]/60" />
          </div>
          <div>
            <h3 className="text-sm text-white/80 uppercase tracking-widest font-light">Operator Credentials</h3>
            <p className="text-[10px] text-white/30 font-light uppercase tracking-tighter">
              {isAuthenticated ? "Node Access: Authorized" : "Node Access: Mandatory Authentication Required"}
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8DCCF]/5 flex items-center justify-center border border-white/10 shadow-[inner_0_2px_4px_rgba(0,0,0,0.3)]">
                <span className="text-[#E8DCCF]/80 text-sm font-light tracking-widest uppercase">OP</span>
              </div>
              <div>
                <p className="text-xs text-white font-light tracking-wide">METROPOLITAN OPERATOR</p>
                <p className="text-[10px] text-[#E8DCCF]/40 font-light font-mono italic">operator.node.01@suci.gov</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="border-red-500/10 text-red-500/60 bg-red-500/[0.02] text-[10px] uppercase tracking-widest h-8 px-4"
            >
              Terminate Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 uppercase tracking-tight">
                Critical Failure: {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/20 font-light block uppercase tracking-tighter ml-1">Universal Identifier</label>
                <input 
                  type="email" 
                  placeholder="METRO_ID"
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/60 focus:outline-none focus:border-[#E8DCCF]/20 transition-all font-mono"
                  defaultValue="operator@city.gov"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/20 font-light block uppercase tracking-tighter ml-1">Access Protocol</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="SECURE_PHRASE"
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/60 focus:outline-none focus:border-[#E8DCCF]/20 transition-all"
                    defaultValue="password"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/10" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => login("operator@city.gov", "password")}
                disabled={isLoading}
                className="bg-[#E8DCCF]/80 text-[#0B0B0B] text-[10px] uppercase tracking-widest h-10 px-10 border-none rounded-xl"
              >
                {isLoading ? "Synchronizing..." : "Initiate Link"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5">
              <Bell className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <h3 className="text-sm text-white/80 uppercase tracking-widest font-light">Tactical Alerts</h3>
              <p className="text-[10px] text-white/30 font-light uppercase tracking-tighter">
                System Signal Management
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { id: 'alerts', label: 'Critical Carbon Drift', desc: 'Alert upon safety threshold breach' },
              { id: 'reports', label: 'Metropolitan Pulse', desc: 'Daily intelligence summaries' },
              { id: 'modelUpdates', label: 'Quantum Sync', desc: 'ML model optimization logs' }
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div>
                  <p className="text-xs text-white/70 font-light tracking-wide mb-0.5">{item.label}</p>
                  <p className="text-[10px] text-white/20 font-light tracking-tight">{item.desc}</p>
                </div>
                <Switch 
                  checked={(notifications as any)[item.id]} 
                  onCheckedChange={(val) => setNotifications({...notifications, [item.id]: val})}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5">
              <Shield className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <h3 className="text-sm text-white/80 uppercase tracking-widest font-light">Intelligence Integrity</h3>
              <p className="text-[10px] text-white/30 font-light uppercase tracking-tighter">
                Node Privacy Configuration
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { id: 'analytics', label: 'Learning Engine Participation', desc: 'Contribute to global climate forecasts' },
              { id: 'export', label: 'Tactical Data Extraction', desc: 'Enable secondary node synchronization' },
              { id: 'integrations', label: 'External Proxy link', desc: 'Authorize third-party sensor mesh' }
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div>
                  <p className="text-xs text-white/70 font-light tracking-wide mb-0.5">{item.label}</p>
                  <p className="text-[10px] text-white/20 font-light tracking-tight">{item.desc}</p>
                </div>
                <Switch 
                  checked={(privacy as any)[item.id]} 
                  onCheckedChange={(val) => setPrivacy({...privacy, [item.id]: val})}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Model Settings */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5">
              <Database className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <h3 className="text-sm text-white/80 uppercase tracking-widest font-light">ML Logic Layer</h3>
              <p className="text-[10px] text-white/30 font-light uppercase tracking-tighter">
                Predictive Engine Parameters
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <label className="text-[10px] text-white/40 font-light mb-4 block uppercase tracking-widest">
                Forecast Confidence Tolerance: {modelConfig.confidence}%
              </label>
              <input
                type="range"
                min="80"
                max="99"
                value={modelConfig.confidence}
                onChange={(e) => setModelConfig({...modelConfig, confidence: parseInt(e.target.value)})}
                className="w-full accent-[#E8DCCF]/40 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <label className="text-[10px] text-white/40 font-light mb-2 block uppercase tracking-widest">
                Sensor Feedback loop
              </label>
              <select 
                value={modelConfig.refreshRate}
                onChange={(e) => setModelConfig({...modelConfig, refreshRate: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 font-light focus:outline-none focus:border-[#E8DCCF]/30 uppercase tracking-tighter"
              >
                <option>Real-time</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Hourly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5">
              <Palette className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <h3 className="text-sm text-white/80 uppercase tracking-widest font-light">Visual Interface</h3>
              <p className="text-[10px] text-white/30 font-light uppercase tracking-tighter">
                Node Aesthetic Protocol
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <label className="text-[10px] text-white/40 font-light mb-3 block uppercase tracking-widest">
                Terminal Chroma Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Dark', 'Light', 'Auto'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setAppearance({...appearance, theme: t})}
                    className={`px-3 py-2 border rounded-lg text-[10px] uppercase tracking-widest transition-all ${appearance.theme === t ? 'bg-[#E8DCCF]/10 border-[#E8DCCF]/30 text-[#E8DCCF]' : 'bg-transparent border-white/5 text-white/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div>
                <p className="text-xs text-white/70 font-light tracking-wide mb-0.5">Tactical Concentration</p>
                <p className="text-[10px] text-white/20 font-light tracking-tight">Reduce node visual footprint</p>
              </div>
              <Switch 
                checked={appearance.compact} 
                onCheckedChange={(val) => setAppearance({...appearance, compact: val})}
              />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5">
              <Globe className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <h3 className="text-sm text-white/80 uppercase tracking-widest font-light">Metropolitan Localization</h3>
              <p className="text-[10px] text-white/30 font-light uppercase tracking-tighter">
                Regional Deployment Settings
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <label className="text-[10px] text-white/40 font-light mb-2 block uppercase tracking-widest tracking-tighter">Communication protocol</label>
              <select 
                value={regional.language}
                onChange={(e) => setRegional({...regional, language: e.target.value})}
                className="w-full bg-transparent border-none p-0 text-xs text-white/60 font-light focus:outline-none uppercase tracking-widest"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <label className="text-[10px] text-white/40 font-light mb-2 block uppercase tracking-widest tracking-tighter">Temporal synchronization</label>
              <select 
                value={regional.timezone}
                onChange={(e) => setRegional({...regional, timezone: e.target.value})}
                className="w-full bg-transparent border-none p-0 text-xs text-white/60 font-light focus:outline-none uppercase tracking-widest"
              >
                <option>IST (UTC +5:30)</option>
                <option>UTC</option>
                <option>PST</option>
                <option>EST</option>
              </select>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <label className="text-[10px] text-white/40 font-light mb-2 block uppercase tracking-widest tracking-tighter">Sensor Unit Metric</label>
              <select 
                value={regional.units}
                onChange={(e) => setRegional({...regional, units: e.target.value})}
                className="w-full bg-transparent border-none p-0 text-xs text-white/60 font-light focus:outline-none uppercase tracking-widest"
              >
                <option>Metric</option>
                <option>Imperial</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
