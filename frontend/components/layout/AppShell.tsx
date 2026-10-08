'use client';

import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { BottomNav } from '@/components/navigation/BottomNav';
import { NotificationSheet } from '@/components/notifications/NotificationSheet';
import { api } from '@/services/api';
import { AlertItem } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.getAlerts();
        setAlerts(data);
      } catch (e) {
        console.error('Failed to load alerts', e);
      }
    };
    fetchAlerts();
  }, []);

  const activeAlert = alerts.length > 0 ? alerts[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative w-full max-w-full overflow-x-hidden">
      {/* Top Navigation */}
      <TopNav
        onOpenNotifications={() => {
          setIsNotificationOpen(true);
          setHasUnread(false);
        }}
        hasUnreadAlerts={hasUnread}
      />

      {/* Demo Status Banner */}
      <div className="w-full bg-white border-b border-slate-200 py-1.5 px-4 text-center text-xs text-slate-600 font-medium flex items-center justify-center gap-2 z-30 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-slate-700">Coimbatore Metro Corridor</span>
        <span className="text-slate-300">•</span>
        <span>Google Maps Traffic Telemetry Active</span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span className="hidden sm:inline text-slate-500">KPR Institute ⇄ Railway Station</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-20 md:pb-12 w-full max-w-full overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Notification Sheet / Modal */}
      <NotificationSheet
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        alert={activeAlert}
      />
    </div>
  );
};
