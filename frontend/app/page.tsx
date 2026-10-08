'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin, ArrowRight, ShieldCheck, Clock, Sparkles,
  Navigation, ChevronRight, Activity, CloudRain, AlertCircle, TrendingUp
} from 'lucide-react';
import { PredictionSequenceModal } from '@/components/motion/PredictionSequenceModal';
import { api } from '@/services/api';
import { GoogleTrafficMap } from '@/components/map/GoogleTrafficMap';

export default function HomePage() {
  const router = useRouter();
  const [destination, setDestination] = useState('Coimbatore Railway Station');
  const [origin, setOrigin] = useState('KPR Institute');
  const [isPredicting, setIsPredicting] = useState(false);
  const [liveStatus, setLiveStatus] = useState<any>(null);

  useEffect(() => {
    const loadTraffic = async () => {
      try {
        const data = await api.getLiveTraffic();
        setLiveStatus(data);
      } catch {}
    };
    loadTraffic();
  }, []);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Good evening.
          </h1>
          <p className="text-base text-slate-600 font-medium mt-1">
            Don't just see traffic.{' '}
            <span className="text-sky-600 font-semibold">See what's coming.</span>
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {liveStatus?.context_statement || 'No major congestion nearby. Average corridor velocity 34 km/h.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          Traffic around you: <span className="font-black ml-1">NORMAL</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Journey Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              PREDICT YOUR JOURNEY
            </div>
            <form onSubmit={handlePredict} className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-sky-400 transition-colors">
                <Navigation className="w-5 h-5 text-sky-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">FROM</div>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                    placeholder="Starting location"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-emerald-400 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">WHERE ARE YOU GOING?</div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                    placeholder="Destination"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all btn-hover"
              >
                <Sparkles className="w-4 h-4" />
                <span>Predict My Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Upcoming Journey Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upcoming</div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1 min-w-0">
                  <span className="truncate">KPR Institute</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Cbe. Station</span>
                </div>
                <div className="text-xs text-sky-600 font-semibold">6:30 PM · Friday</div>
              </div>
            </div>
            <button
              onClick={() => setIsPredicting(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-bold text-sky-700 transition-colors btn-hover shrink-0 flex items-center gap-1"
            >
              Predict <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Nav Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { href: '/forecast', label: 'Future Forecast', screen: '6', icon: TrendingUp, color: 'text-amber-600' },
              { href: '/propagation', label: 'Propagation', screen: '7', icon: Activity, color: 'text-rose-600' },
              { href: '/risk', label: 'Risk: 87/100', screen: '8', icon: AlertCircle, color: 'text-red-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 hover:border-sky-300 hover:bg-sky-50/60 transition-all card-hover text-center flex flex-col items-center gap-2"
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Screen {item.screen}</div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">{item.label}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Real Google Map */}
        <div className="lg:col-span-7">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE TRAFFIC MAP — COIMBATORE METRO CORRIDOR
          </div>
          <GoogleTrafficMap
            mode="LIVE"
            compact={false}
          />
        </div>
      </div>

      <PredictionSequenceModal
        isOpen={isPredicting}
        destination={destination}
        onComplete={() => router.push('/routes')}
      />
    </div>
  );
}
