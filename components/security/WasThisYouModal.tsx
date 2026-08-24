'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Lock,
  ExternalLink,
  MapPin,
  Clock,
  Laptop,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  X,
} from 'lucide-react';
import { SecurityEvent } from '@/lib/types';
import { NeoButton } from '../neumorphic/NeoButton';

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

  if (!isOpen || !event) return null;

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

  const isMac = (event.device_name || '').toLowerCase().includes('mac');
  const findMyUrl = isMac
    ? 'https://www.icloud.com/find'
    : 'https://account.microsoft.com/devices';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative z-20 w-[94%] max-w-md bg-surface dark:bg-[#191b24] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-neu-raised-lg border-t-2 border-error animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface dark:bg-[#232530] shadow-neu-raised-sm flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {stage === 'prompt' && (
          <div className="flex flex-col items-center w-full">
            {/* Caution Icon in Neumorphic Circle */}
            <div className="w-24 h-24 rounded-full bg-surface dark:bg-[#191b24] mb-6 flex items-center justify-center shadow-neu-raised relative">
              <AlertTriangle className="w-12 h-12 text-error" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0px_2px_4px_rgba(186,26,26,0.35)] pointer-events-none" />
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface dark:text-white mb-2 tracking-tight">
              Was this you?
            </h2>

            <p className="font-sans text-sm sm:text-base text-on-surface-variant dark:text-[#c4c5d9] mb-4 max-w-xs">
              Your <strong>{event.device_name || 'Laptop'}</strong> was unlocked while your phone appeared to be away.
            </p>

            {/* Recessed Telemetry Box */}
            <div className="w-full bg-surface-container dark:bg-[#14151d] rounded-xl p-3.5 mb-6 shadow-neu-recessed text-xs space-y-1">
              <div className="flex items-center justify-between text-on-surface-variant font-mono">
                <span>DETECTED TIME</span>
                <span className="font-bold text-on-surface dark:text-white">
                  {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-mono">
                <span>PROXIMITY</span>
                <span className="font-bold text-tertiary-container">Owner Away (Out of range)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <button
                disabled={isProcessing}
                onClick={handleNotMe}
                className="w-full py-3.5 rounded-xl bg-error hover:bg-[#93000a] text-white font-heading font-bold text-sm shadow-neu-button flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>This wasn't me (Lockdown)</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={handleYesItWasMe}
                className="w-full py-3.5 rounded-xl bg-surface dark:bg-[#232530] text-primary dark:text-primary-fixed font-heading font-bold text-sm shadow-neu-raised-sm border border-outline-variant/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Yes, it was me</span>
              </button>
            </div>
          </div>
        )}

        {stage === 'escalation' && (
          <div className="flex flex-col items-center w-full space-y-4">
            <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center shadow-neu-recessed">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-on-surface dark:text-white">
                Emergency System Lockdown
              </h3>
              <p className="font-sans text-xs text-on-surface-variant mt-1">
                Choose an immediate action to lock and track your device.
              </p>
            </div>

            <div className="w-full space-y-2.5 pt-2">
              <button
                onClick={handleEmergencyLock}
                disabled={isProcessing}
                className="w-full p-4 rounded-xl bg-error text-white font-heading font-bold text-sm shadow-neu-button flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Immediate OS Lock Screen
                </span>
                <span>Lock Now →</span>
              </button>

              <a
                href={findMyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-xl bg-surface dark:bg-[#232530] text-primary dark:text-primary-fixed font-heading font-bold text-sm shadow-neu-raised-sm border border-outline-variant/30 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {isMac ? 'Apple Find My' : 'Microsoft Find My'}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {stage === 'locked_success' && (
          <div className="flex flex-col items-center w-full space-y-4 py-3">
            <div className="w-16 h-16 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center shadow-neu-raised">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-heading text-2xl font-bold text-on-surface dark:text-white">
              LAPTOP LOCKED
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-xs">
              Your laptop received the signed emergency command and entered its native OS lock screen.
            </p>

            <NeoButton variant="primary" size="md" onClick={handleClose}>
              Return to Dashboard
            </NeoButton>
          </div>
        )}
      </div>
    </div>
  );
};
