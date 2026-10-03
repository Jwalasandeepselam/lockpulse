'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import {
  Laptop,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Monitor,
  Apple,
  Lock,
  Radio,
  EyeOff,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';
import { addStoredDevice } from '@/lib/store';

export default function ConnectDevicePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedOS, setSelectedOS] = useState<'windows' | 'macos'>('macos');
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairingCode] = useState('LP-9824-7612');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deviceName, setDeviceName] = useState('MacBook Pro');

  const qrPayload = JSON.stringify({
    app: 'lockpulse',
    v: '1.2.0',
    challenge: pairingCode,
    endpoint: 'https://api.lockpulse.app/v1/pair',
    exp: Date.now() + 5 * 60 * 1000,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVerifyPairing = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    
    // Enroll the device into localStorage store
    addStoredDevice({
      device_name: deviceName.trim() || (selectedOS === 'macos' ? 'MacBook Pro' : 'Windows Laptop'),
      os_name: selectedOS === 'macos' ? 'macOS 15.0 Sequoia' : 'Windows 11 Pro (23H2)',
    });

    setIsVerifying(false);
    setCurrentStep(5);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-4">
      {/* Step Progress Bar */}
      <div className="flex items-center justify-between px-2 mb-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl font-heading text-xs font-bold flex items-center justify-center transition-all ${
                currentStep === step
                  ? 'bg-primary text-white shadow-neu-button scale-105'
                  : currentStep > step
                  ? 'bg-secondary text-white'
                  : 'bg-surface-container dark:bg-[#1E212B] text-on-surface-variant dark:text-titanium-400 border border-outline-variant/60'
              }`}
            >
              {currentStep > step ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < 5 && (
              <div
                className={`hidden sm:block w-8 sm:w-12 h-1 rounded-full transition-all ${
                  currentStep > step
                    ? 'bg-secondary'
                    : 'bg-outline-variant dark:bg-[#282B38]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Welcome */}
      {currentStep === 1 && (
        <NeoCard variant="raised" className="p-8 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-azure border border-primary/20 mx-auto flex items-center justify-center shadow-neu-raised-sm">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Step 1 of 5 • Device Enrollment
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-on-surface dark:text-white mt-1.5 tracking-tight">
              Pair Your First Laptop
            </h2>
            <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-300 mt-2 max-w-md mx-auto leading-relaxed">
              Set up your personal laptop security control plane. In just 2 minutes, your phone and computer will establish an encrypted link using Ed25519 cryptographic keys.
            </p>
          </div>

          <div className="pt-3">
            <NeoButton variant="primary" size="lg" onClick={() => setCurrentStep(2)} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Get Started
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* Step 2: Concept Explanation */}
      {currentStep === 2 && (
        <NeoCard variant="raised" className="p-8 space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Step 2 of 5 • Architecture
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface dark:text-white mt-1 tracking-tight">
              How LockPulse Protects You
            </h2>
            <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
              Your direct encrypted security channel between phone and laptop
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] space-y-1.5 shadow-neu-recessed">
              <div className="font-bold text-on-surface dark:text-white flex items-center gap-1.5 font-heading">
                <Lock className="w-4 h-4 text-primary" /> Instant Remote Lock
              </div>
              <p className="text-on-surface-variant dark:text-titanium-400">
                Trigger your laptop's native lock screen from anywhere in the world in under 1 second.
              </p>
            </div>

            <div className="p-4 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] space-y-1.5 shadow-neu-recessed">
              <div className="font-bold text-on-surface dark:text-white flex items-center gap-1.5 font-heading">
                <Radio className="w-4 h-4 text-secondary" /> "Was This You?" Alerts
              </div>
              <p className="text-on-surface-variant dark:text-titanium-400">
                Receive instant push notifications if your laptop is unlocked while your phone is away.
              </p>
            </div>

            <div className="p-4 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] space-y-1.5 shadow-neu-recessed">
              <div className="font-bold text-on-surface dark:text-white flex items-center gap-1.5 font-heading">
                <ShieldCheck className="w-4 h-4 text-secondary" /> Zero Credential Storage
              </div>
              <p className="text-on-surface-variant dark:text-titanium-400">
                No passwords or private keys are ever uploaded to cloud servers.
              </p>
            </div>

            <div className="p-4 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] space-y-1.5 shadow-neu-recessed">
              <div className="font-bold text-on-surface dark:text-white flex items-center gap-1.5 font-heading">
                <EyeOff className="w-4 h-4 text-tertiary" /> Zero Surveillance
              </div>
              <p className="text-on-surface-variant dark:text-titanium-400">
                No webcam spying, no keyloggers, and no invasive screen recording.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
            <NeoButton variant="ghost" size="md" onClick={() => setCurrentStep(1)}>
              Back
            </NeoButton>
            <NeoButton variant="primary" size="lg" onClick={() => setCurrentStep(3)} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Choose Operating System
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* Step 3: Platform Selection & Device Info */}
      {currentStep === 3 && (
        <NeoCard variant="raised" className="p-8 space-y-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Step 3 of 5 • Platform Binding
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface dark:text-white mt-1 tracking-tight">
              Select Operating System
            </h2>
            <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
              LockPulse utilizes dedicated platform security APIs for your specific OS.
            </p>
          </div>

          {/* OS Selection Cards with High Contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* macOS Option */}
            <button
              type="button"
              onClick={() => {
                setSelectedOS('macos');
                if (deviceName === 'Windows Laptop' || deviceName === '') {
                  setDeviceName('MacBook Pro');
                }
              }}
              className={`p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-all cursor-pointer border-2 ${
                selectedOS === 'macos'
                  ? 'bg-primary text-white border-primary shadow-neu-button ring-4 ring-primary/20 scale-[1.02]'
                  : 'bg-surface dark:bg-[#16181F] border-outline-variant dark:border-[#282B38] text-on-surface dark:text-white hover:border-primary/50 shadow-neu-raised-sm'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedOS === 'macos' ? 'bg-white/20 text-white' : 'bg-surface-container dark:bg-[#242735] text-on-surface dark:text-white'
                }`}
              >
                <Apple className="w-7 h-7" />
              </div>
              <div>
                <span className="font-heading font-bold text-base block tracking-tight">
                  macOS (Sonoma / Sequoia)
                </span>
                <span
                  className={`text-[11px] font-mono mt-0.5 block ${
                    selectedOS === 'macos' ? 'text-white/80' : 'text-on-surface-variant dark:text-titanium-400'
                  }`}
                >
                  Apple SACLockScreenImmediate
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                  selectedOS === 'macos'
                    ? 'bg-white text-primary'
                    : 'bg-surface-container dark:bg-[#242735] text-on-surface-variant dark:text-titanium-300'
                }`}
              >
                {selectedOS === 'macos' ? 'SELECTED' : 'SELECT'}
              </span>
            </button>

            {/* Windows Option */}
            <button
              type="button"
              onClick={() => {
                setSelectedOS('windows');
                if (deviceName === 'MacBook Pro' || deviceName === '') {
                  setDeviceName('Windows Laptop');
                }
              }}
              className={`p-5 rounded-2xl flex flex-col items-center text-center gap-3 transition-all cursor-pointer border-2 ${
                selectedOS === 'windows'
                  ? 'bg-primary text-white border-primary shadow-neu-button ring-4 ring-primary/20 scale-[1.02]'
                  : 'bg-surface dark:bg-[#16181F] border-outline-variant dark:border-[#282B38] text-on-surface dark:text-white hover:border-primary/50 shadow-neu-raised-sm'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedOS === 'windows' ? 'bg-white/20 text-white' : 'bg-surface-container dark:bg-[#242735] text-on-surface dark:text-white'
                }`}
              >
                <Monitor className="w-7 h-7" />
              </div>
              <div>
                <span className="font-heading font-bold text-base block tracking-tight">
                  Windows 10 / 11
                </span>
                <span
                  className={`text-[11px] font-mono mt-0.5 block ${
                    selectedOS === 'windows' ? 'text-white/80' : 'text-on-surface-variant dark:text-titanium-400'
                  }`}
                >
                  user32!LockWorkStation
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                  selectedOS === 'windows'
                    ? 'bg-white text-primary'
                    : 'bg-surface-container dark:bg-[#242735] text-on-surface-variant dark:text-titanium-300'
                }`}
              >
                {selectedOS === 'windows' ? 'SELECTED' : 'SELECT'}
              </span>
            </button>
          </div>

          <div>
            <NeoInput
              label="Laptop Nickname"
              placeholder={selectedOS === 'macos' ? 'e.g. MacBook Pro 16 or Work Mac' : 'e.g. ThinkPad X1 or Dell XPS'}
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              helperText="Give your laptop a name so you can identify it easily in your dashboard."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
            <NeoButton variant="ghost" size="md" onClick={() => setCurrentStep(2)}>
              Back
            </NeoButton>
            <NeoButton variant="primary" size="lg" onClick={() => setCurrentStep(4)} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Generate Pairing Code
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* Step 4: Cryptographic Pairing QR & Code */}
      {currentStep === 4 && (
        <NeoCard variant="raised" className="p-8 space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Step 4 of 5 • Cryptographic Handshake
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface dark:text-white mt-1 tracking-tight">
              Pair With Laptop Agent
            </h2>
            <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
              Scan this QR code from your LockPulse laptop agent or enter the challenge code.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-neu-raised-sm max-w-xs mx-auto">
            <QRCodeSVG value={qrPayload} size={180} level="M" />
            <span className="text-[11px] font-mono text-slate-500 mt-3 flex items-center gap-1 font-semibold">
              <RefreshCw className="w-3.5 h-3.5" /> Dynamic challenge expires in 5:00
            </span>
          </div>

          {/* Manual Code */}
          <div className="p-4 bg-surface-container-low dark:bg-[#12131A] rounded-xl border border-outline-variant/60 dark:border-[#282B38] text-center space-y-2 shadow-neu-recessed">
            <span className="text-xs font-sans text-on-surface-variant dark:text-titanium-400 block font-medium">
              Short-Lived Pairing Challenge:
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono font-extrabold text-2xl tracking-widest text-primary dark:text-primary-azure">
                {pairingCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-xl bg-surface dark:bg-[#242735] border border-outline-variant text-on-surface hover:text-primary transition-colors cursor-pointer shadow-sm"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terminal / Simulation Trigger */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs font-mono flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">npm run agent:sim</span>
            </div>
            <span className="text-[11px] text-slate-400">Agent Handshake Daemon</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/40">
            <NeoButton variant="ghost" size="md" onClick={() => setCurrentStep(3)}>
              Back
            </NeoButton>
            <NeoButton
              variant="primary"
              size="lg"
              isLoading={isVerifying}
              onClick={handleVerifyPairing}
              rightIcon={<ShieldCheck className="w-5 h-5" />}
            >
              Verify & Complete Enrollment
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* Step 5: Device Connected Celebration */}
      {currentStep === 5 && (
        <NeoCard variant="floating" glow="secure" className="p-8 sm:p-10 space-y-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-secondary/15 text-secondary border border-secondary/30 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <NeoSecurityBadge status="secure" size="md" label="ED25519 PAIRING VERIFIED" />
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-on-surface dark:text-white mt-3 tracking-tight">
              Your Laptop is Protected.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-300 mt-2 max-w-md mx-auto leading-relaxed">
              <strong>{deviceName}</strong> ({selectedOS === 'windows' ? 'Windows 11' : 'macOS'}) is now successfully linked to your LockPulse network with hardware-bound cryptographic keys.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <NeoButton variant="primary" size="lg" onClick={() => router.push('/dashboard')}>
              Go to Security Dashboard
            </NeoButton>
          </div>
        </NeoCard>
      )}
    </div>
  );
}
