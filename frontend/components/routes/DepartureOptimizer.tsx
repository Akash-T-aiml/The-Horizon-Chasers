'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { DepartureOptimizerResponse, DepartureSlot } from '@/types';

interface DepartureOptimizerProps {
  data: DepartureOptimizerResponse;
  selectedSlotOffset: number;
  onSelectSlot: (slot: DepartureSlot) => void;
}

export const DepartureOptimizer: React.FC<DepartureOptimizerProps> = ({
  data,
  selectedSlotOffset,
  onSelectSlot
}) => {
  const currentSlot = data.slots.find((s) => s.offset_minutes === selectedSlotOffset) || data.slots[0];

  return (
    <div className="rounded-3xl glass-panel-elevated border border-cyan-500/25 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30">
              AI DEPARTURE OPTIMIZER
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Real-time corridor delay modeling
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            When Should You Leave?
          </h3>
        </div>

        {/* Best Time Banner */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 shadow-lg shadow-emerald-950/30">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-300 font-bold">
              BEST TIME TO LEAVE
            </div>
            <div className="text-base font-black text-white flex items-center gap-2">
              <span>{data.recommended_departure} ({data.departure_time})</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Save {data.estimated_saving_min} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Time Horizon Bar / Scrubber */}
      <div className="py-6">
        <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between">
          <span>SELECT DEPARTURE WINDOW</span>
          <span className="text-cyan-400">Tap time to simulate route impact</span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {data.slots.map((slot) => {
            const isSelected = slot.offset_minutes === selectedSlotOffset;
            const isPeak = slot.travel_time_min >= 50;

            return (
              <button
                key={slot.offset_minutes}
                onClick={() => onSelectSlot(slot)}
                className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all text-center border ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/80 to-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-[1.03]'
                    : isPeak
                    ? 'bg-slate-900/40 border-rose-500/30 hover:border-rose-400/50'
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-800/50'
                }`}
              >
                {slot.is_best_time && (
                  <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                    OPTIMAL
                  </span>
                )}

                <div className="text-xs font-mono text-slate-400 font-bold">
                  {slot.departure_time_label}
                </div>
                <div className="text-[10px] text-slate-400">
                  {slot.clock_time}
                </div>

                {/* Time Display */}
                <div className={`my-2 text-base sm:text-xl font-black ${
                  slot.travel_time_min <= 38
                    ? 'text-emerald-400'
                    : isPeak
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}>
                  {slot.travel_time_min} <span className="text-xs font-normal text-slate-400">min</span>
                </div>

                {/* Risk Tag */}
                <div className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  slot.risk_level === 'LOW'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/20'
                    : slot.risk_level === 'HIGH'
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-500/20'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-500/20'
                }`}>
                  {slot.risk_level}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Slot Impact Feedback */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              Simulating departure at <span className="text-white font-bold">{currentSlot.clock_time}</span>:
            </div>
            <div className="text-sm text-slate-200 mt-0.5 leading-relaxed">
              {currentSlot.offset_minutes === 0
                ? 'Leaving NOW completely clears the Lakshmi Mills bottleneck before festival arrival onset.'
                : currentSlot.offset_minutes === 30
                ? 'Severe peak delay (+17 min added). Mariamman temple chariot crowd will choke the corridor.'
                : 'Delay buffer will accumulate by approximately 8-14 minutes on the primary corridor.'}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Expected Trip Time</div>
            <div className="text-lg font-black text-cyan-400">{currentSlot.travel_time_min} mins</div>
          </div>
        </div>
      </div>
    </div>
  );
};
