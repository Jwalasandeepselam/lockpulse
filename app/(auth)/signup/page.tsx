'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup & Resend verification email dispatch
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push('/devices/connect');
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pulse-blue to-pulse-cyan shadow-glow-accent flex items-center justify-center text-white font-heading font-extrabold text-2xl">
              ⚡
            </div>
          </Link>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            Create LockPulse Account
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Build your personal laptop security network
          </p>
        </div>

        <NeoCard variant="raised" className="p-8 space-y-5">
          <form onSubmit={handleSignup} className="space-y-4">
            <NeoInput
              label="Full Name"
              placeholder="e.g. Sandeep"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />

            <NeoInput
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <NeoInput
              label="Master Password"
              type="password"
              placeholder="At least 8 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              helperText="Note: OS credentials & biometric keys are never uploaded to the cloud."
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
                Create Account & Pair Devices
              </NeoButton>
            </div>
          </form>
        </NeoCard>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-pulse-blue font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
