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
  const [pairingCode] = useState('LP-9824-7612');
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
              className={`w-8 h-8 rounded-xl font-heading text-xs flex items-center justify-center transition-all ${
                currentStep === step
                  ? 'bg-palette-black text-white shadow-editorial-sm'
                  : currentStep > step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-ash'
              }`}
            >
              {currentStep > step ? <Check className="w-4 h-4" /> : step}
            </div>
            {step < 5 && (
              <div
                className={`hidden sm:block w-8 sm:w-12 h-0.5 transition-all ${
                  currentStep > step ? 'bg-emerald-600' : 'bg-palette-sand dark:bg-[#3E3B3A]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Welcome */}
      {currentStep === 1 && (
        <NeoCard variant="raised" className="p-8 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-palette-sand-light dark:bg-[#1E1D1D] border border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand mx-auto flex items-center justify-center shadow-editorial-sm">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-palette-ash">
              Step 1 of 5
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-palette-black dark:text-white mt-1 tracking-wide">
              WELCOME TO LOCKPULSE
            </h2>
            <p className="text-xs sm:text-sm font-sans text-palette-charcoal dark:text-palette-sand mt-2 max-w-md mx-auto leading-relaxed">
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
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-palette-ash">
              Step 2 of 5
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-palette-black dark:text-white mt-1 tracking-wide">
              HOW LOCKPULSE PROTECTS YOU
            </h2>
            <p className="text-xs sm:text-sm font-sans text-palette-ash mt-1">
              Your personal security network between your phone and laptop
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A] space-y-1.5">
              <div className="font-bold text-palette-black dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Out-of-Band Remote Lock
              </div>
              <p className="text-palette-ash">
                Trigger your laptop's native lock screen from anywhere in the world in under 1 second.
              </p>
            </div>

            <div className="p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A] space-y-1.5">
              <div className="font-bold text-palette-black dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Suspicious Unlock Detection
              </div>
              <p className="text-palette-ash">
                Receive "Was this you?" push alerts if your laptop is unlocked while your phone is away.
              </p>
            </div>

            <div className="p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A] space-y-1.5">
              <div className="font-bold text-palette-black dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Credential Storage
              </div>
              <p className="text-palette-ash">
                No passwords or private keys are ever uploaded to cloud servers.
              </p>
            </div>

            <div className="p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A] space-y-1.5">
              <div className="font-bold text-palette-black dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Non-Invasive Security
              </div>
              <p className="text-palette-ash">
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
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-palette-ash">
              Step 3 of 5
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-palette-black dark:text-white mt-1 tracking-wide">
              SELECT OPERATING SYSTEM
            </h2>
            <p className="text-xs sm:text-sm font-sans text-palette-ash mt-1">
              LockPulse utilizes dedicated platform security APIs for your specific OS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedOS('windows')}
              className={`p-5 rounded-2xl flex flex-col items-center gap-2.5 transition-all border ${
                selectedOS === 'windows'
                  ? 'bg-palette-black text-white border-palette-black shadow-editorial-sm'
                  : 'bg-palette-white dark:bg-[#222020] border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand'
              }`}
            >
              <Monitor className="w-8 h-8" />
              <span className="font-heading text-base tracking-wide">Windows 10 / 11</span>
              <span className="text-[10px] font-mono opacity-75">user32!LockWorkStation</span>
            </button>

            <button
              onClick={() => setSelectedOS('macos')}
              className={`p-5 rounded-2xl flex flex-col items-center gap-2.5 transition-all border ${
                selectedOS === 'macos'
                  ? 'bg-palette-black text-white border-palette-black shadow-editorial-sm'
                  : 'bg-palette-white dark:bg-[#222020] border-palette-sand dark:border-[#3E3B3A] text-palette-charcoal dark:text-palette-sand'
              }`}
            >
              <Apple className="w-8 h-8" />
              <span className="font-heading text-base tracking-wide">macOS Sonoma / Sequoia</span>
              <span className="text-[10px] font-mono opacity-75">SACLockScreenImmediate</span>
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
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-palette-ash">
              Step 4 of 5
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-palette-black dark:text-white mt-1 tracking-wide">
              PAIR WITH LAPTOP AGENT
            </h2>
            <p className="text-xs sm:text-sm font-sans text-palette-ash mt-1">
              Scan this QR code from your LockPulse laptop agent or enter the secure challenge code.
            </p>
          </div>

          {/* QR Code Inset Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-palette-white dark:bg-white rounded-2xl border border-palette-sand max-w-xs mx-auto shadow-editorial-sm">
            <QRCodeSVG value={qrPayload} size={180} level="M" />
            <span className="text-[11px] font-mono text-palette-ash mt-3 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Challenge expires in 5:00
            </span>
          </div>

          {/* Manual Code */}
          <div className="p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A] text-center space-y-2">
            <span className="text-xs font-sans text-palette-ash block">Short-Lived Pairing Challenge:</span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono font-extrabold text-2xl tracking-widest text-palette-black dark:text-white">
                {pairingCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-palette-white dark:bg-[#2A2828] border border-palette-sand text-palette-ash hover:text-palette-black transition-colors"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terminal / Runner Trigger */}
          <div className="p-3 bg-palette-black text-white rounded-xl text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>npm run agent:sim</span>
            </div>
            <span className="text-[10px] text-palette-sand">Agent Runner Daemon</span>
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
        <NeoCard variant="floating" glow="secure" className="p-8 sm:p-10 space-y-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <NeoSecurityBadge status="secure" size="md" label="ED25519 PAIRING VERIFIED" />
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-palette-black dark:text-white mt-3 tracking-wide">
              YOUR LAPTOP IS PROTECTED.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-palette-charcoal dark:text-palette-sand mt-2 max-w-md mx-auto leading-relaxed">
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
