'use client';

import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle, Activity, Clock, Zap, MapPin, Shield, ArrowUpRight } from 'lucide-react';
import { GoogleTrafficMap } from '@/components/map/GoogleTrafficMap';

const LIVE_EVENTS = [
  { id: 1, type: 'CRITICAL', icon: '🚧', title: 'Mariamman Festival Procession', location: 'Lakshmi Mills Junction', detail: '3.2 km queue · 8 km/h · Est. clear 7:45 PM', time: '5:30 PM', color: 'border-red-300 bg-red-50' },
  { id: 2, type: 'MAJOR', icon: '🔴', title: 'Signal Overflow Detected', location: 'Anna Salai–RS Puram', detail: '1.1 km spillback · 12 km/h', time: '5:52 PM', color: 'border-amber-300 bg-amber-50' },
  { id: 3, type: 'DIVERSION', icon: '🔃', title: 'Heavy Diversion Traffic', location: 'Ring Road Corridor', detail: '+40% volume · 31 km/h (acceptable)', time: '6:12 PM', color: 'border-amber-200 bg-amber-50/50' },
  { id: 4, type: 'INFO', icon: 'ℹ️', title: 'Alternative Corridor Clear', location: 'Trichy Road Bypass', detail: 'All clear · 42 km/h · Recommended', time: '6:15 PM', color: 'border-emerald-300 bg-emerald-50' },
];

export default function LiveMonitorPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeEvent, setActiveEvent] = useState<number>(1);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
    const interval = setInterval(() => setLastUpdated(new Date().toLocaleTimeString()), 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
            </span>
            LIVE MONITOR · SCREEN 5
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Live Traffic Monitor</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Real-time corridor surveillance · Updated {lastUpdated || 'just now'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-black">
            <AlertTriangle className="w-4 h-4" />
            1 CRITICAL
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-black">
            <Activity className="w-4 h-4" />
            2 MAJOR
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-black">
            <Shield className="w-4 h-4" />
            1 CLEAR
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Metrics Bar */}
        <div className="xl:col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Corridor Speed', value: '22 km/h', delta: '-34%', color: 'text-red-600' },
            { label: 'Traffic Volume', value: '2,840/hr', delta: '+22%', color: 'text-amber-600' },
            { label: 'Queue Length', value: '3.2 km', delta: '+1.8 km', color: 'text-red-600' },
            { label: 'Incident TTC', value: '1:45 hrs', delta: 'clearing', color: 'text-emerald-600' },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{m.label}</div>
              <div className="text-xl font-black text-slate-900">{m.value}</div>
              <div className={`text-xs font-bold ${m.color} flex items-center gap-0.5`}>
                <ArrowUpRight className="w-3 h-3" />{m.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Left: Events */}
        <div className="xl:col-span-5 space-y-3">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Active Traffic Events
          </h2>
          {LIVE_EVENTS.map((event) => (
            <button
              key={event.id}
              onClick={() => setActiveEvent(event.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all btn-hover ${
                activeEvent === event.id ? event.color + ' shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{event.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-black text-slate-900 truncate">{event.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{event.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-sky-700 mb-1">📍 {event.location}</div>
                  <div className="text-xs text-slate-600">{event.detail}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Live Map */}
        <div className="xl:col-span-7">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            LIVE GOOGLE MAPS TRAFFIC LAYER
          </div>
          <GoogleTrafficMap mode="LIVE" compact={false} />
          <p className="text-[10px] text-slate-400 mt-2 text-right">
            Powered by Google Maps Traffic Layer · Auto-refresh every 60s
          </p>
        </div>
      </div>
    </div>
  );
}
