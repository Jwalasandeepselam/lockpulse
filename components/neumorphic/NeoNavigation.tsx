'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { clsx } from 'clsx';
import { getStoredProfile, getStoredAuth } from '@/lib/store';

export const NeoNavigation: React.FC = () => {
  const pathname = usePathname();
  const [userName, setUserName] = useState('User');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth?.user?.full_name) {
      setUserName(auth.user.full_name);
    } else {
      const p = getStoredProfile();
      if (p?.full_name) setUserName(p.full_name);
    }
  }, []);

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
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#16181F]/85 backdrop-blur-xl border-b border-outline-variant/80 dark:border-white/10 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-neu-button"
            >
              ⚡
            </motion.div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl tracking-tight text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-primary-azure transition-colors">
                LockPulse
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-on-surface-variant dark:text-titanium-400 uppercase">
                Apple Enclave • Titanium
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-surface-container dark:bg-[#1E212B] p-1.5 rounded-full shadow-neu-recessed border border-outline-variant/60 dark:border-white/5 relative">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={clsx(
                      'relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-heading font-bold transition-colors duration-200',
                      isActive
                        ? 'text-white'
                        : 'text-on-surface-variant dark:text-titanium-300 hover:text-on-surface dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="active-desktop-pill"
                      className="absolute inset-0 bg-primary rounded-full shadow-neu-button"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 400, damping: 30 }
                      }
                    />
                  )}
                </motion.div>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <Link href="/devices/connect">
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface dark:bg-[#242735] text-xs font-heading font-bold text-primary dark:text-white shadow-neu-raised-sm hover:bg-surface-container active:scale-95 transition-all border border-outline-variant dark:border-[#383A4A] cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span>Pair Laptop</span>
              </motion.button>
            </Link>

            <Link href="/account" className="flex items-center gap-2" title="Account settings">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-10 h-10 rounded-full shadow-neu-raised-sm bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-azure flex items-center justify-center font-heading font-bold overflow-hidden border border-primary/30"
              >
                {userName.charAt(0).toUpperCase()}
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Floating AI Assistant FAB Button */}
      <Link href="/support" aria-label="AI Security Assistant">
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-24 right-5 md:right-10 md:bottom-10 w-14 h-14 bg-surface dark:bg-[#242735] rounded-full shadow-neu-raised flex items-center justify-center text-primary dark:text-primary-azure z-40 group cursor-pointer border border-outline-variant dark:border-[#383A4A]"
        >
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20 blur-md -z-10" />
          <Bot className="w-6 h-6 text-primary dark:text-primary-azure" />
        </motion.div>
      </Link>

      {/* Floating Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 flex justify-around items-center py-2 px-3 bg-surface/90 dark:bg-[#1E212B]/90 backdrop-blur-xl rounded-full shadow-2xl border border-outline-variant/80 dark:border-white/10">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative flex items-center justify-center"
            >
              <Link
                href={item.href}
                aria-label={item.name}
                className={clsx(
                  'relative z-10 flex flex-col items-center justify-center w-11 h-11 rounded-full transition-colors duration-200',
                  isActive
                    ? 'text-white'
                    : 'text-on-surface-variant dark:text-titanium-400 hover:text-primary dark:hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
              </Link>
              {isActive && (
                <motion.div
                  layoutId="active-mobile-pill"
                  className="absolute inset-0 bg-primary rounded-full shadow-neu-button"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 400, damping: 30 }
                  }
                />
              )}
            </motion.div>
          );
        })}
      </nav>
    </>
  );
};

