'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Smartphone,
  Laptop,
  Radio,
  BellRing,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Zap,
  CheckCircle,
  ArrowRight,
  EyeOff,
  Server,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';

export default function LandingPage() {
  const [activeDemoState, setActiveDemoState] = useState<'normal' | 'suspicious' | 'locked'>('normal');

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-foreground flex flex-col justify-between selection:bg-pulse-blue selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full neo-glass border-b border-white/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pulse-blue to-pulse-cyan shadow-glow-accent flex items-center justify-center text-white font-heading font-extrabold text-2xl">
              ⚡
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              LOCK<span className="text-pulse-blue">PULSE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-heading font-semibold text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-pulse-blue transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-pulse-blue transition-colors">
              Features
            </a>
            <a href="#security-model" className="hover:text-pulse-blue transition-colors">
              Zero-Trust Security
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <NeoButton variant="ghost" size="sm">
                Sign In
              </NeoButton>
            </Link>
            <Link href="/dashboard">
              <NeoButton variant="primary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                Launch App
              </NeoButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Security Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pulse-blue/10 border border-pulse-blue/20 text-pulse-blue dark:text-pulse-sky font-heading text-xs font-bold mb-6 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Your Laptop. Your Control. Wherever You Are.</span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1]">
          Stay in control of your laptop —{' '}
          <span className="bg-gradient-to-r from-pulse-blue via-pulse-cyan to-sky-400 bg-clip-text text-transparent">
            even when you're away.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          LockPulse connects your phone and computer so you can monitor important security events, detect suspicious access, and remotely protect your laptop from anywhere.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <NeoButton variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Started Free
            </NeoButton>
          </Link>
          <a href="#how-it-works">
            <NeoButton variant="secondary" size="xl">
              How It Works
            </NeoButton>
          </a>
        </div>

        {/* Interactive Architecture Flow Visualizer */}
        <div className="mt-16 max-w-4xl mx-auto">
          <NeoCard variant="floating" className="p-6 sm:p-10 border border-white/80 dark:border-white/10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-300/40 dark:border-white/10">
              <div className="text-left">
                <span className="text-[11px] font-bold font-heading uppercase tracking-widest text-slate-500">
                  Live Control Plane Simulation
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Interactive Security Triad
                </h3>
              </div>

              {/* Demo State Switcher */}
              <div className="flex items-center gap-2 bg-[#E2EAF2] dark:bg-[#0E1626] p-1 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
                <button
                  onClick={() => setActiveDemoState('normal')}
                  className={`px-3 py-1 text-xs font-heading font-bold rounded-lg transition-all ${
                    activeDemoState === 'normal'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Nearby
                </button>
                <button
                  onClick={() => setActiveDemoState('suspicious')}
                  className={`px-3 py-1 text-xs font-heading font-bold rounded-lg transition-all ${
                    activeDemoState === 'suspicious'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Away + Unlock
                </button>
                <button
                  onClick={() => setActiveDemoState('locked')}
                  className={`px-3 py-1 text-xs font-heading font-bold rounded-lg transition-all ${
                    activeDemoState === 'locked'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Locked Down
                </button>
              </div>
            </div>

            {/* Triad Flow Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative">
              {/* Node 1: Phone */}
              <NeoCard
                variant={activeDemoState === 'suspicious' ? 'raised' : 'flat'}
                glow={activeDemoState === 'suspicious' ? 'warning' : 'none'}
                className="p-5 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-pulse-blue/15 text-pulse-blue flex items-center justify-center shadow-neo-sm">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                    YOUR PHONE
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeDemoState === 'normal'
                      ? 'Proximity: Owner Nearby'
                      : activeDemoState === 'suspicious'
                      ? '⚠️ Push Alert: Was this you?'
                      : 'Lock Command Dispatched'}
                  </p>
                </div>
                <NeoSecurityBadge
                  status={activeDemoState === 'suspicious' ? 'warning' : 'secure'}
                  size="sm"
                  label={activeDemoState === 'suspicious' ? 'PHONE AWAY' : 'NEARBY'}
                />
              </NeoCard>

              {/* Node 2: Cloud */}
              <NeoCard
                variant="inset"
                className="p-5 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Server className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                    LockPulse Cloud
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Deterministic Risk Engine & Ed25519 Command Bus
                  </p>
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-semibold">
                  Zero OS Credential Storage
                </span>
              </NeoCard>

              {/* Node 3: Laptop */}
              <NeoCard
                variant={activeDemoState === 'locked' ? 'raised' : 'flat'}
                glow={activeDemoState === 'locked' ? 'danger' : 'none'}
                className="p-5 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-neo-sm">
                  <Laptop className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                    YOUR LAPTOP
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeDemoState === 'normal'
                      ? 'Protected & In Sync'
                      : activeDemoState === 'suspicious'
                      ? 'Unlocked (Owner Absent)'
                      : '✓ LockWorkStation Active'}
                  </p>
                </div>
                <NeoSecurityBadge
                  status={
                    activeDemoState === 'locked'
                      ? 'locked'
                      : activeDemoState === 'suspicious'
                      ? 'danger'
                      : 'secure'
                  }
                  size="sm"
                  label={
                    activeDemoState === 'locked'
                      ? 'OS LOCKED'
                      : activeDemoState === 'suspicious'
                      ? 'UNLOCKED'
                      : 'PROTECTED'
                  }
                />
              </NeoCard>
            </div>
          </NeoCard>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold font-heading uppercase tracking-widest text-pulse-blue">
            Core Capabilities
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white mt-2">
            Engineered for personal laptop defense.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-4 text-sm sm:text-base">
            Not remote desktop. Not invasive surveillance. LockPulse provides a dedicated, lightweight security control plane.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <NeoCard variant="raised" className="p-6 space-y-4 hover:shadow-neo-floating transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-security-danger flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Instant Remote Lock
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Lock your Windows or macOS laptop immediately from your phone using official platform APIs (LockWorkStation / SACLockScreenImmediate).
            </p>
          </NeoCard>

          {/* Feature 2 */}
          <NeoCard variant="raised" className="p-6 space-y-4 hover:shadow-neo-floating transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              "Was This You?" Alerts
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When your laptop is unlocked while your phone is away, receive a proactive notification with single-tap lockdown and incident review.
            </p>
          </NeoCard>

          {/* Feature 3 */}
          <NeoCard variant="raised" className="p-6 space-y-4 hover:shadow-neo-floating transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-pulse-blue flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Proximity Risk Signals
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Transparent, non-invasive proximity heuristics that assess risk without constant battery-draining GPS tracking.
            </p>
          </NeoCard>

          {/* Feature 4 */}
          <NeoCard variant="raised" className="p-6 space-y-4 hover:shadow-neo-floating transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Ed25519 Cryptography
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Device-bound cryptographic keypairs and 30-second replay-protected nonces ensure commands cannot be spoofed or repeated.
            </p>
          </NeoCard>
        </div>
      </section>

      {/* Security Architecture & Privacy Principles */}
      <section id="security-model" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <NeoCard variant="floating" className="p-8 sm:p-12 border border-white/80 dark:border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                Zero-Trust & Privacy Boundaries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How LockPulse respects operating system boundaries
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3 p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">No Raw OS Passwords</span>
                <p className="mt-0.5">Your laptop credentials and biometric keys remain locked in Windows TPM / Apple Secure Enclave.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">No Surveillance or Screen Viewing</span>
                <p className="mt-0.5">We never capture webcams, microphones, keystrokes, or screen contents.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Official OS Lock Hooks</span>
                <p className="mt-0.5">Commands trigger legitimate platform lock screens without bypassing OS security.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Strict Row-Level Security</span>
                <p className="mt-0.5">PostgreSQL database policies isolate your devices from every other user.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-300/40 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Ready to secure your MacBook or Windows laptop?
            </span>
            <Link href="/dashboard">
              <NeoButton variant="primary" size="md">
                Launch Control Center
              </NeoButton>
            </Link>
          </div>
        </NeoCard>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/60 dark:border-white/5 neo-glass text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
              LOCK<span className="text-pulse-blue">PULSE</span>
            </span>
            <span>— Personal Laptop Security Network</span>
          </div>
          <div>
            © {new Date().getFullYear()} LockPulse Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
