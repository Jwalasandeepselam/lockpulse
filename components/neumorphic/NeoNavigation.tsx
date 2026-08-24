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
      <header className="sticky top-0 z-40 w-full bg-palette-white/90 dark:bg-[#181717]/90 backdrop-blur-md border-b border-palette-sand dark:border-[#3A3837] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-palette-black dark:bg-palette-white text-white dark:text-palette-black flex items-center justify-center font-heading font-extrabold text-xl tracking-tighter transition-transform group-hover:scale-105 shadow-editorial-sm">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-2xl tracking-wider text-palette-black dark:text-white group-hover:text-palette-ash transition-colors">
                LOCKPULSE
              </span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-palette-ash">
                Security Control
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-palette-canvas dark:bg-[#222020] p-1.5 rounded-2xl border border-palette-sand dark:border-[#3E3B3A]">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-palette-white dark:bg-[#323030] text-palette-black dark:text-white shadow-editorial-sm border border-palette-sand dark:border-[#4A4747]'
                      : 'text-palette-ash hover:text-palette-black dark:hover:text-white'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', isActive ? 'text-palette-black dark:text-white' : 'text-palette-ash')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <Link href="/devices/connect">
              <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-palette-white dark:bg-[#222020] text-xs font-heading tracking-wide uppercase text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A] hover:border-palette-ash shadow-editorial-sm transition-all">
                <Zap className="w-3.5 h-3.5 text-palette-black dark:text-white" />
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-palette-white/95 dark:bg-[#181717]/95 backdrop-blur-lg border-t border-palette-sand dark:border-[#3A3837] py-2.5 px-4 flex items-center justify-around shadow-editorial-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-palette-black dark:text-white font-bold'
                  : 'text-palette-ash hover:text-palette-charcoal'
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                  isActive
                    ? 'bg-palette-sand-light dark:bg-[#323030] text-palette-black dark:text-white'
                    : 'bg-transparent'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-sans">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
