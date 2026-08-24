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
    <div className="min-h-screen bg-palette-canvas dark:bg-[#141313] text-foreground flex flex-col justify-between selection:bg-palette-black selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-palette-white/90 dark:bg-[#181717]/90 backdrop-blur-md border-b border-palette-sand dark:border-[#3A3837]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-palette-black dark:bg-palette-white text-white dark:text-palette-black shadow-editorial-sm flex items-center justify-center font-heading font-extrabold text-2xl">
              ⚡
            </div>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-wider text-palette-black dark:text-white">
              LOCKPULSE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-heading tracking-widest uppercase text-palette-ash">
            <a href="#how-it-works" className="hover:text-palette-black dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-palette-black dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#security-model" className="hover:text-palette-black dark:hover:text-white transition-colors">
              Zero-Trust
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
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Security Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-palette-white dark:bg-[#222020] border border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand font-heading tracking-wider uppercase text-xs mb-8 shadow-editorial-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Personal Laptop Security Control Plane</span>
        </div>

        <h1 className="font-heading font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-palette-black dark:text-white max-w-5xl mx-auto leading-[1.02]">
          STAY IN CONTROL OF YOUR LAPTOP —{' '}
          <span className="text-palette-ash">
            EVEN WHEN YOU'RE AWAY.
          </span>
        </h1>

        <p className="mt-8 text-base sm:text-xl font-sans text-palette-charcoal dark:text-palette-sand max-w-2xl mx-auto leading-relaxed font-normal">
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
        <div id="how-it-works" className="mt-20 max-w-4xl mx-auto">
          <NeoCard variant="floating" className="p-6 sm:p-10 border border-palette-sand dark:border-[#3E3B3A]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-palette-sand/60 dark:border-[#3E3B3A]">
              <div className="text-left">
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-palette-ash">
                  Live Control Plane Simulation
                </span>
                <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
                  Interactive Security Triad
                </h3>
              </div>

              {/* Demo State Switcher */}
              <div className="flex items-center gap-1.5 bg-palette-sand-light dark:bg-[#141313] p-1.5 rounded-xl border border-palette-sand dark:border-[#3E3B3A]">
                <button
                  onClick={() => setActiveDemoState('normal')}
                  className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wide rounded-lg transition-all ${
                    activeDemoState === 'normal'
                      ? 'bg-palette-black dark:bg-palette-white text-white dark:text-palette-black shadow-editorial-sm'
                      : 'text-palette-charcoal dark:text-palette-sand hover:text-palette-black'
                  }`}
                >
                  Nearby
                </button>
                <button
                  onClick={() => setActiveDemoState('suspicious')}
                  className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wide rounded-lg transition-all ${
                    activeDemoState === 'suspicious'
                      ? 'bg-amber-500 text-white shadow-editorial-sm'
                      : 'text-palette-charcoal dark:text-palette-sand hover:text-palette-black'
                  }`}
                >
                  Away + Unlock
                </button>
                <button
                  onClick={() => setActiveDemoState('locked')}
                  className={`px-3 py-1.5 text-xs font-heading uppercase tracking-wide rounded-lg transition-all ${
                    activeDemoState === 'locked'
                      ? 'bg-security-danger text-white shadow-editorial-sm'
                      : 'text-palette-charcoal dark:text-palette-sand hover:text-palette-black'
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
                className="p-6 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A] flex items-center justify-center shadow-editorial-sm">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading text-base tracking-wide text-palette-black dark:text-white">
                    YOUR PHONE
                  </h4>
                  <p className="text-xs font-sans text-palette-ash mt-0.5">
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
                className="p-6 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-palette-white dark:bg-[#222020] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A] flex items-center justify-center">
                  <Server className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading text-base tracking-wide text-palette-black dark:text-white">
                    LOCKPULSE CLOUD
                  </h4>
                  <p className="text-xs font-sans text-palette-ash mt-0.5">
                    Deterministic Risk Engine & Ed25519 Command Bus
                  </p>
                </div>
                <span className="font-mono text-[10px] text-palette-ash font-bold uppercase">
                  Zero Credential Storage
                </span>
              </NeoCard>

              {/* Node 3: Laptop */}
              <NeoCard
                variant={activeDemoState === 'locked' ? 'raised' : 'flat'}
                glow={activeDemoState === 'locked' ? 'danger' : 'none'}
                className="p-6 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A] flex items-center justify-center shadow-editorial-sm">
                  <Laptop className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading text-base tracking-wide text-palette-black dark:text-white">
                    YOUR LAPTOP
                  </h4>
                  <p className="text-xs font-sans text-palette-ash mt-0.5">
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
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-palette-ash">
            Core Security Architecture
          </span>
          <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-palette-black dark:text-white mt-2">
            ENGINEERED FOR PERSONAL LAPTOP DEFENSE.
          </h2>
          <p className="font-sans text-palette-charcoal dark:text-palette-sand max-w-xl mx-auto mt-4 text-sm sm:text-base">
            Not remote desktop. Not invasive surveillance. LockPulse provides a dedicated, lightweight security control plane.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <NeoCard variant="raised" className="p-7 space-y-4 hover:border-palette-ash transition-all">
            <div className="w-12 h-12 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] border border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              Instant Remote Lock
            </h3>
            <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand leading-relaxed">
              Lock your Windows or macOS laptop immediately from your phone using official platform APIs (LockWorkStation / SACLockScreenImmediate).
            </p>
          </NeoCard>

          {/* Feature 2 */}
          <NeoCard variant="raised" className="p-7 space-y-4 hover:border-palette-ash transition-all">
            <div className="w-12 h-12 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] border border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand flex items-center justify-center">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              "Was This You?" Alerts
            </h3>
            <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand leading-relaxed">
              When your laptop is unlocked while your phone is away, receive a proactive notification with single-tap lockdown and incident review.
            </p>
          </NeoCard>

          {/* Feature 3 */}
          <NeoCard variant="raised" className="p-7 space-y-4 hover:border-palette-ash transition-all">
            <div className="w-12 h-12 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] border border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              Proximity Risk Signals
            </h3>
            <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand leading-relaxed">
              Transparent, non-invasive proximity heuristics that assess risk without constant battery-draining GPS tracking.
            </p>
          </NeoCard>

          {/* Feature 4 */}
          <NeoCard variant="raised" className="p-7 space-y-4 hover:border-palette-ash transition-all">
            <div className="w-12 h-12 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] border border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              Ed25519 Cryptography
            </h3>
            <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand leading-relaxed">
              Device-bound cryptographic keypairs and 30-second replay-protected nonces ensure commands cannot be spoofed or repeated.
            </p>
          </NeoCard>
        </div>
      </section>

      {/* Security Architecture & Privacy Principles */}
      <section id="security-model" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <NeoCard variant="floating" className="p-8 sm:p-12 border border-palette-sand dark:border-[#3E3B3A]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-palette-black dark:bg-palette-white text-white dark:text-palette-black flex items-center justify-center">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-3xl text-palette-black dark:text-white tracking-wide">
                ZERO-TRUST PRIVACY BOUNDARIES
              </h3>
              <p className="text-xs font-sans text-palette-ash">
                How LockPulse respects operating system security boundaries
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans text-palette-charcoal dark:text-palette-sand">
            <div className="flex items-start gap-3 p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A]">
              <CheckCircle className="w-4 h-4 text-palette-black dark:text-white flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-palette-black dark:text-white">No Raw OS Passwords</span>
                <p className="mt-0.5 text-palette-ash">Your laptop credentials and biometric keys remain locked in Windows TPM / Apple Secure Enclave.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A]">
              <CheckCircle className="w-4 h-4 text-palette-black dark:text-white flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-palette-black dark:text-white">No Surveillance or Screen Viewing</span>
                <p className="mt-0.5 text-palette-ash">We never capture webcams, microphones, keystrokes, or screen contents.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A]">
              <CheckCircle className="w-4 h-4 text-palette-black dark:text-white flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-palette-black dark:text-white">Official OS Lock Hooks</span>
                <p className="mt-0.5 text-palette-ash">Commands trigger legitimate platform lock screens without bypassing OS security.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A]">
              <CheckCircle className="w-4 h-4 text-palette-black dark:text-white flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-palette-black dark:text-white">Strict Row-Level Security</span>
                <p className="mt-0.5 text-palette-ash">PostgreSQL database policies isolate your devices from every other user.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-palette-sand/60 dark:border-[#3E3B3A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-sans text-palette-ash">
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
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-palette-sand dark:border-[#3A3837] bg-palette-white dark:bg-[#181717] text-center text-xs text-palette-ash">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-base tracking-wider text-palette-black dark:text-white">
              LOCKPULSE
            </span>
            <span className="font-sans">— Personal Laptop Security Network</span>
          </div>
          <div className="font-sans">
            © {new Date().getFullYear()} LockPulse Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
