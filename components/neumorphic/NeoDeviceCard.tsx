'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Laptop, Apple, Monitor, Lock, ShieldAlert, Clock, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { Device } from '@/lib/types';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';
import { NeoStatusIndicator } from './NeoStatusIndicator';
import { NeoModal } from './NeoModal';

interface NeoDeviceCardProps {
  device: Device;
  onLockDevice?: (deviceId: string) => Promise<void>;
  isLocking?: boolean;
}

export const NeoDeviceCard: React.FC<NeoDeviceCardProps> = ({
  device,
  onLockDevice,
  isLocking = false,
}) => {
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [lockStatusMsg, setLockStatusMsg] = useState<string | null>(null);

  const isMac = device.device_type === 'laptop_macos' || device.os_name.toLowerCase().includes('mac');
  const isOnline = device.status === 'online';
  const isLocked = device.status === 'locked';

  const handleConfirmLock = async () => {
    if (onLockDevice) {
      setLockStatusMsg('Lock request sent — waiting for confirmation from laptop...');
      await onLockDevice(device.id);
      setTimeout(() => {
        setLockStatusMsg(null);
        setShowLockConfirm(false);
      }, 1400);
    }
  };

  return (
    <>
      <NeoCard
        variant="raised"
        glow={device.presence_status === 'away' && isOnline ? 'warning' : 'none'}
        className="relative overflow-hidden flex flex-col justify-between"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] border border-palette-sand dark:border-[#3E3B3A] flex items-center justify-center text-palette-charcoal dark:text-palette-sand">
                {isMac ? <Apple className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-heading text-lg text-palette-black dark:text-white tracking-wide">
                  {device.device_name}
                </h4>
                <p className="text-xs font-sans text-palette-ash">{device.os_name}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <NeoStatusIndicator status={device.status} />
              <span className="text-[11px] font-medium text-palette-ash flex items-center gap-1">
                {isOnline ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-palette-ash" />}
                {device.presence_status === 'nearby' ? 'Owner nearby' : device.presence_status === 'away' ? 'Owner away' : 'Presence unknown'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Inset Box */}
          <div className="bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl p-3 border border-palette-sand dark:border-[#3E3B3A] space-y-1.5 mb-5 text-xs text-palette-charcoal dark:text-palette-sand">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-palette-ash">
                <Clock className="w-3.5 h-3.5" /> Last Activity
              </span>
              <span className="font-medium text-palette-black dark:text-white">
                {new Date(device.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-palette-ash">Security Agent</span>
              <span className="font-mono text-[11px] font-bold text-palette-charcoal dark:text-palette-sand">
                v{device.agent_version} • Ed25519 Verified
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-palette-sand/60 dark:border-[#3E3B3A] flex items-center justify-between gap-3">
          <Link
            href={`/devices/${device.id}`}
            className="text-xs font-heading uppercase tracking-wide text-palette-ash hover:text-palette-black dark:hover:text-white transition-colors flex items-center gap-1"
          >
            View Security <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <NeoButton
            variant={isLocked ? 'secondary' : 'danger'}
            size="sm"
            disabled={!isOnline || isLocked || isLocking}
            isLoading={isLocking}
            onClick={() => setShowLockConfirm(true)}
            leftIcon={<Lock className="w-3.5 h-3.5" />}
          >
            {isLocked ? 'Locked' : 'Lock Laptop'}
          </NeoButton>
        </div>
      </NeoCard>

      {/* Remote Lock Confirmation Modal */}
      <NeoModal
        isOpen={showLockConfirm}
        onClose={() => !isLocking && setShowLockConfirm(false)}
        title={`Lock ${device.device_name}?`}
        subtitle="Signed Remote Security Command"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-security-danger flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950 dark:text-rose-200 space-y-1">
              <p className="font-bold uppercase tracking-wide font-heading">Immediate OS Lockout</p>
              <p className="font-sans">
                LockPulse will immediately dispatch a cryptographically signed command requesting{' '}
                <strong>{device.device_name}</strong> to enter its native operating system lock screen ({isMac ? 'SACLockScreenImmediate' : 'LockWorkStation'}).
              </p>
            </div>
          </div>

          {lockStatusMsg ? (
            <div className="p-3 bg-palette-sand-light dark:bg-[#1E1D1D] rounded-xl text-xs font-bold text-palette-black dark:text-white text-center animate-pulse">
              {lockStatusMsg}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-2">
              <NeoButton
                variant="ghost"
                size="md"
                onClick={() => setShowLockConfirm(false)}
                disabled={isLocking}
              >
                Cancel
              </NeoButton>
              <NeoButton
                variant="danger"
                size="md"
                isLoading={isLocking}
                onClick={handleConfirmLock}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Execute Remote Lock
              </NeoButton>
            </div>
          )}
        </div>
      </NeoModal>
    </>
  );
};
