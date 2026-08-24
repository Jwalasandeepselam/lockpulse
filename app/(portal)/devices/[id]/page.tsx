'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Apple,
  Monitor,
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  Clock,
  Radio,
  KeyRound,
  Trash2,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Wifi,
  WifiOff,
  Cpu,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoIconButton } from '@/components/neumorphic/NeoIconButton';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';
import { NeoStatusIndicator } from '@/components/neumorphic/NeoStatusIndicator';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
import { NeoModal } from '@/components/neumorphic/NeoModal';
import { initialDevices, initialEvents } from '@/lib/store';
import { Device, SecurityEvent } from '@/lib/types';

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = params.id as string;

  const [device, setDevice] = useState<Device | null>(
    initialDevices.find((d) => d.id === deviceId) || initialDevices[0]
  );
  const [events, setEvents] = useState<SecurityEvent[]>(
    initialEvents.filter((e) => e.device_id === deviceId || !e.device_id)
  );

  const [showLockModal, setShowLockModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockFeedbackMsg, setLockFeedbackMsg] = useState<string | null>(null);

  if (!device) {
    return (
      <div className="text-center py-20">
        <h2 className="font-heading font-bold text-xl text-slate-800 dark:text-slate-200">
          Device Not Found
        </h2>
        <Link href="/devices" className="text-pulse-blue text-sm mt-3 inline-block">
          ← Back to Devices
        </Link>
      </div>
    );
  }

  const isMac = device.device_type === 'laptop_macos' || device.os_name.toLowerCase().includes('mac');
  const isOnline = device.status === 'online';
  const isLocked = device.status === 'locked';

  const handleLock = async () => {
    setIsLocking(true);
    setLockFeedbackMsg('Sending cryptographically signed lock command...');

    await new Promise((resolve) => setTimeout(resolve, 1400));

    setDevice((prev) => (prev ? { ...prev, status: 'locked', last_activity: new Date().toISOString() } : null));

    const newEvt: SecurityEvent = {
      id: `evt_${Date.now()}`,
      user_id: device.user_id,
      device_id: device.id,
      device_name: device.device_name,
      event_type: 'remote_lock_ack',
      severity: 'low',
      title: 'Remote Lock Acknowledged',
      description: `Dispatched signed lock command. Laptop acknowledged transition to lock screen.`,
      risk_score: 'LOW',
      metadata: { method: isMac ? 'SACLockScreenImmediate' : 'LockWorkStation' },
      is_resolved: true,
      created_at: new Date().toISOString(),
    };

    setEvents((prev) => [newEvt, ...prev]);
    setLockFeedbackMsg('Laptop locked successfully.');

    setTimeout(() => {
      setIsLocking(false);
      setShowLockModal(false);
      setLockFeedbackMsg(null);
    }, 1200);
  };

  const handleRevokeDevice = () => {
    router.push('/devices');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <Link href="/devices">
          <NeoIconButton size="sm" variant="raised" aria-label="Back to devices">
            <ArrowLeft className="w-4 h-4" />
          </NeoIconButton>
        </Link>
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">
            Device Security Detail
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {device.device_name}
          </h1>
        </div>
      </div>

      {/* Main Status & Action Card */}
      <NeoCard variant="raised" className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-300/40 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E0E8F2] dark:bg-[#0E1628] shadow-neo-sm flex items-center justify-center text-slate-800 dark:text-white">
              {isMac ? <Apple className="w-9 h-9" /> : <Monitor className="w-9 h-9 text-pulse-blue" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                  {device.device_name}
                </h2>
                <NeoSecurityBadge status={device.status === 'locked' ? 'locked' : 'secure'} size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {device.os_name} • Agent v{device.agent_version}
              </p>
            </div>
          </div>

          {/* Primary Action Button: Prominent LOCK LAPTOP */}
          <div className="w-full md:w-auto flex items-center gap-3">
            <NeoButton
              variant={isLocked ? 'secondary' : 'danger'}
              size="lg"
              disabled={!isOnline || isLocked || isLocking}
              isLoading={isLocking}
              onClick={() => setShowLockModal(true)}
              leftIcon={<Lock className="w-5 h-5" />}
              className="w-full md:w-auto text-base"
            >
              {isLocked ? 'Laptop is Locked' : 'LOCK LAPTOP'}
            </NeoButton>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-[#E5ECF4]/70 dark:bg-[#0E1626] rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Connection
            </span>
            <NeoStatusIndicator status={device.status} />
          </div>

          <div className="p-4 bg-[#E5ECF4]/70 dark:bg-[#0E1626] rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Proximity Risk
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
              {device.presence_status === 'nearby' ? 'Owner Nearby (Low Risk)' : 'Owner Away (Elevated)'}
            </span>
          </div>

          <div className="p-4 bg-[#E5ECF4]/70 dark:bg-[#0E1626] rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Last Seen
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {new Date(device.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="p-4 bg-[#E5ECF4]/70 dark:bg-[#0E1626] rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Last Activity
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {new Date(device.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </NeoCard>

      {/* Cryptographic Key & Native Platform Abstraction Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NeoCard variant="raised" className="p-6">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-pulse-blue" />
              Cryptographic Trust & Device Binding
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Public Key (Ed25519)</span>
                <p className="font-mono text-[11px] text-pulse-blue dark:text-pulse-sky break-all">
                  ed25519_pk_79cbf209a32dc8104e76a08bc79326f1c49b109e450b65ab40
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Secure Storage Provider</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {isMac ? 'Apple Keychain / Secure Enclave' : 'Windows DPAPI / TPM'}
                  </span>
                </div>
                <div className="p-3.5 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed dark:shadow-neo-dark-pressed">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">OS Native Lock API</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {isMac ? 'SACLockScreenImmediate()' : 'user32!LockWorkStation()'}
                  </span>
                </div>
              </div>
            </div>
          </NeoCard>

          {/* Device Specific Activity Timeline */}
          <NeoCard variant="raised" className="p-6">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-pulse-blue" />
              Device Activity Feed
            </h3>
            <NeoTimeline events={events} />
          </NeoCard>
        </div>

        {/* Right Sidebar: Security Actions & Revocation */}
        <div className="space-y-6">
          <NeoCard variant="raised" className="p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Platform Integrations
            </h3>

            <a
              href={isMac ? 'https://www.icloud.com/find' : 'https://account.microsoft.com/devices'}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <NeoButton variant="secondary" size="md" className="w-full justify-between" rightIcon={<ExternalLink className="w-4 h-4" />}>
                <span>{isMac ? 'Open Apple Find My' : 'Microsoft Find My'}</span>
              </NeoButton>
            </a>

            <div className="pt-4 border-t border-slate-300/40 dark:border-white/10">
              <span className="text-xs font-bold text-slate-500 block mb-2">Danger Zone</span>
              <NeoButton
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => setShowRevokeModal(true)}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Revoke Device Access
              </NeoButton>
            </div>
          </NeoCard>
        </div>
      </div>

      {/* Remote Lock Modal */}
      <NeoModal
        isOpen={showLockModal}
        onClose={() => !isLocking && setShowLockModal(false)}
        title={`Lock ${device.device_name}?`}
        subtitle="Signed Command Authorization"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            LockPulse will immediately request <strong>{device.device_name}</strong> to enter its normal operating system lock screen.
          </p>

          {lockFeedbackMsg ? (
            <div className="p-3 bg-pulse-blue/10 rounded-xl text-xs font-semibold text-pulse-blue text-center animate-pulse">
              {lockFeedbackMsg}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-2">
              <NeoButton variant="ghost" size="md" onClick={() => setShowLockModal(false)} disabled={isLocking}>
                Cancel
              </NeoButton>
              <NeoButton variant="danger" size="md" isLoading={isLocking} onClick={handleLock} leftIcon={<Lock className="w-4 h-4" />}>
                Lock Laptop
              </NeoButton>
            </div>
          )}
        </div>
      </NeoModal>

      {/* Revoke Modal */}
      <NeoModal
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        title="Revoke Device Access?"
        subtitle="Permanent Unpairing"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Are you sure you want to disconnect <strong>{device.device_name}</strong>? The device's local session will be terminated and its cryptographic public key removed from your account.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <NeoButton variant="ghost" size="md" onClick={() => setShowRevokeModal(false)}>
              Cancel
            </NeoButton>
            <NeoButton variant="danger" size="md" onClick={handleRevokeDevice}>
              Yes, Revoke Device
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
