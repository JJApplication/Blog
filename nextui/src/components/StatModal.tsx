import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { X, Activity, Eye, Clock, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";

interface StatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatModal({ isOpen, onClose }: StatModalProps) {
  const { stats, fetchStats } = useBlogStore();
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen, fetchStats]);

  useEffect(() => {
    const startDate = new Date("2017-09-30T00:00:00Z");
    
    const calculateUptime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      
      setUptime({ days, hours, minutes });
    };

    calculateUptime();
    const timer = setInterval(calculateUptime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed z-[1000] inset-0 flex items-center justify-center p-4 pointer-events-none backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0.5, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <GlassCard className="!p-8 relative border-blue-500/20 bg-black/80">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Site Statistics</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      <span className="text-white/70 font-medium">Total Views</span>
                    </div>
                    <span className="text-xl font-bold text-white">
                      {stats.views !== null ? stats.views.toLocaleString() : "..."}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-purple-400" />
                      <span className="text-white/70 font-medium">Goroutines</span>
                    </div>
                    <span className="text-xl font-bold text-white">
                      {stats.routines !== null ? stats.routines : "..."}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-white/70 font-medium">Uptime</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{uptime.days} Days</div>
                      <div className="text-xs text-white/50">{uptime.hours}h {uptime.minutes}m</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
