'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSyDq4kTe84CYs9P0uRYbolBEe51pfe88rlk';

// Coimbatore corridor endpoints
const ORIGIN_LATLNG = { lat: 11.0827, lng: 77.0607 };       // KPR Institute (Arasur)
const DEST_LATLNG   = { lat: 10.9972, lng: 76.9635 };       // Cbe Railway Station

/* ─── Real Coimbatore Road Geometries (curve-accurate polylines) ─── */
// Route A: Avinashi Road Core (NH544 — High Congestion Corridor)
const ROUTE_A_COORDS = [
  { lat: 11.0827, lng: 77.0607 }, // KPR Institute Entrance
  { lat: 11.0812, lng: 77.0592 },
  { lat: 11.0772, lng: 77.0545 }, // Arasur NH544
  { lat: 11.0720, lng: 77.0490 },
  { lat: 11.0660, lng: 77.0428 }, // Neelambur Junction / L&T Bypass
  { lat: 11.0605, lng: 77.0375 },
  { lat: 11.0545, lng: 77.0315 }, // Chinniampalayam
  { lat: 11.0490, lng: 77.0270 },
  { lat: 11.0450, lng: 77.0235 }, // KMCH / CIT
  { lat: 11.0375, lng: 77.0180 }, // SITRA / Airport Junction
  { lat: 11.0315, lng: 77.0140 },
  { lat: 11.0250, lng: 77.0090 }, // Hope College Flyover
  { lat: 11.0230, lng: 77.0035 },
  { lat: 11.0210, lng: 76.9980 }, // Peelamedu / PSG Tech
  { lat: 11.0195, lng: 76.9940 },
  { lat: 11.0180, lng: 76.9900 }, // Nava India Junction
  { lat: 11.0160, lng: 76.9855 },
  { lat: 11.0145, lng: 76.9820 }, // Lakshmi Mills Junction (Severe bottleneck)
  { lat: 11.0135, lng: 76.9775 },
  { lat: 11.0120, lng: 76.9740 },
  { lat: 11.0110, lng: 76.9710 }, // Anna Salai / VOC Park
  { lat: 11.0065, lng: 76.9690 },
  { lat: 11.0020, lng: 76.9670 }, // Collectorate Office / Station Feeder
  { lat: 10.9985, lng: 76.9648 }, // Goodshed Road
  { lat: 10.9972, lng: 76.9635 }, // Coimbatore Railway Station
];

// Route B: Trichy Road / Singanallur Bypass (Recommended Alternative Corridor)
const ROUTE_B_COORDS = [
  { lat: 11.0827, lng: 77.0607 }, // KPR Institute
  { lat: 11.0772, lng: 77.0545 }, // Arasur NH544
  { lat: 11.0660, lng: 77.0428 }, // Neelambur Junction
  { lat: 11.0550, lng: 77.0440 }, // Southern bypass link
  { lat: 11.0450, lng: 77.0435 },
  { lat: 11.0340, lng: 77.0420 }, // Ondipudur Link Road
  { lat: 11.0260, lng: 77.0390 },
  { lat: 11.0210, lng: 77.0360 }, // Ondipudur Flyover / Trichy Road
  { lat: 11.0160, lng: 77.0290 },
  { lat: 11.0115, lng: 77.0220 }, // Singanallur Junction
  { lat: 11.0075, lng: 77.0110 },
  { lat: 11.0040, lng: 77.0010 }, // Ramanathapuram Junction
  { lat: 11.0010, lng: 76.9890 },
  { lat: 10.9980, lng: 76.9780 }, // Sungam Flyover / Bypass
  { lat: 10.9970, lng: 76.9720 },
  { lat: 10.9960, lng: 76.9670 }, // Lanka Corner / State Bank Road
  { lat: 10.9972, lng: 76.9635 }, // Coimbatore Railway Station
];

// Route C: Kalapatti / Sathy Road / Ganapathy Bypass (Alternative Corridor C)
const ROUTE_C_COORDS = [
  { lat: 11.0827, lng: 77.0607 }, // KPR Institute
  { lat: 11.0780, lng: 77.0510 },
  { lat: 11.0710, lng: 77.0380 }, // Kalapatti Road
  { lat: 11.0660, lng: 77.0220 }, // Kalapatti Village
  { lat: 11.0600, lng: 77.0050 }, // Saravanampatti Junction
  { lat: 11.0500, lng: 76.9970 },
  { lat: 11.0360, lng: 76.9850 }, // Ganapathy Junction
  { lat: 11.0280, lng: 76.9780 },
  { lat: 11.0190, lng: 76.9680 }, // Gandhipuram Cross Cut Road
  { lat: 11.0130, lng: 76.9660 }, // Dr. Nanjappa Road
  { lat: 11.0050, lng: 76.9650 },
  { lat: 10.9995, lng: 76.9642 }, // State Bank Road
  { lat: 10.9972, lng: 76.9635 }, // Coimbatore Railway Station
];

