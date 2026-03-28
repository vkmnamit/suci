// ─── API Connection Status Indicator ─────────────────────────────────────────
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ConnectionStatusProps {
  isFromApi: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function ConnectionStatus({
  isFromApi,
  error,
  onRetry,
}: ConnectionStatusProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (error && !dismissed) {
      setShowBanner(true);
    } else if (isFromApi) {
      setShowBanner(false);
      setDismissed(false);
    }
  }, [error, isFromApi, dismissed]);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <div
            className={`rounded-xl border px-4 py-3 flex items-center justify-between ${
              isFromApi
                ? "bg-green-500/10 border-green-500/30"
                : "bg-amber-500/10 border-amber-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              {isFromApi ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-amber-400" />
              )}
              <div>
                <p
                  className={`text-xs font-light ${
                    isFromApi ? "text-green-300" : "text-amber-300"
                  }`}
                >
                  {isFromApi
                    ? "Connected to SUCI Backend"
                    : "Using Offline Data"}
                </p>
                {error && (
                  <p className="text-[10px] text-amber-300/60 font-light mt-0.5">
                    {error}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onRetry && !isFromApi && (
                <button
                  onClick={onRetry}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                </button>
              )}
              <button
                onClick={() => {
                  setShowBanner(false);
                  setDismissed(true);
                }}
                className="text-[10px] text-white/40 hover:text-white/60 font-light px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
