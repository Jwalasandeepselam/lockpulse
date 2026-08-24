'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apple, Monitor, Lock, ShieldAlert, Clock, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { Device } from '@/lib/types';
import { NeoButton } from './NeoButton';
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
      setLockStatusMsg('Signed lock command dispatched to laptop...');
      await onLockDevice(device.id);
      setTimeout(() => {
        setLockStatusMsg(null);
        setShowLockConfirm(false);
      }, 1400);
    }
  };

  return (
    <>
      <div className="w-full bg-surface dark:bg-[#191b24] rounded-2xl p-6 shadow-neu-raised flex flex-col justify-between border border-outline-variant/30 dark:border-[#383a47] relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
        {/* Top Status Edge Indicator */}
        <div
          className={`absolute top-0 left-0 w-full h-[3px] ${
            isLocked
              ? 'bg-error'
              : device.presence_status === 'away'
              ? 'bg-tertiary-container'
              : 'bg-secondary'
          }`}
        />

        <div className="space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-recessed flex items-center justify-center text-primary dark:text-primary-fixed flex-shrink-0">
                {isMac ? <Apple className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-on-surface dark:text-white tracking-tight">
                  {device.device_name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isLocked
                        ? 'bg-error glow-coral'
                        : isOnline
                        ? 'bg-secondary glow-emerald'
                        : 'bg-outline'
                    }`}
                  />
                  <span className="font-heading text-[11px] font-bold text-on-surface-variant dark:text-[#c4c5d9] uppercase tracking-wider">
                    {isLocked
                      ? 'LOCKED'
                      : isOnline
                      ? device.presence_status === 'nearby'
                        ? 'ONLINE • OWNER NEARBY'
                        : 'ONLINE • OWNER AWAY'
                      : 'OFFLINE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recessed Activity Info Box */}
          <div className="bg-surface-container-lowest dark:bg-[#14151d] p-4 rounded-xl shadow-neu-recessed space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-on-surface-variant text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Last Activity
              </span>
              <span className="font-sans font-semibold text-on-surface dark:text-white">
                {new Date(device.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
              <span className="font-mono text-on-surface-variant text-[11px] uppercase tracking-wider">
                Security Agent
              </span>
              <span className="font-mono text-[11px] font-bold text-primary dark:text-primary-fixed">
                v{device.agent_version} • Ed25519
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 mt-2 flex items-center gap-3">
          <Link href={`/devices/${device.id}`} className="flex-1">
            <button className="w-full py-3 rounded-xl bg-primary text-white font-heading font-bold text-xs shadow-neu-button hover:opacity-90 active:scale-[0.98] transition-all tracking-wide uppercase">
              View Security
            </button>
          </Link>

          <NeoButton
            variant={isLocked ? 'secondary' : 'danger'}
            size="sm"
            disabled={!isOnline || isLocked || isLocking}
            isLoading={isLocking}
            onClick={() => setShowLockConfirm(true)}
            leftIcon={<Lock className="w-3.5 h-3.5" />}
          >
            {isLocked ? 'Locked' : 'Lock'}
          </NeoButton>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      <NeoModal
        isOpen={showLockConfirm}
        onClose={() => !isLocking && setShowLockConfirm(false)}
        title={`Lock ${device.device_name}?`}
        subtitle="Signed OS Command Execution"
      >
        <div className="space-y-4">
          <div className="p-4 bg-error-container/30 dark:bg-error-container/10 rounded-2xl border border-error/30 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
            <div className="text-xs text-on-surface dark:text-white space-y-1">
              <p className="font-bold font-heading uppercase text-error">Native Operating System Lockout</p>
              <p className="font-sans text-on-surface-variant">
                LockPulse will dispatch a cryptographically signed command triggering{' '}
                <strong>{device.device_name}</strong> to enter its native lock screen ({isMac ? 'SACLockScreenImmediate' : 'user32!LockWorkStation'}).
              </p>
            </div>
          </div>

          {lockStatusMsg ? (
            <div className="p-3 bg-surface-container rounded-xl text-xs font-bold text-primary text-center shadow-neu-recessed animate-pulse">
              {lockStatusMsg}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-2">
              <NeoButton variant="ghost" size="md" onClick={() => setShowLockConfirm(false)} disabled={isLocking}>
                Cancel
              </NeoButton>
              <NeoButton
                variant="danger"
                size="md"
                isLoading={isLocking}
                onClick={handleConfirmLock}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Execute Lock
              </NeoButton>
            </div>
          )}
        </div>
      </NeoModal>
    </>
  );
};
