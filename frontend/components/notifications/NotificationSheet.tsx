'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, ArrowRight, ShieldCheck, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertItem } from '@/types';

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AlertItem | null;
}

export const NotificationSheet: React.FC<NotificationSheetProps> = ({
  isOpen,
  onClose,
  alert
}) => {
  const router = useRouter();

  if (!alert) return null;

  const handleViewRoute = () => {
    onClose();
    router.push('/routes');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur & dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Floating Action Modal / Bottom Sheet */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ y: '100%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="pointer-events-auto w-full max-w-lg rounded-t-3xl sm:rounded-3xl glass-panel-elevated border border-rose-500/30 overflow-hidden shadow-2xl shadow-rose-950/40 p-6"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                      {alert.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      Detected 2 min ago • Sensor Feed
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Core Alert Content */}
              <div className="py-5 space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Congestion predicted ahead on your transit corridor.
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Mariamman festival crowd spillover and rain friction at Lakshmi Mills Junction is causing queue buildup.
                </p>

                {/* Metrics Highlight Card */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Your route adds</div>
                      <div className="text-lg font-bold text-rose-400">+{alert.delay_added_min} min</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Route B saves</div>
                      <div className="text-lg font-bold text-emerald-400">+{alert.time_saved_min} min</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded-xl p-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    Traffix AI recommendation: Switch to Trichy Road Link (Route B) before reaching Peelamedu.
                  </span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-sm font-semibold transition-colors border border-white/10"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleViewRoute}
                  className="flex-[2] py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:gap-3"
                >
                  <span>View Route</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
