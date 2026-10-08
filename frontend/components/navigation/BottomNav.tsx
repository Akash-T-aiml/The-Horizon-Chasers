'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Map, Activity, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'HOME', href: '/', icon: Home },
    { label: 'PLAN', href: '/plan', icon: Compass },
    { label: 'MAP', href: '/map', icon: Map },
    { label: 'LIVE', href: '/live', icon: Activity },
    { label: 'YOU', href: '/you', icon: User }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/home';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md pb-safe pt-2 px-3">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
                active
                  ? 'text-sky-600 scale-105 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-600" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-wider ${active ? 'text-sky-700 font-bold' : 'text-slate-500 font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
