'use client';

import React, { useState, useEffect } from 'react';
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
  Lock,
  Radio,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoDeviceCard } from '@/components/neumorphic/NeoDeviceCard';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
import { WasThisYouModal } from '@/components/security/WasThisYouModal';
import {
  getStoredDevices,
  getStoredEvents,
  getStoredProfile,
  updateStoredDevice,
  addStoredEvent,
} from '@/lib/store';
import { Device, SecurityEvent, UserProfile } from '@/lib/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [lockingDeviceId, setLockingDeviceId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Was This You Modal State
  const [activeWasThisYouEvent, setActiveWasThisYouEvent] = useState<SecurityEvent | null>(null);
  const [isWasThisYouOpen, setIsWasThisYouOpen] = useState(false);

  useEffect(() => {
    const loadedDevices = getStoredDevices();
    const loadedEvents = getStoredEvents();
    const loadedProfile = getStoredProfile();

    setDevices(loadedDevices);
    setEvents(loadedEvents);
    setProfile(loadedProfile);
    setIsLoaded(true);

    // Check if there are unaddressed suspicious unlock events
    const suspicious = loadedEvents.find(
      (e) => e.event_type === 'suspicious_unlock' && !e.is_resolved
    );
    if (suspicious) {
      setActiveWasThisYouEvent(suspicious);
    }
  }, []);

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

    // Update device status in memory and localStorage
    const updatedDevices = updateStoredDevice(deviceId, {
      status: 'locked',
      last_activity: new Date().toISOString(),
    });
    setDevices(updatedDevices);

    // Append new security event to timeline & storage
    const targetDev = devices.find((d) => d.id === deviceId);
    const newEvent: SecurityEvent = {
      id: `evt_lock_${Date.now()}`,
      user_id: profile.id,
      device_id: deviceId,
      device_name: targetDev?.device_name || 'Laptop',
      event_type: 'remote_lock_ack',
      severity: 'low',
      title: 'Remote Lock Executed',
      description: `Dispatched signed OS lock command. ${targetDev?.device_name || 'Device'} is now in native lock screen state.`,
      risk_score: 'LOW',
      metadata: { source: 'mobile_dashboard', nonce: `${Date.now()}-mock-sig` },
      is_resolved: true,
      created_at: new Date().toISOString(),
    };

    addStoredEvent(newEvent);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const orbVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Top Header (Greeting + Quick Pair Action) */}
      <motion.div
        variants={shouldReduceMotion ? undefined : itemVariants}
        className="flex justify-between items-center w-full"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-12 h-12 rounded-2xl shadow-neu-raised-sm bg-primary/10 text-primary dark:text-primary-azure flex items-center justify-center font-heading font-extrabold text-xl border border-primary/20"
          >
            {profile.full_name?.charAt(0).toUpperCase() || 'U'}
          </motion.div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-on-surface dark:text-white">
              {greeting}, {profile.full_name?.split(' ')[0] || 'User'}
            </h1>
            <span className="text-[11px] font-mono font-medium text-on-surface-variant dark:text-titanium-400 uppercase tracking-wider block">
              Apple Enclave • Security Plane
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/devices/connect">
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-primary dark:text-white bg-surface dark:bg-[#16181F] shadow-neu-raised-sm border border-outline-variant dark:border-[#282B38] cursor-pointer"
              title="Pair new laptop"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Add Laptop</span>
            </motion.button>
          </Link>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-neu-raised-sm border transition-colors ${
              devices.length > 0 && isOverallSecure
                ? 'bg-secondary/10 text-secondary border-secondary/30'
                : devices.length === 0
                ? 'bg-surface-container text-on-surface-variant border-outline-variant/60'
                : 'bg-error/10 text-error border-error/30'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </motion.div>

      {/* Centerpiece: Apple Enclave & Alpine Titanium Security Orb */}
      <motion.section
        variants={shouldReduceMotion ? undefined : orbVariants}
        className="flex flex-col items-center justify-center w-full py-4"
      >
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-surface dark:bg-[#16181F] shadow-neu-raised flex items-center justify-center border transition-all duration-300 ${
            devices.length === 0
              ? 'border-outline-variant/80 dark:border-white/10'
              : isOverallSecure
              ? 'border-secondary/40'
              : 'border-error/60 ring-4 ring-error/30 glow-coral'
          }`}
        >
          {/* Inner well */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-surface-container-low dark:bg-[#0D0E12] shadow-neu-recessed flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Glowing Ring */}
            <div
              className={`absolute inset-0 rounded-full border ${
                devices.length === 0
                  ? 'border-primary/20'
                  : isOverallSecure
                  ? 'border-secondary/40 animate-glow-pulse'
                  : 'border-error/60 animate-ping'
              }`}
            />

            <AnimatePresence mode="wait">
              {devices.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col items-center justify-center text-center w-full z-10"
                >
                  <Laptop className="w-12 h-12 text-primary mb-2" />
                  <h2 className="font-heading text-xl font-bold text-on-surface dark:text-white tracking-tight">
                    READY TO PAIR
                  </h2>
                  <p className="font-mono text-[11px] text-on-surface-variant dark:text-titanium-400 mt-1 uppercase tracking-wider">
                    0 Laptops Linked
                  </p>
                  <Link href="/devices/connect" className="mt-2.5">
                    <span className="text-xs font-heading font-bold text-primary dark:text-primary-azure hover:underline flex items-center gap-1">
                      Pair Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </motion.div>
              ) : isOverallSecure ? (
                <motion.div
                  key="secure"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col items-center justify-center text-center w-full z-10"
                >
                  <Shield className="w-12 h-12 text-secondary mb-2" />
                  <h2 className="font-heading text-2xl font-bold text-secondary tracking-tight">
                    ALL SECURE
                  </h2>
                  <p className="font-mono text-xs text-on-surface-variant dark:text-titanium-400 mt-1 uppercase tracking-wider">
                    {devices.length} {devices.length === 1 ? 'device' : 'devices'} protected
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="alert"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col items-center justify-center text-center w-full z-10"
                >
                  <ShieldAlert className="w-12 h-12 text-error mb-2 animate-bounce" />
                  <h2 className="font-heading text-xl font-bold text-error tracking-tight">
                    ATTENTION
                  </h2>
                  <p className="font-mono text-[11px] text-error mt-1 uppercase tracking-wider">
                    Suspicious unlock
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Banner if Incident Detected */}
        {devices.length > 0 && !isOverallSecure && activeWasThisYouEvent && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => setIsWasThisYouOpen(true)}
              className="px-6 py-3 rounded-full bg-error hover:bg-[#D70015] text-white font-heading font-bold text-xs shadow-neu-button flex items-center gap-2 tracking-wide uppercase cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Review "Was This You?" Alert</span>
            </motion.button>
          </motion.div>
        )}
      </motion.section>

      {/* Main Content Grid: Devices & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Devices Section */}
        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-xl font-bold text-on-surface dark:text-white">
                My Devices
              </h3>
            </div>
            {devices.length > 0 && (
              <Link
                href="/devices"
                className="font-heading text-xs font-bold text-primary dark:text-primary-azure uppercase tracking-wider hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                View All ({devices.length}) <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Empty State when 0 devices are enrolled */}
          {devices.length === 0 ? (
            <div className="bg-surface dark:bg-[#16181F] rounded-3xl p-8 sm:p-10 shadow-neu-raised border border-outline-variant/80 dark:border-[#282B38] text-center space-y-6">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-azure mx-auto flex items-center justify-center border border-primary/20 shadow-neu-raised-sm"
              >
                <Laptop className="w-8 h-8" />
              </motion.div>

              <div className="max-w-md mx-auto space-y-2">
                <h4 className="font-heading font-extrabold text-xl sm:text-2xl text-on-surface dark:text-white tracking-tight">
                  No Laptops Connected Yet
                </h4>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant dark:text-titanium-300 leading-relaxed">
                  LockPulse allows you to link your Mac or Windows laptop via cryptographic keys. Setup takes less than 2 minutes.
                </p>
              </div>

              {/* 3 Quick Benefit Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="p-3 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] text-xs"
                >
                  <span className="font-bold text-on-surface dark:text-white flex items-center gap-1.5 font-heading">
                    <Lock className="w-3.5 h-3.5 text-primary" /> Instant Lock
                  </span>
                  <p className="text-[11px] text-on-surface-variant dark:text-titanium-400 mt-1">
                    Trigger native OS lock screens remotely in &lt;1s.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="p-3 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] text-xs"
                >
                  <span className="font-bold text-on-surface dark:text-white flex items-center gap-1.5 font-heading">
                    <Radio className="w-3.5 h-3.5 text-secondary" /> Smart Alerts
                  </span>
                  <p className="text-[11px] text-on-surface-variant dark:text-titanium-400 mt-1">
                    Get push alerts when your laptop is unlocked away.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="p-3 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] text-xs"
                >
                  <span className="font-bold text-on-surface dark:text-white flex items-center gap-1.5 font-heading">
                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Zero Trust
                  </span>
                  <p className="text-[11px] text-on-surface-variant dark:text-titanium-400 mt-1">
                    No passwords or private keys stored in cloud.
                  </p>
                </motion.div>
              </div>

              <div className="pt-2">
                <Link href="/devices/connect">
                  <NeoButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Pair Your First Laptop
                  </NeoButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {devices.map((device, idx) => (
                <motion.div
                  key={device.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <NeoDeviceCard
                    device={device}
                    onLockDevice={handleLockDevice}
                    isLocking={lockingDeviceId === device.id}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="space-y-4"
        >
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-xl font-bold text-on-surface dark:text-white">
                Activity
              </h3>
            </div>
            {events.length > 0 && (
              <Link
                href="/activity"
                className="font-heading text-xs font-bold text-primary dark:text-primary-azure uppercase tracking-wider hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                Full Feed <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="bg-surface dark:bg-[#16181F] rounded-2xl p-5 shadow-neu-raised border border-outline-variant/60 dark:border-[#282B38]">
            {events.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-on-surface-variant dark:text-titanium-400 mx-auto opacity-50" />
                <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-400">
                  No security incidents or events recorded yet.
                </p>
                <p className="text-[11px] text-on-surface-variant/80 dark:text-titanium-500">
                  Telemetry will stream once your laptop is paired.
                </p>
              </div>
            ) : (
              <NeoTimeline
                events={events.slice(0, 3)}
                onPromptWasThisYou={(evt) => {
                  setActiveWasThisYouEvent(evt);
                  setIsWasThisYouOpen(true);
                }}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* "Was This You?" Modal */}
      <WasThisYouModal
        isOpen={isWasThisYouOpen}
        onClose={() => setIsWasThisYouOpen(false)}
        event={activeWasThisYouEvent}
        onConfirmLegitimate={handleConfirmLegitimate}
        onLockdownDevice={handleLockdownDevice}
      />
    </motion.div>
  );
}

