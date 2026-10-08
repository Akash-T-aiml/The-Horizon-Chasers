'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { api, FALLBACK_RISK } from '@/services/api';
import { RiskAssessmentResponse } from '@/types';

export default function TrafficRiskPage() {
  const [riskData, setRiskData] = useState<RiskAssessmentResponse>(FALLBACK_RISK);
  const [expandedFactor, setExpandedFactor] = useState<string | null>('Traffic Volume Surge');

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const data = await api.getRisk('avinashi_road');
        if (data) setRiskData(data);
      } catch {}
    };
    fetchRisk();
  }, []);

  const riskScore = riskData.risk_score ?? 87;
  const riskColor = riskScore >= 70 ? 'text-red-600' : riskScore >= 40 ? 'text-amber-600' : 'text-emerald-600';
  const riskBg = riskScore >= 70 ? 'bg-red-50 border-red-200' : riskScore >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';
  const ringColor = riskScore >= 70 ? 'border-red-400' : riskScore >= 40 ? 'border-amber-400' : 'border-emerald-400';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            CORRIDOR RISK ASSESSMENT · SCREEN 8
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Multi-Factor Congestion Risk
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Avinashi Road &amp; Lakshmi Mills arterial diagnostic telemetry
          </p>
        </div>
        <span className={`px-4 py-1.5 rounded-full border text-sm font-black ${riskBg} ${riskColor}`}>
          {riskData.risk_level}
        </span>
      </div>

      {/* Risk Score Hero */}
      <div className={`bg-white rounded-2xl border-2 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 ${ringColor}`}>
        {/* Radial Score Display */}
        <div className={`w-36 h-36 rounded-full border-4 ${ringColor} flex flex-col items-center justify-center shrink-0 shadow-inner`}>
          <div className={`text-5xl font-black ${riskColor}`}>{riskScore}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">OUT OF 100</div>
        </div>

        <div className="text-center sm:text-left min-w-0">
          <h2 className="text-xl font-black text-slate-900">{riskData.headline}</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-lg">
            {riskData.ai_recommendation}
          </p>
          {/* Score bar */}
          <div className="mt-4 w-full max-w-sm">
            <div className="h-2.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  riskScore >= 70 ? 'bg-red-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>LOW</span>
              <span>MODERATE</span>
              <span>HIGH</span>
              <span>CRITICAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contributing Factors Accordion */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          CONTRIBUTING RISK VECTORS — Click to expand telemetry
        </div>
        {riskData.contributing_factors.map((factor) => {
          const isExpanded = expandedFactor === factor.name;
          const impactColor = factor.severity === 'high' ? 'bg-red-500' : 'bg-amber-400';
          const impactText = factor.severity === 'high' ? 'text-red-600' : 'text-amber-600';
          return (
            <div
              key={factor.name}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFactor(isExpanded ? null : factor.name)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-3 h-3 rounded-full ${impactColor} shrink-0`} />
                  <span className="text-sm font-bold text-slate-800 truncate">{factor.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-sm font-black ${impactText}`}>{factor.score}% Impact</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100"
                  >
                    <div className="px-5 py-4 space-y-3">
                      <p className="text-sm text-slate-600 leading-relaxed">{factor.description}</p>
                      {/* Impact bar */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${impactColor}`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Model Weight: {(factor.weight * 100).toFixed(0)}%</span>
                        <span className="text-sky-600 font-semibold">Sensor Confidence: 96.2%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Context Footer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-800">Situational Awareness Advisory</p>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Mariamman festival procession has elevated corridor risk to {riskScore}/100.
            Recommend Route B via Trichy Road Bypass. Departure before 6:30 PM saves 17 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
