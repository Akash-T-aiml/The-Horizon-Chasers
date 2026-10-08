'use client';

import React from 'react';
import { RouteOption } from '@/types';
import { ShieldCheck, AlertTriangle, Clock, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
  onHover?: (routeId: string) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
  onHover
}) => {
  const isRecommended = route.is_recommended;
  const isHighRisk = route.risk_level === 'HIGH';

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => onHover?.(route.id)}
      className={`relative p-5 sm:p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
        isSelected
          ? isRecommended
            ? 'glass-panel-elevated border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.22)] scale-[1.01]'
            : isHighRisk
            ? 'glass-panel-danger border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
            : 'glass-panel border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
          : 'glass-panel border-white/5 hover:border-white/20 hover:bg-slate-900/60'
      }`}
    >
      {/* Recommended Top Badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-cyan-500/25">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>RECOMMENDED ROUTE</span>
          <span className="bg-slate-950/20 px-1.5 py-0.2 rounded text-[9px]">SAVE 14 MIN</span>
        </div>
      )}

      {/* High Risk Alert Badge */}
      {isHighRisk && (
        <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-rose-950/40">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>HIGH CONGESTION RISK</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white font-mono">
              {route.name}
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({route.distance_km} km)
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{route.via}</span>
          </p>
        </div>

        {/* Travel Time & Prediction */}
        <div className="text-right shrink-0">
          <div className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isRecommended ? 'text-emerald-400' : isHighRisk ? 'text-rose-400' : 'text-amber-400'
          }`}>
            {route.predicted_time_min} <span className="text-sm font-normal text-slate-400">min</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {route.current_time_min}m base time
          </div>
        </div>
      </div>

      {/* Risk Assessment & Delay Factors */}
      <div className="my-4 pt-4 border-t border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Congestion Risk Level</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
            route.risk_level === 'LOW'
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
              : route.risk_level === 'HIGH'
              ? 'bg-rose-950/60 text-rose-400 border border-rose-500/20'
              : 'bg-amber-950/60 text-amber-400 border border-amber-500/20'
          }`}>
            {route.risk_level} ({route.risk_score}/100)
          </span>
        </div>

        {/* Delay factors list */}
        <div className="text-xs text-slate-300 space-y-1">
          {route.delay_factors.slice(0, 2).map((factor, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="truncate">{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1.5">
          {route.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] font-mono text-slate-300 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={`flex items-center gap-1 text-xs font-bold ${
          isSelected ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'
        }`}>
          <span>{isSelected ? 'Selected' : 'Select Route'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
