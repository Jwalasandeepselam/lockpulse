'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Laptop,
  Activity,
  Lock,
  Bot,
  User,
  Zap,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { clsx } from 'clsx';

export const NeoNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Devices', href: '/devices', icon: Laptop },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Security', href: '/security', icon: Lock },
    { name: 'Profile', href: '/account', icon: User },
  ];

  return (
    <>
      {/* Desktop Topbar */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 dark:bg-[#191b24]/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-[#383a47] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-neu-raised-sm group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl tracking-tight text-primary dark:text-primary-fixed group-hover:opacity-90 transition-opacity">
                LockPulse
              </span>
              <span className="text-[10px] font-mono font-medium tracking-widest text-on-surface-variant uppercase">
                Security Control Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-2 bg-surface-container dark:bg-[#232530] p-1.5 rounded-full shadow-neu-recessed border border-outline-variant/20">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 px-5 py-2 rounded-full text-xs font-heading font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white shadow-neu-button'
                      : 'text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <Link href="/devices/connect">
              <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface dark:bg-[#232530] text-xs font-heading font-bold text-primary dark:text-primary-fixed shadow-neu-raised-sm hover:opacity-90 transition-all border border-outline-variant/30">
                <Zap className="w-3.5 h-3.5" />
                <span>Pair Laptop</span>
              </button>
            </Link>

            <Link href="/account" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full shadow-neu-raised bg-surface-container flex items-center justify-center text-primary font-heading font-bold overflow-hidden border border-outline-variant/40">
                S
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Floating AI Assistant FAB Button (from Stitch Design) */}
      <Link href="/support" aria-label="AI Security Assistant">
        <div className="fixed bottom-24 right-5 md:right-10 md:bottom-10 w-14 h-14 bg-surface dark:bg-[#232530] rounded-full shadow-neu-raised flex items-center justify-center text-primary dark:text-primary-fixed hover:scale-110 active:shadow-neu-recessed transition-all duration-300 z-40 group cursor-pointer border border-outline-variant/30">
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary-container/20 blur-md -z-10" />
          <Bot className="w-6 h-6 text-primary dark:text-primary-fixed" />
        </div>
      </Link>

      {/* Floating Neumorphic Bottom Navigation Bar (Stitch Mobile Pill) */}
      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 flex justify-around items-center py-2 px-3 bg-surface-container dark:bg-[#232530] rounded-full shadow-neu-raised border border-outline-variant/30">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-neu-button scale-105'
                  : 'text-on-surface-variant hover:text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </>
  );
};
