'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  CheckCircle2,
  Trash2,
  Key,
  ShieldAlert,
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
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Account Profile & Sessions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your personal account details and active login sessions.
        </p>
      </div>

      {/* Profile Details Form */}
      <NeoCard variant="raised" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-300/40 dark:border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pulse-blue to-pulse-cyan shadow-glow-accent text-white flex items-center justify-center font-heading font-extrabold text-2xl">
            {profile.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              {profile.full_name}
            </h2>
            <p className="text-xs text-slate-500">{profile.email}</p>
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
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />
            <NeoInput
              label="Email Address"
              type="email"
              disabled
              value={profile.email}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              helperText="Verified via Supabase Auth & Resend"
            />
          </div>

          <NeoInput
            label="Emergency Alert Phone (Optional)"
            type="tel"
            value={profile.phone_number || ''}
            onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-300/40 dark:border-white/10">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
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
        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
          Active Sessions
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          You are currently signed in on this device. Terminating your session will require re-authentication.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <NeoButton
            variant="secondary"
            size="md"
            onClick={handleSignOut}
            leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
          >
            Sign Out
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
