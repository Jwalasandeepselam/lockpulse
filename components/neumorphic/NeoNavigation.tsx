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
  HelpCircle,
  LogOut,
  User,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import { NeoIconButton } from './NeoIconButton';

export const NeoNavigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Shield },
    { name: 'Devices', href: '/devices', icon: Laptop },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Security', href: '/security', icon: Lock },
    { name: 'AI & Support', href: '/support', icon: Bot },
  ];

  return (
    <>
      {/* Desktop Topbar */}
      <header className="sticky top-0 z-40 w-full neo-glass border-b border-white/60 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pulse-blue to-pulse-cyan shadow-glow-accent flex items-center justify-center text-white font-heading font-extrabold text-xl tracking-tighter transition-transform group-hover:scale-105">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-pulse-blue transition-colors">
                LOCK<span className="text-pulse-blue">PULSE</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">
                Security Control
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 p-1.5 rounded-2xl shadow-neo-pressed dark:shadow-neo-dark-pressed border border-slate-300/40 dark:border-white/5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-surface-card dark:bg-surface-darkcard text-pulse-blue dark:text-pulse-sky shadow-neo-flat dark:shadow-neo-dark-flat border border-white/70 dark:border-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', isActive ? 'text-pulse-blue' : 'text-slate-500')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <Link href="/devices/connect">
              <button className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-card dark:bg-surface-darkcard text-xs font-heading font-bold text-slate-700 dark:text-slate-200 shadow-neo-flat dark:shadow-neo-dark-flat hover:shadow-neo-raised border border-white/70 dark:border-white/10 transition-all">
                <Zap className="w-3.5 h-3.5 text-pulse-blue" />
                <span>Pair Laptop</span>
              </button>
            </Link>

            <Link href="/account">
              <NeoIconButton size="sm" variant="raised" aria-label="User Account">
                <User className="w-4 h-4" />
              </NeoIconButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 neo-glass border-t border-white/60 dark:border-white/5 py-2 px-4 flex items-center justify-around shadow-neo-floating">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-pulse-blue dark:text-pulse-sky font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                  isActive
                    ? 'bg-surface-card dark:bg-surface-darkcard shadow-neo-flat dark:shadow-neo-dark-flat border border-white/70'
                    : 'bg-transparent'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-heading">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
