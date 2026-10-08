'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Navigation, Clock, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw, MapPin
} from 'lucide-react';
import { GoogleTrafficMap } from '@/components/map/GoogleTrafficMap';

export default function TripMonitoringPage() {
  const router = useRouter();
  const [conditionsChanged, setConditionsChanged] = useState(false);
  const [activeRoute, setActiveRoute] = useState<'ROUTE_A' | 'ROUTE_B'>('ROUTE_A');
  const [etaMinutes, setEtaMinutes] = useState(36);

  const triggerAnomaly = () => {
    setConditionsChanged(true);
    setEtaMinutes(44);
  };

  const handleReroute = () => {
    setActiveRoute('ROUTE_B');
    setConditionsChanged(false);
    setEtaMinutes(34);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Active Navigation HUD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              ACTIVE JOURNEY · SCREEN 9
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 truncate">
              Going to Coimbatore Railway Station
            </h1>
            <div className="text-xs text-slate-500 font-medium">
              Via {activeRoute === 'ROUTE_B' ? 'Trichy Road Bypass (Route B) ✓ Recommended' : 'Avinashi Road Core (Route A)'}
            </div>
          </div>
        </div>

        {/* ETA Metrics */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">LIVE ETA</div>
            <div className="text-2xl font-black text-slate-900">
              {etaMinutes}<span className="text-sm font-medium text-slate-500 ml-1">min</span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase">AHEAD</div>
            <div className={`text-sm font-black ${conditionsChanged ? 'text-red-600' : 'text-emerald-600'}`}>
              {conditionsChanged ? 'Degraded' : 'Stable'}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Condition Alert */}
      <AnimatePresence>
        {conditionsChanged && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-red-50 border-2 border-red-400 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900">TRAFFIC CONDITIONS CHANGED</div>
                <div className="text-xs text-red-700 mt-0.5">
                  Mariamman chariot bottleneck formed at Lakshmi Mills.
                  Expected delay: <span className="font-black">+8 min</span>.
                </div>
              </div>
            </div>
            <button
              onClick={handleReroute}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all btn-hover"
            >
              <RefreshCw className="w-4 h-4" />
              Switch to Route B (−10 min)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Map + Turn-by-Turn */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Map */}
        <div className="lg:col-span-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${conditionsChanged ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
            NAVIGATION MAP — ROUTE {activeRoute.replace('ROUTE_', '')}
          </div>
          <GoogleTrafficMap
            mode="ROUTES"
            selectedRouteId={activeRoute}
            onSelectRoute={(id) => setActiveRoute(id as 'ROUTE_A' | 'ROUTE_B')}
            compact={false}
          />
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Next Maneuver */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NEXT MANEUVER (500m)</div>
            <div className="text-base font-black text-slate-900 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-sky-600 shrink-0" />
              <span>Continue along Avinashi Flyover</span>
            </div>
            <div className="text-xs text-slate-500">Speed: 38 km/h · Speed limit: 50 km/h</div>
          </div>

          {/* Route Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ROUTE PROGRESS</div>
            <div className="space-y-2">
              {[
                { label: 'KPR Institute', done: true },
                { label: 'Avinashi Flyover', done: true },
                { label: 'Hope College', done: false, active: true },
                { label: 'Lakshmi Mills ⚠', done: false, warn: true },
                { label: 'Cbe. Station', done: false },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    step.done ? 'border-emerald-500 bg-emerald-500' :
                    step.active ? 'border-sky-500 bg-sky-50' :
                    step.warn ? 'border-red-400 bg-red-50' :
                    'border-slate-300 bg-white'
                  }`}>
                    {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    {step.active && <div className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />}
                  </div>
                  <span className={`font-semibold ${
                    step.done ? 'text-slate-400 line-through' :
                    step.active ? 'text-sky-700' :
                    step.warn ? 'text-red-600' :
                    'text-slate-600'
                  }`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Trigger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wide">Demo Controls</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inject anomaly to test dynamic rerouting recommendation.
            </p>
            <button
              onClick={triggerAnomaly}
              disabled={conditionsChanged}
              className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all btn-hover ${
                conditionsChanged
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Simulate Congestion Shockwave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
