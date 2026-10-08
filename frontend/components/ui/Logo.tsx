'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  isPredicting?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', isPredicting = false }) => {
  const dimensions = {
    sm: { icon: 20, text: 'text-base', spacing: 'gap-2' },
    md: { icon: 26, text: 'text-xl', spacing: 'gap-2.5' },
    lg: { icon: 34, text: 'text-2xl', spacing: 'gap-3' }
  }[size];

  return (
    <Link href="/" className={`flex items-center ${dimensions.spacing} group cursor-pointer select-none`}>
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div 
          className={`absolute inset-0 rounded-xl bg-sky-500/15 blur-sm transition-all duration-300 group-hover:bg-sky-500/25 ${
            isPredicting ? 'animate-ping opacity-75' : ''
          }`} 
        />
        
        {/* Clean Bright Vector Brand Icon */}
        <div className="relative z-10 w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 group-hover:scale-105 ${isPredicting ? 'animate-spin' : ''}`}
          >
            {/* Connected converging road vectors */}
            <path
              d="M3 19L9 5"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M21 19L15 5"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Dynamic arrow prediction vector */}
            <path
              d="M12 4L12 17M12 4L9 7M12 4L15 7"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="19" r="2" fill="#0284C7" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-wider text-slate-900 ${dimensions.text} font-mono`}>
            TRAFFIX
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 tracking-tight">
            AI
          </span>
        </div>
        {size !== 'sm' && (
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
            Predictive Traffic Intelligence
          </span>
        )}
      </div>
    </Link>
  );
};
