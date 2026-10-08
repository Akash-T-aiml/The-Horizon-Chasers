import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'TRAFFIX | Predictive Traffic Decision Assistant',
  description: 'Predictive traffic intelligence platform for proactive commuter route decisioning, shockwave propagation forecasting, and departure time optimization.',
  keywords: ['traffic prediction', 'commute optimization', 'congestion propagation', 'urban mobility', 'Coimbatore'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-50 text-slate-900 overflow-x-hidden">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-900">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