const ROUTE_COORDINATES: Record<string, Array<{ lat: number; lng: number }>> = {
  ROUTE_A: ROUTE_A_COORDS,
  ROUTE_B: ROUTE_B_COORDS,
  ROUTE_C: ROUTE_C_COORDS,
};

const CONGESTION_ZONES = [
  { lat: 11.0145, lng: 76.9820, label: 'Lakshmi Mills — SEVERE', color: '#DC2626', radius: 450 },
  { lat: 11.0250, lng: 77.0090, label: 'Hope College — HEAVY',  color: '#EA580C', radius: 350 },
  { lat: 11.0130, lng: 76.9660, label: 'Anna Salai — HEAVY',   color: '#EA580C', radius: 350 },
];

const ROUTE_COLORS: Record<string, string> = {
  ROUTE_A: '#DC2626', // red — congested
  ROUTE_B: '#059669', // green — recommended
  ROUTE_C: '#D97706', // amber — alternative
};

export type MapMode = 'LIVE' | 'FORECAST' | 'ROUTES' | 'PROPAGATION';

interface GoogleTrafficMapProps {
  mode?: MapMode;
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
  compact?: boolean;
  forecastOffset?: number;
}

declare global {
  interface Window { google: any }
}

/* ─── Script loader helper ─────────────────────────────────────── */
let scriptPromise: Promise<void> | null = null;
function loadGoogleMapsScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  if (typeof window !== 'undefined' && window.google?.maps) {
    return (scriptPromise = Promise.resolve());
  }
  scriptPromise = new Promise((resolve) => {
    const existing = document.getElementById('gmaps-traffix');
    if (existing) {
      const iv = setInterval(() => {
        if (window.google?.maps) { clearInterval(iv); resolve(); }
      }, 100);
      return;
    }
    const s = document.createElement('script');
    s.id   = 'gmaps-traffix';
    s.src  = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/* ─── Component ────────────────────────────────────────────────── */
export const GoogleTrafficMap: React.FC<GoogleTrafficMapProps> = ({
  mode            = 'LIVE',
  selectedRouteId = 'ROUTE_B',
  onSelectRoute,
  compact         = false,
  forecastOffset  = 0,
}) => {
  const mapRef       = useRef<HTMLDivElement>(null);
  const mapObj       = useRef<google.maps.Map | null>(null);
  const trafficLayer = useRef<google.maps.TrafficLayer | null>(null);
  const polylines    = useRef<google.maps.Polyline[]>([]);
  const circles      = useRef<google.maps.Circle[]>([]);
  const markers      = useRef<google.maps.Marker[]>([]);

  const [ready,        setReady]        = useState(false);
  const [activeMode,   setActiveMode]   = useState<MapMode>(mode);
  const [activeRoute,  setActiveRoute]  = useState(selectedRouteId);
  const [timeOffset,   setTimeOffset]   = useState(forecastOffset);
  const [isPlaying,    setIsPlaying]    = useState(false);

  /* ── 1. Load SDK + init map ─────────────────────────── */
  useEffect(() => {
    loadGoogleMapsScript().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || mapObj.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center:              { lat: 11.0350, lng: 77.0100 },
      zoom:                compact ? 11 : 12,
      mapTypeId:           'roadmap',
      zoomControl:         true,
      mapTypeControl:      false,
      streetViewControl:   false,
      fullscreenControl:   false,
      gestureHandling:     'cooperative',
      styles: [
        { featureType: 'poi',        stylers: [{ visibility: 'off' }] },
        { featureType: 'transit',    stylers: [{ visibility: 'simplified' }] },
        { featureType: 'road.highway',   elementType: 'geometry', stylers: [{ color: '#fde68a' }] },
        { featureType: 'road.arterial',  elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road.local',     elementType: 'geometry', stylers: [{ color: '#f8fafc' }] },
        { featureType: 'landscape',      elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
        { featureType: 'water',          elementType: 'geometry', stylers: [{ color: '#bae6fd' }] },
        { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#1e293b' }] },
      ],
    });

    mapObj.current       = map;
    trafficLayer.current = new window.google.maps.TrafficLayer();

    // Origin / Destination markers (persistent)
    const mkOrigin = new window.google.maps.Marker({
      position: ORIGIN_LATLNG,
      map,
      title:    'KPR Institute (Origin)',
      zIndex:   10,
      icon: {
        path:         window.google.maps.SymbolPath.CIRCLE,
        scale:        11,
        fillColor:    '#0284c7',
        fillOpacity:  1,
        strokeColor:  '#ffffff',
        strokeWeight: 2.5,
      },
      label: { text: 'A', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', fontFamily: 'Helvetica Neue, sans-serif' },
    });

    const mkDest = new window.google.maps.Marker({
      position: DEST_LATLNG,
      map,
      title:    'Coimbatore Railway Station (Destination)',
      zIndex:   10,
      icon: {
        path:         window.google.maps.SymbolPath.CIRCLE,
        scale:        11,
        fillColor:    '#059669',
        fillOpacity:  1,
        strokeColor:  '#ffffff',
        strokeWeight: 2.5,
      },
      label: { text: 'B', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', fontFamily: 'Helvetica Neue, sans-serif' },
    });

    // Lakshmi Mills hotspot marker
    const mkHot = new window.google.maps.Marker({
      position: { lat: 11.0145, lng: 76.9820 },
      map,
      title: 'Lakshmi Mills — SEVERE Congestion',
      zIndex: 9,
      icon: {
        path:         window.google.maps.SymbolPath.CIRCLE,
        scale:        9,
        fillColor:    '#DC2626',
        fillOpacity:  0.9,
        strokeColor:  '#ffffff',
        strokeWeight: 2,
      },
    });

    const infoHot = new window.google.maps.InfoWindow({
      content: `<div style="font-family:Helvetica Neue,Helvetica,sans-serif;padding:6px;max-width:200px">
        <b style="color:#DC2626">⚠ Lakshmi Mills Junction</b><br/>
        <span style="color:#555;font-size:12px">SEVERE — 8 km/h avg<br/>Mariamman festival procession active</span>
      </div>`,
    });
    mkHot.addListener('click', () => infoHot.open(map, mkHot));

    markers.current = [mkOrigin, mkDest, mkHot];
  }, [ready, compact]);

  /* ── 2. Clear overlays helper ───────────────────────── */
  const clearOverlays = useCallback(() => {
    polylines.current.forEach((p) => p.setMap(null));
    polylines.current = [];
    circles.current.forEach((c) => c.setMap(null));
    circles.current = [];
    trafficLayer.current?.setMap(null);
  }, []);

  /* ── 3. Draw a road polyline ────────────────────────── */
  const drawRoutePolyline = useCallback(
    (routeId: string, strokeColor: string, strokeWeight: number, strokeOpacity: number, zIndex = 5) => {
      if (!mapObj.current || !window.google?.maps) return;
      const coords = ROUTE_COORDINATES[routeId] || [];
      if (!coords.length) return;

      const polyline = new window.google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        zIndex,
        map: mapObj.current,
      });

      polylines.current.push(polyline);
    },
    []
  );

  /* ── 4. Render based on active mode ─────────────────── */
  const renderMode = useCallback(
    (currentMode: MapMode, currentRoute: string, offset: number) => {
      if (!mapObj.current || !window.google?.maps) return;
      clearOverlays();

      /* ---- LIVE ---- */
      if (currentMode === 'LIVE') {
        trafficLayer.current?.setMap(mapObj.current);
        // Congestion zone circles overlay
        CONGESTION_ZONES.forEach((z) => {
          circles.current.push(
            new window.google.maps.Circle({
              map:           mapObj.current!,
              center:        { lat: z.lat, lng: z.lng },
              radius:        z.radius,
              strokeColor:   z.color,
              strokeOpacity: 0.75,
              strokeWeight:  2,
              fillColor:     z.color,
              fillOpacity:   0.15,
            })
          );
        });
      }

      /* ---- ROUTES ---- */
      if (currentMode === 'ROUTES') {
        // Draw non-selected routes first, then the selected one on top
        const allRoutes = ['ROUTE_A', 'ROUTE_C', 'ROUTE_B'];
        const ordered = allRoutes.filter((r) => r !== currentRoute).concat([currentRoute]);

        ordered.forEach((rId) => {
          const isSelected = rId === currentRoute;
          drawRoutePolyline(
            rId,
            ROUTE_COLORS[rId],
            isSelected ? 6 : 4,
            isSelected ? 0.95 : 0.35,
            isSelected ? 10 : 4
          );
        });
      }

      /* ---- FORECAST ---- */
      if (currentMode === 'FORECAST') {
        trafficLayer.current?.setMap(mapObj.current);
        const severity = offset >= 30 ? 0.35 : offset >= 15 ? 0.22 : 0.12;
        const fColor   = offset >= 30 ? '#DC2626' : offset >= 15 ? '#EA580C' : '#D97706';
        CONGESTION_ZONES.forEach((z) => {
          circles.current.push(
            new window.google.maps.Circle({
              map:           mapObj.current!,
              center:        { lat: z.lat, lng: z.lng },
              radius:        z.radius * (1 + offset / 120),
              strokeColor:   fColor,
              strokeOpacity: 0.7,
              strokeWeight:  2,
              fillColor:     fColor,
              fillOpacity:   severity,
            })
          );
        });
      }

      /* ---- PROPAGATION ---- */
      if (currentMode === 'PROPAGATION') {
        // Draw Route A corridor with high-visibility red line
        drawRoutePolyline('ROUTE_A', '#DC2626', 7, 0.90, 8);

        // Cascading shockwave circles at key road intersections
        [
          { lat: 11.0250, lng: 77.0090, r: 350 },
          { lat: 11.0145, lng: 76.9820, r: 520 },
          { lat: 11.0130, lng: 76.9660, r: 400 },
          { lat: 10.9972, lng: 76.9635, r: 260 },
        ].forEach((n, i) => {
          circles.current.push(
            new window.google.maps.Circle({
              map:           mapObj.current!,
              center:        { lat: n.lat, lng: n.lng },
              radius:        n.r,
              strokeColor:   '#DC2626',
              strokeOpacity: Math.max(0.25, 0.85 - i * 0.15),
              strokeWeight:  2,
              fillColor:     '#DC2626',
              fillOpacity:   Math.max(0.05, 0.22 - i * 0.04),
            })
          );
        });
      }
    },
    [clearOverlays, drawRoutePolyline]
  );

  /* ── 5. Re-render when mode / route / offset changes ── */
  useEffect(() => {
    if (!ready || !mapObj.current) return;
    renderMode(activeMode, activeRoute, timeOffset);
  }, [ready, activeMode, activeRoute, timeOffset, renderMode]);

  /* ── 6. Sync props → state ──────────────────────────── */
  useEffect(() => { setActiveMode(mode); }, [mode]);
  useEffect(() => { setActiveRoute(selectedRouteId); }, [selectedRouteId]);

  /* ── 7. Forecast auto-play ──────────────────────────── */
  useEffect(() => {
    let iv: any;
    if (isPlaying && activeMode === 'FORECAST') {
      iv = setInterval(() => setTimeOffset((p) => (p >= 60 ? 0 : p + 15)), 2000);
    }
    return () => clearInterval(iv);
  }, [isPlaying, activeMode]);

  /* ── 8. Render ──────────────────────────────────────── */
  const height = compact ? 'h-80' : 'h-[520px]';

  return (
    <div className={`w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex flex-col`}>
      {/* Control Bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white border-b border-slate-200 flex-wrap">
        {(['LIVE', 'FORECAST', 'ROUTES', 'PROPAGATION'] as MapMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setActiveMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all btn-hover ${
              activeMode === m
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {m === 'LIVE' && <span className="mr-1 text-red-400">●</span>}
            {m}
          </button>
        ))}

        {/* Forecast scrubber */}
        {activeMode === 'FORECAST' && (
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            {[0, 15, 30, 45, 60].map((t) => (
              <button
                key={t}
                onClick={() => setTimeOffset(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeOffset === t
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {t === 0 ? 'NOW' : `+${t}`}
              </button>
            ))}
          </div>
        )}

        {/* Route selector */}
        {activeMode === 'ROUTES' && (
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            {[
              { id: 'ROUTE_B', label: 'B — Recommended', dot: 'bg-emerald-600' },
              { id: 'ROUTE_C', label: 'C — Alternative',  dot: 'bg-amber-500'  },
              { id: 'ROUTE_A', label: 'A — Risk',          dot: 'bg-red-600'   },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRoute(r.id);
                  onSelectRoute?.(r.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border btn-hover ${
                  activeRoute === r.id
                    ? 'border-slate-400 bg-white shadow-sm text-slate-900'
                    : 'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${r.dot}`} />
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative">
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 gap-3 z-20">
            <div className="w-8 h-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading Google Maps…</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded-xl px-3 py-2 shadow-md z-20 pointer-events-none text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full bg-emerald-500 inline-block" /> Normal (&gt;35 km/h)</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full bg-amber-500 inline-block" />  Moderate (20–35)</div>
          <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full bg-red-600 inline-block" />   Severe (&lt;15 km/h)</div>
        </div>

        {/* Badge */}
        <div className="absolute top-2 right-2 bg-white/90 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-500 font-medium shadow-sm z-20 pointer-events-none">
          📍 Google Maps · Live Road Layer
        </div>
      </div>
    </div>
  );
};
