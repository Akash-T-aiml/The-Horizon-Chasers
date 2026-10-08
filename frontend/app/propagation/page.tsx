'use client';

import React, { useState } from 'react';
import { Activity, ZoomIn, ZoomOut, AlertTriangle, Filter, Clock, ArrowRight } from 'lucide-react';
import { GoogleTrafficMap } from '@/components/map/GoogleTrafficMap';

const PROPAGATION_TIMELINE = [
  { time: '5:30 PM', event: 'Mariamman procession blocks Avinashi Road near Lakshmi Mills', severity: 'INITIAL', icon: '🚧' },
  { time: '5:38 PM', event: 'Shockwave propagates 1.2 km east to Hope College junction', severity: 'SPREADING', icon: '🔴' },
  { time: '5:52 PM', event: 'Anna Salai and RS Puram signal overflow detected', severity: 'CASCADING', icon: '🔶' },
  { time: '6:12 PM', event: 'Ring road traffic increases 40% as drivers divert', severity: 'DIVERSION', icon: '🔃' },
  { time: '6:45 PM', event: 'Queue dissolving — recommend 6:30 PM departure shift', severity: 'RESOLVING', icon: '✅' },
];

export default function PropagationPage() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const severityColors: Record<string, string> = {
    INITIAL: 'bg-red-600 text-white',
    SPREADING: 'bg-red-600 text-white',
    CASCADING: 'bg-amber-500 text-white',
    DIVERSION: 'bg-amber-400 text-slate-900',
    RESOLVING: 'bg-emerald-600 text-white',
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">CONGESTION PROPAGATION · SCREEN 7</div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Shockwave Analysis
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Visualising how congestion nucleates and cascades across 8.4 km of corridor · KPR → Cbe. Station
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Timeline Panel */}
        <div className="xl:col-span-4 space-y-4">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            Propagation Timeline
          </h2>

          <div className="space-y-2">
            {PROPAGATION_TIMELINE.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all btn-hover ${
                  activeStep === idx
                    ? 'bg-red-50 border-red-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-red-200 hover:bg-red-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{step.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-black text-slate-700">{step.time}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${severityColors[step.severity]}`}>
                        {step.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{step.event}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Shockwave Speed', value: '4.8 km/h', sub: 'upstream' },
              { label: 'Cascade Radius', value: '3.2 km', sub: 'from origin' },
              { label: 'Affected Roads', value: '6 roads', sub: 'impacted' },
              { label: 'Delay Caused', value: '+28 min', sub: 'peak period' },
            ].map((m) => (
              <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{m.label}</div>
                <div className="text-lg font-black text-slate-900">{m.value}</div>
                <div className="text-[10px] text-slate-500">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Map showing propagation */}
        <div className="xl:col-span-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            PROPAGATION VISUALIZATION — {PROPAGATION_TIMELINE[activeStep]?.time}
          </div>
          <GoogleTrafficMap mode="PROPAGATION" compact={false} />

          {/* Propagation Key */}
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-black text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-sky-600" />
              NetworkX Cascade Model
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-slate-700">
              {[
                { color: 'bg-red-600', label: 'Primary congestion nucleus', pct: '100%' },
                { color: 'bg-amber-500', label: 'Secondary spread zones', pct: '65%' },
                { color: 'bg-yellow-400', label: 'Tertiary ripple zones', pct: '30%' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                  <span className="leading-tight">{item.label} ({item.pct})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
