'use client';

import React, { useState } from 'react';
import {
  BellRing,
  KeyRound,
  Users,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoToggle } from '@/components/neumorphic/NeoToggle';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';
import { NeoModal } from '@/components/neumorphic/NeoModal';

export default function SecuritySettingsPage() {
  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [notifyOnUnlockAway, setNotifyOnUnlockAway] = useState(true);
  const [notifyOnFailedLogin, setNotifyOnFailedLogin] = useState(true);

  // Security Mechanisms
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showTemporarySessionModal, setShowTemporarySessionModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-palette-black dark:text-white tracking-wide">
          SECURITY & PROTECTION
        </h1>
        <p className="text-xs sm:text-sm font-sans text-palette-ash mt-1">
          Configure notification dispatch channels, authentication factors, and emergency account recovery.
        </p>
      </div>

      {/* Notification Dispatch Preferences (Resend & Push) */}
      <NeoCard variant="raised" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A] flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              SECURITY NOTIFICATIONS
            </h3>
            <p className="text-xs font-sans text-palette-ash">
              Powered by Resend transactional email and mobile push
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-palette-sand/60 dark:border-[#3E3B3A]">
          <NeoToggle
            checked={notifyOnUnlockAway}
            onChange={setNotifyOnUnlockAway}
            label='"Was This You?" Alerts'
            description="Send an instant alert when a laptop is unlocked while your phone appears to be away."
          />
          <NeoToggle
            checked={notifyOnFailedLogin}
            onChange={setNotifyOnFailedLogin}
            label="Failed Login Notifications"
            description="Trigger alert on multiple failed biometric or PIN login attempts."
          />
          <NeoToggle
            checked={emailAlerts}
            onChange={setEmailAlerts}
            label="Transactional Email Notifications (Resend)"
            description="Receive email summaries for device pairing, lockdown events, and policy changes."
          />
          <NeoToggle
            checked={pushAlerts}
            onChange={setPushAlerts}
            label="Real-Time Mobile Push Alerts"
            description="High-priority push notifications to registered iOS / Android devices."
          />
        </div>
      </NeoCard>

      {/* Authentication & Hardware Factors */}
      <NeoCard variant="raised" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A] flex items-center justify-center">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              AUTHENTICATION & PASSKEYS
            </h3>
            <p className="text-xs font-sans text-palette-ash">
              FIDO2 / WebAuthn and cryptographic device binding
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-palette-sand/60 dark:border-[#3E3B3A]">
          <div className="flex items-center justify-between p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A]">
            <div className="space-y-0.5">
              <div className="font-heading text-base text-palette-black dark:text-white tracking-wide flex items-center gap-2">
                <span>Passkey (Touch ID / Windows Hello)</span>
                <NeoSecurityBadge status="secure" size="sm" label="ACTIVE" />
              </div>
              <p className="text-xs font-sans text-palette-ash">Hardware-bound cryptographic authenticator</p>
            </div>
            <NeoButton variant="secondary" size="sm">
              Manage Keys
            </NeoButton>
          </div>

          <div className="flex items-center justify-between p-4 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-xl border border-palette-sand dark:border-[#3E3B3A]">
            <div className="space-y-0.5">
              <span className="font-heading text-base text-palette-black dark:text-white tracking-wide">
                Emergency Recovery Codes
              </span>
              <p className="text-xs font-sans text-palette-ash">Offline one-time cryptographic recovery codes</p>
            </div>
            <NeoButton
              variant="secondary"
              size="sm"
              onClick={() => setShowRecoveryModal(true)}
              leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            >
              View Codes
            </NeoButton>
          </div>
        </div>
      </NeoCard>

      {/* Temporary Guest / Friend Device Session */}
      <NeoCard variant="raised" className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              TEMPORARY ACCESS SESSION
            </h3>
            <p className="text-xs font-sans text-palette-ash">
              Access your devices from someone else's phone without registering it as a trusted device
            </p>
          </div>
        </div>

        <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand leading-relaxed">
          If your phone is lost or out of battery, you can create an expiring, temporary session to lock your laptop from another device. It will automatically expire and leave no cached credentials.
        </p>

        <NeoButton
          variant="secondary"
          size="md"
          onClick={() => setShowTemporarySessionModal(true)}
          leftIcon={<Smartphone className="w-4 h-4" />}
        >
          Generate Temporary Access Link
        </NeoButton>
      </NeoCard>

      {/* Recovery Codes Modal */}
      <NeoModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        title="Emergency Recovery Codes"
        subtitle="Keep these in a safe, offline location"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 text-xs text-amber-950 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Important Security Warning
            </p>
            <p>Each recovery code can only be used once to regain access if you lose both your phone and laptop.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs p-4 bg-palette-sand-light dark:bg-[#1A1919] rounded-xl border border-palette-sand text-center font-bold text-palette-black dark:text-white">
            <div>8492-3819</div>
            <div>5910-2481</div>
            <div>7194-0582</div>
            <div>6302-8419</div>
          </div>

          <div className="flex justify-end pt-2">
            <NeoButton variant="primary" size="sm" onClick={() => setShowRecoveryModal(false)}>
              I Have Saved These Codes
            </NeoButton>
          </div>
        </div>
      </NeoModal>

      {/* Temporary Session Modal */}
      <NeoModal
        isOpen={showTemporarySessionModal}
        onClose={() => setShowTemporarySessionModal(false)}
        title="Temporary Session Active"
        subtitle="15-Minute Ephemeral Access"
      >
        <div className="space-y-4">
          <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand">
            This session is sandboxed. No credentials or biometric keys are stored on this browser. The session will automatically revoke in 15 minutes or when you close the tab.
          </p>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ephemeral Mode Active</span>
          </div>

          <div className="flex justify-end pt-2">
            <NeoButton variant="primary" size="sm" onClick={() => setShowTemporarySessionModal(false)}>
              Done
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
