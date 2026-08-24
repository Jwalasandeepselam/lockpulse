'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Laptop,
  Activity,
  Plus,
  Zap,
  Lock,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoDeviceCard } from '@/components/neumorphic/NeoDeviceCard';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';
import { WasThisYouModal } from '@/components/security/WasThisYouModal';
import { initialProfile, initialDevices, initialEvents } from '@/lib/store';
import { Device, SecurityEvent } from '@/lib/types';

export default function DashboardPage() {
  const [profile] = useState(initialProfile);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [events, setEvents] = useState<SecurityEvent[]>(initialEvents);
  const [lockingDeviceId, setLockingDeviceId] = useState<string | null>(null);

  // Was This You Modal State
  const [activeWasThisYouEvent, setActiveWasThisYouEvent] = useState<SecurityEvent | null>(
    events.find((e) => e.event_type === 'suspicious_unlock' && !e.is_resolved) || null
  );
  const [isWasThisYouOpen, setIsWasThisYouOpen] = useState(false);

  // Compute overall security status
  const unaddressedSuspiciousEvents = events.filter(
    (e) => e.event_type === 'suspicious_unlock' && !e.is_resolved
  );
  const isOverallSecure = unaddressedSuspiciousEvents.length === 0;

  // Greeting based on current time
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  // Remote Lock Handler
  const handleLockDevice = async (deviceId: string) => {
    setLockingDeviceId(deviceId);

    // Simulate signed command execution flow (30s nonce, agent execution, ACK)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Update device status to locked
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              status: 'locked',
              last_activity: new Date().toISOString(),
            }
          : d
      )
    );

    // Append new security event to timeline
    const targetDev = devices.find((d) => d.id === deviceId);
    const newEvent: SecurityEvent = {
      id: `evt_lock_${Date.now()}`,
      user_id: profile.id,
      device_id: deviceId,
      device_name: targetDev?.device_name || 'Laptop',
      event_type: 'remote_lock_ack',
      severity: 'low',
      title: 'Remote Lock Executed',
      description: `Dispatched signed OS lock command. ${targetDev?.device_name || 'Device'} is now locked.`,
      risk_score: 'LOW',
      metadata: { source: 'mobile_dashboard', nonce: `${Date.now()}-mock-sig` },
      is_resolved: true,
      created_at: new Date().toISOString(),
    };

    setEvents((prev) => [newEvent, ...prev]);
    setLockingDeviceId(null);
  };

  // Confirm legitimate unlock
  const handleConfirmLegitimate = async (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, is_resolved: true, resolution_action: 'confirmed_legitimate' }
          : e
      )
    );
  };

  // Lockdown device from "Was this you?" modal
  const handleLockdownDevice = async (deviceId: string, eventId: string) => {
    await handleLockDevice(deviceId);
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, is_resolved: true, resolution_action: 'remote_locked' }
          : e
      )
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {greeting}, {profile.full_name || 'User'}
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-0.5">
            Your Security Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/devices/connect">
            <NeoButton variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Device
            </NeoButton>
          </Link>
        </div>
      </div>

      {/* Main Security Overview Banner */}
      <NeoCard
        variant="raised"
        glow={isOverallSecure ? 'secure' : 'danger'}
        className="p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center flex-shrink-0 transition-all ${
                isOverallSecure
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-glow-secure'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 shadow-glow-danger animate-pulse'
              }`}
            >
              {isOverallSecure ? (
                <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11" />
              ) : (
                <ShieldAlert className="w-9 h-9 sm:w-11 sm:h-11" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  System Status
                </span>
                <NeoSecurityBadge
                  status={isOverallSecure ? 'secure' : 'danger'}
                  size="sm"
                  label={isOverallSecure ? 'ALL SYSTEMS SECURE' : 'ACTION REQUIRED'}
                />
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {isOverallSecure
                  ? `${devices.length} Devices Protected`
                  : 'Suspicious Unlock Detected'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-lg">
                {isOverallSecure
                  ? 'Cryptographic lock channels active. No unauthorized access detected.'
                  : 'A laptop was unlocked while your phone was away. Review the alert below.'}
              </p>
            </div>
          </div>

          {/* Quick Alert CTA */}
          {!isOverallSecure && activeWasThisYouEvent && (
            <div className="w-full md:w-auto">
              <NeoButton
                variant="danger"
                size="lg"
                onClick={() => setIsWasThisYouOpen(true)}
                leftIcon={<AlertTriangle className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Resolve "Was This You?"
              </NeoButton>
            </div>
          )}
        </div>
      </NeoCard>

      {/* Main Grid: Devices (Left/Top) & Recent Activity (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Devices Column (2 Cols on Large Screens) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-pulse-blue" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Your Devices
              </h3>
            </div>
            <Link
              href="/devices"
              className="text-xs font-heading font-bold text-pulse-blue dark:text-pulse-sky hover:underline flex items-center gap-1"
            >
              Manage All ({devices.length}) <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {devices.map((device) => (
              <NeoDeviceCard
                key={device.id}
                device={device}
                onLockDevice={handleLockDevice}
                isLocking={lockingDeviceId === device.id}
              />
            ))}
          </div>

          {/* AI Security Quick Insight Card */}
          <NeoCard variant="inset" className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-pulse-blue/15 text-pulse-blue flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                LockPulse Risk Engine
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Proximity heuristics indicate <strong>MacBook Pro</strong> is currently at Home Office with owner away. Auto-lock timeout is active at 5 minutes.
              </p>
              <Link
                href="/support"
                className="inline-block text-pulse-blue dark:text-pulse-sky font-semibold hover:underline mt-1"
              >
                Ask AI Security Assistant →
              </Link>
            </div>
          </NeoCard>
        </div>

        {/* Recent Activity Column */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-pulse-blue" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <Link
              href="/activity"
              className="text-xs font-heading font-bold text-pulse-blue dark:text-pulse-sky hover:underline flex items-center gap-1"
            >
              Full Feed <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <NeoCard variant="raised" className="p-5">
            <NeoTimeline
              events={events.slice(0, 4)}
              onPromptWasThisYou={(evt) => {
                setActiveWasThisYouEvent(evt);
                setIsWasThisYouOpen(true);
              }}
            />
          </NeoCard>
        </div>
      </div>

      {/* "Was This You?" Modal */}
      <WasThisYouModal
        isOpen={isWasThisYouOpen}
        onClose={() => setIsWasThisYouOpen(false)}
        event={activeWasThisYouEvent}
        onConfirmLegitimate={handleConfirmLegitimate}
        onLockdownDevice={handleLockdownDevice}
      />
    </div>
  );
}
