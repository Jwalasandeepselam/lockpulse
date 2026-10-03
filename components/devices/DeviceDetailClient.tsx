'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Apple,
  Monitor,
  Lock,
  Clock,
  KeyRound,
  Trash2,
  ArrowLeft,
  ExternalLink,
  MapPin,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoIconButton } from '@/components/neumorphic/NeoIconButton';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';
import { NeoStatusIndicator } from '@/components/neumorphic/NeoStatusIndicator';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
import { NeoModal } from '@/components/neumorphic/NeoModal';
import {
  getStoredDevices,
  getStoredEvents,
  updateStoredDevice,
  removeStoredDevice,
  addStoredEvent,
} from '@/lib/store';
import { Device, SecurityEvent } from '@/lib/types';

interface DeviceDetailClientProps {
  deviceId: string;
}

export const DeviceDetailClient: React.FC<DeviceDetailClientProps> = ({ deviceId }) => {
  const router = useRouter();

  const [device, setDevice] = useState<Device | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [showLockModal, setShowLockModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockFeedbackMsg, setLockFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const devices = getStoredDevices();
    const found = devices.find((d) => d.id === deviceId) || devices[0] || null;
    setDevice(found);

    const allEvents = getStoredEvents();
    if (found) {
      setEvents(allEvents.filter((e) => e.device_id === found.id || !e.device_id));
    }
    setIsLoaded(true);
  }, [deviceId]);

  if (isLoaded && !device) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="font-heading font-extrabold text-2xl text-on-surface dark:text-white">
          Device Not Found
        </h2>
        <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400">
          The requested device may have been revoked or does not exist.
        </p>
        <div>
          <Link href="/devices">
            <NeoButton variant="primary" size="md">
              ← Return to Devices
            </NeoButton>
          </Link>
        </div>
      </div>
    );
  }

  if (!device) return null;

  const isMac = device.device_type === 'laptop_macos' || device.os_name.toLowerCase().includes('mac');
  const isOnline = device.status === 'online';
  const isLocked = device.status === 'locked';
  const findMyUrl = isMac
    ? 'https://www.icloud.com/find'
    : 'https://account.microsoft.com/devices';

  const handleLock = async () => {
    setIsLocking(true);
    setLockFeedbackMsg('Sending cryptographically signed lock command...');

    await new Promise((resolve) => setTimeout(resolve, 1400));

    const updatedList = updateStoredDevice(device.id, {
      status: 'locked',
      last_activity: new Date().toISOString(),
    });
    const updatedDevice = updatedList.find((d) => d.id === device.id) || null;
    setDevice(updatedDevice);

    const newEvt: SecurityEvent = {
      id: `evt_${Date.now()}`,
      user_id: device.user_id,
      device_id: device.id,
      device_name: device.device_name,
      event_type: 'remote_lock_ack',
      severity: 'low',
      title: 'Remote Lock Acknowledged',
      description: `Dispatched signed lock command. Laptop entered native lock screen.`,
      risk_score: 'LOW',
      metadata: { method: isMac ? 'SACLockScreenImmediate' : 'LockWorkStation' },
      is_resolved: true,
      created_at: new Date().toISOString(),
    };

    addStoredEvent(newEvt);
    setEvents((prev) => [newEvt, ...prev]);
    setLockFeedbackMsg('Laptop locked successfully.');

    setTimeout(() => {
      setIsLocking(false);
      setShowLockModal(false);
      setLockFeedbackMsg(null);
    }, 1200);
  };

  const handleRevokeDevice = () => {
    removeStoredDevice(device.id);
    router.push('/devices');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <Link href="/devices">
          <NeoIconButton size="sm" variant="raised" aria-label="Back to devices">
            <ArrowLeft className="w-4 h-4" />
          </NeoIconButton>
        </Link>
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            Device Security Detail
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface dark:text-white tracking-tight">
            {device.device_name}
          </h1>
        </div>
      </div>

      {/* Main Status & Action Card */}
      <div className="bg-surface dark:bg-[#16181F] p-6 sm:p-8 rounded-3xl shadow-neu-raised border border-outline-variant/70 dark:border-[#282B38]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-outline-variant/50 dark:border-[#282B38]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container dark:bg-[#242735] shadow-neu-recessed flex items-center justify-center text-primary dark:text-white flex-shrink-0 border border-outline-variant/50">
              {isMac ? <Apple className="w-9 h-9" /> : <Monitor className="w-9 h-9" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-on-surface dark:text-white">
                  {device.device_name}
                </h2>
                <NeoSecurityBadge status={device.status === 'locked' ? 'locked' : 'secure'} size="sm" />
              </div>
              <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-400">
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
              className="w-full md:w-auto"
            >
              {isLocked ? 'Laptop is Locked' : 'LOCK LAPTOP'}
            </NeoButton>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-surface-container-lowest dark:bg-[#0D0E12] rounded-xl shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-on-surface-variant dark:text-titanium-400 block mb-1">
              Connection
            </span>
            <NeoStatusIndicator status={device.status} />
          </div>

          <div className="p-4 bg-surface-container-lowest dark:bg-[#0D0E12] rounded-xl shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-on-surface-variant dark:text-titanium-400 block mb-1">
              Proximity Risk
            </span>
            <span className="text-xs font-heading font-bold text-on-surface dark:text-white capitalize">
              {device.presence_status === 'nearby' ? 'Owner Nearby (Low)' : 'Owner Away (Elevated)'}
            </span>
          </div>

          <div className="p-4 bg-surface-container-lowest dark:bg-[#0D0E12] rounded-xl shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-on-surface-variant dark:text-titanium-400 block mb-1">
              Last Seen
            </span>
            <span className="text-xs font-sans font-semibold text-on-surface dark:text-white">
              {new Date(device.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="p-4 bg-surface-container-lowest dark:bg-[#0D0E12] rounded-xl shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-on-surface-variant dark:text-titanium-400 block mb-1">
              Last Activity
            </span>
            <span className="text-xs font-sans font-semibold text-on-surface dark:text-white">
              {new Date(device.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Cryptographic Key & Native Platform Abstraction Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface dark:bg-[#16181F] p-6 rounded-3xl shadow-neu-raised border border-outline-variant/70 dark:border-[#282B38]">
            <h3 className="font-heading font-bold text-lg text-on-surface dark:text-white mb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Cryptographic Trust & Device Binding
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-surface-container-lowest dark:bg-[#0D0E12] rounded-xl shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735] space-y-1">
                <span className="font-heading font-bold text-on-surface dark:text-white block">
                  Public Key (Ed25519)
                </span>
                <p className="font-mono text-[11px] text-primary dark:text-primary-azure break-all">
                  {device.public_key || 'ed25519_pk_79cbf209a32dc8104e76a08bc79326f1c49b109e450b65ab40'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-surface-container-lowest dark:bg-[#0D0E12] rounded-xl shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735]">
                  <span className="font-heading font-bold text-on-surface dark:text-white block mb-0.5">
                    Secure Storage Provider
                  </span>
                  <span className="text-on-surface-variant dark:text-titanium-400 text-xs font-sans">
                    {isMac ? 'Apple Keychain / Secure Enclave' : 'Windows DPAPI / TPM 2.0'}
                  </span>
                </div>
                <div className="p-4 bg-surface-container-lowest dark:bg-[#0D0E12] rounded-xl shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735]">
                  <span className="font-heading font-bold text-on-surface dark:text-white block mb-0.5">
                    OS Native Lock API
                  </span>
                  <span className="text-on-surface-variant dark:text-titanium-400 text-xs font-sans">
                    {isMac ? 'SACLockScreenImmediate()' : 'user32!LockWorkStation()'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Specific Activity Timeline */}
          <div className="bg-surface dark:bg-[#16181F] p-6 rounded-3xl shadow-neu-raised border border-outline-variant/70 dark:border-[#282B38]">
            <h3 className="font-heading font-bold text-lg text-on-surface dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Device Activity Feed
            </h3>
            <NeoTimeline events={events} />
          </div>
        </div>

        {/* Right Sidebar: Platform integrations & danger zone */}
        <div className="space-y-6">
          <div className="bg-surface dark:bg-[#16181F] p-6 rounded-3xl shadow-neu-raised border border-outline-variant/70 dark:border-[#282B38] space-y-4">
            <h3 className="font-heading font-bold text-base text-on-surface dark:text-white">
              Platform Integrations
            </h3>

            <a
              href={findMyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-surface-container dark:bg-[#242735] rounded-xl shadow-neu-raised-sm hover:scale-[1.02] transition-all text-xs font-heading font-bold text-primary dark:text-white border border-outline-variant/50"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> {isMac ? 'Apple Find My' : 'Microsoft Find My'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="pt-2 border-t border-outline-variant/50">
              <span className="font-mono text-[11px] uppercase font-bold text-on-surface-variant dark:text-titanium-400 block mb-1">
                Hardware Fingerprint
              </span>
              <span className="font-mono text-xs text-on-surface dark:text-white">
                {device.hardware_fingerprint || 'HW-LP-7821-X9'}
              </span>
            </div>
          </div>

          <div className="bg-surface dark:bg-[#16181F] p-6 rounded-3xl shadow-neu-raised border border-outline-variant/70 dark:border-[#282B38] space-y-3">
            <h3 className="font-heading font-bold text-base text-on-surface dark:text-white">
              Danger Zone
            </h3>
            <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-400">
              Revoking this laptop will remove its cryptographic keys and terminate active telemetry.
            </p>
            <NeoButton
              variant="danger"
              size="sm"
              onClick={() => setShowRevokeModal(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="w-full"
            >
              Revoke Device Access
            </NeoButton>
          </div>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      <NeoModal
        isOpen={showLockModal}
        onClose={() => !isLocking && setShowLockModal(false)}
        title={`Lock ${device.device_name}?`}
        subtitle="Signed Command Dispatch"
      >
        <div className="space-y-4">
          <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-300 leading-relaxed">
            LockPulse will dispatch a cryptographically signed request to{' '}
            <strong>{device.device_name}</strong>. The operating system will immediately engage its native lock screen.
          </p>

          {lockFeedbackMsg ? (
            <div className="p-3 bg-surface-container rounded-xl text-xs font-bold text-primary text-center shadow-neu-recessed animate-pulse">
              {lockFeedbackMsg}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-2">
              <NeoButton variant="ghost" size="md" onClick={() => setShowLockModal(false)} disabled={isLocking}>
                Cancel
              </NeoButton>
              <NeoButton
                variant="danger"
                size="md"
                isLoading={isLocking}
                onClick={handleLock}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Lock Laptop
              </NeoButton>
            </div>
          )}
        </div>
      </NeoModal>

      {/* Revoke Confirmation Modal */}
      <NeoModal
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        title="Revoke Device?"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-300 leading-relaxed">
            Are you sure you want to revoke <strong>{device.device_name}</strong>? You will need to re-pair the device using the pairing wizard to reconnect.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <NeoButton variant="ghost" size="md" onClick={() => setShowRevokeModal(false)}>
              Cancel
            </NeoButton>
            <NeoButton variant="danger" size="md" onClick={handleRevokeDevice}>
              Revoke & Remove
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
};
