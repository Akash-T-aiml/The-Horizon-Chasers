'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, MapPin, ArrowRight, ShieldCheck, Clock, Sparkles, Navigation, AlertTriangle, Play
} from 'lucide-react';
import { GoogleTrafficMap } from '@/components/map/GoogleTrafficMap';
import { RouteCard } from '@/components/routes/RouteCard';
import { DepartureOptimizer } from '@/components/routes/DepartureOptimizer';
import { api, FALLBACK_ROUTES, FALLBACK_DEPARTURE } from '@/services/api';
import { RouteOption, DepartureOptimizerResponse, DepartureSlot } from '@/types';

export default function RouteComparisonPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<RouteOption[]>(FALLBACK_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('ROUTE_B');
  const [departureData, setDepartureData] = useState<DepartureOptimizerResponse>(FALLBACK_DEPARTURE);
  const [selectedSlotOffset, setSelectedSlotOffset] = useState<number>(0);
  const [mapMode, setMapMode] = useState<'LIVE' | 'ROUTES'>('ROUTES');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const journeyRes = await api.predictJourney({
          origin: 'KPR Institute',
          destination: 'Coimbatore Railway Station',
          departure_time: '6:30 PM',
          preference: 'Balanced'
        });
        if (journeyRes.routes?.length) setRoutes(journeyRes.routes);
        if (journeyRes.departure_optimization) setDepartureData(journeyRes.departure_optimization);
      } catch {}
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">ROUTE COMPARISON · SCREEN 3</div>
          <div className="text-lg sm:text-xl font-black text-slate-900 flex flex-wrap items-center gap-2">
            <span>KPR Institute</span>
            <ArrowRight className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Coimbatore Railway Station</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 font-medium">Target: 6:30 PM · Friday Peak Commute</div>
        </div>
        <button
          onClick={() => router.push('/trip')}
          className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-sky-500/20 transition-all btn-hover"
        >
          <Play className="w-4 h-4 fill-white" />
          Start Trip
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Route Cards + Departure Optimizer */}
        <div className="xl:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-600" />
              Evaluated Routes
            </h2>
            <span className="text-xs text-slate-400 font-medium">Sorted by lowest risk</span>
          </div>

          <div className="space-y-4">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={selectedRouteId === route.id}
                onSelect={() => {
                  setSelectedRouteId(route.id);
                  setMapMode('ROUTES');
                }}
              />
            ))}
          </div>

          <DepartureOptimizer
            data={departureData}
            selectedSlotOffset={selectedSlotOffset}
            onSelectSlot={(slot) => setSelectedSlotOffset(slot.offset_minutes)}
          />
        </div>

        {/* Right: Synced Google Map */}
        <div className="xl:col-span-5 sticky top-20 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>SYNCHRONIZED MAP · {selectedRouteId.replace('_', ' ')}</span>
            <button
              onClick={() => setMapMode(mapMode === 'LIVE' ? 'ROUTES' : 'LIVE')}
              className="text-sky-600 hover:text-sky-700"
            >
              Switch to {mapMode === 'LIVE' ? 'ROUTES' : 'LIVE'}
            </button>
          </div>

          <GoogleTrafficMap
            mode={mapMode}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            compact={false}
          />

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 mb-1">
              <ShieldCheck className="w-4 h-4" />
              AI Recommendation
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Route B via Trichy Road Link bypasses the 3.2 km Mariamman festival congestion shockwave.
              Leave <span className="font-bold text-emerald-600">NOW</span> to save 17 minutes over peak delay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
