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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative z-20 w-[94%] max-w-md bg-surface dark:bg-[#16181F] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl border-t-4 border-error border-x border-b border-outline-variant/60 dark:border-white/10 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container dark:bg-[#242735] shadow-neu-raised-sm flex items-center justify-center text-on-surface-variant hover:text-on-surface dark:text-titanium-300 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {stage === 'prompt' && (
          <div className="flex flex-col items-center w-full">
            {/* Caution Icon */}
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/40 mb-5 flex items-center justify-center border border-red-200 dark:border-red-900/60 relative">
              <AlertTriangle className="w-10 h-10 text-error" />
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface dark:text-white mb-2 tracking-tight">
              Was this you?
            </h2>

            <p className="font-sans text-sm text-on-surface-variant dark:text-titanium-300 mb-4 max-w-xs">
              Your <strong>{event.device_name || 'Laptop'}</strong> was unlocked while your phone appeared to be away.
            </p>

            {/* Recessed Telemetry Box */}
            <div className="w-full bg-surface-container-low dark:bg-[#0D0E12] rounded-xl p-3.5 mb-6 shadow-neu-recessed text-xs space-y-1.5 border border-outline-variant/50 dark:border-[#282B38]">
              <div className="flex items-center justify-between text-on-surface-variant dark:text-titanium-400 font-mono">
                <span>DETECTED TIME</span>
                <span className="font-bold text-on-surface dark:text-white">
                  {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant dark:text-titanium-400 font-mono">
                <span>PROXIMITY STATUS</span>
                <span className="font-bold text-tertiary">Owner Away (Out of range)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3">
              <button
                disabled={isProcessing}
                onClick={handleNotMe}
                className="w-full py-3.5 rounded-xl bg-error hover:bg-[#D70015] text-white font-heading font-bold text-sm shadow-neu-button flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>This wasn't me (Lockdown)</span>
              </button>

              <button
                disabled={isProcessing}
                onClick={handleYesItWasMe}
                className="w-full py-3.5 rounded-xl bg-surface dark:bg-[#242735] text-on-surface dark:text-white font-heading font-bold text-sm shadow-neu-raised-sm border border-outline-variant dark:border-[#383A4A] hover:bg-surface-container flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>Yes, it was me</span>
              </button>
            </div>
          </div>
        )}

        {stage === 'escalation' && (
          <div className="flex flex-col items-center w-full space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-error flex items-center justify-center border border-red-200">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-on-surface dark:text-white">
                Emergency System Lockdown
              </h3>
              <p className="font-sans text-xs text-on-surface-variant dark:text-titanium-400 mt-1">
                Choose an immediate action to lock and track your device.
              </p>
            </div>

            <div className="w-full space-y-2.5 pt-2">
              <button
                onClick={handleEmergencyLock}
                disabled={isProcessing}
                className="w-full p-4 rounded-xl bg-error text-white font-heading font-bold text-sm shadow-neu-button flex items-center justify-between cursor-pointer hover:bg-[#D70015] transition-colors"
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
                className="w-full p-4 rounded-xl bg-surface dark:bg-[#242735] text-on-surface dark:text-white font-heading font-bold text-sm shadow-neu-raised-sm border border-outline-variant dark:border-[#383A4A] hover:bg-surface-container flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> {isMac ? 'Apple Find My' : 'Microsoft Find My'}
                </span>
                <ExternalLink className="w-4 h-4 text-on-surface-variant" />
              </a>
            </div>
          </div>
        )}

        {stage === 'locked_success' && (
          <div className="flex flex-col items-center w-full space-y-4 py-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-secondary flex items-center justify-center border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-heading text-2xl font-bold text-on-surface dark:text-white">
              LAPTOP LOCKED
            </h3>
            <p className="font-sans text-xs text-on-surface-variant dark:text-titanium-300 leading-relaxed max-w-xs">
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
