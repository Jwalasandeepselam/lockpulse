'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  LogOut,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { NeoSecurityBadge } from '@/components/neumorphic/NeoSecurityBadge';
import { getStoredProfile, saveStoredProfile, clearStoredAuth, getStoredAuth } from '@/lib/store';
import { UserProfile } from '@/lib/types';

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const p = getStoredProfile();
    setProfile(p);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    saveStoredProfile(profile);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSignOut = () => {
    clearStoredAuth();
    localStorage.setItem('lockpulse_signed_out', 'true');
    router.push('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-on-surface dark:text-white tracking-tight">
          Account & Profile
        </h1>
        <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
          Manage your personal account details, encryption tier, and active login sessions.
        </p>
      </div>

      {/* Profile Details Form */}
      <NeoCard variant="raised" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/60 dark:border-[#282B38]">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white shadow-neu-button flex items-center justify-center font-heading font-extrabold text-2xl">
            {profile.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-on-surface dark:text-white tracking-tight">
              {profile.full_name || 'User'}
            </h2>
            <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-400">{profile.email}</p>
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
              leftIcon={<User className="w-4 h-4 text-on-surface-variant" />}
            />
            <NeoInput
              label="Email Address"
              type="email"
              disabled
              value={profile.email}
              leftIcon={<Mail className="w-4 h-4 text-on-surface-variant" />}
              helperText="Verified identity bound to secure enclave"
            />
          </div>

          <NeoInput
            label="Emergency Alert Phone (Optional)"
            type="tel"
            value={profile.phone_number || ''}
            onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            leftIcon={<Phone className="w-4 h-4 text-on-surface-variant" />}
            helperText="Used for high-priority SMS security dispatch during unexpected laptop unlock."
          />

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/60 dark:border-[#282B38]">
            {savedSuccess ? (
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5 font-sans">
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
        <h3 className="font-heading font-bold text-lg sm:text-xl text-on-surface dark:text-white tracking-tight">
          Active Sessions
        </h3>
        <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-400">
          You are currently signed in on this client browser. Terminating your session will clear cached tokens and require re-authentication.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <NeoButton
            variant="danger"
            size="md"
            onClick={handleSignOut}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
