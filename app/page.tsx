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
  ArrowRight,
  EyeOff,
  Server,
  Sparkles,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';

export default function LandingPage() {
  const [activeDemoState, setActiveDemoState] = useState<'normal' | 'suspicious' | 'locked'>('normal');

  return (
    <div className="min-h-screen bg-surface dark:bg-[#13141b] text-foreground flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-surface/90 dark:bg-[#191b24]/90 backdrop-blur-md border-b border-outline-variant/30 dark:border-[#383a47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-neu-button">
              ⚡
            </div>
            <span className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-primary dark:text-primary-fixed">
              LockPulse
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-heading font-bold tracking-wider uppercase text-on-surface-variant">
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#security-model" className="hover:text-primary transition-colors">
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
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Security Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface dark:bg-[#191b24] border border-outline-variant/40 text-primary dark:text-primary-fixed font-heading font-bold uppercase text-xs mb-8 shadow-neu-raised-sm">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Personal Laptop Security Control Plane</span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-on-surface dark:text-white max-w-5xl mx-auto leading-[1.1]">
          STAY IN CONTROL OF YOUR LAPTOP —{' '}
          <span className="text-primary dark:text-primary-fixed">
            EVEN WHEN YOU'RE AWAY.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl font-sans text-on-surface-variant dark:text-[#c4c5d9] max-w-2xl mx-auto leading-relaxed">
          LockPulse connects your phone and laptop so you can monitor security events, detect suspicious access, and remotely lock your computer from anywhere.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
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

        {/* Interactive Stitch Neumorphic Security Core Visualizer */}
        <div id="how-it-works" className="mt-16 max-w-4xl mx-auto">
          <div className="bg-surface dark:bg-[#191b24] rounded-[2.5rem] p-6 sm:p-10 shadow-neu-raised-lg border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-outline-variant/20">
              <div className="text-left">
                <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-on-surface-variant">
                  Live Control Plane Simulation
                </span>
                <h3 className="font-heading text-xl font-bold text-on-surface dark:text-white tracking-tight">
                  Interactive Security Triad
                </h3>
              </div>

              {/* Demo State Switcher */}
              <div className="flex items-center gap-1.5 bg-surface-container dark:bg-[#14151d] p-1.5 rounded-full shadow-neu-recessed">
                <button
                  onClick={() => setActiveDemoState('normal')}
                  className={`px-4 py-1.5 text-xs font-heading font-bold uppercase rounded-full transition-all ${
                    activeDemoState === 'normal'
                      ? 'bg-primary text-white shadow-neu-button'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Nearby
                </button>
                <button
                  onClick={() => setActiveDemoState('suspicious')}
                  className={`px-4 py-1.5 text-xs font-heading font-bold uppercase rounded-full transition-all ${
                    activeDemoState === 'suspicious'
                      ? 'bg-tertiary-container text-white shadow-neu-button'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Away + Unlock
                </button>
                <button
                  onClick={() => setActiveDemoState('locked')}
                  className={`px-4 py-1.5 text-xs font-heading font-bold uppercase rounded-full transition-all ${
                    activeDemoState === 'locked'
                      ? 'bg-error text-white shadow-neu-button'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Locked Down
                </button>
              </div>
            </div>

            {/* Triad Flow Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Node 1: Phone */}
              <div
                className={`bg-surface dark:bg-[#191b24] p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center space-y-3 ${
                  activeDemoState === 'suspicious'
                    ? 'shadow-neu-raised ring-2 ring-tertiary-container/40 glow-amber'
                    : 'shadow-neu-raised-sm'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-surface dark:bg-[#191b24] text-primary dark:text-primary-fixed shadow-neu-recessed flex items-center justify-center">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-on-surface dark:text-white">
                    YOUR PHONE
                  </h4>
                  <p className="text-xs font-sans text-on-surface-variant mt-0.5">
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
              </div>

              {/* Node 2: Cloud */}
              <div className="bg-surface-container-lowest dark:bg-[#14151d] p-6 rounded-2xl shadow-neu-recessed border border-outline-variant/20 flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-surface dark:bg-[#191b24] text-primary dark:text-primary-fixed shadow-neu-raised-sm flex items-center justify-center">
                  <Server className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-on-surface dark:text-white">
                    LOCKPULSE CLOUD
                  </h4>
                  <p className="text-xs font-sans text-on-surface-variant mt-0.5">
                    Deterministic Risk Engine & Ed25519 Bus
                  </p>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant font-bold uppercase">
                  Zero Credential Storage
                </span>
              </div>

              {/* Node 3: Laptop */}
              <div
                className={`bg-surface dark:bg-[#191b24] p-6 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center space-y-3 ${
                  activeDemoState === 'locked'
                    ? 'shadow-neu-raised ring-2 ring-error/50 glow-coral'
                    : 'shadow-neu-raised-sm'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-surface dark:bg-[#191b24] text-primary dark:text-primary-fixed shadow-neu-recessed flex items-center justify-center">
                  <Laptop className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-on-surface dark:text-white">
                    YOUR LAPTOP
                  </h4>
                  <p className="text-xs font-sans text-on-surface-variant mt-0.5">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Core Security Architecture
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-on-surface dark:text-white mt-2">
            ENGINEERED FOR LAPTOP DEFENSE.
          </h2>
          <p className="font-sans text-on-surface-variant dark:text-[#c4c5d9] max-w-xl mx-auto mt-3 text-sm sm:text-base">
            Not remote desktop. Not invasive surveillance. LockPulse provides a dedicated security control plane.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-surface dark:bg-[#191b24] rounded-2xl p-7 shadow-neu-raised border border-outline-variant/30 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-recessed text-primary flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-on-surface dark:text-white">
              Instant Remote Lock
            </h3>
            <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
              Lock your Windows or macOS laptop immediately from your phone using native OS APIs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-surface dark:bg-[#191b24] rounded-2xl p-7 shadow-neu-raised border border-outline-variant/30 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-recessed text-primary flex items-center justify-center">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-on-surface dark:text-white">
              "Was This You?" Alerts
            </h3>
            <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
              When your laptop is unlocked while your phone is away, receive a single-tap alert to immediately lock down.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-surface dark:bg-[#191b24] rounded-2xl p-7 shadow-neu-raised border border-outline-variant/30 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-recessed text-primary flex items-center justify-center">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-on-surface dark:text-white">
              Proximity Risk Signals
            </h3>
            <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
              Transparent proximity heuristics assess risk without constant battery-draining GPS tracking.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-surface dark:bg-[#191b24] rounded-2xl p-7 shadow-neu-raised border border-outline-variant/30 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-recessed text-primary flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-on-surface dark:text-white">
              Ed25519 Cryptography
            </h3>
            <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
              Device-bound cryptographic keypairs and 30-second replay-protected nonces ensure commands cannot be spoofed.
            </p>
          </div>
        </div>
      </section>

      {/* Zero Trust Principles */}
      <section id="security-model" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-surface dark:bg-[#191b24] rounded-[2.5rem] p-8 sm:p-12 shadow-neu-raised-lg border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-neu-button">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-on-surface dark:text-white">
                Zero-Trust Privacy Boundaries
              </h3>
              <p className="text-xs font-sans text-on-surface-variant">
                How LockPulse protects your credentials and hardware
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 bg-surface-container-lowest dark:bg-[#14151d] rounded-xl shadow-neu-recessed border border-outline-variant/20 space-y-1">
              <span className="font-bold text-on-surface dark:text-white block font-heading">No Raw OS Passwords</span>
              <p className="text-on-surface-variant">Your laptop credentials remain locked in Windows TPM / Apple Secure Enclave.</p>
            </div>

            <div className="p-4 bg-surface-container-lowest dark:bg-[#14151d] rounded-xl shadow-neu-recessed border border-outline-variant/20 space-y-1">
              <span className="font-bold text-on-surface dark:text-white block font-heading">No Surveillance</span>
              <p className="text-on-surface-variant">We never capture webcams, microphones, keystrokes, or screen contents.</p>
            </div>

            <div className="p-4 bg-surface-container-lowest dark:bg-[#14151d] rounded-xl shadow-neu-recessed border border-outline-variant/20 space-y-1">
              <span className="font-bold text-on-surface dark:text-white block font-heading">Official Platform Hooks</span>
              <p className="text-on-surface-variant">Triggers legitimate platform lock screens without bypassing OS security.</p>
            </div>

            <div className="p-4 bg-surface-container-lowest dark:bg-[#14151d] rounded-xl shadow-neu-recessed border border-outline-variant/20 space-y-1">
              <span className="font-bold text-on-surface dark:text-white block font-heading">Row-Level Security</span>
              <p className="text-on-surface-variant">PostgreSQL database policies isolate your devices from every other user.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-sans text-on-surface-variant">
              Ready to protect your Windows or Mac laptop?
            </span>
            <Link href="/dashboard">
              <NeoButton variant="primary" size="md">
                Launch Control Center
              </NeoButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-outline-variant/30 bg-surface dark:bg-[#191b24] text-center text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-base text-primary dark:text-primary-fixed">
              LockPulse
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
