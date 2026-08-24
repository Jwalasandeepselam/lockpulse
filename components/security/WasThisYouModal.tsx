'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ExternalLink,
  MapPin,
  Clock,
  Laptop,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { SecurityEvent } from '@/lib/types';
import { NeoModal } from '../neumorphic/NeoModal';
import { NeoButton } from '../neumorphic/NeoButton';
import { NeoCard } from '../neumorphic/NeoCard';

interface WasThisYouModalProps {
  event: SecurityEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmLegitimate: (eventId: string) => Promise<void>;
  onLockdownDevice: (deviceId: string, eventId: string) => Promise<void>;
}

export const WasThisYouModal: React.FC<WasThisYouModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirmLegitimate,
  onLockdownDevice,
}) => {
  const [stage, setStage] = useState<'prompt' | 'escalation' | 'locked_success'>('prompt');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!event) return null;

  const handleYesItWasMe = async () => {
    setIsProcessing(true);
    await onConfirmLegitimate(event.id);
    setIsProcessing(false);
    onClose();
  };

  const handleNotMe = () => {
    setStage('escalation');
  };

  const handleEmergencyLock = async () => {
    if (!event.device_id) return;
    setIsProcessing(true);
    await onLockdownDevice(event.device_id, event.id);
    setIsProcessing(false);
    setStage('locked_success');
  };

  const handleClose = () => {
    setStage('prompt');
    onClose();
  };

  const isMac = (event.device_name || '').toLowerCase().includes('mac') || (event.metadata?.os || '').toLowerCase().includes('mac');
  const findMyUrl = isMac
    ? 'https://www.icloud.com/find'
    : 'https://account.microsoft.com/devices';

  return (
    <NeoModal
      isOpen={isOpen}
      onClose={handleClose}
      title={stage === 'escalation' ? 'Secure Your Laptop' : 'Security Alert'}
      subtitle={stage === 'escalation' ? 'Immediate Incident Escalation' : 'Suspicious Unlock Activity'}
      maxWidth="md"
    >
      {stage === 'prompt' && (
        <div className="space-y-5">
          {/* Risk Banner */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-300 dark:border-amber-900/50 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading text-lg text-amber-950 dark:text-amber-200 tracking-wide">
                WAS THIS YOU?
              </h4>
              <p className="text-xs font-sans text-amber-900 dark:text-amber-300 mt-0.5">
                Your <strong>{event.device_name || 'Laptop'}</strong> was unlocked while your phone appeared to be away.
              </p>
            </div>
          </div>

          {/* Context Inset */}
          <div className="bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl p-4 border border-palette-sand dark:border-[#3E3B3A] space-y-2 text-xs font-sans text-palette-charcoal dark:text-palette-sand">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-palette-ash">
                <Laptop className="w-3.5 h-3.5" /> Device
              </span>
              <span className="font-semibold text-palette-black dark:text-white">{event.device_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-palette-ash">
                <Clock className="w-3.5 h-3.5" /> Detected Time
              </span>
              <span className="font-semibold text-palette-black dark:text-white">
                {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-palette-ash">
                <MapPin className="w-3.5 h-3.5" /> Proximity Signal
              </span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Phone Away (Out of range)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <NeoButton
              variant="secondary"
              size="md"
              disabled={isProcessing}
              onClick={handleYesItWasMe}
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            >
              Yes, it was me
            </NeoButton>
            <NeoButton
              variant="danger"
              size="md"
              disabled={isProcessing}
              onClick={handleNotMe}
              leftIcon={<AlertOctagon className="w-4 h-4" />}
            >
              This wasn't me
            </NeoButton>
          </div>
        </div>
      )}

      {stage === 'escalation' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-300 dark:border-rose-900/60 text-xs text-rose-950 dark:text-rose-200">
            <p className="font-bold font-heading uppercase tracking-wide">Protect your system immediately</p>
            <p className="mt-0.5 font-sans">
              Select an action below to lock the OS screen and initiate recovery protocols.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Action 1: Instant Lock */}
            <NeoCard variant="flat" className="p-4 flex items-center justify-between gap-3 hover:border-palette-ash">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 text-security-danger flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-heading text-base text-palette-black dark:text-white tracking-wide">
                    Emergency Lock Laptop
                  </h5>
                  <p className="text-xs font-sans text-palette-ash">
                    Triggers native OS lock screen immediately.
                  </p>
                </div>
              </div>
              <NeoButton
                variant="danger"
                size="sm"
                isLoading={isProcessing}
                onClick={handleEmergencyLock}
              >
                Lock Now
              </NeoButton>
            </NeoCard>

            {/* Action 2: OS Find My */}
            <NeoCard variant="flat" className="p-4 flex items-center justify-between gap-3 hover:border-palette-ash">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-charcoal dark:text-palette-sand flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-heading text-base text-palette-black dark:text-white tracking-wide">
                    Track via {isMac ? 'Apple Find My' : 'Microsoft Find My'}
                  </h5>
                  <p className="text-xs font-sans text-palette-ash">
                    Open official platform location & lost mode.
                  </p>
                </div>
              </div>
              <a href={findMyUrl} target="_blank" rel="noopener noreferrer">
                <NeoButton variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Open
                </NeoButton>
              </a>
            </NeoCard>
          </div>

          <div className="flex justify-end pt-2">
            <NeoButton variant="ghost" size="sm" onClick={handleClose}>
              Dismiss
            </NeoButton>
          </div>
        </div>
      )}

      {stage === 'locked_success' && (
        <div className="space-y-5 text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h4 className="font-heading text-2xl text-palette-black dark:text-white tracking-wide">
              LAPTOP LOCKED SUCCESSFULLY
            </h4>
            <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand mt-2 max-w-sm mx-auto leading-relaxed">
              Your laptop received the signed security command and entered its native OS lock screen. The incident has been recorded in your audit timeline.
            </p>
          </div>
          <NeoButton variant="primary" size="md" onClick={handleClose}>
            Return to Dashboard
          </NeoButton>
        </div>
      )}
    </NeoModal>
  );
};
