'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';
import { initialProfile } from '@/lib/store';

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSignOut = () => {
    router.push('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-palette-black dark:text-white tracking-wide">
          ACCOUNT & SESSIONS
        </h1>
        <p className="text-xs sm:text-sm font-sans text-palette-ash mt-1">
          Manage your personal account details and active login sessions.
        </p>
      </div>

      {/* Profile Details Form */}
      <NeoCard variant="raised" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-palette-sand/60 dark:border-[#3E3B3A]">
          <div className="w-16 h-16 rounded-2xl bg-palette-black dark:bg-palette-white text-white dark:text-palette-black shadow-editorial-sm flex items-center justify-center font-heading font-extrabold text-2xl">
            {profile.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl text-palette-black dark:text-white tracking-wide">
              {profile.full_name}
            </h2>
            <p className="text-xs font-sans text-palette-ash">{profile.email}</p>
            <div className="mt-1.5">
              <NeoSecurityBadge status="secure" size="sm" label="ENHANCED SECURITY TIER" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NeoInput
              label="Full Name"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              leftIcon={<User className="w-4 h-4 text-palette-ash" />}
            />
            <NeoInput
              label="Email Address"
              type="email"
              disabled
              value={profile.email}
              leftIcon={<Mail className="w-4 h-4 text-palette-ash" />}
              helperText="Verified via Supabase Auth & Resend"
            />
          </div>

          <NeoInput
            label="Emergency Alert Phone (Optional)"
            type="tel"
            value={profile.phone_number || ''}
            onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            leftIcon={<Phone className="w-4 h-4 text-palette-ash" />}
          />

          <div className="flex items-center justify-between pt-4 border-t border-palette-sand/60 dark:border-[#3E3B3A]">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-sans">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully
              </span>
            ) : (
              <span />
            )}
            <NeoButton variant="primary" size="md" type="submit" isLoading={isSaving}>
              Save Changes
            </NeoButton>
          </div>
        </form>
      </NeoCard>

      {/* Session Management */}
      <NeoCard variant="raised" className="p-6 sm:p-8 space-y-4">
        <h3 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
          ACTIVE SESSIONS
        </h3>
        <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand">
          You are currently signed in on this device. Terminating your session will require re-authentication.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <NeoButton
            variant="secondary"
            size="md"
            onClick={handleSignOut}
            leftIcon={<LogOut className="w-4 h-4 text-rose-600" />}
          >
            Sign Out
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
