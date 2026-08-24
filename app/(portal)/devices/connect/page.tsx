'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import {
  Laptop,
  QrCode,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  ArrowRight,
  ArrowLeft,
  Apple,
  Monitor,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';

export default function ConnectDevicePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedOS, setSelectedOS] = useState<'windows' | 'macos'>('windows');
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairingCode, setPairingCode] = useState('LP-9824-7612');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deviceName, setDeviceName] = useState('My Work Laptop');

  const qrPayload = JSON.stringify({
    app: 'lockpulse',
    v: '1.0',
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
    // Simulate cryptographic challenge verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
              className={`w-8 h-8 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
                currentStep === step
                  ? 'bg-pulse-blue text-white shadow-glow-accent'
                  : currentStep > step
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#E5ECF4] dark:bg-[#0E1626] text-slate-500 shadow-neo-pressed'
              }`}
            >
              {currentStep > step ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < 5 && (
              <div
                className={`hidden sm:block w-8 sm:w-12 h-1 rounded-full transition-all ${
                  currentStep > step ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Welcome */}
      {currentStep === 1 && (
        <NeoCard variant="raised" className="p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-pulse-blue/15 text-pulse-blue mx-auto flex items-center justify-center shadow-neo-sm">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-pulse-blue">
              Step 1 of 5
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
              Welcome to LockPulse
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              Let's set up your personal laptop security control plane. In just a couple of minutes, your phone and computer will be paired via cryptographic keys.
            </p>
          </div>

          <div className="pt-4">
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
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-pulse-blue">
              Step 2 of 5
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
              How LockPulse Protects You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Your personal security network between your phone and laptop
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Out-of-Band Remote Lock
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Trigger your laptop's native lock screen from anywhere in the world in under 1 second.
              </p>
            </div>

            <div className="p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Suspicious Unlock Detection
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Receive "Was this you?" push alerts if your laptop is unlocked while your phone is away.
              </p>
            </div>

            <div className="p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Credential Storage
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                No passwords or private keys are ever uploaded to cloud servers.
              </p>
            </div>

            <div className="p-4 bg-[#E5ECF4]/60 dark:bg-[#0D1524]/60 rounded-xl shadow-neo-pressed space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Non-Invasive Security
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                No surveillance, no webcam monitoring, and no invasive screen tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <NeoButton variant="ghost" size="md" onClick={() => setCurrentStep(1)}>
              Back
            </NeoButton>
            <NeoButton variant="primary" size="lg" onClick={() => setCurrentStep(3)} rightIcon={<ArrowRight className="w-5 h-5" />}>
              Configure Security
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* Step 3: Platform Selection & Device Info */}
      {currentStep === 3 && (
        <NeoCard variant="raised" className="p-8 space-y-6">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-pulse-blue">
              Step 3 of 5
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
              Select Laptop Operating System
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              LockPulse utilizes dedicated platform security APIs for your specific OS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedOS('windows')}
              className={`p-5 rounded-2xl flex flex-col items-center gap-3 transition-all border ${
                selectedOS === 'windows'
                  ? 'bg-pulse-blue/10 border-pulse-blue shadow-glow-accent text-pulse-blue'
                  : 'bg-surface-card dark:bg-surface-darkcard border-white/50 text-slate-700 dark:text-slate-300 shadow-neo-flat'
              }`}
            >
              <Monitor className="w-8 h-8" />
              <span className="font-heading font-bold text-sm">Windows 10 / 11</span>
              <span className="text-[10px] text-slate-500 font-mono">user32!LockWorkStation</span>
            </button>

            <button
              onClick={() => setSelectedOS('macos')}
              className={`p-5 rounded-2xl flex flex-col items-center gap-3 transition-all border ${
                selectedOS === 'macos'
                  ? 'bg-pulse-blue/10 border-pulse-blue shadow-glow-accent text-pulse-blue'
                  : 'bg-surface-card dark:bg-surface-darkcard border-white/50 text-slate-700 dark:text-slate-300 shadow-neo-flat'
              }`}
            >
              <Apple className="w-8 h-8" />
              <span className="font-heading font-bold text-sm">macOS Sonoma / Sequoia</span>
              <span className="text-[10px] text-slate-500 font-mono">SACLockScreenImmediate</span>
            </button>
          </div>

          <div>
            <NeoInput
              label="Laptop Nickname"
              placeholder="e.g. MacBook Pro 16 or ThinkPad Work"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
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
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-pulse-blue">
              Step 4 of 5
            </span>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
              Pair with Laptop Agent
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Scan this QR code from your LockPulse laptop agent or enter the secure challenge code.
            </p>
          </div>

          {/* QR Code Inset Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-neo-pressed dark:shadow-neo-dark-pressed max-w-xs mx-auto">
            <QRCodeSVG value={qrPayload} size={180} level="M" />
            <span className="text-[11px] font-mono text-slate-400 mt-3 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Challenge expires in 5:00
            </span>
          </div>

          {/* Manual Code */}
          <div className="p-4 bg-[#E5ECF4]/70 dark:bg-[#0D1524]/70 rounded-xl shadow-neo-pressed text-center space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">Short-Lived Pairing Challenge:</span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono font-extrabold text-xl tracking-widest text-pulse-blue dark:text-pulse-sky">
                {pairingCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-surface-card shadow-neo-sm text-slate-600 hover:text-pulse-blue transition-colors"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Terminal / Simulator Trigger */}
          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-pulse-sky" />
              <span>npm run agent:sim</span>
            </div>
            <span className="text-[10px] text-slate-400">Agent Background Runner</span>
          </div>

          <div className="flex items-center justify-between pt-4">
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
              Verify Connection
            </NeoButton>
          </div>
        </NeoCard>
      )}

      {/* Step 5: Device Connected Celebration */}
      {currentStep === 5 && (
        <NeoCard variant="floating" glow="secure" className="p-8 space-y-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-glow-secure animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <NeoSecurityBadge status="secure" size="md" label="ED25519 PAIRING VERIFIED" />
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-3">
              Your laptop is protected.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              <strong>{deviceName}</strong> ({selectedOS === 'windows' ? 'Windows' : 'macOS'}) is now successfully linked to your LockPulse network.
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
