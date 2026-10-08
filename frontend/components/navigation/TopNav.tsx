'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Bell, Activity, Compass, MapPin, User, Navigation } from 'lucide-react';

interface TopNavProps {
  onOpenNotifications: () => void;
  hasUnreadAlerts?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenNotifications,
  hasUnreadAlerts = true
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'PLAN', href: '/plan' },
    { label: 'MAP', href: '/map' },
    { label: 'LIVE', href: '/live' },
    { label: 'YOU', href: '/you' }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/home';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/90 border border-slate-200/80">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
                  active
                    ? 'text-sky-700 bg-white border border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Status Pill & Notification Bell */}
        <div className="flex items-center gap-3">
          {/* Live Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>SYSTEM LIVE</span>
          </div>

          {/* Quick Route Shortcut */}
          <Link
            href="/routes"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Active Corridor</span>
          </Link>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition-all shadow-xs group"
          >
            <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
            {hasUnreadAlerts && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
