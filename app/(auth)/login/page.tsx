'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { setStoredAuth, getStoredProfile } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com).');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError('');

    // Simulate authentication check
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Valid credentials check simulation
    if (email.toLowerCase().includes('fail') || email.toLowerCase().includes('invalid')) {
      setAuthError('Invalid credentials. Please verify your email and password.');
      setIsLoading(false);
      return;
    }

    const currentProfile = getStoredProfile();
    const userProfile = {
      ...currentProfile,
      id: currentProfile.id || `usr_${Date.now()}`,
      email: email.trim(),
      full_name: currentProfile.full_name || email.trim().split('@')[0],
      is_onboarded: true,
      security_tier: 'enhanced' as const,
      updated_at: new Date().toISOString(),
    };

    setStoredAuth(userProfile);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleDemoSignIn = () => {
    const demoUser = {
      id: 'usr_sandeep_01',
      email: 'sandeep@example.com',
      full_name: 'Sandeep',
      avatar_url: null,
      phone_number: '+1 (555) 234-5678',
      is_onboarded: true,
      security_tier: 'enhanced' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStoredAuth(demoUser);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-starlight dark:bg-[#0D0E12] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white shadow-neu-button flex items-center justify-center font-heading font-extrabold text-2xl group-hover:scale-105 transition-transform">
              ⚡
            </div>
          </Link>
          <h1 className="font-heading font-extrabold text-3xl text-on-surface dark:text-white tracking-tight">
            Sign In to LockPulse
          </h1>
          <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
            Access your personal laptop security control plane
          </p>
        </div>

        {/* Login Form Card */}
        <NeoCard variant="raised" className="p-8 space-y-5">
          {authError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs font-semibold text-error flex items-start gap-2 animate-scaleUp">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <NeoInput
              label="Email Address"
              type="email"
              placeholder="name@domain.com"
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-heading font-bold text-xs uppercase tracking-wider text-on-surface dark:text-white">
                  Password
                </label>
                <Link
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    setEmail('sandeep@example.com');
                    setPassword('LockPulse2026!');
                  }}
                  className="text-xs font-sans text-primary dark:text-primary-azure hover:underline font-semibold cursor-pointer"
                >
                  Fill Demo
                </Link>
              </div>
              <NeoInput
                type="password"
                placeholder="••••••••••••"
                value={password}
                error={passwordError}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="pt-2">
              <NeoButton
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </NeoButton>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline-variant/60 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono font-bold uppercase tracking-widest text-on-surface-variant dark:text-titanium-400">
              Quick Access
            </span>
            <div className="flex-grow border-t border-outline-variant/60 dark:border-white/10"></div>
          </div>

          <NeoButton
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleDemoSignIn}
          >
            <ShieldCheck className="w-4 h-4 text-secondary mr-2" />
            Continue with 1-Click Demo Profile
          </NeoButton>
        </NeoCard>

        {/* Footer Link */}
        <p className="text-center text-xs font-sans text-on-surface-variant dark:text-titanium-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary dark:text-primary-azure font-bold hover:underline">
            Create Account & Enroll Laptop
          </Link>
        </p>
      </div>
    </div>
  );
}
