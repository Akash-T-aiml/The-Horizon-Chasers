'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Play, Pause, ZoomIn, ZoomOut, RotateCcw,
  AlertTriangle, ArrowUpRight, Zap, Navigation, Clock, ShieldCheck, MapPin
} from 'lucide-react';
import { RouteOption, RoadSegment } from '@/types';

interface TrafficMapProps {
  initialMode?: 'LIVE' | 'FORECAST' | 'ROUTES' | 'PROPAGATION';
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
  interactive?: boolean;
  compact?: boolean;
}

export const TrafficMap: React.FC<TrafficMapProps> = ({
  initialMode = 'LIVE',
  selectedRouteId = 'ROUTE_B',
  onSelectRoute,
  interactive = true,
  compact = false
}) => {
  const [mode, setMode] = useState<'LIVE' | 'FORECAST' | 'ROUTES' | 'PROPAGATION'>(initialMode);
  const [activeRoute, setActiveRoute] = useState<string>(selectedRouteId);
  const [timeOffset, setTimeOffset] = useState<number>(0); // 0, 15, 30, 45, 60
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedRoad, setSelectedRoad] = useState<any | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync mode if prop changes
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (selectedRouteId) setActiveRoute(selectedRouteId);
  }, [selectedRouteId]);

  // Handle play/pause animation scrub
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset((prev) => {
          const next = prev + 15;
          return next > 60 ? 0 : next;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Urban map nodes with Coimbatore coordinates mapped to canvas space
  const mapNodes = [
    { id: 'kpr', name: 'KPR Institute (Origin)', x: 120, y: 70, type: 'terminal', desc: 'Starting point: Outer ring arterial' },
    { id: 'neelambur', name: 'Neelambur Bypass', x: 260, y: 130, type: 'junction', desc: 'NH544 High-speed junction' },
    { id: 'hope_college', name: 'Hope College Flyover', x: 420, y: 190, type: 'flyover', desc: 'Elevated corridor ramp work' },
    { id: 'peelamedu', name: 'Peelamedu Tech Zone', x: 530, y: 240, type: 'corridor', desc: 'Airport feeder segment' },
    { id: 'lakshmi_mills', name: 'Lakshmi Mills Junction', x: 640, y: 310, type: 'bottleneck', desc: 'HOTSPOT: Festival procession & rain merge' },
    { id: 'gandhipuram', name: 'Gandhipuram Crosscut', x: 700, y: 220, type: 'junction', desc: 'Commercial core & bus terminal' },
    { id: 'sungam', name: 'Sungam Junction', x: 670, y: 410, type: 'arterial', desc: 'Bypass interchange' },
    { id: 'trichy_rd', name: 'Trichy Road Bypass', x: 520, y: 430, type: 'bypass', desc: 'Clear express arterial corridor' },
    { id: 'railway_station', name: 'Coimbatore Railway Station', x: 820, y: 370, type: 'terminal', desc: 'Destination: Southern terminus' }
  ];

  // Route Paths
  const routesData: Record<string, { name: string; path: string; color: string; time: number; risk: string }> = {
    ROUTE_A: {
      name: 'Route A (Avinashi Road)',
      path: 'M 120 70 L 260 130 L 420 190 L 530 240 L 640 310 L 730 340 L 820 370',
      color: '#F43F5E', // Rose
      time: 52,
      risk: 'HIGH'
    },
    ROUTE_B: {
      name: 'Route B (Trichy Road Link)',
      path: 'M 120 70 L 260 130 L 390 280 L 520 430 L 670 410 L 820 370',
      color: '#10B981', // Emerald
      time: 38,
      risk: 'LOW'
    },
    ROUTE_C: {
      name: 'Route C (Sathy Road / Bypass)',
      path: 'M 120 70 L 320 90 L 500 130 L 700 220 L 770 290 L 820 370',
      color: '#F59E0B', // Amber
      time: 44,
      risk: 'MEDIUM'
    }
  };

  // Particles animation along paths
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw flowing traffic particles on the active route
      const activeColor = routesData[activeRoute]?.color || '#00F0FF';
      const particleCount = mode === 'PROPAGATION' ? 24 : 12;

      for (let i = 0; i < particleCount; i++) {
        const offset = (t + (i / particleCount)) % 1;
        
        let px = 120 + offset * 700;
        let py = 70 + Math.sin(offset * Math.PI) * 180 + offset * 280;

        if (activeRoute === 'ROUTE_B') {
          // Follow Route B curvature
          px = 120 + offset * 700;
          py = 70 + (offset < 0.5 ? offset * 600 : 370 + Math.sin(offset * 4) * 30);
        }

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = activeColor;
        ctx.shadowColor = activeColor;
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      t += 0.003;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeRoute, mode]);

  // Compute congestion color for mode & forecast
  const getCorridorColor = (roadId: string) => {
    if (mode === 'PROPAGATION') {
      if (['lakshmi_mills', 'peelamedu', 'hope_college'].includes(roadId)) return '#F43F5E';
      if (['sungam', 'gandhipuram'].includes(roadId)) return '#F59E0B';
      return '#3B82F6';
    }

    if (mode === 'FORECAST') {
      if (timeOffset >= 30 && ['lakshmi_mills', 'hope_college', 'peelamedu'].includes(roadId)) {
        return '#F43F5E'; // Severe at +30 & +45
      }
      if (timeOffset >= 15 && ['lakshmi_mills'].includes(roadId)) {
        return '#F59E0B';
      }
      return '#10B981';
    }

    // Default LIVE
    if (roadId === 'lakshmi_mills') return '#F43F5E';
    if (roadId === 'hope_college') return '#F59E0B';
    if (roadId === 'gandhipuram') return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl glass-panel-elevated border border-cyan-500/20 shadow-2xl ${compact ? 'h-[420px]' : 'h-[620px]'}`}>
      {/* 3D Depth Grid Background */}
      <div 
        className="absolute inset-0 bg-[#070D18] pointer-events-none"
        style={{
          transform: `scale(${zoomLevel}) perspective(1000px) rotateX(16deg)`,
          transformOrigin: 'center 40%',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="absolute inset-0 bg-cyber-grid opacity-35" />
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Map HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl pointer-events-auto backdrop-blur-md">
          {(['LIVE', 'FORECAST', 'ROUTES', 'PROPAGATION'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all ${
                mode === m
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Zoom & Reset HUD */}
        {interactive && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl pointer-events-auto backdrop-blur-md">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive SVG Urban Canvas */}
      <div 
        className="w-full h-full relative"
        style={{
          transform: `scale(${zoomLevel}) perspective(900px) rotateX(12deg) translateY(-20px)`,
          transformOrigin: 'center 45%',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <svg
          viewBox="0 0 950 500"
          className="w-full h-full drop-shadow-2xl select-none"
        >
          <defs>
            {/* Road Glow Filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 3D Context Buildings / City Blocks Wireframe */}
          <g stroke="rgba(255,255,255,0.06)" fill="rgba(15,23,42,0.4)" strokeWidth="1">
            <polygon points="300,160 360,140 380,180 320,200" />
            <polygon points="460,210 510,190 530,220 480,240" />
            <polygon points="580,260 640,240 660,280 600,300" />
            <polygon points="680,180 740,160 760,200 700,220" />
            <polygon points="560,360 620,340 640,380 580,400" />
          </g>

          {/* Secondary Arterial Grid Lines */}
          <g stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4">
            <path d="M 260 130 L 320 90 L 500 130 L 700 220" />
            <path d="M 420 190 L 460 310 L 520 430" />
            <path d="M 700 220 L 820 370" />
            <path d="M 640 310 L 670 410" />
          </g>

          {/* Base Road Network Segments */}
          {/* Main Avinashi Road Corridor */}
          <path
            d="M 120 70 L 260 130 L 420 190 L 530 240 L 640 310 L 730 340 L 820 370"
            fill="none"
            stroke={getCorridorColor('lakshmi_mills')}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer transition-all duration-500 hover:opacity-90"
            onClick={() => setSelectedRoad(mapNodes.find(n => n.id === 'lakshmi_mills'))}
          />

          {/* Southern Trichy Road Link Corridor */}
          <path
            d="M 120 70 L 260 130 L 390 280 L 520 430 L 670 410 L 820 370"
            fill="none"
            stroke={mode === 'ROUTES' && activeRoute === 'ROUTE_B' ? '#10B981' : '#3B82F6'}
            strokeWidth={mode === 'ROUTES' && activeRoute === 'ROUTE_B' ? '9' : '5'}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={mode === 'ROUTES' && activeRoute === 'ROUTE_B' ? 'url(#glow-emerald)' : undefined}
            className="cursor-pointer transition-all duration-300"
            onClick={() => {
              setActiveRoute('ROUTE_B');
              onSelectRoute?.('ROUTE_B');
            }}
          />

          {/* Northern Sathy Road Corridor */}
          <path
            d="M 120 70 L 320 90 L 500 130 L 700 220 L 770 290 L 820 370"
            fill="none"
            stroke={mode === 'ROUTES' && activeRoute === 'ROUTE_C' ? '#F59E0B' : 'rgba(255,255,255,0.25)'}
            strokeWidth={mode === 'ROUTES' && activeRoute === 'ROUTE_C' ? '7' : '4'}
            strokeLinecap="round"
            className="cursor-pointer"
            onClick={() => {
              setActiveRoute('ROUTE_C');
              onSelectRoute?.('ROUTE_C');
            }}
          />

          {/* Propagation Shockwave Vector Overlay */}
          {mode === 'PROPAGATION' && (
            <g>
              {/* Pulsing shockwave ring at Lakshmi Mills */}
              <circle cx="640" cy="310" r="38" fill="none" stroke="#F43F5E" strokeWidth="2.5" className="animate-ping" opacity="0.6" />
              <circle cx="640" cy="310" r="22" fill="rgba(244,63,94,0.2)" stroke="#F43F5E" strokeWidth="3" />

              {/* Propagation direction arrows */}
              <line x1="530" y1="240" x2="620" y2="300" stroke="#F43F5E" strokeWidth="4" strokeDasharray="6 4" />
              <line x1="640" y1="310" x2="710" y2="335" stroke="#F59E0B" strokeWidth="4" strokeDasharray="6 4" />
            </g>
          )}

          {/* Interactive Junction Nodes */}
          {mapNodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            const isBottleneck = node.id === 'lakshmi_mills';
            const isOrigin = node.id === 'kpr';
            const isDest = node.id === 'railway_station';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedRoad(node)}
                className="cursor-pointer group"
              >
                {/* Node Halo */}
                <circle
                  r={isOrigin || isDest ? 16 : isBottleneck ? 14 : 9}
                  fill={
                    isOrigin
                      ? 'rgba(0,240,255,0.25)'
                      : isDest
                      ? 'rgba(16,185,129,0.25)'
                      : isBottleneck
                      ? 'rgba(244,63,94,0.3)'
                      : 'rgba(59,130,246,0.2)'
                  }
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Core Dot */}
                <circle
                  r={isOrigin || isDest ? 8 : isBottleneck ? 7 : 5}
                  fill={
                    isOrigin
                      ? '#00F0FF'
                      : isDest
                      ? '#10B981'
                      : isBottleneck
                      ? '#F43F5E'
                      : '#3B82F6'
                  }
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                {/* Node Label Card */}
                <text
                  x="0"
                  y={isHovered ? -22 : -14}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all"
                >
                  {node.name.split(' (')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Canvas Particle Overlay */}
        <canvas
          ref={canvasRef}
          width={950}
          height={500}
          className="absolute inset-0 pointer-events-none w-full h-full"
        />
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Forecast / Time Scrubber HUD */}
        {mode === 'FORECAST' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md pointer-events-auto"
          >
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/25"
              title={isPlaying ? 'Pause Scrubber' : 'Play Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1 px-1">
              {[0, 15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimeOffset(mins)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    timeOffset === mins
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {mins === 0 ? 'NOW' : `+${mins}`}
                </button>
              ))}
            </div>

            <div className="pl-2 border-l border-white/10 text-xs font-mono text-cyan-300">
              {timeOffset === 0 ? 'Normal Peak' : timeOffset === 30 ? 'Severe Choke (+17m)' : 'Dynamic Horizon'}
            </div>
          </motion.div>
        )}

        {/* Route Selector Quick HUD */}
        {mode === 'ROUTES' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-md pointer-events-auto"
          >
            {Object.entries(routesData).map(([id, r]) => (
              <button
                key={id}
                onClick={() => {
                  setActiveRoute(id);
                  onSelectRoute?.(id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeRoute === id
                    ? 'bg-slate-800 text-white border border-white/20 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span>{id.replace('_', ' ')}: {r.time}m</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Selected Road Details Popup */}
        <AnimatePresence>
          {selectedRoad && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="ml-auto p-4 rounded-2xl glass-panel-elevated border border-white/15 max-w-xs shadow-2xl pointer-events-auto relative"
            >
              <button
                onClick={() => setSelectedRoad(null)}
                className="absolute top-2 right-2 text-xs text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Corridor Telemetry
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {selectedRoad.name}
              </div>
              <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedRoad.desc}
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Sensor Status</span>
                <span className={`font-mono font-bold ${selectedRoad.id === 'lakshmi_mills' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedRoad.id === 'lakshmi_mills' ? 'Severe Gridlock (8 km/h)' : 'Normal Flow (38 km/h)'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
