'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, CloudSun, AlertTriangle, ChevronLeft, ChevronRight, Play, Pause, CalendarDays } from 'lucide-react';
import { GoogleTrafficMap } from '@/components/map/GoogleTrafficMap';

const FORECAST_SLOTS = [
  { offset: 0, label: 'NOW', speed: 34, risk: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { offset: 15, label: '+15 min', speed: 24, risk: 'MODERATE', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { offset: 30, label: '+30 min', speed: 14, risk: 'HIGH', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  { offset: 45, label: '+45 min', speed: 18, risk: 'MODERATE', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { offset: 60, label: '+60 min', speed: 28, risk: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
];

const HOUR_GRID = [
  { time: '4PM', v: 42 }, { time: '5PM', v: 28 }, { time: '5:30', v: 14 }, { time: '6PM', v: 12 },
  { time: '6:30', v: 19 }, { time: '7PM', v: 26 }, { time: '7:30', v: 35 }, { time: '8PM', v: 40 },
];

export default function ForecastPage() {
  const [activeSlot, setActiveSlot] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveSlot((prev) => (prev + 1) % FORECAST_SLOTS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentForecast = FORECAST_SLOTS[activeSlot];
  const maxV = Math.max(...HOUR_GRID.map(h => h.v));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">FUTURE FORECAST · SCREEN 6</div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Predictive Traffic Forecast</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">LSTM Model · Coimbatore Metro Corridor · Next 60 minutes</p>
        </div>
        <div className={`px-4 py-2.5 rounded-xl border text-base font-black ${currentForecast.bg} ${currentForecast.color} flex items-center gap-2`}>
          <TrendingUp className="w-4 h-4" />
          {currentForecast.risk} RISK
        </div>
      </div>

      {/* Scrubber */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">FORECAST TIMELINE</span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors shadow-sm btn-hover"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Animate'}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FORECAST_SLOTS.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveSlot(idx); setIsPlaying(false); }}
              className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl border text-center transition-all font-bold text-sm btn-hover ${
                activeSlot === idx ? slot.bg + ' ' + slot.color + ' border-current shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-black">{slot.label}</div>
              <div className="text-[11px] mt-0.5 font-semibold">{slot.speed} km/h</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Speed Chart + Breakdown */}
        <div className="xl:col-span-5 space-y-4">
          {/* Mini Speed Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Speed vs. Time (km/h)</div>
            <div className="flex items-end gap-1.5 h-32">
              {HOUR_GRID.map((h, i) => {
                const isNow = h.time === '5:30' || h.time === '6PM';
                const barHeight = Math.round((h.v / maxV) * 100);
                const barColor = h.v < 20 ? 'bg-red-500' : h.v < 30 ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div key={h.time} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${barColor}`}
                      style={{ height: `${barHeight}%` }}
                    />
                    <span className={`text-[9px] font-bold rotate-45 origin-left ${isNow ? 'text-slate-900' : 'text-slate-400'}`}>
                      {h.time}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-5 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Severe</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Normal</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">SEGMENT BREAKDOWN</div>
            {[
              { road: 'Avinashi Road (KPR–Ring Road)', speed: 28, risk: 'MODERATE' },
              { road: 'Ring Road Link', speed: 41, risk: 'LOW' },
              { road: 'Lakshmi Mills Junction ⚠', speed: 8, risk: 'SEVERE' },
              { road: 'Trichy Road Bypass', speed: 37, risk: 'LOW' },
            ].map((seg) => (
              <div key={seg.road} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{seg.road}</div>
                  <div className="text-[10px] text-slate-500">{seg.speed} km/h</div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                  seg.risk === 'SEVERE' ? 'bg-red-600 text-white' :
                  seg.risk === 'MODERATE' ? 'bg-amber-500 text-white' :
                  'bg-emerald-100 text-emerald-700'
                }`}>{seg.risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Google Map with forecast overlay */}
        <div className="xl:col-span-7">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            FORECAST MAP — {currentForecast.label}
          </div>
          <GoogleTrafficMap mode="FORECAST" forecastOffset={currentForecast.offset} compact={false} />
        </div>
      </div>
    </div>
  );
}
