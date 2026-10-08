'use client';

import React, { useState } from 'react';
import { User, MapPin, Sliders, Bell, Database, Cpu, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const [trafficAlerts, setTrafficAlerts] = useState(true);
  const [routePref, setRoutePref] = useState('Balanced');

  const savedPlaces = [
    { label: 'College', address: 'KPR Institute of Engineering and Technology, Arasur', icon: '🎓' },
    { label: 'Work', address: 'TIDEL Park Coimbatore, Civil Aerodrome Post', icon: '💼' },
    { label: 'Home', address: 'Cross Cut Road, Gandhipuram, Coimbatore', icon: '🏠' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg shadow-sky-500/20">
          TX
        </div>
        <div>
          <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-0.5">USER PROFILE · SCREEN 10</div>
          <h1 className="text-xl font-black text-slate-900">Commuter Intelligence Account</h1>
          <p className="text-xs text-slate-500 font-medium">Coimbatore Metro Smart Mobility Pilot · ID #TX-9042</p>
        </div>
      </div>

      {/* Saved Places */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-600" />
          SAVED PLACES
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {savedPlaces.map((place) => (
            <div
              key={place.label}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors cursor-pointer card-hover"
            >
              <div className="text-2xl mb-2">{place.icon}</div>
              <div className="text-sm font-black text-slate-800">{place.label}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-tight">{place.address}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-500" />
          PREFERENCES
        </div>

        <div className="space-y-3">
          {/* Alerts Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-sm font-black text-slate-800">Proactive Congestion Alerts</div>
              <div className="text-xs text-slate-500 mt-0.5">Notify 18 min before shockwave arrival</div>
            </div>
            <button
              onClick={() => setTrafficAlerts(!trafficAlerts)}
              className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${
                trafficAlerts ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                trafficAlerts ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Route Preference */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-sm font-black text-slate-800">Primary Route Preference</div>
              <div className="text-xs text-slate-500 mt-0.5">Default multi-objective cost weight</div>
            </div>
            <select
              value={routePref}
              onChange={(e) => setRoutePref(e.target.value)}
              className="bg-white text-xs font-bold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 transition-colors shrink-0"
            >
              <option value="Balanced">Balanced</option>
              <option value="Fastest">Fastest</option>
              <option value="Avoid high-risk traffic">Avoid high-risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* About & Data Sources */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-500" />
          ABOUT &amp; DATA SOURCES
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: 'Live Sensing Telemetry',
              body: 'Google Maps Traffic Layer, municipal arterial loop detectors, and Tamil Nadu Highway authority feeds.',
              icon: <Cpu className="w-4 h-4 text-sky-600" />,
            },
            {
              title: 'ML Forecasting Engine',
              body: 'Gradient-boosted decision trees with LWR macroscopic shockwave propagation modeling across directed urban graph.',
              icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-black text-slate-800 mb-2">
                {item.icon}
                {item.title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-400 text-center font-medium pt-2 border-t border-slate-100">
          Traffix v2.0 · Coimbatore Metro Corridor · Google Maps API · Powered by AI
        </div>
      </div>
    </div>
  );
}
