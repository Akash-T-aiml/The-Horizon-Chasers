'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Activity, Database, CloudRain, TrendingUp, GitFork,
  CheckCircle2, Cpu, ArrowRight, ShieldAlert, Sparkles
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface PredictionSequenceModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  destination?: string;
}

const PREDICTION_STEPS = [
  {
    title: 'Reading current traffic',
    desc: 'Querying 42 probe telemetry stations and municipal arterial loop detectors...',
    icon: Activity,
    color: '#00F0FF'
  },
  {
    title: 'Analyzing historical pattern',
    desc: 'Matching Friday 18:30 commute trends over 52 historical weeks...',
    icon: Database,
    color: '#3B82F6'
  },
  {
    title: 'Checking weather/event context',
    desc: 'Factoring evening drizzle (-14% friction) & Mariamman temple chariot crowd...',
    icon: CloudRain,
    color: '#A855F7'
  },
  {
    title: 'Forecasting congestion',
    desc: 'Simulating queue accumulation at Lakshmi Mills bottleneck (T+18 min onset)...',
    icon: TrendingUp,
    color: '#F59E0B'
  },
  {
    title: 'Tracing propagation',
    desc: 'Computing 3.2 km backward shockwave wavefront along Avinashi corridor...',
    icon: GitFork,
    color: '#F43F5E'
  },
  {
    title: 'Comparing routes',
    desc: 'Simulating Route A (Avinashi), Route B (Trichy Road Link), Route C (Sathy Road)...',
    icon: Cpu,
    color: '#38BDF8'
  },
  {
    title: 'Generating recommendation',
    desc: 'Optimized decision: Route B delivers 14 min savings with Low Risk profile.',
    icon: CheckCircle2,
    color: '#10B981'
  }
];

export const PredictionSequenceModal: React.FC<PredictionSequenceModalProps> = ({
  isOpen,
  onComplete,
  destination = 'Coimbatore Railway Station'
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const totalSteps = PREDICTION_STEPS.length;
    let stepIndex = 0;

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < totalSteps) {
        setCurrentStep(stepIndex);
        setProgress(Math.round(((stepIndex + 1) / totalSteps) * 100));
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          } else {
            router.push('/routes');
          }
        }, 800);
      }
    }, 650);

    return () => clearInterval(interval);
  }, [isOpen, onComplete, router]);

  if (!isOpen) return null;

  const activeStepInfo = PREDICTION_STEPS[currentStep] || PREDICTION_STEPS[PREDICTION_STEPS.length - 1];
  const StepIcon = activeStepInfo.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Deep blur backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#040810]/85 backdrop-blur-xl"
        />

        {/* Core Prediction Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg rounded-3xl glass-panel-elevated border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 overflow-hidden"
        >
          {/* Animated Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Logo size="sm" isPredicting={true} />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>AI PREDICTIVE ENGINE</span>
            </div>
          </div>

          {/* Central Animated Hologram */}
          <div className="py-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              {/* Outer pulsing laser rings */}
              <div
                className="absolute inset-0 rounded-full blur-xl transition-all duration-300"
                style={{ backgroundColor: `${activeStepInfo.color}30` }}
              />
              <div className="relative w-24 h-24 rounded-2xl bg-slate-900 border-2 border-white/10 flex items-center justify-center shadow-xl">
                <StepIcon
                  className="w-12 h-12 transition-all duration-500 animate-pulse"
                  style={{ color: activeStepInfo.color }}
                />
              </div>
            </div>

            <div className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-1">
              Step {currentStep + 1} of {PREDICTION_STEPS.length}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeStepInfo.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mt-2 leading-relaxed min-h-[40px]">
              {activeStepInfo.desc}
            </p>
          </div>

          {/* Smooth Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Computing Journey Decision</span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Steps Timeline Track */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {PREDICTION_STEPS.map((s, idx) => (
              <div
                key={s.title}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx <= currentStep ? 'bg-cyan-400' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
