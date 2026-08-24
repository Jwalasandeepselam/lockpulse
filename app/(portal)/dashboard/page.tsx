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
  ChevronRight,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoDeviceCard } from '@/components/neumorphic/NeoDeviceCard';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
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
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Mobile Top Header (Greeting + Verified Badge) */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full shadow-neu-raised bg-surface-container flex items-center justify-center text-primary font-heading font-bold overflow-hidden border border-outline-variant/40">
            S
          </div>
          <div>
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-primary dark:text-primary-fixed">
              {greeting}, {profile.full_name?.split(' ')[0] || 'Sandeep'}
            </h1>
            <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider block">
              LockPulse Security Plane
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/devices/connect">
            <button className="flex items-center justify-center w-10 h-10 rounded-full text-primary dark:text-primary-fixed shadow-neu-raised hover:scale-105 transition-all border border-outline-variant/30">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex items-center justify-center w-10 h-10 rounded-full text-secondary shadow-neu-raised border border-outline-variant/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Centerpiece: Tactile Neumorphic Security Orb from Stitch Design */}
      <section className="flex flex-col items-center justify-center w-full py-4">
        <div
          className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-raised flex items-center justify-center animate-pulse-slow border border-outline-variant/30 ${
            isOverallSecure ? '' : 'ring-4 ring-error/40 glow-coral'
          }`}
        >
          {/* Inner recessed well for the glowing core */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-recessed flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Glowing LED Ring */}
            <div
              className={`absolute inset-0 rounded-full border ${
                isOverallSecure
                  ? 'border-secondary-container/50 animate-glow-pulse'
                  : 'border-error/60 animate-ping'
              }`}
            />

            {isOverallSecure ? (
              <>
                <Shield className="w-12 h-12 text-secondary mb-2" />
                <h2 className="font-heading text-2xl font-bold text-secondary tracking-tight z-10">
                  ALL SECURE
                </h2>
                <p className="font-mono text-xs text-on-surface-variant mt-1 z-10 uppercase tracking-wider">
                  {devices.length} devices protected
                </p>
              </>
            ) : (
              <>
                <ShieldAlert className="w-12 h-12 text-error mb-2 animate-bounce" />
                <h2 className="font-heading text-xl font-bold text-error tracking-tight z-10">
                  ATTENTION
                </h2>
                <p className="font-mono text-[11px] text-error mt-1 z-10 uppercase tracking-wider">
                  Suspicious unlock
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Banner if Incident Detected */}
        {!isOverallSecure && activeWasThisYouEvent && (
          <div className="mt-4 animate-scaleUp">
            <button
              onClick={() => setIsWasThisYouOpen(true)}
              className="px-6 py-3 rounded-full bg-error hover:bg-[#93000a] text-white font-heading font-bold text-xs shadow-neu-button flex items-center gap-2 tracking-wide uppercase"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Review "Was This You?" Alert</span>
            </button>
          </div>
        )}
      </section>

      {/* Main Content Grid: Devices & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Devices Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-xl font-bold text-on-surface dark:text-white">
                My Devices
              </h3>
            </div>
            <Link
              href="/devices"
              className="font-heading text-xs font-bold text-primary dark:text-primary-fixed uppercase tracking-wider hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              View All ({devices.length}) <ChevronRight className="w-3.5 h-3.5" />
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
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-xl font-bold text-on-surface dark:text-white">
                Activity
              </h3>
            </div>
            <Link
              href="/activity"
              className="font-heading text-xs font-bold text-primary dark:text-primary-fixed uppercase tracking-wider hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              Full Feed <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-surface dark:bg-[#191b24] rounded-2xl p-5 shadow-neu-raised border border-outline-variant/30">
            <NeoTimeline
              events={events.slice(0, 3)}
              onPromptWasThisYou={(evt) => {
                setActiveWasThisYouEvent(evt);
                setIsWasThisYouOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* "Was This You?" Modal from Stitch */}
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
