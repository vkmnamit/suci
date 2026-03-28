import { motion } from "motion/react";
import { Settings, Bell, Shield, Database, Palette, Globe, User, LogOut, Key } from "lucide-react";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

export function SettingsPage() {
  const { isAuthenticated, login, logout, isLoading, error } = useAuth();

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
        <h2 className="text-2xl text-white font-light mb-1">Settings</h2>
        <p className="text-sm text-white/50 font-light">
          Configure dashboard preferences and system settings
        </p>
      </div>

      {/* User Account Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#E8DCCF]" />
          </div>
          <div>
            <h3 className="text-lg text-white font-light">User Account</h3>
            <p className="text-xs text-white/40 font-light">
              {isAuthenticated ? "Manage your SUCI operator account" : "Sign in to your account"}
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center justify-between p-4 bg-white/5 border border-[#E8DCCF]/20 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8DCCF]/20 flex items-center justify-center border border-[#E8DCCF]/40">
                <span className="text-[#E8DCCF] text-lg font-light">OP</span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">Operator</p>
                <p className="text-xs text-white/40 font-light">operator@city.gov</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-9"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-white/40 font-light block ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="operator@city.gov"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E8DCCF]/50"
                  defaultValue="operator@city.gov"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-white/40 font-light block ml-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E8DCCF]/50"
                    defaultValue="password"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => login("operator@city.gov", "password")}
                disabled={isLoading}
                className="bg-[#E8DCCF] text-[#0B0B0B] hover:bg-[#D4C5B3] h-10 px-8"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <Button 
                variant="outline"
                className="border-white/10 text-white/60 hover:bg-white/5 h-10"
              >
                Create Account
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
            <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#E8DCCF]" />
            </div>
            <div>
              <h3 className="text-lg text-white font-light">Notifications</h3>
              <p className="text-xs text-white/40 font-light">
                Manage alert preferences
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">
                  High Carbon Alerts
                </p>
                <p className="text-xs text-white/40 font-light">
                  Get notified when zones exceed threshold
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">Daily Reports</p>
                <p className="text-xs text-white/40 font-light">
                  Receive daily summary emails
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">
                  Model Updates
                </p>
                <p className="text-xs text-white/40 font-light">
                  AI model performance notifications
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#E8DCCF]" />
            </div>
            <div>
              <h3 className="text-lg text-white font-light">Data & Privacy</h3>
              <p className="text-xs text-white/40 font-light">
                Control data usage and privacy
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">
                  Anonymous Analytics
                </p>
                <p className="text-xs text-white/40 font-light">
                  Help improve predictions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">Data Export</p>
                <p className="text-xs text-white/40 font-light">
                  Allow automatic data exports
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">
                  Third-party Integrations
                </p>
                <p className="text-xs text-white/40 font-light">
                  Connect with external services
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* AI Model Settings */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#E8DCCF]" />
            </div>
            <div>
              <h3 className="text-lg text-white font-light">AI Model</h3>
              <p className="text-xs text-white/40 font-light">
                Configure prediction settings
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <label className="text-sm text-white font-light mb-2 block">
                Prediction Confidence Threshold
              </label>
              <input
                type="range"
                min="80"
                max="99"
                defaultValue="94"
                className="w-full"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-white/40 font-light">80%</span>
                <span className="text-xs text-[#E8DCCF] font-light">94%</span>
                <span className="text-xs text-white/40 font-light">99%</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <label className="text-sm text-white font-light mb-2 block">
                Data Refresh Rate
              </label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light focus:outline-none focus:ring-2 focus:ring-[#E8DCCF]/50">
                <option>Real-time</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Hourly</option>
              </select>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <label className="text-sm text-white font-light mb-2 block">
                Historical Data Range
              </label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light focus:outline-none focus:ring-2 focus:ring-[#E8DCCF]/50">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#E8DCCF]" />
            </div>
            <div>
              <h3 className="text-lg text-white font-light">Appearance</h3>
              <p className="text-xs text-white/40 font-light">
                Customize dashboard look
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <label className="text-sm text-white font-light mb-2 block">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button className="px-3 py-2 bg-[#E8DCCF]/20 border border-[#E8DCCF]/40 rounded-lg text-xs text-[#E8DCCF] font-light">
                  Dark
                </button>
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 font-light hover:bg-white/10">
                  Light
                </button>
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 font-light hover:bg-white/10">
                  Auto
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">
                  Compact Mode
                </p>
                <p className="text-xs text-white/40 font-light">
                  Reduce spacing and padding
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white font-light mb-1">Animations</p>
                <p className="text-xs text-white/40 font-light">
                  Enable smooth transitions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#E8DCCF]" />
            </div>
            <div>
              <h3 className="text-lg text-white font-light">Regional Settings</h3>
              <p className="text-xs text-white/40 font-light">
                Language and location preferences
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <label className="text-sm text-white font-light mb-2 block">
                Language
              </label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light focus:outline-none focus:ring-2 focus:ring-[#E8DCCF]/50">
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <label className="text-sm text-white font-light mb-2 block">
                Timezone
              </label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light focus:outline-none focus:ring-2 focus:ring-[#E8DCCF]/50">
                <option>IST (UTC +5:30)</option>
                <option>UTC</option>
                <option>PST</option>
                <option>EST</option>
              </select>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <label className="text-sm text-white font-light mb-2 block">
                Units
              </label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light focus:outline-none focus:ring-2 focus:ring-[#E8DCCF]/50">
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
