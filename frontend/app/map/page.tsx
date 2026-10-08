'use client';

import React, { useState } from 'react';
import { GoogleTrafficMap } from '@/components/map/GoogleTrafficMap';
import { Layers, Navigation, Compass, MapPin } from 'lucide-react';

type MapMode = 'LIVE' | 'FORECAST' | 'ROUTES' | 'PROPAGATION';

export default function DedicatedMapPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>('ROUTE_B');
  const [mapMode, setMapMode] = useState<MapMode>('LIVE');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            INTERACTIVE MAP · SCREEN 4
          </div>
          <h1 className="text-xl font-black text-slate-900">Coimbatore Urban Arterial Network</h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            Powered by Google Maps · Switch modes to inspect telemetry, forecast, routes, or propagation
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>KPR Institute</span>
          <span>→</span>
          <span>Cbe. Station</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {([
          { mode: 'LIVE', label: '● Live Traffic', color: 'bg-emerald-600' },
          { mode: 'ROUTES', label: '⇅ Route Compare', color: 'bg-sky-600' },
          { mode: 'FORECAST', label: '⏱ Forecast', color: 'bg-amber-500' },
          { mode: 'PROPAGATION', label: '⚡ Propagation', color: 'bg-red-600' },
        ] as const).map(({ mode, label, color }) => (
          <button
            key={mode}
            onClick={() => setMapMode(mode as MapMode)}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-sm font-bold transition-all btn-hover ${
              mapMode === mode
                ? `${color} text-white shadow-md`
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Full Map */}
      <div className="h-[calc(100vh-320px)] min-h-[500px]">
        <GoogleTrafficMap
          mode={mapMode}
          selectedRouteId={selectedRoute}
          onSelectRoute={(id) => setSelectedRoute(id)}
          compact={false}
        />
      </div>

      {/* Info Footer */}
      <div className="flex flex-wrap items-center gap-4 px-2 text-xs text-slate-400 font-medium">
        <span>© Google Maps · Traffic data refreshes every 60s</span>
        <span>·</span>
        <span>Corridor: Avinashi Rd ⇄ Trichy Rd Bypass</span>
        <span>·</span>
        <span className="text-sky-600 font-bold">KPR Institute ↔ Railway Station</span>
      </div>
    </div>
  );
}
