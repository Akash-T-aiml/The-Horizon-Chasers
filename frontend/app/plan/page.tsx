'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Navigation, MapPin, Clock, Sliders, Sparkles, ArrowRight, ShieldCheck
} from 'lucide-react';
import { PredictionSequenceModal } from '@/components/motion/PredictionSequenceModal';

export default function PlanJourneyPage() {
  const router = useRouter();
  const [origin, setOrigin] = useState('KPR Institute');
  const [destination, setDestination] = useState('Coimbatore Railway Station');
  const [departureType, setDepartureType] = useState<'now' | 'custom'>('custom');
  const [departureTime, setDepartureTime] = useState('18:30');
  const [preference, setPreference] = useState<'Balanced' | 'Fastest' | 'Avoid high-risk traffic'>('Balanced');
  const [isPredicting, setIsPredicting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          PREDICTIVE TRAVEL PLANNER · SCREEN 2
        </div>
        <h1 className="text-2xl font-black text-slate-900">Plan Your Journey</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Traffix anticipates downstream congestion shockwaves before you depart.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        {/* FROM */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-sky-400 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <Navigation className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              FROM (CURRENT LOCATION)
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
              placeholder="Starting location"
              required
            />
          </div>
        </div>

        {/* TO */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-emerald-400 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              TO (DESTINATION)
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
              placeholder="Where are you going?"
              required
            />
          </div>
        </div>

        {/* DEPARTURE */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              DEPARTURE TIME
            </label>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white border border-slate-200">
              <button
                type="button"
                onClick={() => setDepartureType('now')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  departureType === 'now'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Leave Now
              </button>
              <button
                type="button"
                onClick={() => setDepartureType('custom')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  departureType === 'custom'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Select Time
              </button>
            </div>
          </div>

          {departureType === 'custom' && (
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-sky-400"
              />
              <span className="text-xs text-slate-500">Friday 6:30 PM peak rush</span>
            </div>
          )}
        </div>

        {/* Route Preference */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            ROUTE PREFERENCE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Balanced', 'Fastest', 'Avoid high-risk traffic'] as const).map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setPreference(pref)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all btn-hover ${
                  preference === pref
                    ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-800">AI Insight — Friday 6:30 PM</div>
            <div className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Mariamman festival active near Lakshmi Mills. Recommend departing
              <span className="font-bold"> 15 min early</span> to avoid +28 min peak delay.
              Route B via Trichy Road Bypass is optimal.
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-sky-500/20 transition-all btn-hover"
        >
          <Sparkles className="w-4 h-4" />
          Predict My Journey
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <PredictionSequenceModal
        isOpen={isPredicting}
        destination={destination}
        onComplete={() => router.push('/routes')}
      />
    </div>
  );
}
