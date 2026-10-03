'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { setStoredAuth, initialProfile } from '@/lib/store';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setSignupError('');

    if (!fullName.trim()) {
      setNameError('Full name is required.');
      isValid = false;
    } else if (fullName.trim().length < 2) {
      setNameError('Full name must be at least 2 characters.');
      isValid = false;
    }

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
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      isValid = false;
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordError('Password must contain both letters and numbers.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSignupError('');

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newProfile = {
      ...initialProfile,
      id: `usr_${Date.now()}`,
      email: email.trim(),
      full_name: fullName.trim(),
      is_onboarded: true,
      security_tier: 'enhanced' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setStoredAuth(newProfile);
    setIsLoading(false);
    // Direct newly registered user straight to device enrollment
    router.push('/devices/connect');
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
            Create LockPulse Account
          </h1>
          <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
            Build your personal laptop security network
          </p>
        </div>

        <NeoCard variant="raised" className="p-8 space-y-5">
          {signupError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs font-semibold text-error flex items-start gap-2 animate-scaleUp">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{signupError}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <NeoInput
              label="Full Name"
              placeholder="e.g. Alex Morgan"
              value={fullName}
              error={nameError}
              onChange={(e) => {
                setFullName(e.target.value);
                if (nameError) setNameError('');
              }}
              leftIcon={<User className="w-4 h-4" />}
            />

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

            <NeoInput
              label="Master Password"
              type="password"
              placeholder="Minimum 8 characters with letters & numbers"
              value={password}
              error={passwordError}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              leftIcon={<Lock className="w-4 h-4" />}
              helperText="Zero-Trust: Your OS credentials and private keys are never sent to cloud servers."
            />

            <div className="pt-2">
              <NeoButton
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Pair Laptop
              </NeoButton>
            </div>
          </form>
        </NeoCard>

        <p className="text-center text-xs font-sans text-on-surface-variant dark:text-titanium-400">
          Already have an account?{' '}
          <Link href="/login" className="text-primary dark:text-primary-azure font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
